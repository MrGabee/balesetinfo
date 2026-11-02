#!/usr/bin/env python3
"""
Felügyelő: az összes repó összes időzített GitHub Actions workflow-ját figyeli.

Minden körben (alapból percenként):
  * KIMARADÁS: ha egy workflow-nak az ütemezése (cron) szerint már futnia
    kellett volna, de azóta nem indult, azonnal elindítja (workflow_dispatch,
    vagy ha az nincs, repository_dispatch).
  * ELAKADÁS: ha egy futás jóval tovább tart a megengedettnél, leállítja és
    újraindítja.
  * HIBA: ha a legutóbbi futás hibával állt le, egyszer újrafuttatja a hibás
    jobokat; ha egymás után többször hibázik, riaszt.
  * LETILTÁS: ha a GitHub inaktivitás miatt letiltotta az ütemezést, újra
    engedélyezi és elindítja.
  * Riasztás: issue a felügyelő repóban, külön e-mail nélkül. Ha a hiba
    megszűnik, az issue magától lezárul.

Új repót / új workflow-t nem kell felvenni sehova: amit a PAT_TOKEN lát és
amiben `schedule:` van, azt automatikusan figyeli.
"""

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

import yaml

API = "https://api.github.com"
PAT = os.environ.get("GH_PAT", "")
SAJAT_TOKEN = os.environ.get("GITHUB_TOKEN", "")
SAJAT_REPO = os.environ.get("GITHUB_REPOSITORY", "")
SAJAT_WF = ".github/workflows/felugyelo.yml"
SZARAZ = os.environ.get("FELUGYELO_SZARAZ", "") == "1"  # csak kiír, nem nyúl semmihez
FUTASIDO_MP = int(os.environ.get("FELUGYELO_FUTASIDO_MP", "330"))
KOR_MP = int(os.environ.get("FELUGYELO_KOR_MP", "60"))

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "beallitasok.json"), encoding="utf-8") as f:
    B = json.load(f)

FUTO = {"queued", "in_progress", "waiting", "pending", "requested"}
HIBAS = {"failure", "timed_out", "startup_failure"}
CIMKE = "felugyelo-riasztas"

naplo_sorok = []


def naplo(s):
    print(s, flush=True)
    naplo_sorok.append(s)


def most():
    return datetime.now(timezone.utc)


def ido(s):
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)


# ───────────────────────────── GitHub API ─────────────────────────────

rate_maradek = 5000


def gh(modszer, ut, adat=None, token=None, elfogad=(200, 201, 202, 204)):
    """(státusz, json) — hibánál nem dob kivételt, csak a státuszt adja vissza."""
    global rate_maradek
    token = token if token is not None else PAT
    url = ut if ut.startswith("http") else API + ut
    fejlec = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
              "User-Agent": "felugyelo"}
    if token:
        fejlec["Authorization"] = "Bearer " + token
    torzs = json.dumps(adat).encode() if adat is not None else None
    for probalkozas in range(3):
        kerelem = urllib.request.Request(url, data=torzs, method=modszer, headers=fejlec)
        try:
            with urllib.request.urlopen(kerelem, timeout=30) as v:
                r = v.headers.get("X-RateLimit-Remaining")
                if r is not None:
                    rate_maradek = int(r)
                nyers = v.read()
                return v.status, (json.loads(nyers) if nyers else None)
        except urllib.error.HTTPError as e:
            r = e.headers.get("X-RateLimit-Remaining") if e.headers else None
            if r is not None:
                rate_maradek = int(r)
            nyers = e.read()
            try:
                tartalom = json.loads(nyers) if nyers else None
            except ValueError:
                tartalom = {"message": nyers[:300].decode(errors="replace")}
            if e.code >= 500 and probalkozas < 2:
                time.sleep(3)
                continue
            return e.code, tartalom
        except Exception as e:  # hálózati hiba
            if probalkozas < 2:
                time.sleep(3)
                continue
            return 0, {"message": str(e)}
    return 0, None


def lapozva(ut, kulcs=None, max_lap=5):
    elemek = []
    for lap in range(1, max_lap + 1):
        sep = "&" if "?" in ut else "?"
        st, j = gh("GET", f"{ut}{sep}per_page=100&page={lap}")
        if st != 200 or j is None:
            break
        resz = j[kulcs] if kulcs else j
        elemek += resz
        if len(resz) < 100:
            break
    return elemek


# ───────────────────────────── cron ─────────────────────────────

def _mezo(kif, lo, hi, nevek=None):
    ertekek = set()
    for resz in kif.split(","):
        lepes = 1
        if "/" in resz:
            resz, l = resz.split("/")
            lepes = int(l)
        if resz in ("*", "?"):
            a, b = lo, hi
        elif "-" in resz:
            a, b = resz.split("-")
            a, b = _szam(a, nevek), _szam(b, nevek)
        else:
            a = _szam(resz, nevek)
            b = hi if lepes > 1 else a
        ertekek.update(range(a, b + 1, lepes))
    return ertekek


def _szam(s, nevek):
    s = s.strip().lower()
    if nevek and s[:3] in nevek:
        return nevek[s[:3]]
    return int(s)


HONAPOK = {n: i + 1 for i, n in enumerate("jan feb mar apr may jun jul aug sep oct nov dec".split())}
NAPOK = {n: i for i, n in enumerate("sun mon tue wed thu fri sat".split())}


class Cron:
    def __init__(self, kif):
        p = kif.split()
        if len(p) != 5:
            raise ValueError(kif)
        self.perc = _mezo(p[0], 0, 59)
        self.ora = _mezo(p[1], 0, 23)
        self.nap = _mezo(p[2], 1, 31)
        self.honap = _mezo(p[3], 1, 12, HONAPOK)
        self.het = {d % 7 for d in _mezo(p[4], 0, 7, NAPOK)}
        self.nap_kot = p[2] not in ("*", "?")
        self.het_kot = p[4] not in ("*", "?")

    def illik(self, t):
        if t.minute not in self.perc or t.hour not in self.ora or t.month not in self.honap:
            return False
        n = t.day in self.nap
        h = ((t.weekday() + 1) % 7) in self.het
        if self.nap_kot and self.het_kot:
            return n or h
        return n and h

    def elozo(self, t):
        """Az utolsó ütemezett időpont, ami <= t (max. 35 napra visszamenőleg)."""
        t = t.replace(second=0, microsecond=0)
        for _ in range(35 * 24 * 60):
            if self.illik(t):
                return t
            if t.hour not in self.ora or t.month not in self.honap:
                t = t.replace(minute=0) - timedelta(minutes=1)
            else:
                t -= timedelta(minutes=1)
        return None


# ───────────────────────────── workflow-k feltérképezése ─────────────────────────────

def kulcs(repo, wf):
    return f"{repo}:{wf['path'].split('/')[-1]}"


def workflow_info(repo, ag, wf):
    st, j = gh("GET", f"/repos/{repo}/contents/{urllib.parse.quote(wf['path'])}?ref={urllib.parse.quote(ag)}")
    if st != 200 or not j or "content" not in j:
        return None
    try:
        szoveg = base64.b64decode(j["content"]).decode("utf-8", errors="replace")
        doc = yaml.safe_load(szoveg) or {}
    except Exception as e:
        naplo(f"   ⚠️ {repo}/{wf['path']}: nem olvasható YAML ({e})")
        return None
    on = doc.get("on", doc.get(True, {}))
    if isinstance(on, str):
        on = {on: None}
    elif isinstance(on, list):
        on = {x: None for x in on}
    on = on or {}
    cronok = []
    for s in (on.get("schedule") or []):
        try:
            cronok.append(Cron(str(s.get("cron"))))
        except Exception:
            pass
    wd = "workflow_dispatch" in on
    wd_ok = wd
    if wd and isinstance(on.get("workflow_dispatch"), dict):
        for _, inp in (on["workflow_dispatch"].get("inputs") or {}).items():
            if isinstance(inp, dict) and inp.get("required") and "default" not in inp:
                wd_ok = False
    rd_tipus = None
    if "repository_dispatch" in on:
        rd = on.get("repository_dispatch") or {}
        tipusok = rd.get("types") if isinstance(rd, dict) else None
        if tipusok:
            rd_tipus = tipusok[0]
    idokorlat = 0
    for job in (doc.get("jobs") or {}).values():
        if isinstance(job, dict):
            try:
                idokorlat = max(idokorlat, int(job.get("timeout-minutes", 360)))
            except (TypeError, ValueError):
                idokorlat = max(idokorlat, 360)
    # Önindító lánc: a workflow a futása végén saját magát indítja újra.
    tomor = szoveg.replace(" ", "").replace("\\", "")
    lanc = bool(rd_tipus) and f'"event_type":"{rd_tipus}"' in tomor
    return {"cronok": cronok, "wd": wd_ok, "rd": rd_tipus, "lanc": lanc, "idokorlat": idokorlat or 360}


terkep = {"ido": None, "repok": []}


def terkep_frissit():
    """Repók és időzített workflow-k listája; 15 percenként frissül."""
    if terkep["ido"] and most() - terkep["ido"] < timedelta(minutes=15):
        return
    repok = {}
    if not os.environ.get("FELUGYELO_CSAK_REPOK"):
        for r in lapozva("/user/repos?affiliation=owner,collaborator,organization_member"):
            repok[r["full_name"]] = r
    extra = B.get("extra_repok", []) + [x for x in os.environ.get("FELUGYELO_CSAK_REPOK", "").split(",") if x]
    for nev in extra:
        if nev not in repok:
            st, j = gh("GET", f"/repos/{nev}")
            if st == 200:
                repok[nev] = j
    kihagy = set(B.get("kihagy_repok", []))
    kihagy_wf = set(B.get("kihagy_workflowk", []))
    eredmeny = []
    for nev, r in sorted(repok.items()):
        if r.get("archived") or nev in kihagy:
            continue
        wfk = lapozva(f"/repos/{nev}/actions/workflows", "workflows", 2)
        figyelt = []
        for wf in wfk:
            if not wf["path"].startswith(".github/workflows/"):
                continue
            if nev == SAJAT_REPO and wf["path"] == SAJAT_WF:
                continue  # saját magát nem figyeli (a lánc + 5 perces ütemezés tartja életben)
            k = kulcs(nev, wf)
            if k in kihagy_wf:
                continue
            if wf["state"] not in ("active", "disabled_inactivity"):
                continue
            info = workflow_info(nev, r["default_branch"], wf)
            if not info:
                continue
            if not info["cronok"] and not info["lanc"] and k not in B.get("max_perc", {}):
                continue
            figyelt.append({"wf": wf, "info": info, "kulcs": k})
        if figyelt:
            eredmeny.append({"nev": nev, "ag": r["default_branch"], "workflowk": figyelt})
    terkep["repok"] = eredmeny
    terkep["ido"] = most()
    db = sum(len(r["workflowk"]) for r in eredmeny)
    naplo(f"🗺️  {len(eredmeny)} repó, {db} figyelt workflow")


# ───────────────────────────── riasztás ─────────────────────────────

nyitott = {}  # cím -> issue szám


cimke_kesz = False


def riasztasok_betolt():
    global cimke_kesz
    nyitott.clear()
    if not SAJAT_REPO:
        return
    if not cimke_kesz and not SZARAZ:
        gh("POST", f"/repos/{SAJAT_REPO}/labels",
           {"name": CIMKE, "color": "d73a4a", "description": "A felügyelő riasztása"}, token=SAJAT_TOKEN)
        cimke_kesz = True
    st, j = gh("GET", f"/repos/{SAJAT_REPO}/issues?state=open&labels={CIMKE}&per_page=100", token=SAJAT_TOKEN)
    if st == 200:
        for i in j:
            nyitott[i["title"]] = i["number"]


def riaszt(cim, szoveg):
    cim = f"🚨 {cim}"
    if cim in nyitott:
        return
    naplo(f"   🚨 RIASZTÁS: {cim}")
    if SZARAZ or not SAJAT_REPO:
        return
    st, j = gh("POST", f"/repos/{SAJAT_REPO}/issues", {"title": cim, "body": szoveg, "labels": [CIMKE]},
               token=SAJAT_TOKEN)
    if st == 201:
        nyitott[cim] = j["number"]


def rendben(cim, szoveg="✅ Megoldódott, a workflow újra rendben fut."):
    cim = f"🚨 {cim}"
    szam = nyitott.pop(cim, None)
    if not szam:
        return
    naplo(f"   ✅ Megoldódott: {cim}")
    if SZARAZ:
        return
    gh("POST", f"/repos/{SAJAT_REPO}/issues/{szam}/comments", {"body": szoveg}, token=SAJAT_TOKEN)
    gh("PATCH", f"/repos/{SAJAT_REPO}/issues/{szam}", {"state": "closed", "state_reason": "completed"},
       token=SAJAT_TOKEN)


# ───────────────────────────── beavatkozások ─────────────────────────────

inditva = {}      # kulcs -> (időpont, hányszor indítottuk egymás után eredmény nélkül, utolsó ismert run id)
ujrafuttatva = set()


def indit(repo, ag, wf, info, ok):
    nev = wf["name"]
    if SZARAZ:
        naplo(f"   ▶️  [száraz] indítanám: {nev} ({ok})")
        return True
    if info["wd"]:
        st, j = gh("POST", f"/repos/{repo}/actions/workflows/{wf['id']}/dispatches", {"ref": ag})
        if st == 204:
            naplo(f"   ▶️  Elindítva: {repo} / {nev} ({ok})")
            return True
        naplo(f"   ⚠️ workflow_dispatch sikertelen ({st}): {j}")
    if info["rd"]:
        st, j = gh("POST", f"/repos/{repo}/dispatches", {"event_type": info["rd"]})
        if st == 204:
            naplo(f"   ▶️  Elindítva (repository_dispatch {info['rd']}): {repo} / {nev} ({ok})")
            return True
        naplo(f"   ⚠️ repository_dispatch sikertelen ({st}): {j}")
    return False


def ellenoriz_workflow(repo, ag, elem, futasok):
    wf, info, k = elem["wf"], elem["info"], elem["kulcs"]
    nev = wf["name"]
    cim_alap = f"{repo} / {nev}"
    t = most()
    turelem = timedelta(minutes=B.get("egyedi_turelem_perc", {}).get(k, B.get("turelem_perc", 3)))

    # 1) Inaktivitás miatt letiltott ütemezés
    if wf["state"] == "disabled_inactivity" and not B.get("automatikus_ujraengedelyezes", True):
        riaszt(f"Letiltott ütemezés: {cim_alap}",
               f"A GitHub inaktivitás miatt letiltotta a(z) **{nev}** ütemezését ({repo}).\n\n{wf.get('html_url', '')}")
        return
    if wf["state"] == "disabled_inactivity":
        naplo(f"── {cim_alap}: ⛔ a GitHub letiltotta (inaktivitás) – újraengedélyezés")
        if not SZARAZ:
            gh("PUT", f"/repos/{repo}/actions/workflows/{wf['id']}/enable")
        riaszt(f"Letiltott ütemezés: {cim_alap}",
               f"A GitHub inaktivitás miatt letiltotta a(z) **{nev}** ütemezését ({repo}). "
               f"A felügyelő újraengedélyezte és elindította.\n\n{wf.get('html_url', '')}")
        indit(repo, ag, wf, info, "újraengedélyezés után")
        wf["state"] = "active"
        return

    utolso = futasok[0] if futasok else None
    befejezett = [f for f in futasok if f["status"] == "completed" and f["conclusion"] not in ("cancelled", "skipped")]

    # 2) Elakadt futás
    if utolso and utolso["status"] in FUTO:
        kor = t - ido(utolso.get("run_started_at") or utolso["created_at"])
        hatar = timedelta(minutes=min(info["idokorlat"] * 2 + 10, B.get("elakadt_max_perc", 120)))
        if utolso["status"] in ("queued", "pending", "requested", "waiting"):
            hatar = timedelta(minutes=B.get("sorban_allas_max_perc", 30))
        if kor > hatar:
            naplo(f"── {cim_alap}: ⏳ elakadt ({int(kor.total_seconds() // 60)} perce {utolso['status']}) – leállítás és újraindítás")
            if not SZARAZ:
                st, _ = gh("POST", f"/repos/{repo}/actions/runs/{utolso['id']}/cancel")
                if st not in (202, 204):
                    gh("POST", f"/repos/{repo}/actions/runs/{utolso['id']}/force-cancel")
            riaszt(f"Elakadt futás: {cim_alap}",
                   f"A(z) **{nev}** egyik futása {int(kor.total_seconds() // 60)} perce nem fejeződött be "
                   f"(állapot: {utolso['status']}). A felügyelő leállította és újraindította.\n\n{utolso['html_url']}")
            indit(repo, ag, wf, info, "elakadás után")
        else:
            rendben(f"Elakadt futás: {cim_alap}")
            rendben(f"Nem indul: {cim_alap}")
            inditva.pop(k, None)
        return  # fut, nincs más teendő
    rendben(f"Elakadt futás: {cim_alap}")

    # 3) Hibás futás
    hiba_sorozat = 0
    for f in befejezett:
        if f["conclusion"] in HIBAS:
            hiba_sorozat += 1
        else:
            break
    if utolso and utolso["status"] == "completed" and utolso["conclusion"] in HIBAS:
        friss = t - ido(utolso["updated_at"]) < timedelta(minutes=60)
        if (friss and utolso["id"] not in ujrafuttatva
                and utolso.get("run_attempt", 1) <= B.get("hibas_ujraprobal", 1)
                and k not in B.get("ne_futtasd_ujra", [])):
            ujrafuttatva.add(utolso["id"])
            naplo(f"── {cim_alap}: ❌ hibával állt le – hibás jobok újrafuttatása")
            if not SZARAZ:
                ut = "rerun" if utolso["conclusion"] == "startup_failure" else "rerun-failed-jobs"
                st, j = gh("POST", f"/repos/{repo}/actions/runs/{utolso['id']}/{ut}")
                if st not in (201, 204):
                    naplo(f"   ⚠️ újrafuttatás sikertelen ({st}): {j} – új futás indítása")
                    indit(repo, ag, wf, info, "hiba után")
            return
    if hiba_sorozat >= B.get("riasztas_hibak_utan", 2) and k not in B.get("ne_futtasd_ujra", []):
        h = befejezett[0]
        riaszt(f"Ismétlődő hiba: {cim_alap}",
               f"A(z) **{nev}** ({repo}) az utolsó {hiba_sorozat} futásból mindegyikben hibával állt le, "
               f"az újrafuttatás sem segített.\n\nUtolsó hibás futás: {h['html_url']}")
    elif befejezett and befejezett[0]["conclusion"] == "success":
        rendben(f"Ismétlődő hiba: {cim_alap}")

    # 4) Kimaradt futás
    vart = None
    for c in info["cronok"]:
        p = c.elozo(t - turelem)
        if p and (vart is None or p > vart):
            vart = p
    # Újrafuttatásnál a created_at a régi marad, ezért a későbbi időpontot nézzük.
    utolso_ido = max(ido(utolso["created_at"]), ido(utolso.get("run_started_at") or utolso["created_at"])) if utolso else None
    kimaradt_ok = None
    kezi_max = k in B.get("max_perc", {})  # ha kézzel megadtuk, az felülírja a cron-t
    if vart and not kezi_max and (utolso_ido is None or utolso_ido < vart - timedelta(seconds=30)):
        kimaradt_ok = f"ütemezés szerint {vart:%H:%M} UTC-kor kellett volna futnia"
    maxp = B.get("max_perc", {}).get(k)
    if not maxp and info["lanc"]:
        # Önindító láncnál a megszokott futási ritmusból számolunk: ha a szokásos
        # időköz ~2,5-szeresénél tovább nincs új futás, a lánc megszakadt.
        idok = sorted({ido(f["created_at"]) for f in futasok[:10]}, reverse=True)
        kozok = sorted((a - b).total_seconds() / 60 for a, b in zip(idok, idok[1:]))
        if len(kozok) >= 3:
            median = kozok[len(kozok) // 2]
            maxp = max(B.get("lanc_min_perc", 5), round(median * 2.5))
    if maxp and (utolso_ido is None or t - utolso_ido > timedelta(minutes=maxp)):
        kimaradt_ok = f"{maxp} percnél régebben futott"
    if not kimaradt_ok:
        if k in inditva:
            inditva.pop(k)
        rendben(f"Nem indul: {cim_alap}")
        return

    elozo = inditva.get(k)
    if elozo and t - elozo[0] < timedelta(minutes=B.get("ujrainditas_varakozas_perc", 4)):
        return  # nemrég indítottuk, adjunk időt a GitHubnak
    kesesperc = int((t - utolso_ido).total_seconds() // 60) if utolso_ido else None
    naplo(f"── {cim_alap}: 🕳️ kimaradt ({kimaradt_ok}; utolsó futás: "
          f"{f'{kesesperc} perce' if kesesperc is not None else 'nincs'})")
    sikerult = indit(repo, ag, wf, info, "kimaradás")
    db = (elozo[1] + 1) if elozo else 1
    inditva[k] = (t, db)
    if not sikerult:
        riaszt(f"Nem indítható: {cim_alap}",
               f"A(z) **{nev}** ({repo}) kimaradt ({kimaradt_ok}), de a felügyelő nem tudta elindítani. "
               f"Valószínű ok: a PAT_TOKEN-nek nincs joga ehhez a repóhoz, vagy a workflow-ban nincs "
               f"`workflow_dispatch`/`repository_dispatch`.\n\n{wf.get('html_url', '')}")
    elif db >= 3:
        riaszt(f"Nem indul: {cim_alap}",
               f"A(z) **{nev}** ({repo}) kimaradt, és a felügyelő {db}-szor elindította, de nem jelent meg "
               f"új futás. Nézd meg a GitHub Actions oldalát.\n\n{wf.get('html_url', '')}")


def ellenoriz_repo(r):
    repo = r["nev"]
    friss = lapozva(f"/repos/{repo}/actions/runs?exclude_pull_requests=true", "workflow_runs", 1)
    wf_szerint = {}
    for f in friss:
        wf_szerint.setdefault(f["workflow_id"], []).append(f)
    for elem in r["workflowk"]:
        futasok = wf_szerint.get(elem["wf"]["id"])
        if not futasok:
            st, j = gh("GET", f"/repos/{repo}/actions/workflows/{elem['wf']['id']}/runs?per_page=10&exclude_pull_requests=true")
            futasok = (j or {}).get("workflow_runs", []) if st == 200 else []
        try:
            ellenoriz_workflow(repo, r["ag"], elem, futasok)
        except Exception as e:
            naplo(f"   ⚠️ {repo} / {elem['wf']['name']}: ellenőrzési hiba: {e}")


def kor():
    terkep_frissit()
    riasztasok_betolt()
    for r in terkep["repok"]:
        ellenoriz_repo(r)


def lanc_folytat():
    if SZARAZ or not SAJAT_REPO:
        return
    for i in range(3):
        st, _ = gh("POST", f"/repos/{SAJAT_REPO}/dispatches", {"event_type": "felugyelo_lanc"})
        if st == 204:
            naplo("🔄 Felügyelő-lánc folytatva.")
            return
        time.sleep(5)
    naplo("⚠️ A lánc folytatása sikertelen – az 5 perces ütemezés úgyis újraindítja.")


def main():
    if not PAT and not SZARAZ:
        print("Nincs beállítva a PAT_TOKEN secret!", file=sys.stderr)
        sys.exit(1)
    kezdet = time.time()
    korok = 0
    try:
        while True:
            k0 = time.time()
            korok += 1
            naplo(f"\n═══ {korok}. kör – {most():%H:%M:%S} UTC (API keret: {rate_maradek}) ═══")
            kor()
            if os.environ.get("FELUGYELO_EGYSZER") == "1":
                break
            varj = KOR_MP if rate_maradek > 800 else KOR_MP * 3
            if time.time() - kezdet + varj > FUTASIDO_MP:
                break
            time.sleep(max(5, varj - (time.time() - k0)))
    finally:
        lanc_folytat()
        osszefoglalo = os.environ.get("GITHUB_STEP_SUMMARY")
        if osszefoglalo:
            erdekes = [s for s in naplo_sorok if any(x in s for x in ("▶️", "🚨", "✅ Megold", "⛔", "⏳", "❌", "🕳️", "⚠️"))]
            with open(osszefoglalo, "a", encoding="utf-8") as f:
                f.write("## 🛡️ Felügyelő\n\n")
                f.write("\n".join(f"- {s.strip()}" for s in erdekes) if erdekes else "Minden figyelő rendben futott.")
                f.write("\n")


if __name__ == "__main__":
    main()
