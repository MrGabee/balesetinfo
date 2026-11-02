# 🛡️ Felügyelő

Az összes repó összes időzített GitHub Actions workflow-ját figyeli, és beavatkozik,
ha valamelyik nem úgy fut, ahogy kellene. A GitHub ütemezője (cron) gyakran órákig
kihagyja a futásokat; ez a repó ezt nem engedi.

## Mit csinál percenként

| Helyzet | Mit tesz |
|---|---|
| **Kimaradás**: az ütemezés szerint már futnia kellett volna (3 perc türelemmel), de nem indult | azonnal elindítja |
| **Megszakadt önindító lánc**: a szokásos ritmus ~2,5-szereséig nincs új futás | azonnal elindítja |
| **Elakadás**: egy futás jóval tovább tart a megengedettnél, vagy 30 percnél tovább áll sorban | leállítja és újraindítja, riaszt |
| **Hiba**: a legutóbbi futás hibával állt le | egyszer újrafuttatja a hibás jobokat |
| **Ismétlődő hiba**: 2 egymás utáni futás hibás | riaszt |
| **Nem indul**: 3 indítás után sincs új futás | riaszt |
| **Letiltás**: a GitHub inaktivitás miatt letiltotta | újraengedélyezi, elindítja, riaszt |

A **riasztás** egy issue ebben a repóban (`felugyelo-riasztas` címkével). E-mailt
a felügyelő nem küld.
Amikor a hiba megszűnik, az issue magától lezárul.

Új repót vagy új workflow-t **nem kell felvenni sehova**: amit a `PAT_TOKEN` lát, és
amiben `schedule:` vagy önindító lánc van, azt magától figyeli. A kézzel letiltott
(Disable workflow) workflow-khoz nem nyúl.

## Beállítás

A balesetinfo repóban fut (`.github/workflows/felugyelo.yml`), a meglévő `PAT_TOKEN`
secrettel, külön beállítás nem kell. Nyilvános repóban fut, mert szinte folyamatosan
dolgozik, és ez privát repóban elfogyasztaná az ingyenes Actions-perceket.

Kivételek és finomhangolás: [`beallitasok.json`](beallitasok.json)

- `max_perc`: ennél régebbi utolsó futás esetén indít (felülírja a cron-t)
- `kihagy_workflowk` / `kihagy_repok`: amihez ne nyúljon
- `ne_futtasd_ujra`: amit hiba után ne futtasson újra és ne riasszon miatta (most: a Mr.Gabee oldalra posztoló figyelők); a kimaradásukat ettől még pótolja

Kipróbálás: Actions → 🛡️ Felügyelő → Run workflow, `szaraz` = `1`: csak kiírja, mit tenne.

## Hogyan fut folyamatosan

Egy futás ~5,5 percig körözik (percenként egy ellenőrzés), utána saját magát indítja
újra (`repository_dispatch`). Az 5 perces ütemezés csak biztonsági háló, ha a lánc
megszakadna. A felügyelő a mentoheli Őrzőjét is figyeli.
