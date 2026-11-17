# Cum contribui — REGULA

[English](CONTRIBUTING.md) · **Română** · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versiune: 0.2.0 · Ultima actualizare: 2026-11-17

1. Fă fork acestui depozit.
2. Copiază `data/games/example.json` în `data/games/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Reguli

- O intrare = un fișier.
- Citează întotdeauna o sursă.
- Contribuie doar cu material pe care ai voie să-l partajezi (fără texte copiate protejate de drepturi de autor).
- Fii amabil: vezi Codul de conduită.

## Adăugarea unui joc

1. Citește `docs/tutorial.ro.md` (20 de minute) și ține deschis `docs/moves.ro.md`: descrie fiecare câmp.
2. Copiază `data/games/example.json` în `data/games/<id>.json`. Descrierea singură (`name`, `region`, `setup`, `moves`, `win`, `sources`) este deja o contribuție validă; adaugă `rules` ca să faci jocul jucabil.
3. Rulează `python scripts/validate.py`, apoi lipește fișierul în **Jocul tău** din aplicație: *Verifică* numește fiecare greșeală.
4. Pentru un joc jucabil adaugă `names` în `ro fr de es it hu pt`, un `status` sincer și `notes` în `en` și `ro` despre fiecare alegere făcută; citează o sursă pentru fiecare regulă.
5. Adaugă în `test/engine.test.mjs` numărul primelor mutări, calculat de mână, și rulează `npm test`.
6. Ca să adaugi un fel nou de mutare sau de câștig, editează `src/engine.mjs` (`MOVE_TYPES` sau `WIN_TYPES`, `compile`, `explain`), adaugă propozițiile regulii în toate cele opt limbi în `src/i18n.mjs`, extinde `schema.json` și `docs/moves.md` și adaugă teste.
7. Rulează `node scripts/build.mjs` și fă commit cu `index.html` regenerat împreună cu `src/`.
