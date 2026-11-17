# Mitmachen — REGULA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · **Deutsch** · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

1. Forke dieses Repository.
2. Kopiere `data/games/example.json` nach `data/games/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Regeln

- Ein Eintrag = eine Datei.
- Gib immer eine Quelle an.
- Steuere nur Material bei, das du rechtmäßig teilen darfst (keine kopierten geschützten Texte).
- Sei freundlich: siehe Verhaltenskodex.

## Ein Spiel hinzufügen

1. Lies `docs/tutorial.md` (20 Minuten) und halte `docs/moves.md` offen: Es beschreibt jedes Feld.
2. Kopiere `data/games/example.json` nach `data/games/<id>.json`. Die Beschreibung allein (`name`, `region`, `setup`, `moves`, `win`, `sources`) ist schon ein gültiger Beitrag; ergänze `rules`, damit das Spiel spielbar wird.
3. Führe `python scripts/validate.py` aus und füge die Datei in **Ihr eigenes Spiel** in der App ein: *Prüfen* nennt jeden Fehler.
4. Für ein spielbares Spiel ergänze `names` in `ro fr de es it hu pt`, einen ehrlichen `status` und `notes` in `en` und `ro` zu jeder getroffenen Entscheidung; zitiere für jede Regel eine Quelle.
5. Trage die von Hand berechnete Zahl der ersten Züge in `test/engine.test.mjs` ein und führe `npm test` aus.
6. Für eine neue Zug- oder Siegart bearbeite `src/engine.mjs` (`MOVE_TYPES` oder `WIN_TYPES`, `compile`, `explain`), ergänze die Regelsätze in allen acht Sprachen in `src/i18n.mjs`, erweitere `schema.json` und `docs/moves.md` und füge Tests hinzu.
7. Führe `node scripts/build.mjs` aus und committe die neu erzeugte `index.html` zusammen mit `src/`.
