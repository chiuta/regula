# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

🌐 https://regula.chiuta.ro

> Írj le bármilyen hagyományos tábla- vagy kártyajátékot egy JSON-fájlban, és játssz vele — egyetlen szabálymotor minden játékhoz.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa, használható: öt klasszikus kétszemélyes játék játszható az egyetlen `index.html` fájlban (offline nyitható, szerver nélkül), a számítógép vagy egy másik ember ellen; minden játék szabályai nyolc nyelven íródnak ki ugyanabból az adatból, amelyet a motor játszik, és beilleszthetsz saját játékfájlt is. A korlátok lent vannak felsorolva.

## Mit tud

- Öt klasszikus játékot játszik adatfájlokból: Malom, Alquerque, Fanorona, Mū tōrere, Hnefatafl (koppenhágai 11 × 11, egyszerűsített). Mindegyiknek van eredete, jelzése arról, mennyire biztosak a szabályok, jegyzete a meghozott döntésekről és forrásai.
- Mindkét oldalt játszhatja ember, véletlenszerű játékos vagy a számítógép két szinten; lépés egérrel, ujjal vagy billentyűzettel; visszavonás, újra, tipp és másolható lépéslista.
- Kiírja a választott játék szabályait nyolc nyelven, ugyanabból az adatból előállítva, amelyet a motor játszik, így a szöveg és a játék nem mondhat ellent egymásnak.
- Saját játék: illessz be egy játékot JSON-ként, ellenőrizd olyan üzenetekkel, amelyek megnevezik a hibás mezőt, játszd le és töltsd le. Semmi sem kerül feltöltésre.
- Nyolc nyelvű felület, sötét és világos téma, minden ponthoz feliratozott gomb (képernyőolvasók, billentyűzet), 360 px szélességtől működik; hálózat és követés nélkül.
- Alkalmazásként telepíthető, és az első látogatás után offline is elérhető, ha HTTPS-en keresztül szolgálják ki (egy service worker megőrzi az oldalt; semmi mást nem tárol és nem küld). Letöltött fájlból megnyitva ugyanígy működik, telepítés nélkül.

## Hogyan működik

- Játékonként egy JSON-fájl a `data/games/` mappában, a `schema.json` ellenőrzi; a formátumot a `docs/moves.md`, az útmutatót a `docs/tutorial.md` írja le (angolul és románul).
- A `src/engine.mjs` a szabálymotor (képernyő és hálózat nélkül): lefordít egy játékot, felsorolja a szabályos lépéseket, alkalmazza őket, és minimax- és alfa–béta-vágással keres a számítógépes ellenfélnek.
- A `src/ui.js`, `src/i18n.mjs` és `src/app.css` a felület; a `node scripts/build.mjs` építi az egyetlen `index.html` fájlt (a `--check` ellenőrzi, hogy egyezik-e).
- Az `npm test` futtatja a motor (kézzel kiszámolt lépésszámok), az adatfájlok és a dokumentáció tesztjeit; a `python scripts/validate.py` a JSON-fájlokat ellenőrzi. A fejlesztéshez Node.js 24 vagy újabb kell; maga az oldal csak ES2017-et ismerő böngészőt igényel.
- A `manifest.webmanifest`, az `sw.js` és az ikonok a `node scripts/build.mjs` futtatásakor készülnek a közös kit révén (az `src/app.json` `pwa` szakasza); a `--check` is ellenőrzi őket, az `npm test` pedig azt, hogy a manifeszt, a service worker verziója és a CSP megegyezik az oldalval.

## Korlátok, nyíltan kimondva

- A történeti játékok rekonstrukciók: a források hiányosak, a modern döntéseket minden játéknál jelöljük. Ezek nem versenyszabályok.
- A hnefatafl egyszerűsített: hiányzik a pajzsfal-ütés, a szélvár általi győzelem és az összes védő bekerítése általi győzelem.
- A számítógépes ellenfél rövid minimax-keresést használ (könnyű: 2 mélység; közepes: 5 mélység csomópont-korláttal); ésszerűen játszik, nem tökéletesen. A véletlen szint találomra lép.
- Az ismétlés vagy ütés nélküli körök miatti döntetlen az alkalmazás megállapodása, minden játéknál jelöljük. A kártyajátékok még nem játszhatók.
- A motor csak kétszemélyes játékokat kezel rács- vagy gráftáblán; kockához, rejtett kártyákhoz vagy több játékoshoz még nincsenek szabályok.
- A Moara (Țintar) kivételével hiányoznak a hagyományos román játékok: szabályaikat nem ellenőrizték forrásokban. Lásd a nyitott feladatokat.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/games/example.json` fájlt a `data/games/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.
5. A motor vagy a felület módosításához szerkeszd a `src/` mappát, majd futtasd az `npm test` és a `node scripts/build.mjs` parancsot (lásd `CONTRIBUTING.md`).

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
