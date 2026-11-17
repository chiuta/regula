# REGULA

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.2.0 · Ultima actualizare: 2026-11-17

🌐 https://regula.chiuta.ro

> Descrie orice joc tradițional de tablă sau de cărți într-un fișier JSON și joacă-l — un singur motor de reguli pentru toate jocurile.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa, utilizabil: cinci jocuri clasice pentru doi jucători se pot juca în singurul fișier `index.html` (îl deschizi offline, fără server) împotriva calculatorului sau a altei persoane; regulile fiecărui joc sunt scrise în opt limbi din aceleași date pe care le joacă motorul, iar tu poți lipi propriul fișier de joc. Limitele sunt enumerate mai jos.

## Ce face

- Joacă cinci jocuri clasice din fișiere de date: Moara (Țintar, jocul morii), Alquerque (al-quirkat), Fanorona, Mū tōrere, Hnefatafl (Copenhaga 11 × 11, simplificat). Fiecare are origine, o precizare despre cât de sigure sunt regulile, note despre alegerile făcute și surse.
- Fiecare latură poate fi un om, un jucător aleator sau calculatorul, la două niveluri; mutări cu mouse-ul, cu degetul sau de la tastatură; anulare, refacere, sugestie și o înregistrare a mutărilor pe care o poți copia.
- Scrie regulile jocului ales în opt limbi, generate din aceleași date pe care le joacă motorul, deci textul și jocul nu pot fi în dezacord.
- Jocul tău: lipește un joc ca JSON, verifică-l cu mesaje care numesc câmpul greșit, joacă-l și descarcă-l. Nu se trimite nimic undeva.
- Interfață în opt limbi, teme întunecată și luminoasă, un buton cu etichetă pentru fiecare punct (cititoare de ecran, tastatură), funcționează de la 360 px lățime; fără rețea, fără urmărire.
- Se poate instala ca aplicație și funcționează offline după prima vizită, când e servită prin HTTPS (un service worker păstrează pagina; nu se stochează și nu se trimite nimic altceva). Deschisă dintr-un fișier descărcat, merge la fel, fără instalare.

## Cum funcționează

- Un fișier JSON pe joc în `data/games/`, verificat de `schema.json`; formatul e descris în `docs/moves.md`, iar tutorialul este `docs/tutorial.md` (engleză și română).
- `src/engine.mjs` este motorul de reguli (fără ecran, fără rețea): compilează un joc, enumeră mutările legale, le aplică și caută cu minimax și tăiere alfa–beta pentru adversarul calculator.
- `src/ui.js`, `src/i18n.mjs` și `src/app.css` sunt interfața; `node scripts/build.mjs` construiește singurul `index.html` (`--check` verifică dacă se potrivește).
- `npm test` rulează testele motorului (numere de mutări calculate de mână), ale fișierelor de date și ale documentației; `python scripts/validate.py` verifică fișierele JSON. Dezvoltarea cere Node.js 24 sau mai nou; pagina în sine cere doar un browser care cunoaște ES2017.
- `manifest.webmanifest`, `sw.js` și pictogramele sunt produse de `node scripts/build.mjs` prin kitul comun (secțiunea `pwa` din `src/app.json`); `--check` le verifică și el, iar `npm test` verifică dacă manifestul, versiunea service worker-ului și CSP-ul corespund paginii.

## Limite, spuse deschis

- Jocurile istorice sunt reconstituiri: sursele sunt incomplete, iar alegerile moderne sunt notate la fiecare joc. Nu sunt reguli de turneu.
- Hnefatafl este simplificat: lipsesc captura „zid de scuturi”, victoria prin fort pe margine și victoria prin încercuirea tuturor apărătorilor.
- Adversarul calculatorului este o căutare minimax scurtă (ușor: adâncime 2; mediu: adâncime 5, cu limită de noduri); joacă rezonabil, nu perfect. Nivelul aleator mută la întâmplare.
- Remizele prin repetare sau prin ture fără captură sunt convenții ale aplicației, notate la fiecare joc. Jocurile de cărți nu se pot juca încă.
- Motorul tratează doar jocuri cu doi jucători pe table de tip grilă sau graf; încă nu există reguli pentru zaruri, cărți ascunse sau mai mulți jucători.
- Jocurile tradiționale românești, în afară de Moara (Țintar), lipsesc: regulile lor nu au fost verificate în surse. Vezi sarcinile deschise.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/games/example.json` în `data/games/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.
5. Pentru a schimba motorul sau interfața, editează `src/`, apoi rulează `npm test` și `node scripts/build.mjs` (vezi `CONTRIBUTING.md`).

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
