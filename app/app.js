/* Balesetinfo – a GitHubos felület kódja. GENERÁLT FÁJL, ne szerkeszd kézzel:
   a forrása az apps-script-sync repó balesetinfo-app mappája (felulet/epites.cjs). */
(function () {
'use strict';
const API_URL = "https://script.google.com/macros/s/AKfycbziexgMQGpVMINn6w7fs3a1RddOIR4a4_IFB_DvESxNxylQvcfENljeFhjPHpusX7-r/exec";
const APP = {
  "NEV": "Balesetinfo"
};
const TELJ_CONFIG = {
  "DEFAULT_RECIPIENTS": [
    "tv2-videk@tv2.hu",
    "gyartas@tv2.hu",
    "blazek13@gmail.com"
  ],
  "IDOZONA": "Europe/Budapest"
};
const ELSZ_CONFIG = {
  "CIMZETT_LISTA": [
    {
      "email": "gyartas@tv2.hu",
      "alapEllenorzott": true
    },
    {
      "email": "iktatas@tv2.hu",
      "alapEllenorzott": true
    },
    {
      "email": "janos.horvath@tv2.hu",
      "alapEllenorzott": true
    },
    {
      "email": "Blazek13@gmail.com",
      "alapEllenorzott": false
    }
  ],
  "NEVEBEN_LISTA": [
    {
      "nev": "Orosz Ildikó e.v.",
      "alapEllenorzott": true
    }
  ]
};
const DASH_CONFIG = {
  "IDOZONA": "Europe/Budapest"
};
const OLDALAK = [
  {
    "kulcs": "riport",
    "rovid": "Riport",
    "cim": "Riport beküldő",
    "leiras": "VÉSZ esemény küldése a TV2 szerkesztőinek",
    "ikon": "📣"
  },
  {
    "kulcs": "teljesites",
    "rovid": "Teljesítési",
    "cim": "Teljesítési igazolás",
    "leiras": "Új igazolás készítése és küldése",
    "ikon": "📄"
  },
  {
    "kulcs": "elszamolas",
    "rovid": "Elszámolás",
    "cim": "Elszámolás beküldése",
    "leiras": "Havi PDF-ek összefűzése és elküldése",
    "ikon": "💰"
  },
  {
    "kulcs": "dashboard",
    "rovid": "Dashboard",
    "cim": "Elszámolás dashboard",
    "leiras": "Havi tételek és összegek áttekintése",
    "ikon": "📊"
  }
];
const ESZKOZ_CSOPORTOK = [
  {
    "cim": "Kép-eszközök",
    "elemek": [
      {
        "cim": "Kép-eltakaró",
        "leiras": "Arcok, rendszámok kitakarása",
        "ikon": "🙈",
        "url": "https://mrgabee.github.io/balesetinfo/eltakaro.html"
      },
      {
        "cim": "Kép felturbózó",
        "leiras": "Kép élesítése, javítása",
        "ikon": "✨",
        "url": "https://mrgabee.github.io/balesetinfo/felturbozo.html"
      },
      {
        "cim": "Vízjelező",
        "leiras": "Vízjel a képekre",
        "ikon": "💧",
        "url": "https://mrgabee.github.io/balesetinfo/vizjelezo.html"
      }
    ]
  },
  {
    "cim": "Térkép és kijelző",
    "elemek": [
      {
        "cim": "Wind-yy",
        "leiras": "Magyar webkamerák térképen",
        "ikon": "🗺️",
        "url": "https://mrgabee.github.io/mentoheli/windy/magyar_webkamerak.html"
      },
      {
        "cim": "Nyilvántartás",
        "leiras": "BKK kijelző",
        "ikon": "🚏",
        "url": "https://mrgabee.github.io/mentoheli/bkk_kijelzo/bkk_kijelzo.html"
      }
    ]
  }
];
const BESZALLITO_OPTIONS = [
  "Balesetinfo | Orosz Ildikó e.v",
  "Balesetinfo | Balogh Regina Julianna e.v"
];
const ROMAI_HONAPOK = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII"
];
const RIPORT_SABLON = "<!DOCTYPE html>\n<html lang=\"hu\">\n<head>\n<base target=\"_top\">\n<meta charset=\"UTF-8\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap\">\n<style>\n  /* Arculat: ugyanaz a kártyás, mobilbarát stílus, mint a számla-áttekintőé.\n     A színek tokenekben vannak, a sötét mód (rendszer-beállítás szerint)\n     csak a tokeneket írja felül. */\n  :root {\n    color-scheme: light;\n    --bg: #f3f5f8;\n    --card: #ffffff;\n    --surface-2: #eef1f6;\n    --border: #dde2ea;\n    --text: #16202e;\n    --muted: #5d6a7c;\n    --blue: #1f5f8b;\n    --blue-soft: #e2edf6;\n    --red: #b3261e;\n    --red-soft: #fbe3e1;\n    --green: #1b7f4b;\n    --green-soft: #e1f3e8;\n    --amber: #a35a00;\n    --amber-soft: #fbefdc;\n    --on-accent: #ffffff;\n    --f-display: \"Bricolage Grotesque\", \"Segoe UI\", system-ui, sans-serif;\n    --f-body: \"Figtree\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Arial, sans-serif;\n    --f-num: \"JetBrains Mono\", ui-monospace, Consolas, monospace;\n  }\n  @media (prefers-color-scheme: dark) { :root:not([data-theme=\"light\"]) {\n    color-scheme: dark;\n    --bg: #0f141b; --card: #161d27; --surface-2: #1c2531; --border: #2a3443;\n    --text: #e6ebf2; --muted: #93a0b2; --blue: #6fb0e0; --blue-soft: #1b2e40;\n    --red: #f2867f; --red-soft: #3a1a18; --green: #5cc98d; --green-soft: #15301f;\n    --amber: #f0b052; --amber-soft: #33260f; --on-accent: #0f141b;\n  } }\n  :root[data-theme=\"dark\"] {\n    color-scheme: dark;\n    --bg: #0f141b; --card: #161d27; --surface-2: #1c2531; --border: #2a3443;\n    --text: #e6ebf2; --muted: #93a0b2; --blue: #6fb0e0; --blue-soft: #1b2e40;\n    --red: #f2867f; --red-soft: #3a1a18; --green: #5cc98d; --green-soft: #15301f;\n    --amber: #f0b052; --amber-soft: #33260f; --on-accent: #0f141b;\n  }\n  * { box-sizing: border-box; }\n  body {\n    margin: 0;\n    background: var(--bg);\n    color: var(--text);\n    font-family: var(--f-body); font-size: 15px; line-height: 1.5;\n  }\n  .wrap { max-width: 1120px; margin: 0 auto; padding: 24px 16px 48px; }\n  h1 { font: 700 26px/1.15 var(--f-display); margin: 0 0 4px; text-wrap: balance; }\n  .alcim { color: var(--muted); font-size: 14px; margin-bottom: 20px; }\n\n  input, select, textarea, button { font-family: inherit; color: var(--text); }\n  input[type=\"text\"], input[type=\"search\"], input[type=\"date\"], input[type=\"password\"], textarea {\n    width: 100%; background: var(--card); border: 1px solid var(--border); border-radius: 8px;\n    padding: 10px 12px; font-size: 15px; outline: none;\n  }\n  input:focus, textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-soft); }\n  textarea { min-height: 130px; resize: vertical; }\n  textarea:disabled { background: var(--surface-2); color: var(--muted); cursor: not-allowed; }\n\n  /* ── Gombok ── */\n  .gomb {\n    display: inline-flex; align-items: center; justify-content: center; gap: 6px;\n    padding: 10px 18px; border-radius: 8px; border: 1px solid transparent;\n    font-size: 14px; font-weight: 600; cursor: pointer; min-height: 42px;\n  }\n  .gomb:disabled { opacity: 0.6; cursor: default; }\n  .gomb-fo { background: var(--blue); color: var(--on-accent); }\n  .gomb-fo:hover:not(:disabled) { filter: brightness(1.08); }\n  .gomb-masod { background: var(--card); border-color: var(--border); color: var(--text); }\n  .gomb-masod:hover:not(:disabled) { border-color: var(--blue); color: var(--blue); }\n  .gomb-teljes { width: 100%; font-size: 16px; padding: 14px 18px; border-radius: 10px; }\n\n  /* ── KPI-kártyák ── */\n  .kartyak { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 20px; }\n  .kartya { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; min-width: 0; }\n  .kartya .cimke { color: var(--muted); font-size: 13px; }\n  .kartya .ertek { font: 500 24px/1.2 var(--f-num); font-variant-numeric: tabular-nums; margin-top: 4px; }\n\n  /* ── Elrendezés: asztalon két oszlop, telefonon egy ── */\n  .racs { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }\n  .oszlop { display: flex; flex-direction: column; gap: 16px; min-width: 0; }\n  @media (min-width: 900px) {\n    .racs { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); }\n  }\n\n  .panel { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; min-width: 0; }\n  .panel-fej { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }\n  .panel-cim { font: 600 17px/1.2 var(--f-display); margin: 0; flex: 1; }\n  .lepes {\n    flex: none; width: 26px; height: 26px; border-radius: 50%;\n    display: inline-flex; align-items: center; justify-content: center;\n    background: var(--blue-soft); color: var(--blue); font-size: 13px; font-weight: 700;\n  }\n  .panel-info { color: var(--muted); font-size: 13px; margin: 0 0 12px; }\n\n  .badge { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }\n  .badge-kek { background: var(--blue-soft); color: var(--blue); }\n  .badge-zold { background: var(--green-soft); color: var(--green); }\n  .badge-sarga { background: var(--amber-soft); color: var(--amber); }\n\n  /* ── Címzett-választó ── */\n  .csoport { border: 1px solid var(--border); border-radius: 10px; margin-bottom: 10px; overflow: hidden; }\n  .csoport:last-child { margin-bottom: 0; }\n  .csoport-fej {\n    display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 14px;\n    background: var(--surface-2); border: 0; cursor: pointer; text-align: left;\n  }\n  .csoport-fej .nev { flex: 1; font-weight: 600; font-size: 15px; }\n  .csoport-fej .nyil { color: var(--muted); transition: transform .15s ease; }\n  .csoport.nyitva .csoport-fej .nyil { transform: rotate(90deg); }\n  .csoport-test { display: none; padding: 12px 14px 14px; }\n  .csoport.nyitva .csoport-test { display: block; }\n  .csoport-mind { margin-bottom: 10px; font-size: 13px; padding: 6px 12px; min-height: 34px; }\n  .chipek { display: flex; flex-wrap: wrap; gap: 8px; }\n  .chip { position: relative; }\n  .chip input { position: absolute; opacity: 0; pointer-events: none; }\n  .chip span {\n    display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; min-height: 38px;\n    border: 1px solid var(--border); border-radius: 999px; background: var(--card);\n    font-size: 14px; cursor: pointer; user-select: none;\n  }\n  .chip span::before { content: \"+\"; color: var(--muted); font-weight: 700; }\n  .chip:hover span { border-color: var(--blue); }\n  .chip input:checked + span { background: var(--blue); border-color: var(--blue); color: var(--on-accent); }\n  .chip input:checked + span::before { content: \"✓\"; color: var(--on-accent); }\n  .chip input:focus-visible + span { box-shadow: 0 0 0 3px var(--blue-soft); }\n  .osszesito { margin-top: 12px; font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }\n  .osszesito .torles { background: none; border: 0; color: var(--blue); cursor: pointer; font-size: 13px; padding: 0; text-decoration: underline; }\n\n  /* ── VÉSZ esemény-választó ── */\n  .datum-sor { display: flex; gap: 8px; align-items: center; }\n  .datum-sor input { flex: 1; min-width: 0; }\n  .datum-sor .gomb { flex: none; width: 42px; padding: 0; font-size: 18px; }\n  .kereso { margin-top: 10px; }\n  .esemeny-lista { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; max-height: 420px; overflow-y: auto; padding-right: 2px; }\n  .esemeny {\n    display: block; width: 100%; text-align: left; background: var(--card);\n    border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; cursor: pointer;\n  }\n  .esemeny:hover { border-color: var(--blue); }\n  .esemeny.aktiv { border-color: var(--blue); background: var(--blue-soft); box-shadow: inset 3px 0 0 var(--blue); }\n  .esemeny-felso { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; color: var(--muted); }\n  .esemeny-ido { font-family: var(--f-num); font-variant-numeric: tabular-nums; }\n  .esemeny-cim { font-weight: 600; font-size: 15px; margin-top: 3px; overflow-wrap: anywhere; }\n  .esemeny-lead { font-size: 13px; color: var(--muted); margin-top: 2px; overflow-wrap: anywhere; }\n  .kivalasztott-esemeny { margin-top: 10px; font-size: 13px; color: var(--muted); overflow-wrap: anywhere; }\n  .kivalasztott-esemeny a { color: var(--blue); }\n\n  .statusz { margin-top: 10px; font-size: 14px; min-height: 20px; }\n  .statusz.ok { color: var(--green); }\n  .statusz.hiba { color: var(--red); }\n  .ures { color: var(--muted); text-align: center; padding: 20px 10px; font-size: 14px; }\n\n  /* ── Előzmények ── */\n  .elozmenyek { margin-top: 16px; }\n  .elozmeny-lista { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }\n  .elozmeny {\n    display: block; width: 100%; text-align: left; background: var(--card);\n    border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; cursor: pointer; min-width: 0;\n  }\n  .elozmeny:hover { border-color: var(--blue); }\n  .elozmeny.aktiv { border-color: var(--blue); background: var(--blue-soft); }\n  .elozmeny-cim { font-weight: 600; font-size: 14px; overflow-wrap: anywhere; }\n  .elozmeny-meta { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 6px; font-size: 12px; color: var(--muted); }\n  .elozmeny-cimzettek { font-size: 12px; color: var(--muted); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n\n  .ujrakuldes { display: none; margin-top: 14px; border-top: 1px solid var(--border); padding-top: 16px; }\n  .ujrakuldes.nyitva { display: block; }\n  .ujrakuldes h3 { font: 600 15px/1.2 var(--f-display); margin: 16px 0 10px; }\n  .ujrakuldes h3:first-child { margin-top: 0; }\n  .gomb-sor { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }\n\n  .config-figyelmeztetes { background: var(--red-soft); color: var(--red); border-radius: 10px; padding: 12px 14px; font-size: 14px; margin-bottom: 16px; }\n\n  @media (max-width: 560px) {\n    .wrap { padding: 18px 12px 40px; }\n    h1 { font-size: 22px; }\n    .kartyak { gap: 8px; }\n    .kartya { padding: 10px 12px; }\n    .kartya .cimke { font-size: 12px; }\n    .kartya .ertek { font-size: 20px; }\n    .esemeny-lista { max-height: 60vh; }\n  }\n</style>\n</head>\n<body>\n<style>:root { --nav-belso: 20px 16px 0; --nav-szel: 1120px; }</style>\n<?!= navSav('riport', jelszo) ?>\n\n<div class=\"wrap\">\n\n  <h1>TV2 riport beküldő</h1>\n  <div class=\"alcim\">VÉSZ esemény kiválasztása és elküldése a TV2 szerkesztőinek</div>\n\n  <div class=\"kartyak\">\n    <div class=\"kartya\"><div class=\"cimke\">Események a napon</div><div class=\"ertek\" id=\"kpiEsemeny\">–</div></div>\n    <div class=\"kartya\"><div class=\"cimke\">Kiválasztott címzett</div><div class=\"ertek\" id=\"kpiCimzett\">0</div></div>\n    <div class=\"kartya\"><div class=\"cimke\">Elküldött levél</div><div class=\"ertek\" id=\"kpiElozmeny\">–</div></div>\n  </div>\n\n  <div class=\"racs\">\n    <div class=\"oszlop\">\n      <section class=\"panel\">\n        <div class=\"panel-fej\"><span class=\"lepes\">1</span><h2 class=\"panel-cim\">Címzettek</h2></div>\n        <div id=\"recipientPicker\"></div>\n        <div class=\"osszesito\" id=\"selectedSummary\"></div>\n      </section>\n    </div>\n\n    <div class=\"oszlop\">\n      <section class=\"panel\">\n        <div class=\"panel-fej\"><span class=\"lepes\">2</span><h2 class=\"panel-cim\">VÉSZ esemény</h2></div>\n        <div class=\"datum-sor\">\n          <button class=\"gomb gomb-masod\" id=\"prevDayBtn\" aria-label=\"Előző nap\">‹</button>\n          <input type=\"date\" id=\"dateInput\">\n          <button class=\"gomb gomb-masod\" id=\"nextDayBtn\" aria-label=\"Következő nap\">›</button>\n        </div>\n        <input type=\"search\" id=\"eventSearch\" class=\"kereso\" placeholder=\"Keresés cím vagy kategória szerint…\">\n        <div class=\"esemeny-lista\" id=\"eventList\"><div class=\"ures\">Betöltés…</div></div>\n        <div class=\"kivalasztott-esemeny\" id=\"eventMeta\">Nincs kiválasztott esemény – esemény nélkül is küldhetsz.</div>\n      </section>\n\n      <section class=\"panel\">\n        <div class=\"panel-fej\"><span class=\"lepes\">3</span><h2 class=\"panel-cim\">Egyéb információ</h2></div>\n        <textarea id=\"extraInfo\" placeholder=\"Írd le a további részleteket, kontextust, forrást…\"></textarea>\n        <button class=\"gomb gomb-fo gomb-teljes\" id=\"sendBtn\" style=\"margin-top:12px;\">Email küldése</button>\n        <div class=\"statusz\" id=\"sendStatus\"></div>\n      </section>\n    </div>\n  </div>\n\n  <section class=\"panel elozmenyek\">\n    <div class=\"panel-fej\"><span class=\"lepes\">4</span><h2 class=\"panel-cim\">Korábban elküldött emailek</h2></div>\n    <p class=\"panel-info\">Koppints egy levélre, ha új címzetteknek is el szeretnéd küldeni.</p>\n    <div id=\"historyList\"><div class=\"ures\">Betöltés…</div></div>\n\n    <div class=\"ujrakuldes\" id=\"resendPanel\">\n      <h3>Kiválasztott levél újraküldése</h3>\n      <div class=\"kivalasztott-esemeny\" id=\"resendOriginalMeta\" style=\"margin:0 0 10px;\"></div>\n      <textarea id=\"resendExtraInfo\" disabled></textarea>\n      <div class=\"gomb-sor\">\n        <button class=\"gomb gomb-masod\" id=\"editResendBtn\">Szerkesztés</button>\n      </div>\n      <h3>Új címzettek</h3>\n      <div id=\"resendRecipientPicker\"></div>\n      <div class=\"osszesito\" id=\"resendSelectedSummary\"></div>\n      <div class=\"gomb-sor\">\n        <button class=\"gomb gomb-fo\" id=\"resendSendBtn\">Újraküldés</button>\n        <button class=\"gomb gomb-masod\" id=\"cancelResendBtn\">Mégse</button>\n      </div>\n      <div class=\"statusz\" id=\"resendStatus\"></div>\n    </div>\n  </section>\n</div>\n\n<script>\n  // Címzettek - ABC sorrendben minden kategórián belül, duplikátumok kiszűrve\n  const RECIPIENT_GROUPS_RAW = [\n    { title: 'Felelős szerkesztők', people: [\n      { name: 'Balás Árpád', email: 'arpad.balas@tv2.hu' },\n      { name: 'Egry Bertalan', email: 'bertalan.egry@tv2.hu' },\n      { name: 'Gyenes Tünde', email: 'tunde.gyenes@tv2.hu' },\n      { name: 'Ráth Viktória', email: 'viktoria.rath@tv2.hu' },\n      { name: 'Szekszárdi Zsuzsanna', email: 'zsuzsanna.szekszardi@tv2.hu' },\n      { name: 'Szűcs Dániel', email: 'daniel.szucs@tv2.hu' },\n      { name: 'Varga Attila', email: 'attila.varga@tv2.hu' },\n    ]},\n    { title: 'Riporterek', people: [\n      { name: 'Csikós Klaudia', email: 'klaudia.csikos@tv2.hu' },\n      { name: 'Harasztovich Erika', email: 'erika.harasztovich@tv2.hu' },\n      { name: 'Janky Bendegúz', email: 'bendeguz.janky@tv2partner.hu' },\n      { name: 'Kovács Gyöngyike', email: 'gyongyike.kovacs@tv2.hu' },\n      { name: 'Lónyai Linda', email: 'linda.lonyai@tv2.hu' },\n      { name: 'Léé Noémi', email: 'Noemi.lee@tv2.hu' },\n      { name: 'Szobonya Boglárka', email: 'boglarka.anna.szobonya@tv2partner.hu' },\n      { name: 'Tóth György', email: 'gyorgy.toth@tv2.hu' },\n      { name: 'Varga Balázs', email: 'balazs.varga@tv2.hu' },\n    ]},\n    { title: 'Egyéb munkatársak (szerkesztők)', people: [\n      { name: 'Kiss András', email: 'andras.kiss@tv2partner.hu' },\n      { name: 'Tv2 vidék', email: 'tv2-videk@tv2.hu' },\n      { name: 'Varga Péter', email: 'peter.varga@tv2.hu' },\n    ]},\n    { title: 'Balesetinfo', people: [\n      { name: 'Gombkötő Krisztián', email: 'blazek13@gmail.com' },\n      { name: 'Balesetinfo', email: 'balesetinfo@gmail.com' },\n    ]},\n  ];\n\n  function buildGroups() {\n    const seen = new Set();\n    return RECIPIENT_GROUPS_RAW.map(g => ({\n      title: g.title,\n      people: g.people\n        .filter(p => { const k = p.email.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })\n        .slice()\n        .sort((a, b) => a.name.localeCompare(b.name, 'hu')),\n    }));\n  }\n  const RECIPIENT_GROUPS = buildGroups();\n\n  // E-mail címből név, hogy az előzményekben ne csak címek látszódjanak.\n  const NAME_BY_EMAIL = new Map();\n  RECIPIENT_GROUPS.forEach(g => g.people.forEach(p => NAME_BY_EMAIL.set(p.email.toLowerCase(), p.name)));\n  function displayName(email) {\n    return NAME_BY_EMAIL.get(String(email).toLowerCase()) || email;\n  }\n\n  function escapeHtml(str) {\n    const div = document.createElement('div');\n    div.textContent = str ?? '';\n    return div.innerHTML;\n  }\n\n  function renderRecipientPicker(containerId, summaryId, instanceKey) {\n    const container = document.getElementById(containerId);\n    container.innerHTML = RECIPIENT_GROUPS.map((group, gi) => `\n      <div class=\"csoport${gi === 0 ? ' nyitva' : ''}\" id=\"${instanceKey}-${gi}\">\n        <button type=\"button\" class=\"csoport-fej\" aria-expanded=\"${gi === 0}\">\n          <span class=\"nev\">${escapeHtml(group.title)}</span>\n          <span class=\"badge badge-kek\" data-szamlalo>${group.people.length} fő</span>\n          <span class=\"nyil\">›</span>\n        </button>\n        <div class=\"csoport-test\">\n          <button type=\"button\" class=\"gomb gomb-masod csoport-mind\">Mindenki kijelölése</button>\n          <div class=\"chipek\">\n            ${group.people.map(p => `\n              <label class=\"chip\">\n                <input type=\"checkbox\" class=\"${instanceKey}-cb\" value=\"${escapeHtml(p.email)}\">\n                <span>${escapeHtml(p.name)}</span>\n              </label>\n            `).join('')}\n          </div>\n        </div>\n      </div>\n    `).join('');\n\n    container.querySelectorAll('.csoport').forEach(csoport => {\n      const fej = csoport.querySelector('.csoport-fej');\n      fej.addEventListener('click', () => {\n        const nyitva = csoport.classList.toggle('nyitva');\n        fej.setAttribute('aria-expanded', String(nyitva));\n      });\n      csoport.querySelector('.csoport-mind').addEventListener('click', () => {\n        const cbs = Array.from(csoport.querySelectorAll(`.${instanceKey}-cb`));\n        const mind = cbs.every(cb => cb.checked);\n        cbs.forEach(cb => cb.checked = !mind);\n        updateSummary(instanceKey, summaryId);\n      });\n    });\n    container.querySelectorAll(`.${instanceKey}-cb`).forEach(cb => {\n      cb.addEventListener('change', () => updateSummary(instanceKey, summaryId));\n    });\n    updateSummary(instanceKey, summaryId);\n  }\n\n  function updateSummary(instanceKey, summaryId) {\n    const checked = getCheckedRecipients(instanceKey);\n    const summary = document.getElementById(summaryId);\n    if (checked.length) {\n      summary.innerHTML = `<span class=\"badge badge-zold\">${checked.length} címzett kiválasztva</span>\n        <button type=\"button\" class=\"torles\">kijelölés törlése</button>`;\n      summary.querySelector('.torles').addEventListener('click', () => {\n        document.querySelectorAll(`.${instanceKey}-cb`).forEach(cb => cb.checked = false);\n        updateSummary(instanceKey, summaryId);\n      });\n    } else {\n      summary.textContent = 'Nincs kiválasztott címzett.';\n    }\n\n    // Csoportonkénti számláló és a \"mindenki\" gomb felirata.\n    RECIPIENT_GROUPS.forEach((group, gi) => {\n      const csoport = document.getElementById(`${instanceKey}-${gi}`);\n      if (!csoport) return;\n      const cbs = Array.from(csoport.querySelectorAll(`.${instanceKey}-cb`));\n      const db = cbs.filter(cb => cb.checked).length;\n      const szamlalo = csoport.querySelector('[data-szamlalo]');\n      szamlalo.textContent = db ? `${db} / ${cbs.length}` : `${cbs.length} fő`;\n      szamlalo.className = 'badge ' + (db ? 'badge-zold' : 'badge-kek');\n      csoport.querySelector('.csoport-mind').textContent =\n        db === cbs.length ? 'Kijelölés törlése' : 'Mindenki kijelölése';\n    });\n\n    if (instanceKey === 'main') {\n      document.getElementById('kpiCimzett').textContent = checked.length;\n    }\n  }\n\n  function getCheckedRecipients(instanceKey) {\n    return Array.from(document.querySelectorAll(`.${instanceKey}-cb:checked`)).map(cb => cb.value);\n  }\n\n  renderRecipientPicker('recipientPicker', 'selectedSummary', 'main');\n  renderRecipientPicker('resendRecipientPicker', 'resendSelectedSummary', 'resend');\n\n\n  // ---- 2. VÉSZ események betöltése - napi dátum szerint, navigálható ----\n  let veszEvents = [];\n  let selectedEvent = null;\n  let eventsLoaded = false;\n\n  function formatDate(d) {\n    const y = d.getFullYear();\n    const m = String(d.getMonth() + 1).padStart(2, '0');\n    const day = String(d.getDate()).padStart(2, '0');\n    return `${y}-${m}-${day}`;\n  }\n\n  function eventTime(datetimeStr) {\n    const m = String(datetimeStr).match(/(\\d{1,2}:\\d{2})/);\n    return m ? m[1] : datetimeStr;\n  }\n\n  function renderEventMeta() {\n    const meta = document.getElementById('eventMeta');\n    if (!selectedEvent) {\n      meta.textContent = 'Nincs kiválasztott esemény – esemény nélkül is küldhetsz.';\n      return;\n    }\n    meta.innerHTML = `Kiválasztva: <strong>${escapeHtml(selectedEvent.title)}</strong><br>\n      <a href=\"${escapeHtml(selectedEvent.url)}\" target=\"_blank\" rel=\"noopener\">${escapeHtml(selectedEvent.url)}</a>`;\n  }\n\n  function renderEventList() {\n    const list = document.getElementById('eventList');\n    if (!eventsLoaded) return;\n    const q = document.getElementById('eventSearch').value.trim().toLowerCase();\n    const shown = veszEvents\n      .map((ev, idx) => ({ ev, idx }))\n      .filter(({ ev }) => !q || [ev.title, ev.category].some(s => String(s || '').toLowerCase().includes(q)));\n\n    if (!veszEvents.length) {\n      list.innerHTML = '<div class=\"ures\">Nincs esemény ezen a napon.</div>';\n      return;\n    }\n    if (!shown.length) {\n      list.innerHTML = '<div class=\"ures\">Nincs a keresésnek megfelelő esemény.</div>';\n      return;\n    }\n    list.innerHTML = shown.map(({ ev, idx }) => `\n      <button type=\"button\" class=\"esemeny${ev === selectedEvent ? ' aktiv' : ''}\" data-idx=\"${idx}\">\n        <div class=\"esemeny-felso\">\n          <span class=\"esemeny-ido\">${escapeHtml(eventTime(ev.datetime))}</span>\n          ${ev.category ? `<span class=\"badge badge-sarga\">${escapeHtml(ev.category)}</span>` : ''}\n        </div>\n        <div class=\"esemeny-cim\">${escapeHtml(ev.title)}</div>\n      </button>\n    `).join('');\n\n    list.querySelectorAll('.esemeny').forEach(el => {\n      el.addEventListener('click', () => {\n        const ev = veszEvents[Number(el.dataset.idx)];\n        selectedEvent = selectedEvent === ev ? null : ev;\n        list.querySelectorAll('.esemeny').forEach(x => x.classList.toggle('aktiv', !!selectedEvent && x === el));\n        renderEventMeta();\n      });\n    });\n  }\n\n  let eventRequest = 0;\n  function loadEventsForDate(dateStr) {\n    const list = document.getElementById('eventList');\n    const kerés = ++eventRequest;\n    eventsLoaded = false;\n    selectedEvent = null;\n    renderEventMeta();\n    list.innerHTML = '<div class=\"ures\">Betöltés…</div>';\n    document.getElementById('kpiEsemeny').textContent = '–';\n\n    google.script.run\n      .withSuccessHandler(events => {\n        if (kerés !== eventRequest) return; // közben másik napra léptél\n        veszEvents = events || [];\n        eventsLoaded = true;\n        document.getElementById('kpiEsemeny').textContent = veszEvents.length;\n        renderEventList();\n      })\n      .withFailureHandler(err => {\n        if (kerés !== eventRequest) return;\n        list.innerHTML = '<div class=\"ures\">Hiba történt a betöltéskor.</div>';\n        console.error(err);\n      })\n      .getVeszEventsForDate(dateStr);\n  }\n\n  const dateInput = document.getElementById('dateInput');\n  dateInput.value = formatDate(new Date());\n\n  function shiftDay(delta) {\n    const current = new Date(dateInput.value + 'T00:00:00');\n    current.setDate(current.getDate() + delta);\n    dateInput.value = formatDate(current);\n    loadEventsForDate(dateInput.value);\n  }\n\n  document.getElementById('prevDayBtn').addEventListener('click', () => shiftDay(-1));\n  document.getElementById('nextDayBtn').addEventListener('click', () => shiftDay(1));\n  dateInput.addEventListener('change', () => loadEventsForDate(dateInput.value));\n  document.getElementById('eventSearch').addEventListener('input', renderEventList);\n\n  function setStatus(id, text, kind) {\n    const el = document.getElementById(id);\n    el.textContent = text;\n    el.className = 'statusz' + (kind ? ' ' + kind : '');\n  }\n\n  // ---- KÜLDÉS ----\n  document.getElementById('sendBtn').addEventListener('click', () => {\n    const btn = document.getElementById('sendBtn');\n    const extraInfo = document.getElementById('extraInfo').value.trim();\n    const recipients = getCheckedRecipients('main');\n\n    if (!recipients.length) {\n      setStatus('sendStatus', 'Válassz ki legalább egy címzettet.', 'hiba');\n      return;\n    }\n\n    const ev = selectedEvent;\n    btn.disabled = true;\n    setStatus('sendStatus', 'Küldés folyamatban…');\n\n    google.script.run\n      .withSuccessHandler(res => {\n        setStatus('sendStatus', `Elküldve ${res.recipientCount} címzettnek.`, 'ok');\n        document.getElementById('extraInfo').value = '';\n        document.querySelectorAll('.main-cb').forEach(cb => cb.checked = false);\n        updateSummary('main', 'selectedSummary');\n        btn.disabled = false;\n        loadHistory();\n      })\n      .withFailureHandler(err => {\n        setStatus('sendStatus', 'Hiba: ' + err.message, 'hiba');\n        btn.disabled = false;\n      })\n      .sendReport({\n        eventTitle: ev ? ev.title : '',\n        eventUrl: ev ? ev.url : '',\n        extraInfo: extraInfo,\n        recipients: recipients,\n      });\n  });\n\n  // ---- 4. ELŐZMÉNYEK ----\n  let historyData = [];\n  let activeHistoryIdx = null;\n\n  function splitRecipients(str) {\n    return String(str || '').split(',').map(s => s.trim()).filter(Boolean);\n  }\n\n  function loadHistory() {\n    const container = document.getElementById('historyList');\n    google.script.run\n      .withSuccessHandler(history => {\n        historyData = history || [];\n        document.getElementById('kpiElozmeny').textContent = historyData.length;\n        if (!historyData.length) {\n          container.innerHTML = '<div class=\"ures\">Még nincs elküldött email.</div>';\n          return;\n        }\n        container.innerHTML = '<div class=\"elozmeny-lista\">' + historyData.map((item, idx) => {\n          const dt = new Date(item.sentAt);\n          const datum = isNaN(dt.getTime()) ? item.sentAt : dt.toLocaleString('hu-HU');\n          const recipients = splitRecipients(item.recipients);\n          return `\n            <button type=\"button\" class=\"elozmeny${idx === activeHistoryIdx ? ' aktiv' : ''}\" data-idx=\"${idx}\">\n              <div class=\"elozmeny-cim\">${escapeHtml(item.subject)}</div>\n              <div class=\"elozmeny-cimzettek\">${escapeHtml(recipients.map(displayName).join(', '))}</div>\n              <div class=\"elozmeny-meta\">\n                <span>${escapeHtml(datum)}</span>\n                <span class=\"badge badge-kek\">${recipients.length} címzett</span>\n              </div>\n            </button>\n          `;\n        }).join('') + '</div>';\n\n        container.querySelectorAll('.elozmeny').forEach(el => {\n          el.addEventListener('click', () => openResendPanel(Number(el.dataset.idx)));\n        });\n      })\n      .withFailureHandler(err => {\n        container.innerHTML = '<div class=\"ures\">Nem sikerült betölteni az előzményeket.</div>';\n        console.error(err);\n      })\n      .getHistory();\n  }\n\n  function openResendPanel(idx) {\n    activeHistoryIdx = idx;\n    const item = historyData[idx];\n\n    document.querySelectorAll('.elozmeny').forEach(el => el.classList.toggle('aktiv', Number(el.dataset.idx) === idx));\n\n    const meta = document.getElementById('resendOriginalMeta');\n    if (item.eventTitle) {\n      meta.innerHTML = `Esemény: <strong>${escapeHtml(item.eventTitle)}</strong>` +\n        (item.eventUrl ? `<br><a href=\"${escapeHtml(item.eventUrl)}\" target=\"_blank\" rel=\"noopener\">${escapeHtml(item.eventUrl)}</a>` : '');\n    } else {\n      meta.textContent = 'Nincs esemény hozzárendelve';\n    }\n\n    const textarea = document.getElementById('resendExtraInfo');\n    textarea.value = item.extraInfo || '';\n    textarea.disabled = true;\n    document.getElementById('editResendBtn').textContent = 'Szerkesztés';\n\n    document.querySelectorAll('.resend-cb').forEach(cb => cb.checked = false);\n    updateSummary('resend', 'resendSelectedSummary');\n    setStatus('resendStatus', '');\n\n    document.getElementById('resendPanel').classList.add('nyitva');\n    document.getElementById('resendPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });\n  }\n\n  document.getElementById('editResendBtn').addEventListener('click', () => {\n    const textarea = document.getElementById('resendExtraInfo');\n    textarea.disabled = !textarea.disabled;\n    document.getElementById('editResendBtn').textContent = textarea.disabled ? 'Szerkesztés' : 'Kész';\n    if (!textarea.disabled) textarea.focus();\n  });\n\n  document.getElementById('cancelResendBtn').addEventListener('click', () => {\n    document.getElementById('resendPanel').classList.remove('nyitva');\n    document.querySelectorAll('.elozmeny').forEach(el => el.classList.remove('aktiv'));\n    activeHistoryIdx = null;\n  });\n\n  document.getElementById('resendSendBtn').addEventListener('click', () => {\n    if (activeHistoryIdx === null) return;\n    const item = historyData[activeHistoryIdx];\n    const btn = document.getElementById('resendSendBtn');\n    const recipients = getCheckedRecipients('resend');\n    const editedExtraInfo = document.getElementById('resendExtraInfo').value.trim();\n\n    if (!recipients.length) {\n      setStatus('resendStatus', 'Válassz ki legalább egy új címzettet.', 'hiba');\n      return;\n    }\n\n    btn.disabled = true;\n    setStatus('resendStatus', 'Küldés folyamatban…');\n\n    google.script.run\n      .withSuccessHandler(res => {\n        setStatus('resendStatus', `Újraküldve ${res.recipientCount} címzettnek.`, 'ok');\n        btn.disabled = false;\n        loadHistory();\n      })\n      .withFailureHandler(err => {\n        setStatus('resendStatus', 'Hiba: ' + err.message, 'hiba');\n        btn.disabled = false;\n      })\n      .sendReport({\n        eventTitle: item.eventTitle,\n        eventUrl: item.eventUrl,\n        extraInfo: editedExtraInfo,\n        recipients: recipients,\n      });\n  });\n\n  loadEventsForDate(dateInput.value);\n  loadHistory();\n</script>\n\n</body>\n</html>\n";

/* ---- Az Apps Script-es kódból átvett képernyő-függvények ---- */
function pageHead() {
  return `<!DOCTYPE html><html lang="hu"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Figtree:wght@400;500;600;700&display=swap">
  <style>${baseStyles()}</style></head>`;
}

function baseStyles() {
  // Ugyanaz a kártyás, mobilbarát arculat, mint a számla-áttekintőé:
  // a színek tokenekben vannak, sötét módban csak a tokenek változnak.
  return `
    :root {
      color-scheme: light;
      --bg: #f3f5f8; --card: #ffffff; --surface-2: #eef1f6; --border: #dde2ea;
      --text: #16202e; --muted: #5d6a7c; --blue: #1f5f8b; --blue-soft: #e2edf6;
      --red: #b3261e; --red-soft: #fbe3e1; --green: #1b7f4b; --green-soft: #e1f3e8;
      --amber: #a35a00; --amber-soft: #fbefdc; --amber-line: #f0d29a;
      --on-accent: #ffffff; --overlay: rgba(15,20,27,0.55);
      --f-display: "Bricolage Grotesque", "Segoe UI", system-ui, sans-serif;
      --f-body: "Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    @media (prefers-color-scheme: dark) { :root {
      color-scheme: dark;
      --bg: #0f141b; --card: #161d27; --surface-2: #1c2531; --border: #2a3443;
      --text: #e6ebf2; --muted: #93a0b2; --blue: #6fb0e0; --blue-soft: #1b2e40;
      --red: #f2867f; --red-soft: #3a1a18; --green: #5cc98d; --green-soft: #15301f;
      --amber: #f0b052; --amber-soft: #33260f; --amber-line: #5a4318;
      --on-accent: #0f141b; --overlay: rgba(0,0,0,0.65);
    } }
    * { box-sizing: border-box; }
    body { font-family: var(--f-body); font-size: 15px; line-height: 1.5; background: var(--bg); color: var(--text); margin: 0; padding: 20px 14px 40px; }
    .wrap { max-width: 640px; margin: 0 auto; }
    h1 { font: 700 24px/1.15 var(--f-display); margin: 0 0 4px; }
    .alcim { color: var(--muted); font-size: 14px; margin-bottom: 18px; }
    input, textarea, button { font-family: inherit; color: var(--text); }

    .panel { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 14px; }
    .panel-fej { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .panel-cim { font: 600 17px/1.2 var(--f-display); margin: 0; flex: 1; }
    .lepes {
      flex: none; width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
      background: var(--blue-soft); color: var(--blue); font-size: 13px; font-weight: 700;
    }

    .field { margin-bottom: 12px; }
    .field:last-child { margin-bottom: 0; }
    .field label.cimke, .field > label:not(.radio-opt):not(.checkbox-opt) { display: block; font-size: 13px; color: var(--muted); margin-bottom: 5px; font-weight: 600; }
    .field input[type=text], .field input[type=date], .field input[type=datetime-local], .field textarea {
      width: 100%; padding: 11px 13px; border: 1px solid var(--border); border-radius: 8px;
      font-size: 16px; background: var(--card); outline: none;
    }
    .field textarea { resize: vertical; min-height: 84px; }
    .field input:focus, .field textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-soft); }
    .mezo-racs { display: grid; grid-template-columns: 1fr; gap: 0 12px; }
    @media (min-width: 520px) { .mezo-racs { grid-template-columns: 1fr 1fr; } }

    /* Rádiók és címzettek: koppintható "csempék" / chipek */
    .radio-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; }
    .checkbox-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .radio-opt, .checkbox-opt { position: relative; cursor: pointer; }
    .radio-opt input, .checkbox-opt input { position: absolute; opacity: 0; pointer-events: none; }
    .radio-opt span {
      display: flex; align-items: center; justify-content: center; text-align: center; min-height: 44px;
      padding: 9px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--card); font-size: 14px; font-weight: 500;
    }
    .radio-opt input:checked + span { border-color: var(--blue); background: var(--blue-soft); color: var(--blue); font-weight: 700; box-shadow: inset 0 0 0 1px var(--blue); }
    .checkbox-opt span {
      display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 8px 14px;
      border: 1px solid var(--border); border-radius: 999px; background: var(--card); font-size: 14px; overflow-wrap: anywhere;
    }
    .checkbox-opt span::before { content: "+"; color: var(--muted); font-weight: 700; }
    .checkbox-opt input:checked + span { background: var(--blue); border-color: var(--blue); color: var(--on-accent); }
    .checkbox-opt input:checked + span::before { content: "✓"; color: var(--on-accent); }
    .radio-opt input:focus-visible + span, .checkbox-opt input:focus-visible + span { box-shadow: 0 0 0 3px var(--blue-soft); }

    /* Időzítés kapcsoló */
    .kapcsolo { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; }
    .kapcsolo input { position: absolute; opacity: 0; pointer-events: none; }
    .kapcsolo .sin { flex: none; width: 44px; height: 26px; border-radius: 999px; background: var(--border); position: relative; transition: background .15s; }
    .kapcsolo .sin::after { content: ""; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform .15s; box-shadow: 0 1px 2px rgba(0,0,0,.25); }
    .kapcsolo input:checked + .sin { background: var(--blue); }
    .kapcsolo input:checked + .sin::after { transform: translateX(18px); }
    #idopontMezo { margin-top: 12px; }

    /* Felvétel-blokkok, sorszámozva */
    #rowsContainer { counter-reset: felvetel; }
    .row-block { counter-increment: felvetel; padding: 14px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); margin-bottom: 10px; }
    .row-block .radio-row { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .row-block .radio-opt span { padding: 9px 6px; }
    .row-block-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-weight: 700; font-size: 14px; color: var(--blue); }
    .row-block-title span::after { content: " " counter(felvetel); }
    .remove-row { color: var(--red); font-size: 13px; font-weight: 600; background: none; border: 1px solid transparent; border-radius: 6px; padding: 4px 8px; cursor: pointer; }
    .remove-row:hover { border-color: var(--red); background: var(--red-soft); }
    .row-block:only-child .remove-row { display: none; }
    .add-row-btn {
      display: block; width: 100%; padding: 12px; text-align: center;
      border: 1.5px dashed var(--blue); border-radius: 10px; color: var(--blue); background: transparent;
      font-size: 15px; font-weight: 600; cursor: pointer;
    }
    .add-row-btn:hover { background: var(--blue-soft); }

    .btn { display: block; width: 100%; background: var(--blue); color: var(--on-accent); border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; }
    .btn:hover:not(:disabled) { filter: brightness(1.08); }
    .btn:disabled { opacity: 0.6; cursor: default; }
    .kuldes-sav { position: sticky; bottom: 0; padding: 12px 0 4px; background: linear-gradient(to bottom, transparent, var(--bg) 35%); }

    /* Üzenet-oldalak (elküldve, hiba stb.) */
    .card { max-width: 480px; margin: 40px auto 0; background: var(--card); border: 1px solid var(--border); border-radius: 14px; }
    .center { text-align: center; padding: 40px 24px; }
    .center .ikon { width: 56px; height: 56px; margin: 0 auto 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; background: var(--green-soft); color: var(--green); }
    .center .ikon.hiba { background: var(--red-soft); color: var(--red); }
    .center h1 { font-size: 22px; margin-bottom: 8px; }
    .center p { color: var(--muted); font-size: 15px; line-height: 1.6; white-space: pre-line; margin: 0; }
    .center a { display: inline-block; margin-top: 18px; color: var(--blue); font-weight: 600; }

    /* Előzmények */
    .elozmenyek-lista { display: flex; flex-direction: column; gap: 8px; }
    .elozmeny-item {
      position: relative; padding: 12px 44px 12px 14px;
      border: 1px solid var(--border); border-radius: 10px; background: var(--card); cursor: pointer;
    }
    .elozmeny-item:hover { border-color: var(--blue); }
    .elozmeny-torles-btn {
      position: absolute; top: 10px; right: 10px; width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      background: var(--card); border: 1px solid var(--border); border-radius: 6px;
      color: var(--muted); font-size: 16px; line-height: 1; cursor: pointer; padding: 0;
    }
    .elozmeny-torles-btn:hover { background: var(--red-soft); color: var(--red); border-color: var(--red); }
    .elozmeny-datum { font-size: 12px; color: var(--muted); font-weight: 600; }
    .elozmeny-targy { font-size: 15px; font-weight: 700; margin-top: 2px; }
    .elozmeny-reszlet { font-size: 13px; color: var(--muted); margin-top: 3px; overflow-wrap: anywhere; }

    /* Újraküldés: alulról felcsúszó panel */
    .panel-overlay {
      display: none; position: fixed; inset: 0; background: var(--overlay);
      z-index: 1000; align-items: flex-end; justify-content: center;
    }
    .panel-overlay.nyitva { display: flex; }
    .panel-doboz {
      width: 100%; max-width: 640px; max-height: 88vh; overflow-y: auto;
      background: var(--card); border-radius: 16px 16px 0 0; box-shadow: 0 -4px 24px rgba(0,0,0,0.25);
    }
    .panel-fejlec {
      position: sticky; top: 0; background: var(--card); border-bottom: 1px solid var(--border); padding: 16px 18px;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    .panel-fejlec h2 { margin: 0; font: 600 17px/1.25 var(--f-display); }
    .panel-bezar-btn {
      flex-shrink: 0; width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--surface-2); color: var(--text); font-size: 17px; cursor: pointer;
    }
    .panel-tartalom { padding: 14px 18px 18px; }
    .panel-tartalom .alcimke { font-size: 13px; color: var(--muted); font-weight: 600; margin: 4px 0 8px; }
    .panel-felvetelek { margin-bottom: 14px; }
    .panel-felvetel-item {
      padding: 10px 12px; margin: 6px 0; background: var(--surface-2); border: 1px solid var(--border);
      border-radius: 10px; font-size: 14px;
    }
    .panel-allapot { margin: 12px 0; font-size: 14px; color: var(--blue); font-weight: 600; min-height: 20px; }
      /* Előzmények: kijelölő-négyzet + kártya (emlékeztetőhöz) */
    .elozmeny-item { display: flex; align-items: flex-start; gap: 10px; padding: 0; border: 0; background: none; cursor: default; }
    .elozmeny-item:hover { border: 0; }
    .elozmeny-item > input[type=checkbox] { width: 20px; height: 20px; margin-top: 14px; flex-shrink: 0; accent-color: var(--blue); }
    .elozmeny-item-content {
      position: relative; flex: 1; min-width: 0; padding: 12px 44px 12px 14px;
      border: 1px solid var(--border); border-radius: 10px; background: var(--card); cursor: pointer;
    }
    .elozmeny-item-content:hover { border-color: var(--blue); }
    .elozmeny-emlekezteto-badge { display: inline-block; margin-top: 6px; padding: 2px 9px; border-radius: 999px; font-size: 12px; font-weight: 600; background: var(--amber-soft); color: var(--amber); }
    .elozmeny-felvetelek { margin-top: 10px; border-top: 1px dashed var(--border); padding-top: 8px; }
    .elozmeny-felvetel-sor { display: flex; align-items: center; gap: 8px; padding: 5px 2px; font-size: 13px; cursor: pointer; }
    .elozmeny-felvetel-sor input[type=checkbox] { width: 17px; height: 17px; accent-color: var(--blue); flex-shrink: 0; }
    .elozmeny-felvetel-badge { font-size: 11px; color: var(--amber); font-weight: 600; margin-left: auto; white-space: nowrap; padding-left: 8px; }

    .emlekezteto-sav { border: 1px solid var(--amber-line); background: var(--amber-soft); border-radius: 10px; padding: 14px; margin-bottom: 12px; }
    .emlekezteto-sav .darabszam { font-size: 14px; font-weight: 700; color: var(--amber); margin-bottom: 10px; }
    .cimzett-field { margin-bottom: 10px; }
    .cimzett-field label { display: block; font-size: 13px; color: var(--muted); font-weight: 600; margin-bottom: 5px; }
    .cimzett-field input, .field input[type=password] {
      width: 100%; padding: 11px 13px; border: 1px solid var(--border); border-radius: 8px;
      font-size: 16px; background: var(--card); outline: none;
    }
    .cimzett-field input:focus, .field input[type=password]:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-soft); }
    .emlekezteto-sav .panel-allapot { margin: 6px 0; color: var(--amber); }
    .login-hiba { color: var(--red); background: var(--red-soft); border-radius: 8px; padding: 8px 12px; font-size: 14px; font-weight: 600; margin: 0 0 12px; }
      /* Főoldal csempék */
    .csoport-cim { font: 600 14px/1.2 var(--f-body); text-transform: uppercase; letter-spacing: .05em; color: var(--muted); margin: 22px 0 10px; }
    .csoport-cim:first-of-type { margin-top: 4px; }
    .csempek { display: grid; grid-template-columns: 1fr; gap: 12px; }
    @media (min-width: 620px) { .csempek { grid-template-columns: 1fr 1fr; } }
    .csempe {
      display: flex; align-items: center; gap: 14px; text-decoration: none; color: var(--text);
      background: var(--card); border: 2px solid var(--border); border-radius: 14px; padding: 18px 16px; min-height: 92px;
    }
    .csempe:hover { border-color: var(--blue); background: var(--blue-soft); }
    .csempe-ikon { flex: none; width: 50px; height: 50px; border-radius: 12px; background: var(--blue-soft); display: flex; align-items: center; justify-content: center; font-size: 25px; }
    .csempe-szoveg { flex: 1; min-width: 0; }
    .csempe-cim { display: block; font: 600 18px/1.25 var(--f-display); }
    .csempe-leiras { display: block; color: var(--muted); font-size: 14px; margin-top: 2px; }
    .csempe-nyil { color: var(--muted); font-size: 20px; }
  `;
}

function escapeHtml(str) {
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;');
}

function navSav(aktiv, jelszo) {
  // Vékony fejléc: a márkanév és egy "Főoldal" link. Az appok nagy gombjai
  // a főoldalon vannak, a többi oldalról innen lehet visszalépni.
  const vissza = aktiv === 'fooldal' ? '' :
    `<a class="appnav-fooldal" href="${oldalLink('fooldal', jelszo)}" target="_top">← Főoldal</a>`;
  return `<style>
    .appnav { max-width: var(--nav-szel, 640px); margin: 0 auto 18px; padding: var(--nav-belso, 0); font-family: "Figtree", -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
    .appnav-fej { display: flex; align-items: center; justify-content: space-between; min-height: 40px; }
    .appnav-marka { font: 700 16px/1 "Bricolage Grotesque", "Segoe UI", sans-serif; color: var(--text, #16202e); text-decoration: none; }
    .appnav-fooldal {
      display: inline-flex; align-items: center; min-height: 40px; padding: 8px 14px; border-radius: 10px;
      border: 1px solid var(--border, #dde2ea); background: var(--card, #fff);
      font-size: 14px; font-weight: 700; color: var(--blue, #1f5f8b); text-decoration: none;
    }
    .appnav-fooldal:hover { border-color: var(--blue, #1f5f8b); }
  </style>
  <nav class="appnav">
    <div class="appnav-fej">
      <a class="appnav-marka" href="${oldalLink('fooldal', jelszo)}" target="_top">${escapeHtml(APP.NEV)}</a>
      ${vissza}
    </div>
  </nav>`;
}

function csempeHtml(href, ikon, cim, leiras, kulso) {
  return `
<a class="csempe" href="${href}" target="${kulso ? '_blank' : '_top'}"${kulso ? ' rel="noopener"' : ''}>
<span class="csempe-ikon">${ikon}</span>
<span class="csempe-szoveg"><span class="csempe-cim">${escapeHtml(cim)}</span><span class="csempe-leiras">${escapeHtml(leiras)}</span></span>
<span class="csempe-nyil">${kulso ? '↗' : '›'}</span>
</a>`;
}

function eszkozCsoportokHtml() {
  return ESZKOZ_CSOPORTOK.map(cs => `
<h2 class="csoport-cim">${escapeHtml(cs.cim)}</h2>
<div class="csempek">${cs.elemek.map(e => csempeHtml(e.url, e.ikon, e.cim, e.leiras, true)).join('')}</div>`).join('');
}

function renderBelepoOldal(hibasVolt, oldal) {
  const hibaSzoveg = hibasVolt ? '<p class="login-hiba">Hibás jelszó, próbáld újra.</p>' : '';
  return `${pageHead()}
<body>
<div class="wrap" style="max-width:380px; margin-top:8vh;">
<h1>${escapeHtml(APP.NEV)}</h1>
<div class="alcim">Belépés jelszóval</div>
<form method="get" action="${appUrl()}" target="_top" class="panel">
${hibaSzoveg}
<input type="hidden" name="oldal" value="${escapeHtml(oldal || '')}">
<div class="field">
<label for="jelszoMezo">Jelszó</label>
<input type="password" id="jelszoMezo" name="jelszo" autofocus required>
</div>
<button type="submit" class="btn">Belépés</button>
</form>
</div>
</body></html>`;
}

function renderFooldal(jelszo) {
  const fo = OLDALAK.map(o => csempeHtml(oldalLink(o.kulcs, jelszo), o.ikon, o.cim, o.leiras, false)).join('');
  return `${pageHead()}
<body>
<div class="wrap">
<h1>${escapeHtml(APP.NEV)}</h1>
<div class="alcim">Válaszd ki, mit szeretnél csinálni.</div>
<h2 class="csoport-cim">TV2 és elszámolás</h2>
<div class="csempek">${fo}</div>
${eszkozCsoportokHtml()}
</div>
</body></html>`;
}

function renderFormPage(defaultSubject, elozmenyek, jelszo) {
elozmenyek = elozmenyek || [];
const beszallitoOptions = BESZALLITO_OPTIONS.map((opt, i) => `
<label class="radio-opt">
<input type="radio" name="beszallito" value="${escapeHtml(opt)}" ${i === 0 ? 'checked' : ''}>
<span>${escapeHtml(opt)}</span>
</label>`).join('');

const recipientOptions = TELJ_CONFIG.DEFAULT_RECIPIENTS.map(email => `
<label class="checkbox-opt">
<input type="checkbox" name="recipients" value="${escapeHtml(email)}" checked>
<span>${escapeHtml(email)}</span>
</label>`).join('');

return `${pageHead()}
<body>
${navSav('teljesites', jelszo)}
<div class="wrap">
<h1>Teljesítési igazolás</h1>
<div class="alcim">Kitöltés után az Excel-igazolás(ok) e-mailben mennek ki a címzetteknek.</div>

<form method="post" action="${appUrl()}" id="mainForm" target="_top">
<input type="hidden" name="jelszo" value="${escapeHtml(jelszo || '')}">
<input type="hidden" name="oldal" value="teljesites">
<input type="hidden" name="row_count" id="rowCount" value="1">
<input type="hidden" name="kuldes_idopont_iso" id="kuldesIdopontIso">

<section class="panel">
<div class="panel-fej"><span class="lepes">1</span><h2 class="panel-cim">Beszállító cég</h2></div>
<div class="radio-row">${beszallitoOptions}</div>
</section>

<section class="panel">
<div class="panel-fej"><span class="lepes">2</span><h2 class="panel-cim">Felvételek</h2></div>
<div id="rowsContainer">
${renderRowBlock(0)}
</div>
<button type="button" class="add-row-btn" id="addRowBtn">+ Új felvétel hozzáadása</button>
</section>

<section class="panel">
<div class="panel-fej"><span class="lepes">3</span><h2 class="panel-cim">E-mail</h2></div>
<div class="field">
<label class="cimke">Címzettek</label>
<div class="checkbox-row">${recipientOptions}</div>
</div>
<div class="field">
<label class="cimke" for="subjectMezo">Tárgy</label>
<input type="text" id="subjectMezo" name="subject" value="${escapeHtml(defaultSubject)}">
</div>
<div class="field">
<label class="cimke" for="megjegyzesMezo">Egyéb megjegyzés</label>
<textarea id="megjegyzesMezo" name="megjegyzes" rows="3" placeholder="Ha van hozzáfűznivalód, ide írhatod (nem kötelező)"></textarea>
</div>
</section>

<section class="panel">
<div class="panel-fej"><span class="lepes">4</span><h2 class="panel-cim">Küldés időzítése</h2></div>
<label class="kapcsolo">
<input type="checkbox" id="utemezveCheckbox" name="utemezve" value="on">
<span class="sin"></span>
<span>Időzített küldés (megadott időpontban menjen ki, ne most)</span>
</label>
<div class="field" id="idopontMezo" style="display:none;">
<label class="cimke" for="kuldesIdopontHelyi">Küldés időpontja</label>
<input type="datetime-local" id="kuldesIdopontHelyi">
</div>
</section>

<div class="kuldes-sav">
<button type="submit" class="btn">Küldés</button>
</div>
</form>

${renderElozmenyekSzekcio(elozmenyek)}
</div>

<template id="rowTemplate">${renderRowBlock('__I__')}</template>

<script>
let rowIndex = 0; // az utoljára hozzáadott sor indexe (0 = az induló sor)

document.getElementById('addRowBtn').addEventListener('click', function () {
rowIndex++;
const tpl = document.getElementById('rowTemplate').innerHTML.replaceAll('__I__', rowIndex);
const wrapper = document.createElement('div');
wrapper.innerHTML = tpl;
const newBlock = wrapper.firstElementChild;

// Az első felvétel Megrendelő szerkesztő mezőjének értékét vesszük át
// alapértelmezettként - de az új sorban ez utólag szabadon módosítható.
const firstSzerkeszto = document.querySelector('.row-block [data-field="szerkeszto"]');
const newSzerkeszto = newBlock.querySelector('[data-field="szerkeszto"]');
if (firstSzerkeszto && newSzerkeszto) {
newSzerkeszto.value = firstSzerkeszto.value;
}

document.getElementById('rowsContainer').appendChild(newBlock);
const ujDatumMezo = newBlock.querySelector('[data-field="datum"]');
if (ujDatumMezo && !ujDatumMezo.value) {
ujDatumMezo.value = formatDateLocal(new Date());
}
updateRowCount();
});

document.getElementById('rowsContainer').addEventListener('click', function (e) {
if (e.target.classList.contains('remove-row')) {
const block = e.target.closest('.row-block');
if (document.querySelectorAll('.row-block').length > 1) {
block.remove();
}
}
});

function updateRowCount() {
document.getElementById('rowCount').value = document.querySelectorAll('.row-block').length;
}

// --- Időzített küldés mező ---
function pad(n) { return String(n).padStart(2, '0'); }
function formatDatetimeLocal(d) {
return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}
function formatDateLocal(d) {
return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

// Az induló (első) felvétel dátum-mezője alapból a mai napra áll be
document.querySelectorAll('[data-field="datum"]').forEach(function (mezo) {
if (!mezo.value) mezo.value = formatDateLocal(new Date());
});

const utemezveCheckbox = document.getElementById('utemezveCheckbox');
const idopontMezo = document.getElementById('idopontMezo');
const kuldesIdopontHelyi = document.getElementById('kuldesIdopontHelyi');

utemezveCheckbox.addEventListener('change', function () {
idopontMezo.style.display = utemezveCheckbox.checked ? 'block' : 'none';
if (utemezveCheckbox.checked && !kuldesIdopontHelyi.value) {
// Alapértelmezettként a form megnyitásakor/pipáláskor érvényes
// pontos idő - utána szabadon átírható.
kuldesIdopontHelyi.value = formatDatetimeLocal(new Date());
}
});

// Beküldés előtt a sorokat 0-tól sorba renumeráljuk, hogy törlés után se
// maradjanak kihagyott indexek. Illetve ha időzítve van, a helyi
// dátum+idő mezőt egyértelmű (UTC, "Z" végű) ISO-időponttá alakítjuk,
// hogy a szerver oldalon sose lehessen időzóna-félreértés.
document.getElementById('mainForm').addEventListener('submit', function (e) {
if (utemezveCheckbox.checked) {
if (!kuldesIdopontHelyi.value) {
e.preventDefault();
alert('Add meg a küldés időpontját, vagy vedd ki a pipát az Időzített küldésből!');
return;
}
const d = new Date(kuldesIdopontHelyi.value);
document.getElementById('kuldesIdopontIso').value = d.toISOString();
}

const blocks = document.querySelectorAll('.row-block');
blocks.forEach(function (block, idx) {
block.querySelectorAll('[data-field]').forEach(function (input) {
const field = input.getAttribute('data-field');
input.name = field + '_' + idx;
});
});
document.getElementById('rowCount').value = blocks.length;
});
</script>
</body></html>`;
}

function renderRowBlock(i) {
return `
<div class="row-block">
<div class="row-block-title">
<span>Felvétel</span>
<button type="button" class="remove-row">Törlés</button>
</div>
<div class="mezo-racs">
<div class="field">
<label>Megrendelő szerkesztő</label>
<input type="text" data-field="szerkeszto" name="szerkeszto_${i}" placeholder="pl. BA">
</div>
<div class="field">
<label>Dátum</label>
<input type="date" data-field="datum" name="datum_${i}" class="datum-input">
</div>
<div class="field">
<label>Téma (munkacím)</label>
<input type="text" data-field="tema" name="tema_${i}" placeholder="pl. ceglédi baleset">
</div>
<div class="field">
<label>Forgatás helyszíne</label>
<input type="text" data-field="helyszin" name="helyszin_${i}" placeholder="pl. Cegléd">
</div>
</div>
<div class="field">
<label>Kategória</label>
<div class="radio-row">
<label class="radio-opt"><input type="radio" data-field="kategoria" name="kategoria_${i}" value="demo" checked><span>DEMO</span></label>
<label class="radio-opt"><input type="radio" data-field="kategoria" name="kategoria_${i}" value="kat1"><span>1. kategória</span></label>
<label class="radio-opt"><input type="radio" data-field="kategoria" name="kategoria_${i}" value="kat2"><span>2. kategória</span></label>
</div>
</div>
<div class="field">
<label>Időszak</label>
<div class="radio-row">
<label class="radio-opt"><input type="radio" data-field="idoszak" name="idoszak_${i}" value="reggeli" checked><span>Ma reggeli</span></label>
<label class="radio-opt"><input type="radio" data-field="idoszak" name="idoszak_${i}" value="esti"><span>Ma esti</span></label>
<label class="radio-opt"><input type="radio" data-field="idoszak" name="idoszak_${i}" value="tegnapi"><span>Tegnapi</span></label>
</div>
</div>
</div>`;
}

function renderElozmenyekSzekcio(elozmenyek) {
if (!elozmenyek || elozmenyek.length === 0) {
return '';
}

const kartyak = elozmenyek.map((e, idx) => {
let sorok = [];
try {
sorok = JSON.parse(e.rowsJson).rows || [];
} catch (err) {
sorok = [];
}
const terkep = e.emlekeztetoTerkep || {};
const tobbFelvetel = sorok.length > 1;

// Ha csak egy felvétel van a beküldésben, nincs mit részletezni - a
// bejegyzés kártyáján simán jelezzük, ha ahhoz már ment emlékeztető.
// Ha több felvétel van, az összevont jelzés helyett minden felvétel saját
// badge-et kap lent (kivéve a régi, "legacy" formátumú bejegyzéseket,
// amiknél nincs felvétel-szintű bontásunk - azt itt fent jelezzük).
let emlekeztetoBadge = '';
if (!tobbFelvetel) {
const sajatBelyeg = terkep[0] || terkep.legacy || '';
emlekeztetoBadge = sajatBelyeg
? `<div class="elozmeny-emlekezteto-badge">Emlékeztető kiküldve: ${escapeHtml(sajatBelyeg)}</div>`
: '';
} else if (terkep.legacy) {
emlekeztetoBadge = `<div class="elozmeny-emlekezteto-badge">Korábbi emlékeztető (felvétel-bontás nélkül): ${escapeHtml(terkep.legacy)}</div>`;
}

const felvetelSorokHtml = tobbFelvetel
? `<div class="elozmeny-felvetelek">${sorok.map((r, rowIdx) => {
const sajatBelyeg = terkep[rowIdx] || '';
const sorBadge = sajatBelyeg
? `<span class="elozmeny-felvetel-badge">kiküldve: ${escapeHtml(sajatBelyeg)}</span>`
: '';
return `
<label class="elozmeny-felvetel-sor">
<input type="checkbox" class="elozmeny-emlekezteto-row-cb" data-idx="${idx}" data-row="${rowIdx}">
<span>${escapeHtml(r.tema)} (${escapeHtml(r.helyszin)})</span>
${sorBadge}
</label>`;
}).join('')}</div>`
: '';

return `
<div class="elozmeny-item" data-idx="${idx}">
<input type="checkbox" class="elozmeny-emlekezteto-cb" data-idx="${idx}" data-rowcount="${sorok.length}" aria-label="Kiválasztás az emlékeztetőhöz">
<div class="elozmeny-item-content" data-idx="${idx}">
<button type="button" class="elozmeny-torles-btn" data-sheet-sor="${e.sheetSor}" title="Törlés" aria-label="Törlés">×</button>
<div class="elozmeny-datum">${escapeHtml(e.datumSzoveg)}</div>
<div class="elozmeny-targy">${escapeHtml(e.subject)}</div>
<div class="elozmeny-reszlet">Címzettek: ${escapeHtml(e.cimzettek)}</div>
${emlekeztetoBadge}
${felvetelSorokHtml}
</div>
</div>`;
}).join('');

// A teljes adatot (rows JSON-ok) egy script-tagbe ágyazzuk be, hogy a
// panel / az emlékeztető a szerver újra-hívása nélkül tudja
// megjeleníteni és összeállítani a részleteket.
const elozmenyAdatokJs = JSON.stringify(elozmenyek.map(e => ({
sheetSor: e.sheetSor,
subject: e.subject,
cimzettek: e.cimzettek,
rowsJson: e.rowsJson,
emlekeztetoTerkep: e.emlekeztetoTerkep || {},
datumSzoveg: e.datumSzoveg,
})));

const recipientCheckboxokTemplate = TELJ_CONFIG.DEFAULT_RECIPIENTS.map(email => `
<label class="checkbox-opt">
<input type="checkbox" class="panel-cimzett-cb" value="${escapeHtml(email)}">
<span>${escapeHtml(email)}</span>
</label>`).join('');

const alapertelmezettEmlekeztetoCimzett = TELJ_CONFIG.DEFAULT_RECIPIENTS.join(', ');

return `
<section class="panel" style="margin-top:24px;">
<div class="panel-fej"><h2 class="panel-cim">Korábban elküldött tételek</h2></div>
<p class="alcim" style="margin:-4px 0 12px;">Pipáld ki azokat, amelyekhez hiányzik a megrendelő, és küldj róluk emlékeztetőt. Koppints egy tételre az újraküldéshez.</p>

<div class="emlekezteto-sav" id="emlekeztetoSav" style="display:none;">
<div class="darabszam" id="emlekeztetoDarabszam"></div>
<div class="cimzett-field">
<label>Emlékeztető címzettje(i) — vesszővel elválasztva, ha több</label>
<input type="text" id="emlekeztetoCimzettek" value="${escapeHtml(alapertelmezettEmlekeztetoCimzett)}" placeholder="pl. gyartas@tv2.hu, tv2-videk@tv2.hu">
</div>
<div class="panel-allapot" id="emlekeztetoAllapot"></div>
<button type="button" class="btn" id="emlekeztetoKuldesBtn">Emlékeztető elküldése</button>
</div>

<div class="elozmenyek-lista" id="elozmenyekLista">${kartyak}</div>
</section>

<div class="panel-overlay" id="panelOverlay">
<div class="panel-doboz">
<div class="panel-fejlec">
<h2 id="panelTargy"></h2>
<button type="button" class="panel-bezar-btn" id="panelBezarBtn" aria-label="Bezárás">×</button>
</div>
<div class="panel-tartalom">
<div class="alcimke">Felvételek</div>
<div id="panelFelvetelek" class="panel-felvetelek"></div>

<div class="alcimke">Címzettek</div>
<div class="checkbox-row" id="panelCimzettek">${recipientCheckboxokTemplate}</div>

<div class="panel-allapot" id="panelAllapot"></div>

<button type="button" class="btn" id="panelKuldesBtn">Küldés újra</button>
</div>
</div>
</div>

<script>
const ELOZMENY_ADATOK = ${elozmenyAdatokJs};
let aktivPanelAdat = null;
// Kulcsok formátuma: "<bejegyzés-idx>:<felvétel-idx belül>" - így egy
// bejegyzésen belül is külön kiválasztható, melyik felvétel(eke)t kéred.
const emlekeztetoKivalasztottak = new Set();

function emlekeztetoKulcs(idx, rowIdx) { return idx + ':' + rowIdx; }

// Ha egy bejegyzésnek van al-bontása (több felvétele), a fő checkbox
// kijelölt/kijelöletlen állapotát a sor-checkboxokhoz igazítjuk: csak akkor
// legyen pipálva, ha MIND az összes al-sor pipálva van.
function frissitFoCheckboxAllapotat(idx) {
const foCb = document.querySelector('.elozmeny-emlekezteto-cb[data-idx="' + idx + '"]');
if (!foCb) return;
const sorCheckboxok = document.querySelectorAll('.elozmeny-emlekezteto-row-cb[data-idx="' + idx + '"]');
if (sorCheckboxok.length === 0) return;
foCb.checked = Array.from(sorCheckboxok).every(function (cb) { return cb.checked; });
}

document.querySelectorAll('.elozmeny-emlekezteto-cb').forEach(function (cb) {
cb.addEventListener('change', function () {
const idx = Number(cb.getAttribute('data-idx'));
const sorCheckboxok = document.querySelectorAll('.elozmeny-emlekezteto-row-cb[data-idx="' + idx + '"]');
if (sorCheckboxok.length > 0) {
// Van al-bontás: a fő checkbox mindet egyszerre be- vagy kikapcsolja.
sorCheckboxok.forEach(function (sorCb) {
sorCb.checked = cb.checked;
const kulcs = emlekeztetoKulcs(idx, Number(sorCb.getAttribute('data-row')));
if (cb.checked) emlekeztetoKivalasztottak.add(kulcs); else emlekeztetoKivalasztottak.delete(kulcs);
});
} else {
// Nincs al-bontás (egyetlen felvétel) - a fő checkbox magát a 0. sort jelöli.
const kulcs = emlekeztetoKulcs(idx, 0);
if (cb.checked) emlekeztetoKivalasztottak.add(kulcs); else emlekeztetoKivalasztottak.delete(kulcs);
}
frissitEmlekeztetoSav();
});
});

document.querySelectorAll('.elozmeny-emlekezteto-row-cb').forEach(function (cb) {
cb.addEventListener('change', function () {
const idx = Number(cb.getAttribute('data-idx'));
const rowIdx = Number(cb.getAttribute('data-row'));
const kulcs = emlekeztetoKulcs(idx, rowIdx);
if (cb.checked) emlekeztetoKivalasztottak.add(kulcs); else emlekeztetoKivalasztottak.delete(kulcs);
frissitFoCheckboxAllapotat(idx);
frissitEmlekeztetoSav();
});
});

function frissitEmlekeztetoSav() {
const sav = document.getElementById('emlekeztetoSav');
if (emlekeztetoKivalasztottak.size === 0) {
sav.style.display = 'none';
return;
}
sav.style.display = 'block';
document.getElementById('emlekeztetoDarabszam').textContent =
emlekeztetoKivalasztottak.size + ' tétel kiválasztva az emlékeztetőhöz';
}

document.getElementById('emlekeztetoKuldesBtn').addEventListener('click', function () {
const cimSzoveg = document.getElementById('emlekeztetoCimzettek').value || '';
const cimzettek = cimSzoveg.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
if (cimzettek.length === 0) {
document.getElementById('emlekeztetoAllapot').textContent = 'Adj meg legalább egy címzettet!';
return;
}
if (!confirm('Biztosan küldesz emlékeztetőt ' + emlekeztetoKivalasztottak.size + ' kiválasztott tételről, hogy hiányzik a megrendelő?')) return;

const csoportositva = {}; // bejegyzés-idx -> [felvétel-idx, ...]
emlekeztetoKivalasztottak.forEach(function (kulcs) {
const resz = kulcs.split(':');
const idx = Number(resz[0]);
const rowIdx = Number(resz[1]);
if (!csoportositva[idx]) csoportositva[idx] = [];
csoportositva[idx].push(rowIdx);
});

const kivalasztottAdatok = Object.keys(csoportositva).map(function (idxStr) {
const idx = Number(idxStr);
const a = ELOZMENY_ADATOK[idx];
return {
sheetSor: a.sheetSor,
subject: a.subject,
idobelyegSzoveg: a.datumSzoveg,
rowsJson: a.rowsJson,
selectedRowIndexes: csoportositva[idx],
};
});

const btn = document.getElementById('emlekeztetoKuldesBtn');
btn.disabled = true;
document.getElementById('emlekeztetoAllapot').textContent = 'Küldés folyamatban...';

google.script.run
.withSuccessHandler(function () {
document.getElementById('emlekeztetoAllapot').textContent = 'Emlékeztető elküldve! Az oldal mindjárt frissül...';
setTimeout(function () {
window.top.location.reload();
}, 1200);
})
.withFailureHandler(function (hiba) {
document.getElementById('emlekeztetoAllapot').textContent = 'Hiba: ' + hiba.message;
btn.disabled = false;
})
.emlekezteteTobbTetelhez(kivalasztottAdatok, cimzettek);
});

document.getElementById('elozmenyekLista').addEventListener('click', function (e) {
if (e.target.classList.contains('elozmeny-torles-btn')) {
e.stopPropagation();
const sheetSor = e.target.getAttribute('data-sheet-sor');
if (!confirm('Biztosan törlöd ezt a tételt az előzményekből?')) return;
e.target.disabled = true;
google.script.run
.withSuccessHandler(function () {
e.target.closest('.elozmeny-item').remove();
})
.withFailureHandler(function (hiba) {
alert('Törlési hiba: ' + hiba.message);
e.target.disabled = false;
})
.torolElozmeny(Number(sheetSor));
return;
}

if (e.target.closest('.elozmeny-felvetelek')) {
// Az al-checkboxok (felvétel-választás) kattintása ne nyissa meg a panelt.
return;
}

const tartalom = e.target.closest('.elozmeny-item-content');
if (!tartalom) return;
const idx = Number(tartalom.getAttribute('data-idx'));
panelMegnyitasa(ELOZMENY_ADATOK[idx]);
});

function panelMegnyitasa(adat) {
aktivPanelAdat = adat;
document.getElementById('panelTargy').textContent = adat.subject;

let jobData;
try {
jobData = JSON.parse(adat.rowsJson);
} catch (err) {
jobData = { rows: [] };
}

document.getElementById('panelFelvetelek').innerHTML = jobData.rows.map(function (r) {
return '<div class="panel-felvetel-item">' +
'<strong>' + escapeHtmlJs(r.tema) + '</strong> (' + escapeHtmlJs(r.helyszin) + ')' +
(r.datum ? ' · ' + escapeHtmlJs(r.datum) : '') +
'</div>';
}).join('');

const eredetiCimzettek = (adat.cimzettek || '').split(',').map(function (s) { return s.trim(); });
document.querySelectorAll('.panel-cimzett-cb').forEach(function (cb) {
cb.checked = eredetiCimzettek.indexOf(cb.value) !== -1;
});

document.getElementById('panelAllapot').textContent = emlekeztetoOsszegzesSzoveg(adat.emlekeztetoTerkep);
document.getElementById('panelOverlay').classList.add('nyitva');
}

// Felvétel-szintű "mikor ment ki hozzá emlékeztető" térképből (lásd
// parseEmlekeztetoTerkep a szerveren) olvasható összegző szöveget épít a
// panel státusz-sorához.
function emlekeztetoOsszegzesSzoveg(terkep) {
if (!terkep) return '';
const kulcsok = Object.keys(terkep);
if (kulcsok.length === 0) return '';
if (terkep.legacy && kulcsok.length === 1) {
return 'Emlékeztető már kiküldve hozzá: ' + terkep.legacy;
}
const reszek = kulcsok.filter(function (k) { return k !== 'legacy'; }).map(function (k) {
return (Number(k) + 1) + '. tétel: ' + terkep[k];
});
return reszek.length > 0 ? ('Emlékeztető már kiküldve - ' + reszek.join(', ')) : '';
}

document.getElementById('panelBezarBtn').addEventListener('click', function () {
document.getElementById('panelOverlay').classList.remove('nyitva');
});

document.getElementById('panelKuldesBtn').addEventListener('click', function () {
const kivalasztott = Array.from(document.querySelectorAll('.panel-cimzett-cb:checked')).map(function (cb) { return cb.value; });
if (kivalasztott.length === 0) {
document.getElementById('panelAllapot').textContent = 'Jelölj be legalább egy címzettet!';
return;
}
if (!confirm('Biztosan újraküldöd ezt a tételt? Ez most, azonnal ki fog menni.')) return;

const btn = document.getElementById('panelKuldesBtn');
btn.disabled = true;
document.getElementById('panelAllapot').textContent = 'Küldés folyamatban...';

google.script.run
.withSuccessHandler(function () {
document.getElementById('panelAllapot').textContent = 'Elküldve!';
btn.disabled = false;
setTimeout(function () {
document.getElementById('panelOverlay').classList.remove('nyitva');
}, 1200);
})
.withFailureHandler(function (hiba) {
document.getElementById('panelAllapot').textContent = 'Hiba: ' + hiba.message;
btn.disabled = false;
})
.ujrakuldesElozmenybol(aktivPanelAdat.rowsJson, kivalasztott);
});

function escapeHtmlJs(str) {
const div = document.createElement('div');
div.textContent = str == null ? '' : str;
return div.innerHTML;
}
</script>`;
}

function parseEmlekeztetoTerkep(raw) {
if (!raw) return {};
try {
const parsed = JSON.parse(raw);
if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
} catch (e) {
return { legacy: String(raw) };
}
return {};
}

function renderMessagePage(title, message, jelszo) {
return `${pageHead()}
<body>${jelszo ? navSav('teljesites', jelszo) : ''}<div class="card"><div class="center"><div class="ikon hiba">!</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>${jelszo ? `<a href="${oldalLink('teljesites', jelszo)}" target="_top">Vissza az űrlaphoz</a>` : ''}</div></div></body></html>`;
}

function renderThankYouPage(fileCount, jelszo) {
return `${pageHead()}
<body>${jelszo ? navSav('teljesites', jelszo) : ''}<div class="card"><div class="center"><div class="ikon">✓</div><h1>Elküldve!</h1><p>${fileCount} db teljesítési igazolás elkészült és elment e-mailben.</p>${jelszo ? `<a href="${oldalLink('teljesites', jelszo)}" target="_top">Vissza az űrlaphoz</a>` : ''}</div></div></body></html>`;
}

function renderScheduledPage(sendAt, fileCount, jelszo) {
const formatted = Utilities.formatDate(sendAt, TELJ_CONFIG.IDOZONA, 'yyyy. MM. dd. HH:mm');
return `${pageHead()}
<body>${jelszo ? navSav('teljesites', jelszo) : ''}<div class="card"><div class="center"><div class="ikon">⏱</div><h1>Időzítve!</h1><p>${fileCount} db teljesítési igazolás elkészítve.\nKüldés időpontja: ${formatted}</p>${jelszo ? `<a href="${oldalLink('teljesites', jelszo)}" target="_top">Vissza az űrlaphoz</a>` : ''}</div></div></body></html>`;
}

function toRomanMonth(month) {
const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
return romans[month - 1] || String(month);
}

function pad2(n) {
return n < 10 ? '0' + n : String(n);
}

function renderElszamolasForm(honapok, alapHonap, jelszo) {
  const opciok = honapok.map(honap =>
    `<option value="${escapeHtml(honap)}" ${honap === alapHonap ? 'selected' : ''}>${escapeHtml(honap)}</option>`
  ).join('');

  const cimzettChipek = ELSZ_CONFIG.CIMZETT_LISTA.map(c => `
<label class="checkbox-opt"><input type="checkbox" class="elsz-cimzett-cb" value="${escapeHtml(c.email)}" ${c.alapEllenorzott ? 'checked' : ''}><span>${escapeHtml(c.email)}</span></label>`).join('');

  const nevebenOpciok = ELSZ_CONFIG.NEVEBEN_LISTA.map((n, i) => `
<label class="radio-opt"><input type="radio" name="nevebenPipa" value="${escapeHtml(n.nev)}" ${n.alapEllenorzott ? 'checked' : ''}><span>${escapeHtml(n.nev)}</span></label>`).join('');

  return `${pageHead()}
<style>
  .field select, .fajl-mezo {
    width: 100%; padding: 11px 13px; border: 1px solid var(--border); border-radius: 8px;
    font-size: 16px; background: var(--card); color: var(--text); font-family: inherit;
  }
  .fajl-doboz { display: block; border: 1.5px dashed var(--blue); border-radius: 10px; padding: 18px 14px; text-align: center; cursor: pointer; color: var(--blue); font-weight: 600; }
  .fajl-doboz:hover { background: var(--blue-soft); }
  .fajl-doboz input { position: absolute; opacity: 0; pointer-events: none; width: 1px; }
  .fajl-lista { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
  .fajl-sor { padding: 8px 12px; border-radius: 8px; background: var(--surface-2); font-size: 14px; overflow-wrap: anywhere; }
  .gomb-masod { background: var(--card); color: var(--blue); border: 1px solid var(--blue); }
  .allapot { font-size: 14px; margin-top: 10px; min-height: 20px; color: var(--muted); }
  .allapot.hiba { color: var(--red); }
  .allapot.sikeres { color: var(--green); }
</style>
<body>
${navSav('elszamolas', jelszo)}
<div class="wrap" id="tartalom">
<h1>Elszámolás beküldése</h1>
<div class="alcim">Havi összefűzött PDF letöltése, majd a feltöltött PDF-ek elküldése.</div>

<section class="panel">
<div class="panel-fej"><span class="lepes">1</span><h2 class="panel-cim">Hónap</h2></div>
<div class="field">
<label for="honap">Melyik hónapot érinti?</label>
<select id="honap">${opciok}</select>
</div>
</section>

<section class="panel">
<div class="panel-fej"><span class="lepes">2</span><h2 class="panel-cim">Összefűzött PDF letöltése</h2></div>
<p class="alcim" style="margin:-4px 0 12px;">A hónap összes PDF-je egy fájlban. Önálló lépés, nem küld semmit.</p>
<button type="button" class="btn gomb-masod" id="letoltGomb" onclick="letoltes()">Összefűzött PDF letöltése</button>
<p class="allapot" id="allapotLetoltes"></p>
</section>

<section class="panel">
<div class="panel-fej"><span class="lepes">3</span><h2 class="panel-cim">Feltöltés és küldés</h2></div>
<div class="field">
<label class="cimke">PDF-ek</label>
<label class="fajl-doboz" for="feltoltottFajlok">+ PDF-ek kiválasztása (több is lehet)
<input type="file" id="feltoltottFajlok" accept="application/pdf" multiple>
</label>
<div class="fajl-lista" id="fajlLista"></div>
</div>
<div class="field">
<label class="cimke">Kinek a nevében?</label>
<div class="radio-row">${nevebenOpciok}</div>
<input type="text" class="fajl-mezo" id="nevebenEgyeb" placeholder="Vagy írj be mást (ez felülírja a fenti választást)" style="margin-top:8px;">
</div>
<div class="field">
<label class="cimke">Címzettek</label>
<div class="checkbox-row">${cimzettChipek}</div>
</div>
</section>

<div class="kuldes-sav">
<button type="button" class="btn" id="kuldGomb" onclick="kuldes()">Küldés</button>
<p class="allapot" id="allapotKuldes"></p>
</div>
</div>

<script>
  document.getElementById('feltoltottFajlok').addEventListener('change', function (e) {
    const lista = document.getElementById('fajlLista');
    lista.innerHTML = '';
    Array.from(e.target.files).forEach(function (f) {
      const sor = document.createElement('div');
      sor.className = 'fajl-sor';
      sor.textContent = f.name;
      lista.appendChild(sor);
    });
  });

  function base64ToBlob(base64, mime) {
    const bajtSzoveg = atob(base64);
    const bajtok = new Uint8Array(bajtSzoveg.length);
    for (let i = 0; i < bajtSzoveg.length; i++) bajtok[i] = bajtSzoveg.charCodeAt(i);
    return new Blob([bajtok], { type: mime });
  }

  function olvasdFajltBase64Kent(fajl) {
    return new Promise(function (resolve, reject) {
      const olvaso = new FileReader();
      olvaso.onload = function () {
        resolve({ base64: olvaso.result.split(',')[1], filename: fajl.name, mimeType: fajl.type });
      };
      olvaso.onerror = reject;
      olvaso.readAsDataURL(fajl);
    });
  }

  function allapotIr(id, szoveg, tipus) {
    const el = document.getElementById(id);
    el.className = 'allapot' + (tipus ? ' ' + tipus : '');
    el.textContent = szoveg;
  }

  // Összefűzött PDF letöltése - önálló, a küldéstől teljesen független
  function letoltes() {
    const honap = document.getElementById('honap').value;
    const letoltGomb = document.getElementById('letoltGomb');
    letoltGomb.disabled = true;
    allapotIr('allapotLetoltes', 'Összefűzés folyamatban, ez a hónap tételszámától függően eltarthat egy ideig...');

    google.script.run
      .withSuccessHandler(function (eredmeny) {
        letoltGomb.disabled = false;
        const blob = base64ToBlob(eredmeny.base64, 'application/pdf');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = eredmeny.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        allapotIr('allapotLetoltes', 'Letöltve: ' + eredmeny.filename + ' (' + eredmeny.tetelSzam + ' tétel).', 'sikeres');
      })
      .withFailureHandler(function (hiba) {
        letoltGomb.disabled = false;
        allapotIr('allapotLetoltes', 'Hiba: ' + hiba.message, 'hiba');
      })
      .honapOsszesPdfjeEgyesitveBase64(honap);
  }

  // Küldés - kizárólag a feltöltött fájlokat csatolja
  function kuldes() {
    const kuldGomb = document.getElementById('kuldGomb');
    const fajlok = Array.from(document.getElementById('feltoltottFajlok').files);
    if (fajlok.length === 0) {
      allapotIr('allapotKuldes', 'Tölts fel legalább egy PDF-et!', 'hiba');
      return;
    }

    const cimzettek = Array.from(document.querySelectorAll('.elsz-cimzett-cb:checked')).map(function (el) { return el.value; });
    if (cimzettek.length === 0) {
      allapotIr('allapotKuldes', 'Jelölj be legalább egy címzettet!', 'hiba');
      return;
    }

    const nevebenEgyeb = document.getElementById('nevebenEgyeb').value.trim();
    const nevebenPipalt = document.querySelector('input[name="nevebenPipa"]:checked');
    const nevebenErtek = nevebenEgyeb || (nevebenPipalt ? nevebenPipalt.value : '');
    if (!nevebenErtek) {
      allapotIr('allapotKuldes', 'Add meg, kinek a nevében küldöd az elszámolást!', 'hiba');
      return;
    }

    const honap = document.getElementById('honap').value;
    kuldGomb.disabled = true;
    allapotIr('allapotKuldes', 'Fájlok beolvasása és küldés folyamatban...');

    Promise.all(fajlok.map(olvasdFajltBase64Kent)).then(function (feltoltottLista) {
      google.script.run
        .withSuccessHandler(function (uzenet) {
          const kesz = document.createElement('div');
          kesz.className = 'card';
          kesz.innerHTML = '<div class="center"><div class="ikon">✓</div><h1>Elküldve!</h1><p></p></div>';
          kesz.querySelector('p').textContent = uzenet;
          const tartalom = document.getElementById('tartalom');
          tartalom.innerHTML = '';
          tartalom.appendChild(kesz);
        })
        .withFailureHandler(function (hiba) {
          kuldGomb.disabled = false;
          allapotIr('allapotKuldes', 'Hiba küldéskor: ' + hiba.message, 'hiba');
        })
        .emailKuldese(honap, feltoltottLista, cimzettek, nevebenErtek);
    }).catch(function (hiba) {
      kuldGomb.disabled = false;
      allapotIr('allapotKuldes', 'Hiba a fájlok beolvasásakor: ' + hiba, 'hiba');
    });
  }
</script>
</body></html>`;
}

function dashLink(honapNev, jelszo) {
  return oldalLink('dashboard', jelszo) + '&honap=' + encodeURIComponent(honapNev);
}

function dashStyles() {
  return `<style>
    :root { --nav-szel: 720px; }
    .wrap { max-width: 720px; }
    .honapvalto { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; }
    .honapvalto a, .honapvalto .inaktiv {
      flex: none; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--border); border-radius: 10px; background: var(--card); color: var(--blue);
      font-size: 22px; font-weight: 700; text-decoration: none;
    }
    .honapvalto a:hover { border-color: var(--blue); }
    .honapvalto .inaktiv { color: var(--border); }
    .honapvalto .honap { font: 600 19px/1.2 var(--f-display); text-align: center; }

    .osszeg-sor { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 14px 20px; }
    .kis-cim { margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 700; }
    .osszeg-ertek { margin: 4px 0 0; font: 700 32px/1.1 var(--f-display); color: var(--blue); }
    .osszeg-ertek.szallitoi { font-size: 22px; }
    .osszeg-ertek.egyezik { color: var(--green); }
    .osszeg-ertek.elter { color: var(--red); }
    .jelmagyarazat-racs { display: grid; grid-template-columns: repeat(2, auto); gap: 4px 16px; margin-top: 6px; }
    .jelmagyarazat-racs p { margin: 0; font-size: 13px; color: var(--muted); white-space: nowrap; }

    .metrika-racs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 16px; }
    .metrika-kartya {
      border: 2px solid var(--border); border-radius: 12px; background: var(--card); padding: 10px 4px;
      text-align: center; cursor: pointer; user-select: none; font: inherit; color: var(--text);
    }
    .metrika-kartya:hover { border-color: var(--blue); }
    .metrika-kartya .cimke { display: block; font-size: 12px; color: var(--muted); }
    .metrika-kartya .ertek { display: block; font-size: 19px; font-weight: 700; margin-top: 2px; }
    .metrika-kartya.aktiv { border-color: var(--blue); background: var(--blue-soft); color: var(--blue); }
    .metrika-kartya.aktiv .cimke { color: var(--blue); }

    .hatar-doboz { margin-top: 12px; background: var(--surface-2); border-radius: 10px; padding: 12px 14px; font-size: 14px; }
    .hatar-doboz p { margin: 0; }
    .hatar-doboz p + p { margin-top: 6px; }

    .tetelek-fejlec { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 22px 0 10px; }
    .szuro-torles { background: none; border: none; color: var(--blue); font-weight: 700; font-size: 14px; cursor: pointer; padding: 6px 0; }
    .tetel-lista { display: flex; flex-direction: column; gap: 8px; }
    .tetel-sor {
      display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
      background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px;
    }
    .tetel-bal { min-width: 0; }
    .tetel-sor .nev { margin: 0; font-size: 15px; font-weight: 600; overflow-wrap: anywhere; }
    .cimkek { margin: 6px 0 0; display: flex; flex-wrap: wrap; gap: 6px; }
    .cimke-chip { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .cimke-datum { background: var(--blue-soft); color: var(--blue); }
    .cimke-felado { background: var(--amber-soft); color: var(--amber); }
    .kizart-cimke { background: var(--surface-2); color: var(--muted); }
    .tetel-jobb { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
    .osszeg-szam { margin: 0; font-size: 16px; font-weight: 700; color: var(--blue); white-space: nowrap; }
    .akciok { display: flex; gap: 6px; }
    .akcio {
      width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;
      border: 1px solid var(--border); border-radius: 8px; background: var(--card); color: var(--blue);
      font-size: 16px; text-decoration: none; cursor: pointer; padding: 0;
    }
    .akcio:hover { border-color: var(--blue); background: var(--blue-soft); }
    .akcio.torles { color: var(--red); }
    .akcio.torles:hover { border-color: var(--red); background: var(--red-soft); }
    .akcio.aktiv { color: var(--amber); border-color: var(--amber-line); background: var(--amber-soft); }
    .tetel-osszesito { border-left: 4px solid var(--amber); background: var(--amber-soft); }
    .tetel-ismeretlen { border-left: 4px solid var(--red); background: var(--red-soft); }
    .tetel-kizarva { opacity: .6; }
    .megjelol-osszesitokent { display: inline-block; margin-top: 8px; font-size: 13px; font-weight: 700; color: var(--red); background: none; border: none; padding: 0; cursor: pointer; }
    .ures { padding: 28px 16px; text-align: center; color: var(--muted); background: var(--card); border: 1px dashed var(--border); border-radius: 10px; }
    .muvelet-alatt { opacity: .4; pointer-events: none; }
    @media (max-width: 420px) {
      .metrika-kartya .ertek { font-size: 16px; }
      .tetel-sor { flex-direction: column; }
      .tetel-jobb { flex-direction: row; align-items: center; justify-content: space-between; width: 100%; }
    }
  </style>`;
}

function renderDashboard(honapNev, sorok, osszesites, nav, nevTerkep, jelszo) {
  const id = s => escapeHtml(s.pdfFileId || '');
  const tetelSorokHtml = sorok.length === 0
    ? `<div class="ures">Ebben a hónapban még nincs egy tétel sem.</div>`
    : sorok.map(s => `
<div class="tetel-sor ${s.tipus === 'osszesito' ? 'tetel-osszesito' : ''} ${s.tipus === 'ismeretlen' ? 'tetel-ismeretlen' : ''} ${s.kizarva ? 'tetel-kizarva' : ''}" data-osszeg="${s.osszeg}" data-tipus="${s.tipus}">
  <div class="tetel-bal">
    <p class="nev">${escapeHtml(s.megnevezes)}</p>
    <p class="cimkek">
      <span class="cimke-chip cimke-datum">${escapeHtml(datumIdoMegjelenitve(s))}</span>
      <span class="cimke-chip cimke-felado">${escapeHtml(feladoMegjelenitendoNeve(nevTerkep, s.feladoEmail))}</span>
      ${s.kizarva ? '<span class="cimke-chip kizart-cimke">Kizárva az összefűzésből</span>' : ''}
    </p>
    ${s.tipus === 'ismeretlen' ? `<button type="button" class="megjelol-osszesitokent" onclick="muvelet(this, 'tetelMegjelolesOsszesitokent', '${id(s)}')">Megjelölés összesítőként →</button>` : ''}
  </div>
  <div class="tetel-jobb">
    <p class="osszeg-szam">${formatFt(s.osszeg)}</p>
    <div class="akciok">
      ${s.pdfFileId ? `<a class="akcio" href="https://drive.google.com/uc?export=download&id=${encodeURIComponent(s.pdfFileId)}" target="_blank" rel="noopener" title="PDF letöltése" aria-label="PDF letöltése">⬇</a>` : ''}
      <button type="button" class="akcio ${s.kizarva ? 'aktiv' : ''}" title="${s.kizarva ? 'Visszavonás (kerüljön bele az összefűzésbe)' : 'Kizárás az összefűzésből'}" aria-label="${s.kizarva ? 'Visszavonás' : 'Kizárás'}" onclick="muvelet(this, 'tetelKizarasaValtasa', '${id(s)}')">${s.kizarva ? '🔗' : '✂'}</button>
      <button type="button" class="akcio" title="Áthelyezés az előző hónapra" aria-label="Áthelyezés az előző hónapra" onclick="muvelet(this, 'tetelAthelyezeseElozoHonapra', '${id(s)}', 'Biztosan áthelyezed ezt a tételt az előző hónapra? Onnantól ott fog szerepelni, az itteni listából és összegből eltűnik.')">◀</button>
      <button type="button" class="akcio torles" title="Tétel törlése" aria-label="Tétel törlése" onclick="muvelet(this, 'tetelTorlese', '${id(s)}', 'Biztosan törlöd ezt a tételt? A hozzá tartozó PDF a Drive-ból is törlődik, és az összeg is csökken.')">✕</button>
    </div>
  </div>
</div>`).join('');

  const elozoLink = nav.vanElozo
    ? `<a href="${dashLink(nav.elozoNev, jelszo)}" target="_top" aria-label="Előző hónap">‹</a>`
    : `<span class="inaktiv">‹</span>`;
  const kovetkezoLink = nav.vanKovetkezo
    ? `<a href="${dashLink(nav.kovetkezoNev, jelszo)}" target="_top" aria-label="Következő hónap">›</a>`
    : `<span class="inaktiv">›</span>`;

  const metrika = (szuro, cimke, db) =>
    `<button type="button" class="metrika-kartya" data-szuro="${szuro}"><span class="cimke">${cimke}</span><span class="ertek">${db} db</span></button>`;

  return `${pageHead()}
${dashStyles()}
<body>
${navSav('dashboard', jelszo)}
<div class="wrap">
<h1>Elszámolás dashboard</h1>
<div class="alcim">A beérkezett Megrendelő PDF-ek havi bontásban.</div>

<div class="honapvalto">
  ${elozoLink}
  <span class="honap">${escapeHtml(honapNev)}</span>
  ${kovetkezoLink}
</div>

<section class="panel">
  <div class="osszeg-sor">
    <div>
      <p class="kis-cim">Pillanatnyi összeg</p>
      <p class="osszeg-ertek">${formatFt(osszesites.pillanatnyi)}</p>
      ${osszesites.szallitoiVegosszeg !== null ? `
      <p class="kis-cim" style="margin-top:12px;">Elszámolás összege</p>
      <p class="osszeg-ertek szallitoi ${osszesites.szallitoiVegosszeg === osszesites.pillanatnyi ? 'egyezik' : 'elter'}">${formatFt(osszesites.szallitoiVegosszeg)}</p>` : ''}
    </div>
    <div>
      <p class="kis-cim">Jelmagyarázat</p>
      <div class="jelmagyarazat-racs">
        <p>⬇ Letöltés</p><p>✂ Kizárás</p>
        <p>◀ Előző hónapra</p><p>🔗 Visszavonás</p>
        <p>✕ Törlés</p>
      </div>
    </div>
  </div>

  <div class="metrika-racs">
    ${metrika('18000', '18 000 Ft', osszesites.darab18)}
    ${metrika('25000', '25 000 Ft', osszesites.darab25)}
    ${metrika('30000', '30 000 Ft', osszesites.darab30)}
    ${metrika('egyeb', 'Egyéb', osszesites.darabEgyeb)}
  </div>

  <div class="hatar-doboz">
    <p>Következő határ: <strong>${formatFt(osszesites.kovetkezoHatar)}</strong> (még <strong>${formatFt(osszesites.maradek)}</strong>)</p>
    <p>Kell hozzá: <strong>${osszesites.kell18} db</strong> 18k vagy <strong>${osszesites.kell25} db</strong> 25k vagy <strong>${osszesites.kell30} db</strong> 30k</p>
  </div>
</section>

<form method="POST" action="${appUrl()}" target="_top" onsubmit="this.querySelector('button').disabled = true; this.querySelector('button').textContent = 'PDF készül…';">
  <input type="hidden" name="oldal" value="dashboard">
  <input type="hidden" name="honap" value="${escapeHtml(honapNev)}">
  <input type="hidden" name="jelszo" value="${escapeHtml(jelszo || '')}">
  <button type="submit" class="btn">Egyesített PDF letöltése</button>
</form>

<div class="tetelek-fejlec">
  <h2 class="panel-cim" id="tetelekCimke">Tételek</h2>
  <button type="button" class="szuro-torles" id="szuroTorles" style="display:none;" onclick="torolSzuro()">Szűrő törlése ✕</button>
</div>
<div class="tetel-lista" id="tetelekLista">
${tetelSorokHtml}
</div>
</div>

<script>
  const HONAP = ${JSON.stringify(honapNev)};
  const JELSZO = ${JSON.stringify(jelszo || '')};
  const UJRATOLT = ${JSON.stringify(dashLink(honapNev, jelszo))};
  let aktivSzuro = null;
  const cimkeSzoveg = { '18000': '18 000 Ft', '25000': '25 000 Ft', '30000': '30 000 Ft', 'egyeb': 'egyéb összeg' };

  document.querySelectorAll('.metrika-kartya').forEach(function (kartya) {
    kartya.addEventListener('click', function () {
      const ertek = kartya.getAttribute('data-szuro');
      aktivSzuro = (aktivSzuro === ertek) ? null : ertek;
      frissitSzuro();
    });
  });

  function torolSzuro() { aktivSzuro = null; frissitSzuro(); }

  function frissitSzuro() {
    document.querySelectorAll('.metrika-kartya').forEach(function (kartya) {
      kartya.classList.toggle('aktiv', kartya.getAttribute('data-szuro') === aktivSzuro);
    });
    document.querySelectorAll('.tetel-sor').forEach(function (sor) {
      if (sor.getAttribute('data-tipus') === 'osszesito' || !aktivSzuro) { sor.style.display = ''; return; }
      const osszeg = sor.getAttribute('data-osszeg');
      const mutat = aktivSzuro === 'egyeb' ? ['18000', '25000', '30000'].indexOf(osszeg) === -1 : osszeg === aktivSzuro;
      sor.style.display = mutat ? '' : 'none';
    });
    document.getElementById('tetelekCimke').textContent = aktivSzuro ? ('Tételek, szűrve: ' + cimkeSzoveg[aktivSzuro]) : 'Tételek';
    document.getElementById('szuroTorles').style.display = aktivSzuro ? 'inline' : 'none';
  }

  // Egy tétel-művelet (törlés, kizárás, áthelyezés, megjelölés) a szerveren,
  // utána az oldal újratöltődik a friss adatokkal.
  function muvelet(gomb, fuggveny, pdfFileId, megerosites) {
    if (megerosites && !confirm(megerosites)) return;
    const sor = gomb.closest('.tetel-sor');
    if (sor) sor.classList.add('muvelet-alatt');
    google.script.run
      .withSuccessHandler(function () { window.open(UJRATOLT, '_top'); })
      .withFailureHandler(function (hiba) {
        alert('Hiba: ' + hiba.message);
        if (sor) sor.classList.remove('muvelet-alatt');
      })[fuggveny](HONAP, JELSZO, pdfFileId);
  }
</script>
</body></html>`;
}

function renderEgyesitesKesz(honapNev, link, jelszo) {
  return `${pageHead()}
<body>
${navSav('dashboard', jelszo)}
<div class="card"><div class="center">
<div class="ikon">✓</div>
<h1>Kész az egyesített PDF</h1>
<p>A(z) ${escapeHtml(honapNev)} hónap összes tétele egyetlen PDF-be fűzve.</p>
<a class="btn" href="${link}" target="_top" style="text-decoration:none; color: var(--on-accent);">Letöltés</a>
<a href="${dashLink(honapNev, jelszo)}" target="_top">Vissza a dashboardra</a>
</div></div>
</body></html>`;
}

function formatFt(szam) {
  return Number(szam).toLocaleString('hu-HU') + ' Ft';
}

function datumMegjelenitve(datum) {
  let honap, nap;

  if (datum instanceof Date) {
    honap = datum.getMonth() + 1;
    nap = Number(Utilities.formatDate(datum, DASH_CONFIG.IDOZONA, 'd'));
  } else {
    const szoveg = String(datum || '');
    const talalat = szoveg.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (!talalat) return szoveg;
    honap = parseInt(talalat[2], 10);
    nap = parseInt(talalat[3], 10);
  }

  const romai = ROMAI_HONAPOK[honap - 1] || String(honap);
  return `${romai}.${nap}`;
}

function datumIdoMegjelenitve(sor) {
  const datumSzoveg = datumMegjelenitve(sor.datum);
  if (!sor.idobelyeg || Number(sor.idobelyeg) <= 0) return datumSzoveg;
  const idoSzoveg = Utilities.formatDate(new Date(Number(sor.idobelyeg)), DASH_CONFIG.IDOZONA, 'HH:mm');
  return `${datumSzoveg} ${idoSzoveg}`;
}

function feladoMegjelenitendoNeve(terkep, email) {
  const kulcs = String(email || '').trim().toLowerCase();
  return (terkep && terkep[kulcs]) || email || '';
}

/* ---- Böngészős futtató: útvonalválasztás, API-hívások ---- */
// A felület böngészőben futó része. A képernyőket ugyanazok a render…
// függvények rajzolják, mint az Apps Script-es változatban; itt csak a
// linkek, az adatlekérés és a gombok szerver-hívásai mennek másképp.

const JELSZO_KULCS = 'balesetinfo_jelszo';

function taroltJelszo() {
  try { return localStorage.getItem(JELSZO_KULCS) || ''; } catch (e) { return ''; }
}
function jelszoMentes(j) {
  try { if (j) localStorage.setItem(JELSZO_KULCS, j); else localStorage.removeItem(JELSZO_KULCS); } catch (e) { /* nincs tárhely */ }
}

// Linkek: minden oldal ugyanez az index.html, az ?oldal= paraméterrel.
function appUrl() { return location.pathname; }
function oldalLink(oldal) {
  return location.pathname + (oldal && oldal !== 'fooldal' ? '?oldal=' + encodeURIComponent(oldal) : '');
}

// Az Apps Script Utilities.formatDate helyettesítője (budapesti idő).
const Utilities = {
  formatDate(datum, idozona, minta) {
    const d = datum instanceof Date ? datum : new Date(datum);
    const r = {};
    new Intl.DateTimeFormat('en-GB', {
      timeZone: idozona || 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(d).forEach(p => { r[p.type] = p.value; });
    return minta
      .replace('yyyy', r.year).replace('MM', r.month).replace('dd', r.day)
      .replace('HH', r.hour).replace('mm', r.minute)
      .replace(/\bd\b/, String(Number(r.day)));
  },
};

// Szerverhívás a Google-ös háttér felé.
async function api(fn, args) {
  const valasz = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ fn, args: args || [], jelszo: taroltJelszo() }),
  });
  if (!valasz.ok) throw new Error('A szerver nem érhető el (' + valasz.status + ').');
  const adat = await valasz.json();
  if (!adat || !adat.ok) {
    const hiba = new Error((adat && adat.hiba) || 'Ismeretlen hiba.');
    hiba.kod = adat && adat.kod;
    throw hiba;
  }
  return adat.eredmeny;
}

// A régi google.script.run hívások ugyanígy működnek tovább, csak az API-n át.
function futtatas(siker, hiba) {
  return new Proxy({}, {
    get(_, nev) {
      if (nev === 'withSuccessHandler') return h => futtatas(h, hiba);
      if (nev === 'withFailureHandler') return h => futtatas(siker, h);
      return (...args) => {
        api(nev, args)
          .then(e => { if (siker) siker(e); })
          .catch(e => {
            if (e.kod === 'JELSZO') return kileptetes(true);
            if (hiba) hiba(e); else alert('Hiba: ' + e.message);
          });
      };
    },
  });
}
window.google = { script: { get run() { return futtatas(null, null); } } };

// Egy teljes oldal megjelenítése (a render… függvények teljes HTML-t adnak).
function mutat(html) {
  document.open();
  document.write(html);
  document.close();
}

function hibaOldal(cim, szoveg) {
  const jelszo = taroltJelszo();
  mutat(`${pageHead()}<body>${jelszo ? navSav('hiba', jelszo) : ''}<div class="card"><div class="center"><div class="ikon hiba">!</div><h1>${escapeHtml(cim)}</h1><p>${escapeHtml(szoveg)}</p><a href="${location.href}">Újrapróbálom</a></div></div></body></html>`);
}

function toltes(szoveg) {
  mutat(`${pageHead()}<body><div class="card"><div class="center"><div class="ikon">⏳</div><h1>${escapeHtml(szoveg || 'Betöltés…')}</h1></div></div></body></html>`);
}

function kileptetes(hibasVolt) {
  jelszoMentes('');
  const oldal = new URLSearchParams(location.search).get('oldal') || '';
  belepoOldal(hibasVolt, oldal);
}

function belepoOldal(hibasVolt, oldal) {
  mutat(renderBelepoOldal(hibasVolt, oldal));
  const urlap = document.querySelector('form');
  urlap.addEventListener('submit', async e => {
    e.preventDefault();
    const jelszo = urlap.querySelector('[name=jelszo]').value.trim();
    jelszoMentes(jelszo);
    try {
      await api('belepes');
      location.href = oldalLink(oldal);
    } catch (err) {
      if (err.kod === 'JELSZO') return kileptetes(true);
      jelszoMentes('');
      hibaOldal('Nem sikerült belépni', err.message);
    }
  });
}

// A teljesítési űrlap küldése: a mezők ugyanúgy mennek, mint a régi űrlapnál.
function teljesitesUrlapKuldes(jelszo) {
  const urlap = document.getElementById('mainForm');
  urlap.addEventListener('submit', async e => {
    if (e.defaultPrevented) return; // az oldal saját ellenőrzése megállította
    e.preventDefault();
    const p = {}, ps = {};
    new FormData(urlap).forEach((ertek, nev) => {
      if (!(nev in p)) p[nev] = ertek;
      (ps[nev] = ps[nev] || []).push(ertek);
    });
    const gomb = urlap.querySelector('button[type=submit]');
    if (gomb) { gomb.disabled = true; gomb.textContent = 'Küldés…'; }
    try {
      const r = await api('teljesitesKuldes', [p, ps]);
      if (r.tipus === 'idozitve') mutat(renderScheduledPage(new Date(r.sendAtIso), r.db, jelszo));
      else if (r.tipus === 'kesz') mutat(renderThankYouPage(r.db, jelszo));
      else mutat(renderMessagePage(r.cim, r.szoveg, jelszo));
    } catch (err) {
      if (err.kod === 'JELSZO') return kileptetes(true);
      mutat(renderMessagePage('Hiba történt', err.message, jelszo));
    }
  });
}

// A dashboard "Egyesített PDF letöltése" gombja.
function dashboardPdfGomb(honapNev, jelszo) {
  const urlap = document.querySelector('form input[name=oldal][value=dashboard]');
  if (!urlap) return;
  urlap.form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const r = await api('dashboardEgyesit', [honapNev]);
      mutat(renderEgyesitesKesz(honapNev, r.link, jelszo));
    } catch (err) {
      if (err.kod === 'JELSZO') return kileptetes(true);
      hibaOldal('Nem sikerült az összefűzés', err.message);
    }
  });
}

async function indit() {
  const q = new URLSearchParams(location.search);
  const oldal = q.get('oldal') || '';
  const jelszo = taroltJelszo();
  if (!jelszo) return belepoOldal(false, oldal);

  try {
    switch (oldal) {
      case 'riport':
        mutat(RIPORT_SABLON.replace("<?!= navSav('riport', jelszo) ?>", navSav('riport', jelszo)));
        break;
      case 'teljesites': {
        toltes();
        const d = await api('teljesitesAdat');
        mutat(renderFormPage(d.defaultSubject, d.elozmenyek, jelszo));
        teljesitesUrlapKuldes(jelszo);
        break;
      }
      case 'elszamolas': {
        toltes();
        const d = await api('elszamolasAdat');
        mutat(renderElszamolasForm(d.honapok, d.alapHonap, jelszo));
        break;
      }
      case 'dashboard': {
        toltes();
        const d = await api('dashboardAdat', [q.get('honap') || '']);
        mutat(renderDashboard(d.honapNev, d.sorok, d.osszesites, d.nav, d.nevTerkep, jelszo));
        dashboardPdfGomb(d.honapNev, jelszo);
        break;
      }
      default:
        mutat(renderFooldal(jelszo));
    }
  } catch (err) {
    if (err.kod === 'JELSZO') return kileptetes(true);
    hibaOldal('Nem sikerült betölteni', err.message);
  }
}

// Csak a betöltés után indulunk: a document.open() így a teljes oldalt cseréli.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(indit, 0));
} else {
  setTimeout(indit, 0);
}

})();
