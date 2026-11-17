# Good first issues

**English** · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Add Three Men’s Morris as a bundled game: start from `docs/examples/three-mens-morris.json`, compare the variant with two more sources, add the names in seven languages and move the file to `data/games/`
- [ ] Have native speakers review the French, Italian, Spanish, Portuguese, German and Hungarian texts: the `notes` of the five games and the rule sentences (`r_*`) in `src/i18n.mjs`
- [ ] Add traditional Romanian board games for two players without dice (ask older relatives, cite a book or a page for every rule) as data files
- [ ] Add Six Men’s Morris and Twelve Men’s Morris as data files, with a cited source for the rules (mills are already supported)
- [ ] Add the missing tafl rules to the engine: the shieldwall capture, the edge-fort win for the defenders and the win by encircling all defenders (new `rules` fields, sentences in eight languages, tests)
- [ ] Add other tafl variants as data (Brandubh, Tablut, Fetlar), each with its sources and its differences from the Copenhagen rules
- [ ] Add the import of a saved record: paste a list of moves and replay it on the board
- [ ] Add a stronger computer level (for example iterative deepening with a transposition table) and test that it beats the current medium level
- [ ] Design dice and other chance for the format (a seeded roll, so that records can be replayed) and write the proposal in `docs/`
- [ ] Add three card-game examples with a `deck` section in the schema (they cannot be played yet: describe them, with sources)

Create them all on GitHub with `scripts/create_issues.sh` (needs the `gh` CLI).
