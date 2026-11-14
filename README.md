# REGULA

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.1.0 · Last updated: 2026-11-14

🌐 https://regula.chiuta.ro

> Describe any traditional board or card game in a JSON file and play it — one rules engine for every game.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha: the repository holds the structure, the data schema or the first examples and the contribution guides. The scope below is the plan, not what works today.

## Planned scope

- A JSON schema v1.0 for moves (step, jump, capture, drop), documented in `docs/moves.md`, and unit tests for the move validator.
- Classic games as data: Nine Men’s Morris, Alquerque, Hnefatafl, Mu Torere and Fanorona, plus five Romanian traditional games.
- A minimal browser renderer for `board.type = grid` and a random-move opponent that works with any valid game file.
- Three card-game examples with a `deck` section in the schema.
- Rules-to-text generators (English and Romanian) and a short tutorial: “Add your grandparents’ game in 20 minutes”.

None of this is implemented yet: each item is a ready-made task in `ISSUES_GOOD_FIRST.md`.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/games/example.json` into `data/games/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

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
