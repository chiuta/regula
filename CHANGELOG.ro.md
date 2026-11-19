# Jurnal de modificări

[English](CHANGELOG.md) · **Română** · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Nelansat]

## [0.2.1] - 2026-11-20

### Modificat
- fff-kit 1.8.1: când browserul blochează sau nu are stocare (`localStorage`/`sessionStorage` aruncă sau lipsesc), pagina pornește cu o stocare temporară în memorie, în loc să se oprească; datele nu se păstrează după închiderea paginii.
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși).

## [0.2.0] - 2026-11-17

### Adăugat
- Cinci jocuri jucabile ca fișiere de date în `data/games/`: Moara (Țintar, jocul morii), Alquerque (al-quirkat), Fanorona, Mū tōrere, Hnefatafl (Copenhaga 11 × 11, simplificat), fiecare cu surse și note despre alegerile făcute.
- Un motor de reguli (`src/engine.mjs`) pentru jocuri cu doi jucători pe table de tip grilă și graf: plasare, pași, alunecări, zbor, sărituri, apropiere și retragere, mori, captură custodială și a regelui, puncte restricționate, reguli de câștig și de remiză; un adversar calculator (minimax cu tăiere alfa–beta).
- Interfață: un buton cu etichetă pentru fiecare punct (mouse, atingere, tastatură, cititor de ecran), un tip de jucător pentru fiecare latură, anulare și refacere, sugestie, înregistrarea mutărilor, reguli scrise în opt limbi din datele jocului și jocul tău ca JSON (verificare, joc, descărcare).
- `schema.json` extins (board, pieces, rules, status, names, notes); `docs/moves.md` (formatul) și `docs/tutorial.md` (20 de minute), în engleză și română, cu un joc-exemplu testat.
- Teste: `node --test` pentru motor (numere de mutări calculate de mână), date și documentație; teste de browser în hub (opt limbi, accesibilitate, stare stocată ostilă, ecrane mici).
- `src/` și `scripts/build.mjs`: singurul `index.html` este acum construit din surse, iar `--check` îl verifică.
- ISSUES_GOOD_FIRST și CODE_OF_CONDUCT traduse în toate cele opt limbi.
- README în engleză, română, franceză, italiană, spaniolă, portugheză, germană și maghiară: secțiuni de stare și de domeniu planificat (derivate din `ISSUES_GOOD_FIRST.md`).
- Instalabilă (PWA): `manifest.webmanifest`, `sw.js` și pictogramele sunt generate de kitul comun (`fff-kit/pwa`); pagina funcționează offline după prima vizită prin HTTPS.

### Modificat
- Fluxul de lucru rulează pe Ubuntu 26.04 cu Node.js 26 și rulează și testele, plus verificarea construcției.

## [0.1.0] - 2026-11-13

### Adăugat
- Schelet inițial: structură, schema de date sau primele exemple, ghiduri de contribuție în opt limbi.
