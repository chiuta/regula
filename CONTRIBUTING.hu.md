# Közreműködés — REGULA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

1. Forkold ezt a tárolót.
2. Másold a `data/games/example.json` fájlt a `data/games/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Szabályok

- Egy bejegyzés = egy fájl.
- Mindig add meg a forrást.
- Csak olyan anyagot küldj, amelyet jogszerűen megoszthatsz (nincs másolt, védett szöveg).
- Légy kedves: lásd az Etikai kódexet.

## Játék hozzáadása

1. Olvasd el a `docs/tutorial.md` fájlt (20 perc), és tartsd nyitva a `docs/moves.md` fájlt: minden mezőt leír.
2. Másold a `data/games/example.json` fájlt a `data/games/<id>.json` helyre. Önmagában a leírás (`name`, `region`, `setup`, `moves`, `win`, `sources`) is érvényes hozzájárulás; add hozzá a `rules` részt, hogy a játék játszható legyen.
3. Futtasd a `python scripts/validate.py` parancsot, majd illeszd be a fájlt az alkalmazás **Saját játék** részébe: a *Ellenőrzés* minden hibát megnevez.
4. Játszható játékhoz add meg a `names` mezőt a `ro fr de es it hu pt` nyelveken, őszinte `status` értéket, és `notes` jegyzetet `en` és `ro` nyelven minden meghozott döntésről; minden szabályhoz idézz forrást.
5. Add hozzá a `test/engine.test.mjs` fájlhoz az első lépések kézzel kiszámolt számát, és futtasd az `npm test` parancsot.
6. Új lépés- vagy győzelemtípushoz szerkeszd a `src/engine.mjs` fájlt (`MOVE_TYPES` vagy `WIN_TYPES`, `compile`, `explain`), add hozzá a szabálymondatokat mind a nyolc nyelven a `src/i18n.mjs` fájlban, bővítsd a `schema.json` és a `docs/moves.md` fájlt, és írj teszteket.
7. Futtasd a `node scripts/build.mjs` parancsot, és commitold az újragenerált `index.html` fájlt a `src/` mappával együtt.
