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


# Az archívum-listában egy esemény frissülésekor a BM OKF néha egy MÁSODIK
# bejegyzést is beszúr ugyanahhoz az ID-hez, "1 frissítés", "2 frissítés"
# stb. címmel - ez NEM a tényleges esemény címe, csak egy jelzés. Ez a
# mintaillesztés ezt ismeri fel, hogy a valós címet sose írja felül vele.
FRISSITES_CIM_MINTA = re.compile(r"^\d+\D{0,10}friss", re.IGNORECASE)


def merge_events_preferring_real_title(events_list):
    """Azonos ID-jú bejegyzéseknél mindig a VALÓDI címet tartja meg,
    nem az esetleges "N frissítés" álcímet - függetlenül attól, melyik
    érkezett hamarabb a feldolgozás során."""
    merged = {}
    for ev in events_list:
        eid = ev["id"]
        if eid not in merged:
            merged[eid] = ev
            continue
        # Már van bejegyzés erre az ID-ra - csak akkor cseréljük le, ha az
        # ÚJ nem "N frissítés" álcím, a régi viszont az volt
        regi_alcim = bool(FRISSITES_CIM_MINTA.match(merged[eid]["title"]))
        uj_alcim = bool(FRISSITES_CIM_MINTA.match(ev["title"]))
        if regi_alcim and not uj_alcim:
            merged[eid] = ev
    return merged


def parse_event_page_content(soup, h2):
    """Egy esemény-oldal (akár a fő esemény, akár egy frissítés al-oldala)
    közös szerkezetű tartalmát bontja szét: dátum, kategória, törzsszöveg,
    helyszín. A frissítés-oldalaknak nincs mindig külön dőlt vezérmondata,
    ezért itt NEM különítjük el a "lead"-et a "body"-tól - minden, ami a
    kategória és a "Helyszín:" sor közé esik, egyben a teljes szöveg."""
    blocks = []
    for tag in h2.find_all_next():
        text = tag.get_text(strip=True)
        if not text:
            continue
        if text == "Vissza" or text.startswith("Frissítések"):
            break
        if tag.name in ("p", "div", "span", "strong", "em", "li") and not tag.find(["p", "div"]):
            blocks.append(text)
        if len(blocks) > 15:
            break

    dt_pattern = re.compile(r"\d{4}\.\d{2}\.\d{2}\.\s+\d{2}:\d{2}")
    i = 0
    datetime_text = ""
    for idx, b in enumerate(blocks):
        if dt_pattern.search(b):
            datetime_text = b
            i = idx + 1
            break

    category = blocks[i] if i < len(blocks) else ""
    i += 1

    remaining = blocks[i:]
    helyszin = ""
    helyszin_idx = None
    for idx, b in enumerate(remaining):
        if b.startswith("Helyszín"):
            helyszin_idx = idx
            helyszin = b.split(":", 1)[1].strip() if ":" in b else b
            break

    content_blocks = remaining[:helyszin_idx] if helyszin_idx is not None else remaining
    full_text = "\n\n".join(content_blocks)

    return {
        "datetime": datetime_text,
        "category": category,
        "text": full_text,
        "location": helyszin,
    }


def fetch_update_page(url):
    """Egy KONKRÉT frissítés (al-esemény) teljes oldalát kéri le és
    dolgozza fel - ugyanaz a szerkezet, mint a fő eseményé, saját címmel,
    dátummal, teljes szöveggel és helyszínnel."""
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        h2 = soup.find("h2")
        if not h2:
            return None
        title = h2.get_text(strip=True)
        content = parse_event_page_content(soup, h2)
        return {
            "title": title,
            "datetime": content["datetime"],
            "category": content["category"],
            "text": content["text"],
            "location": content["location"],
            "url": url,
        }
    except Exception as e:
        print(f"         ⚠️  Frissítés-oldal hiba ({url}): {e}")
        return None


def fetch_event_detail(url):
    """Az egyedi esemény-oldalról kinyeri a vezérmondatot, törzsszöveget,
    a helyszínt ÉS az ÖSSZES frissítés al-oldalának TELJES tartalmát -
    ezek a lista-nézetben NEM szerepelnek, csak itt."""
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        h2 = soup.find("h2")
        if not h2:
            return {}

        # A h2 tartalmazza a VALÓDI címet - ez akkor is helyes, ha az
        # archívum-listában "N db frissítés" áll a helyén.
        real_title = h2.get_text(strip=True)

        # A fő esemény szövegét a régi logikával bontjuk (van külön dőlt
        # vezérmondat + törzsszöveg)
        blocks = []
        in_updates = False
        update_links = []
        seen_update_hrefs = set()

        for tag in h2.find_all_next():
            text = tag.get_text(strip=True)
            if not text:
                continue
            if text == "Vissza":
                break
            if text.startswith("Frissítések"):
                in_updates = True
                continue

            if in_updates:
                if tag.name == "a":
                    href = tag.get("href", "")
                    if href and href not in seen_update_hrefs:
                        seen_update_hrefs.add(href)
                        full_url = href if href.startswith("http") else "https://www.katasztrofavedelem.hu" + href
                        update_links.append(full_url)
                continue

            if tag.name in ("p", "div", "span", "strong", "em", "li") and not tag.find(["p", "div"]):
                blocks.append(text)
            if len(blocks) > 15:
                break
            if len(update_links) > 20:
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

        # Minden frissítés al-oldalát KÜLÖN lekérdezzük a teljes szövegért -
        # legfeljebb 10 frissítést dolgozunk fel eseményenként, hogy egy
        # sokat frissülő esemény se tudja kimeríteni az egész futás idejét
        updates_full = []
        for update_url in update_links[:10]:
            update_data = fetch_update_page(update_url)
            if update_data:
                updates_full.append(update_data)
            time.sleep(0.2)

        return {
            "title": real_title,
            "lead": lead,
            "body": body,
            "location": helyszin,
            "updates": updates_full,
        }
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
    raw_events = []

    for year, month in months_to_fetch:
        print(f"🔍 Lekérdezés: {year}-{month:02d}...")
        try:
            html = fetch_month(year, month)
            events = parse_events(html)
            print(f"   -> {len(events)} esemény.")
            raw_events.extend(events)
        except Exception as e:
            print(f"   ⚠️  Hiba ({year}-{month:02d}): {e}")

    # Azonos ID-jú, de "N frissítés" álcímű bejegyzések helyett mindig a
    # valódi címet tartjuk meg
    all_events = merge_events_preferring_real_title(raw_events)

    # Legfrissebb elöl - a részlet-lekérdezést is ebben a sorrendben végezzük,
    # hogy a legújabb, valószínűleg legfontosabb események kerüljenek elsőként sorra
    sorted_events = sorted(all_events.values(), key=lambda e: e["id"], reverse=True)

    def esemeny_kora_orakban(ev):
        """Megbecsüli, hány órás az esemény a datetime mezője alapján -
        ha nem sikerül értelmezni, nagyon régről valónak tekintjük
        (biztonságból, hogy ne kérdezzük le feleslegesen)."""
        m = re.match(r"(\d{4})\.(\d{2})\.(\d{2})\.\s+(\d{2}):(\d{2})", ev.get("datetime", ""))
        if not m:
            return 999999
        try:
            ev_dt = datetime(
                int(m.group(1)), int(m.group(2)), int(m.group(3)),
                int(m.group(4)), int(m.group(5)), tzinfo=timezone.utc
            )
            return (now - ev_dt).total_seconds() / 3600
        except ValueError:
            return 999999

    # A 48 óránál frissebb eseményeket MINDIG újra lekérdezzük, mert azoknál
    # még jöhetnek új frissítések - a régebbieknél a gyorsítótár elég.
    UJRAFRISSITES_ORA_HATAR = 48

    def cached_updates_regi_formatumu(cached):
        """A frissítések formátuma egyszer megváltozott (sima szövegekből
        strukturált cím+szöveg+helyszín adatra) - ha a gyorsítótárban még
        a régi (sima szöveges lista) formátum van, azt újra le kell
        kérdezni, különben a PHP nem tud belőle semmit kiolvasni."""
        if not cached:
            return False
        updates = cached.get("updates")
        if not updates:
            return False
        return isinstance(updates[0], str)

    uj_lekerdezes_szamlalo = 0
    for ev in sorted_events:
        cached = existing.get(ev["id"])
        eleg_friss_hogy_ujra_lekerdezzuk = (
            esemeny_kora_orakban(ev) <= UJRAFRISSITES_ORA_HATAR
            or cached_updates_regi_formatumu(cached)
        )

        # Ha a lista-nézet "N db frissítés" típusú álcímet ad (ez a BM OKF
        # saját, állandó viselkedése az updatelt eseményeknél, nem egyszeri
        # hiba), és korábban már sikerült kinyerni a valódi címet a
        # részletoldalról, azt használjuk a lista-álcíme helyett.
        if FRISSITES_CIM_MINTA.match(ev["title"]) and cached and cached.get("title") and not FRISSITES_CIM_MINTA.match(cached["title"]):
            ev["title"] = cached["title"]

        if cached and cached.get("body") and not eleg_friss_hogy_ujra_lekerdezzuk:
            # Régi esemény, már van részlete gyorsítótárban - nem valószínű,
            # hogy még frissülne, nem kérdezzük le újra
            ev["lead"] = cached.get("lead", "")
            ev["body"] = cached.get("body", "")
            ev["location"] = cached.get("location", "")
            ev["updates"] = cached.get("updates", [])
            continue

        if uj_lekerdezes_szamlalo >= MAX_UJ_RESZLET_LEKERDEZES:
            # Elértük a limitet ebben a futásban - a következő futás fogja
            # folytatni; addig a gyorsítótárból (ha van) vagy üresen hagyjuk
            ev["lead"] = cached.get("lead", "") if cached else ""
            ev["body"] = cached.get("body", "") if cached else ""
            ev["location"] = cached.get("location", "") if cached else ""
            ev["updates"] = cached.get("updates", []) if cached else []
            continue

        detail = fetch_event_detail(ev["url"])
        # A részletoldal h2-jéből kinyert valódi cím felülírja a lista
        # esetleges "N db frissítés" álcímét
        if detail.get("title") and not FRISSITES_CIM_MINTA.match(detail["title"]):
            ev["title"] = detail["title"]
        ev["lead"] = detail.get("lead", "")
        ev["body"] = detail.get("body", "")
        ev["location"] = detail.get("location", "")
        ev["updates"] = detail.get("updates", [])
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
