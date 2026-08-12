"""
VÉSZ események lekérdezése a BM OKF (katasztrofavedelem.hu) archívumából.

A havi nézet (?yearMonth=ÉÉÉÉ-HH&type=yearMonth) egy oldalon adja vissza
az adott hónap ÖSSZES eseményét - nincs rejtett API, a szerver a HTML-be
rendereli bele az adatokat. Ez legálisan, forrásmegjelöléssel felhasználható:
"Valamennyi közlemény ingyenesen és szabadon felhasználható, de kizárólag
a BM OKF, mint hírforrás feltüntetésével." - a weboldal saját nyilatkozata.
"""

import json
import os
import re
import time
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup

OUTPUT_FILE = "data/vesz_events.json"
BASE_URL = "https://www.katasztrofavedelem.hu/modules/vesz/archivum/"

# Egy futáson belül legfeljebb ennyi ÚJ esemény részletét kérjük le -
# a régebbi, már gyorsítótárazott eseményekhez nem kell újra lekérdezni,
# így a 5 perces ismétlődő futás nem terheli feleslegesen a szervert,
# és nem lépi túl az Actions 5 perces időkorlátját.
MAX_UJ_RESZLET_LEKERDEZES = 40


def fetch_month(year, month):
    """Egy adott hónap összes eseményét kéri le (lista-nézet)."""
    params = {"yearMonth": f"{year:04d}-{month:02d}", "type": "yearMonth", "back": "#"}
    resp = requests.get(BASE_URL, params=params, timeout=20)
    resp.raise_for_status()
    return resp.text


def parse_events(html):
    soup = BeautifulSoup(html, "html.parser")
    events = []

    for link in soup.select('a[href*="/modules/vesz/esemeny/"]'):
        href = link.get("href", "")
        match = re.search(r"/esemeny/(\d+)", href)
        if not match:
            continue
        event_id = match.group(1)

        alert = link.find(attrs={"class": re.compile("alert")}) or link
        text_parts = [t.strip() for t in alert.stripped_strings]
        if len(text_parts) < 2:
            continue

        date_text = text_parts[0]
        title = text_parts[1]
        category = text_parts[2] if len(text_parts) > 2 else ""

        events.append({
            "id": event_id,
            "datetime": date_text,
            "title": title,
            "category": category,
            "url": f"https://www.katasztrofavedelem.hu/modules/vesz/esemeny/{event_id}",
        })

    return events


def fetch_event_detail(url):
    """Az egyedi esemény-oldalról kinyeri a vezérmondatot, törzsszöveget
    és a helyszínt - ezek a lista-nézetben NEM szerepelnek, csak itt."""
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        h2 = soup.find("h2")
        if not h2:
            return {}

        blocks = []
        for tag in h2.find_all_next():
            text = tag.get_text(strip=True)
            if not text:
                continue
            if text.startswith("Frissítések") or text == "Vissza":
                break
            # Csak "levél" (legkisebb egység) elemeket gyűjtünk, hogy ne
            # kerüljön be duplikálva egy szülő <div> teljes szövege
            if tag.name in ("p", "div", "span", "strong", "em", "li") and not tag.find(["p", "div"]):
                blocks.append(text)
            if len(blocks) > 15:
                break

        dt_pattern = re.compile(r"\d{4}\.\d{2}\.\d{2}\.\s+\d{2}:\d{2}")
        i = 0
        for idx, b in enumerate(blocks):
            if dt_pattern.search(b):
                i = idx + 1
                break

        category = blocks[i] if i < len(blocks) else ""
        i += 1

        remaining = blocks[i:]
        helyszin_idx = None
        helyszin = ""
        for idx, b in enumerate(remaining):
            if b.startswith("Helyszín"):
                helyszin_idx = idx
                helyszin = b.split(":", 1)[1].strip() if ":" in b else b
                break

        content_blocks = remaining[:helyszin_idx] if helyszin_idx is not None else remaining
        lead = content_blocks[0] if content_blocks else ""
        body = "\n\n".join(content_blocks[1:]) if len(content_blocks) > 1 else ""

        return {"lead": lead, "body": body, "location": helyszin}
    except Exception as e:
        print(f"      ⚠️  Részlet lekérdezési hiba ({url}): {e}")
        return {}


def load_existing():
    if not os.path.exists(OUTPUT_FILE):
        return {}
    try:
        with open(OUTPUT_FILE, encoding="utf-8") as f:
            data = json.load(f)
        return {ev["id"]: ev for ev in data.get("events", [])}
    except (json.JSONDecodeError, OSError, KeyError):
        return {}


def main():
    now = datetime.now(timezone.utc)

    MONTHS_BACK = 4
    months_to_fetch = []
    year, month = now.year, now.month
    for _ in range(MONTHS_BACK):
        months_to_fetch.append((year, month))
        month -= 1
        if month == 0:
            month = 12
            year -= 1

    existing = load_existing()
    all_events = {}

    for year, month in months_to_fetch:
        print(f"🔍 Lekérdezés: {year}-{month:02d}...")
        try:
            html = fetch_month(year, month)
            events = parse_events(html)
            print(f"   -> {len(events)} esemény.")
            for ev in events:
                all_events[ev["id"]] = ev
        except Exception as e:
            print(f"   ⚠️  Hiba ({year}-{month:02d}): {e}")

    # Legfrissebb elöl - a részlet-lekérdezést is ebben a sorrendben végezzük,
    # hogy a legújabb, valószínűleg legfontosabb események kerüljenek elsőként sorra
    sorted_events = sorted(all_events.values(), key=lambda e: e["id"], reverse=True)

    uj_lekerdezes_szamlalo = 0
    for ev in sorted_events:
        cached = existing.get(ev["id"])
        if cached and cached.get("body"):
            # Már van részlete gyorsítótárban - azt használjuk, nem kérdezzük le újra
            ev["lead"] = cached.get("lead", "")
            ev["body"] = cached.get("body", "")
            ev["location"] = cached.get("location", "")
            continue

        if uj_lekerdezes_szamlalo >= MAX_UJ_RESZLET_LEKERDEZES:
            # Elértük a limitet ebben a futásban - a következő 5 perces
            # futás fogja folytatni a maradék események részleteinek lekérdezését
            ev["lead"] = ""
            ev["body"] = ""
            ev["location"] = ""
            continue

        detail = fetch_event_detail(ev["url"])
        ev["lead"] = detail.get("lead", "")
        ev["body"] = detail.get("body", "")
        ev["location"] = detail.get("location", "")
        uj_lekerdezes_szamlalo += 1
        time.sleep(0.4)  # udvarias várakozás a szerver felé

    print(f"   -> {uj_lekerdezes_szamlalo} új esemény részlete lekérdezve ebben a futásban.")

    output = {
        "updated_at": now.isoformat(),
        "count": len(sorted_events),
        "source": "BM OKF - katasztrofavedelem.hu (ingyenesen és szabadon felhasználható, forrásmegjelöléssel)",
        "events": sorted_events,
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE) or ".", exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"✅ Elmentve: {OUTPUT_FILE} ({len(sorted_events)} esemény)")


if __name__ == "__main__":
    main()
