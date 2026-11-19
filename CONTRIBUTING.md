# Contributing — REGULA

**English** · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.1 · Last updated: 2026-11-20

1. Fork this repository.
2. Copy `data/games/example.json` into `data/games/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

## Rules

- One entry = one file.
- Always cite a source.
- Contribute only material you may legally share (no copied copyrighted text).
- Be kind: see the Code of Conduct.

## Adding a game

1. Read `docs/tutorial.md` (20 minutes) and keep `docs/moves.md` open: it describes every field.
2. Copy `data/games/example.json` to `data/games/<id>.json`. The description alone (`name`, `region`, `setup`, `moves`, `win`, `sources`) is already a valid contribution; add `rules` to make the game playable.
3. Run `python scripts/validate.py`, then paste the file into **Your own game** in the app: *Validate* names every mistake.
4. For a playable game add `names` in `ro fr de es it hu pt`, an honest `status` and `notes` in `en` and `ro` about every choice you made; cite a source for every rule.
5. Add the number of first moves, worked out by hand, to `test/engine.test.mjs`, and run `npm test`.
6. To add a new kind of move or win, edit `src/engine.mjs` (`MOVE_TYPES` or `WIN_TYPES`, `compile`, `explain`), add the rule sentences in all eight languages to `src/i18n.mjs`, extend `schema.json` and `docs/moves.md`, and add tests.
7. Run `node scripts/build.mjs` and commit the regenerated `index.html` together with `src/`.
