# Add your grandparents’ game in 20 minutes

**English** · [Română](tutorial.ro.md) · Reference: [game file format](moves.md)

You need a text editor and a game that two people play on a board with pieces. Nothing to install: the app checks your file in the browser. We will write **Three Men’s Morris**, a game small enough to fit on one screen; the finished file is [`examples/three-mens-morris.json`](examples/three-mens-morris.json), and the `json` blocks below add up to exactly that file (`npm test` checks it).

## 1. Write the rules on paper first (5 minutes)

Ask the person who knows the game, and write short answers to these questions:

1. How many pieces does each player have, and where do they start?
2. Does a player place pieces, move them, or both?
3. How does a piece move? One point at a time, any distance, by jumping?
4. How are pieces captured, if at all?
5. How does the game end? Who wins, and when is it a draw?
6. Where did you learn it, and is there a book or a page that describes it?

Then draw the board and give each point a name: `a1` at the bottom left, `b1` to its right, `a2` above it.

```
a3 — b3 — c3
| \  |  / |
a2 — b2 — c2
| /  |  \ |
a1 — b1 — c1
```

## 2. Start the file: who, where, how sure (2 minutes)

Copy `data/games/example.json` to `data/games/<id>.json`; the `id` uses lowercase letters, digits and `-`. Keep the file name and the `id` equal.

```json
{
  "id": "three-mens-morris",
  "name": "Three Men's Morris",
  "region": "Europe (Roman times and the Middle Ages)",
  "players": 2,
  "status": "reconstructed"
}
```

`status` tells the player how much to trust the rules: `established` (well documented), `reconstructed` (pieced together, with modern choices), `simplified` (part of the real rules is missing) or `unverified` (not yet checked against a source).

## 3. The rules in words, and the sources (3 minutes)

These four fields are for people. Write them in English, in your own words, and cite where you learned the game. A game with only these fields (no `rules`) is already a valid contribution: the app shows it as a description.

```json
{
  "setup": "The board is empty. Each player has three pieces in hand.",
  "moves": [
    "Players take turns placing one piece on any empty point until all six pieces are on the board.",
    "Then each turn one piece moves along a line to an adjacent empty point."
  ],
  "win": "The first player to get their three pieces in a row along a line wins.",
  "sources": [
    "https://en.wikipedia.org/wiki/Three_men%27s_morris"
  ]
}
```

## 4. The board and the pieces (4 minutes)

Our board is not a plain grid, because the diagonals pass only through the centre; so it is a **graph**: the points with coordinates, and the lines as lists of points. Consecutive points on a line are neighbours, and a line of three is what a winning row is made of.

```json
{
  "board": {
    "type": "graph",
    "points": {
      "a1": [0, 0], "b1": [1, 0], "c1": [2, 0],
      "a2": [0, 1], "b2": [1, 1], "c2": [2, 1],
      "a3": [0, 2], "b3": [1, 2], "c3": [2, 2]
    },
    "lines": [
      ["a1", "b1", "c1"], ["a2", "b2", "c2"], ["a3", "b3", "c3"],
      ["a1", "a2", "a3"], ["b1", "b2", "b3"], ["c1", "c2", "c3"],
      ["a1", "b2", "c3"], ["a3", "b2", "c1"]
    ]
  }
}
```

A rectangular board is shorter: `{ "type": "grid", "w": 5, "h": 5, "diagonals": "alternate" }` (see the [format](moves.md#2-board)). Pieces come next; with no `side`, both players use the same kind and `count` is how many each has:

```json
{
  "pieces": [
    { "id": "man", "count": 3 }
  ]
}
```

## 5. The rules for the engine (4 minutes)

Here the words become data. The two sides, who starts, how many pieces are still in the hand, and a start position (here empty: `{ "points": {} }`):

```json
{
  "rules": {
    "sides": ["white", "black"],
    "first": "white",
    "hand": { "white": 3, "black": 3 },
    "setup": { "points": {} },
    "moves": [
      { "type": "drop", "piece": "man", "when": { "hand": "some" } },
      { "type": "step", "when": { "hand": "none" } }
    ],
    "win": [
      { "type": "line", "len": 3 },
      { "type": "draw", "repeat": 3 }
    ]
  }
}
```

Read it as the grandparents would say it: *while there are pieces in the hand, place one (`drop`); when the hand is empty, move one step along a line (`step`). Three in a row wins (`line`); the same position three times is a draw (`draw`).* The last rule is a convention of the app, not part of the old game; say so in `notes`. Many games also say what happens to a player who cannot move: `{ "type": "blocked" }` makes that player lose (see Mū tōrere). It is left out here because on this board nobody can be blocked before someone already has a row.

If the old game needs something the format cannot say yet (dice, cards, three players), leave `rules` out, finish the description, and open an issue: that is how the format grows.

## 6. Try it (3 minutes)

1. Open the app and choose **Your own game (JSON)…** in the game list.
2. Paste the whole file and press **Validate**. A mistake is named with its place, for example:
   - `board.lines[3]: unknown point "a4"` — a typo in a point name;
   - `rules.moves[0]: unknown type "dorp" (known: drop, step, slide, fly, jump, approach-withdraw, mill, custodial, king-capture)`;
   - `rules.moves[0]: a drop rule needs rules.hand` — you forgot `hand`;
   - `rules.win[0]: the board has no line of 4 points` — `len` is longer than any line you drew.
3. Press **Play this game**. Play it against the computer, and then against yourself, trying the odd cases: the last piece, a blocked player, a mistake you would expect the rules to forbid.
4. Under the board, the app writes the rules it understood, in your language. Compare them with what you wrote on paper: that is the best test.

## 7. Notes, names, pull request (the rest)

```json
{
  "notes": {
    "en": "Sources differ on the moving phase: some let a piece go to any empty point, most describe a step to an adjacent point along a line. This file uses the step. Some sources also forbid the first piece in the centre; this file does not. A draw by the same position three times is a convention of the app.",
    "ro": "Sursele diferă la faza de mutare: unele lasă piesa să meargă pe orice punct liber, cele mai multe descriu un pas pe un punct vecin, de-a lungul unei linii. Fișierul folosește pasul. Unele surse interzic și prima piesă în centru; fișierul nu o face. Remiza prin aceeași poziție de trei ori este o convenție a aplicației."
  }
}
```

`notes` is where you are honest: every choice you made between versions of a rule, and every rule you left out. Games that are not `established` need notes in `en` and `ro`.

To add the game to the app:

1. Put the file in `data/games/`; add `names` in `ro fr de es it hu pt` (a name you are sure of, or ask in the pull request).
2. `python scripts/validate.py` should print `0 problem(s)`.
3. `npm test` should pass. Add the number of possible first moves, worked out by hand, to `test/engine.test.mjs` (here 9: any of the nine points).
4. Open a pull request. Data contributions need no coding, and every translation, correction or source helps.
