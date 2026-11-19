# Változásnapló

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · **Magyar**

Formátum: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Kiadatlan]

## [0.2.1] - 2026-11-20

### Módosítva
- fff-kit 1.8.1: ha a böngésző blokkolja a tárolást vagy nincs tárolója (a `localStorage`/`sessionStorage` hibát dob vagy hiányzik), az oldal ideiglenes, memóriabeli tárolóval indul ahelyett, hogy leállna; az adatok az oldal bezárása után nem maradnak meg.
- fff-kit 1.8.1: a kis vezérlőket 44 px-re növelő segéd mostantól az oldal törzsének és a szülőelemnek a szélességét is méri, így a gombsor már nem lóghat ki a képernyőről (a csoport érintetlen marad, ha a növelés túl szélessé tenné).

## [0.2.0] - 2026-11-17

### Hozzáadva
- Öt játszható játék adatfájlként a `data/games/` mappában: Malom, Alquerque, Fanorona, Mū tōrere, Hnefatafl (koppenhágai 11 × 11, egyszerűsített), mindegyik forrásokkal és jegyzetekkel a meghozott döntésekről.
- Szabálymotor (`src/engine.mjs`) kétszemélyes játékokhoz rácsos és gráf alapú táblákon: lerakás, lépés, csúszás, repülés, ugrás, közeledés és távolodás, malmok, bekerítéses és királyfogás, tiltott pontok, győzelmi és döntetlen-szabályok; számítógépes ellenfél (minimax alfa–béta-vágással).
- Felület: minden ponthoz feliratozott gomb (egér, érintés, billentyűzet, képernyőolvasó), oldalanként választható játékostípus, visszavonás és újra, tipp, lépéslista, nyolc nyelven kiírt szabályok a játékadatokból, és saját játék JSON-ként (ellenőrzés, játék, letöltés).
- A `schema.json` bővítve (board, pieces, rules, status, names, notes); `docs/moves.md` (a formátum) és `docs/tutorial.md` (20 perc), angolul és románul, tesztelt példajátékkal.
- Tesztek: `node --test` a motorhoz (kézzel kiszámolt lépésszámok), az adatokhoz és a dokumentációhoz; böngészőtesztek a hubban (nyolc nyelv, akadálymentesség, ellenséges tárolt állapot, kis képernyők).
- A `src/` és a `scripts/build.mjs`: az egyetlen `index.html` mostantól forrásokból épül, és a `--check` ellenőrzi.
- Az ISSUES_GOOD_FIRST és a CODE_OF_CONDUCT lefordítva mind a nyolc nyelvre.
- README angolul, románul, franciául, olaszul, spanyolul, portugálul, németül és magyarul: állapot- és tervezett terjedelem-szakaszok (az `ISSUES_GOOD_FIRST.md` alapján).
- Telepíthető (PWA): a `manifest.webmanifest`, az `sw.js` és az ikonok a közös kitből (`fff-kit/pwa`) készülnek; az oldal az első HTTPS-látogatás után offline is működik.

### Módosítva
- A munkafolyamat Ubuntu 26.04 és Node.js 26 alatt fut, és a teszteket meg a build-ellenőrzést is futtatja.

## [0.1.0] - 2026-11-13

### Hozzáadva
- Kezdeti váz: szerkezet, adatséma vagy első példák, hozzájárulási útmutatók nyolc nyelven.
