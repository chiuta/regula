# REGULA

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.2.0 · Last updated: 2026-11-17

🌐 https://regula.chiuta.ro

> Describe any traditional board or card game in a JSON file and play it — one rules engine for every game.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha, usable: five classic two-player games are playable in the single `index.html` (open it offline, no server) against the computer or another person; the rules of each game are written out in eight languages from the same data the engine plays, and you can paste your own game file. The limits are listed below.

## What it does

- Plays five classic games from data files: Nine Men's Morris, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenhagen 11 × 11, simplified). Each has an origin, a statement of how sure the rules are, notes on the choices made, and sources.
- Each side can be a person, a random player or the computer at two levels; moves by mouse, touch or keyboard; undo, redo, a hint, and a move record you can copy.
- Writes the rules of the chosen game in eight languages, generated from the same data that the engine plays, so the text and the game cannot disagree.
- Your own game: paste a game as JSON, validate it with messages that name the faulty field, play it and download it. Nothing is uploaded.
- Interface in eight languages, dark and light themes, a labelled button for every point (screen readers, keyboard), works from 360 px wide; no network, no tracking.
- Installable as an app and available offline after the first visit when served over HTTPS (a service worker keeps the page; nothing else is stored or sent). Opened from a downloaded file it works the same, without installation.

## How it works

- One JSON file per game in `data/games/`, checked by `schema.json`; the format is described in `docs/moves.md` and the tutorial is `docs/tutorial.md` (English and Romanian).
- `src/engine.mjs` is the rules engine (no screen, no network): it compiles a game, lists the legal moves, applies them, and searches with minimax and alpha–beta pruning for the computer opponent.
- `src/ui.js`, `src/i18n.mjs` and `src/app.css` are the interface; `node scripts/build.mjs` builds the single `index.html` (`--check` verifies that it matches).
- `npm test` runs the tests of the engine (move counts worked out by hand), the data files and the documentation; `python scripts/validate.py` checks the JSON files. Development needs Node.js 24 or newer; the page itself only needs a browser that knows ES2017.
- `manifest.webmanifest`, `sw.js` and the icons are produced by `node scripts/build.mjs` through the shared kit (`pwa` in `src/app.json`); `--check` also verifies them, and `npm test` checks that the manifest, the service worker version and the CSP match the page.

## Limits, stated plainly

- The historical games are reconstructions: the sources are incomplete, and the modern choices are noted for each game. These are not tournament rules.
- Hnefatafl is simplified: the shieldwall capture, the edge-fort win and the win by encircling all defenders are missing.
- The computer opponent is a short minimax search (easy: depth 2; medium: depth 5 with a node limit); it plays reasonably, not perfectly. The random level moves at random.
- Draws by repetition or by turns without a capture are app conventions, noted for each game. Card games cannot be played yet.
- The engine only handles two-player games on grid or graph boards; there are no rules yet for dice, hidden cards or more players.
- Traditional Romanian games other than Moara (Țintar) are missing: their rules were not verified against sources. See the open tasks.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/games/example.json` into `data/games/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.
5. To change the engine or the interface, edit `src/`, then run `npm test` and `node scripts/build.mjs` (see `CONTRIBUTING.md`).

## Good first issues

See `ISSUES_GOOD_FIRST.md` for ready-made tasks.

## License

Code: MIT. Contributed data: state its source; it is released under the same licence unless the file says otherwise.

## Support

If this project is useful, you can [buy me a coffee](https://buymeacoffee.com/echo.of.the.strings).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Add yourself with `@all-contributors please add @you for data` in your pull request.
