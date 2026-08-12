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
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup

OUTPUT_FILE = "tv2_riport/data/vesz_events.json"
BASE_URL = "https://www.katasztrofavedelem.hu/modules/vesz/archivum/"


def fetch_month(year, month):
    """Egy adott hónap összes eseményét kéri le."""
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

        # Szerkezet: [dátum-idő, cím, (kategória)]
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


def main():
    now = datetime.now(timezone.utc)

    # Az elmúlt 4 hónapot kérjük le (aktuális + 3 korábbi) - ez elég
    # tartományt ad a kliensoldali dátumnavigációhoz (nyilak, szerkeszthető
    # dátummező), anélkül hogy minden napváltásnál új szerverkérés kellene.
    MONTHS_BACK = 4
    months_to_fetch = []
    year, month = now.year, now.month
    for _ in range(MONTHS_BACK):
        months_to_fetch.append((year, month))
        month -= 1
        if month == 0:
            month = 12
            year -= 1

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

    # Legfrissebb elöl
    sorted_events = sorted(all_events.values(), key=lambda e: e["id"], reverse=True)

    output = {
        "updated_at": now.isoformat(),
        "count": len(sorted_events),
        "source": "BM OKF - katasztrofavedelem.hu (ingyenesen és szabadon felhasználható, forrásmegjelöléssel)",
        "events": sorted_events,
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"✅ Elmentve: {OUTPUT_FILE} ({len(sorted_events)} esemény)")


if __name__ == "__main__":
    main()
