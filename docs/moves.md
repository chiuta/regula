# REGULA — the game file format (v1)

**English** · [Română](moves.ro.md) · Tutorial: [English](tutorial.md) · [Română](tutorial.ro.md)

A game is **one JSON file** in `data/games/`. Two checks look at it:

- `python scripts/validate.py` checks the *shape* against `schema.json` (needs `pip install jsonschema`);
- the engine (`src/engine.mjs`) checks the *meaning* when the game is loaded. Every error names the field, for example `rules.setup.rows: 5 rows expected, got 4`. The **Your own game** card in the app shows the same messages, so you can test a file without installing anything.

A file has two parts:

1. **the description**, written for people (`name`, `region`, `setup`, `moves`, `win`, `sources`, `notes`) — always required;
2. **the rules**, written for the engine (`rules`) — optional. A file without `rules` is still valid: the app shows its description and says that it cannot be played yet (see `data/games/example.json`, which describes Fox and Geese).

`board` and `pieces` are required in both cases because they are part of the description too.

Code blocks marked `json` below are checked by `npm test` against the real game files, so they cannot drift from the format.

## 1. Top level

| field | required | meaning |
|---|---|---|
| `id` | yes | lowercase letters, digits and `-`; the file is named `<id>.json` |
| `name` | yes | the name in English |
| `names` | no | the name in other languages: `{ "ro": "…", "fr": "…" }` (language codes `ro fr de es it hu pt`; an `en` entry may repeat `name`) |
| `region` | yes | where and when the game was played, in a few words |
| `players` | yes | 1–8; the engine plays only `2` |
| `status` | no | how sure the rules are: `established`, `reconstructed`, `simplified` or `unverified` — shown to the player |
| `board` | yes | the geometry, §2 |
| `pieces` | yes | the kinds of pieces, §3 |
| `setup`, `moves`, `win` | yes | the rules in words: a sentence, a list of sentences, a sentence (English) |
| `sources` | yes | at least one link or reference; only `http(s)` links become clickable |
| `notes` | no | `{ "en": "…", "ro": "…" }` — choices you made, what is not implemented; other languages fall back to `en` |
| `rules` | no | the machine-readable rules, §4 |

Be honest in `status` and `notes`: if you reconstructed a rule, say so. Do not copy text from copyrighted rule books; describe the rules in your own words and cite the source.

## 2. `board`

### 2.1 Grid boards

```json
{ "type": "grid", "w": 9, "h": 5, "diagonals": "alternate" }
```

- `w`, `h`: columns and rows, 1–26.
- `diagonals`: `none` (default), `all`, or `alternate` — diagonals only through the points where column + row is even (the pattern of Alquerque and Fanorona).
- `render`: `lines` (default: points joined by lines) or `cells` (coloured squares, as in tafl games).
- Point names are a letter and a number: `a1` is the **bottom-left** point, columns run `a, b, c…` to the right and rows `1, 2, 3…` upwards.

```json
{ "type": "grid", "w": 11, "h": 11, "render": "cells", "sets": { "throne": ["f6"] } }
```

Grids come with three ready-made point sets: `edge`, `corners` and `center` (the middle point, or the middle two or four points when the size is even).

### 2.2 Graph boards

A graph lists the points and the lines between them. Use it for anything that is not a rectangle: Nine Men’s Morris, Mū tōrere, the Three Men’s Morris board of the tutorial.

```json
{
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
```

- `points`: `name → [x, y]`. The numbers are only used for drawing; `y` grows upwards. Any names will do.
- `lines`: each line is a list of point names in order. **Consecutive points on a line are neighbours.** Long lines are how mills (`mill`) and winning rows (`line`) are found, so draw a row of three as one three-point line, not as two edges.
- `edges`: optional extra pairs `["p", "q"]` that make two points neighbours without forming a line.

### 2.3 Point sets

`sets` gives names to groups of points, so that rules can refer to them (`"fromNot": "far"`, `"set": "corners"`). A set is either a plain list, or an object with one list per side (the list of the side that is moving is used).

```json
{ "far": { "white": ["a5", "b5", "c5", "d5", "e5"], "black": ["a1", "b1", "c1", "d1", "e1"] } }
```

### 2.4 Direction of play

Games where pieces may not go backwards need to know which way is forward. `forward` gives each side a direction `[dx, dy]` (`[0, 1]` is up the board); the direction words `fwd`, `side` and `back` (§4.3) then become available.

```json
{ "white": [0, 1], "black": [0, -1] }
```

## 3. `pieces`

```json
[
  { "id": "attacker", "side": "attackers", "count": 24 },
  { "id": "defender", "side": "defenders", "count": 12, "value": 2 },
  { "id": "king", "side": "defenders", "count": 1, "value": 6 }
]
```

- `id`: the name used in the rules; `count`: how many there are at the start (for each side when there is no `side`, as with the `man` of Nine Men’s Morris).
- `side`: the side the piece belongs to; leave it out when both sides use the same kind of piece.
- `value`: how much a piece is worth to the computer opponent (default 1). `glyph`: an optional letter drawn on the piece.

## 4. `rules`

### 4.1 Sides and hand

```json
{ "sides": ["white", "black"], "first": "white", "mandatoryCapture": true }
```

```json
{ "hand": { "white": 9, "black": 9 } }
```

- `sides`: exactly two ids (lowercase letters, digits, `-`). The app names white, black, attackers and defenders in every language and colours them accordingly; other ids are shown as they are.
- `first`: the side that moves first (default: the first one).
- `mandatoryCapture`: when `true`, a player who can capture must capture.
- `hand`: pieces that start in the hand, to be placed with a `drop` rule (§4.3).

### 4.2 `setup`: the starting position

For grids, give the rows **from the top**, one character per point; `.` is an empty point and the `legend` says what the other characters mean, as `"side:piece"`:

```json
{
  "rows": ["bbbbbbbbb", "bbbbbbbbb", "bwbw.bwbw", "wwwwwwwww", "wwwwwwwww"],
  "legend": { "b": "black:man", "w": "white:man" }
}
```

For any board, name the points directly. `{ "points": {} }` means an empty board (games that start with pieces in hand):

```json
{ "points": { "k1": "black:counter", "k2": "black:counter", "k5": "white:counter" } }
```

The engine refuses a game in which the first player has no legal move at the start.

### 4.3 `moves`: the ways a piece may move

`moves` is a list; a move is legal if **any** rule of the list allows it. Every rule has a `type` and, optionally, these common fields:

| field | meaning |
|---|---|
| `piece` / `pieces` | the piece kinds the rule applies to (default: all) |
| `sides` | the sides the rule applies to (default: both) |
| `dirs` | directions, one word or a list (default `all`; `custodial` defaults to `orth`): `all`, `orth` (horizontal and vertical), `diag`, `fwd`, `side`, `back` (these three need `board.forward`) |
| `when` | `{ "hand": "some" \| "none", "pieces": "<comparison>" }` — the rule is available only while the side still has (`some`) or no longer has (`none`) pieces in hand, and/or while the side has a given total number of pieces on the board and in hand: `"==3"`, `">3"`, `"<=2"`… |
| `from`, `fromNot`, `to`, `toNot` | the piece must (not) start or end on a named point set |
| `requires` | `"adjacent-enemy"`: only a piece that stands next to an enemy piece may do this |
| `chain` | after a capture: `"none"` (default), `"optional"` (the same piece may capture again, or stop) or `"forced"` (it must keep capturing) |
| `max` | the longest distance, for `slide` |

The nine types:

| type | what it does |
|---|---|
| `drop` | place a piece from the hand on any empty point (`piece` says which; needs `rules.hand`) |
| `step` | move one point along a line to an empty neighbour |
| `slide` | move any number of empty points along a line |
| `fly` | move to any empty point |
| `jump` | capture by jumping over an adjacent enemy to the empty point just beyond; `immune` lists the pieces that cannot be captured this way |
| `approach-withdraw` | Fanorona: step to an empty neighbour and capture the unbroken line of enemy pieces in front of it (approach) or behind it (withdrawal). In a chain the piece may not return to a point it visited (`noRevisit`) nor move twice in the same direction (`noSameDir`); both default to `true` |
| `mill` | when a move or placement forms a line of `len` own pieces (default 3, along a board line), remove one enemy piece; `protect: "mill"` (default) spares pieces that are in an enemy mill unless all are, `"none"` spares none |
| `custodial` | tafl capture: an enemy piece is captured when your move sandwiches it in a straight line between the moved piece and another of your pieces (`anvil` limits which kinds count) or a hostile point; `hostile` lists `{ "set", "to", "onlyEmpty" }` entries (`to`: the side whose pieces are endangered; `onlyEmpty`: hostile only while nobody stands on it); `immune` lists the pieces that cannot be captured this way |
| `king-capture` | the piece named by `piece` is captured only when enemy pieces fill all four sides; an empty point of the `throne` set counts as an enemy piece, and on the throne itself all four sides are needed; with `edgeSafe` (default `true`) it cannot be captured on the board edge |

Real examples from the bundled games:

```json
{ "type": "drop", "piece": "man", "when": { "hand": "some" } }
```

```json
{ "type": "step", "when": { "hand": "none", "pieces": ">3" } }
```

```json
{ "type": "fly", "when": { "hand": "none", "pieces": "==3" } }
```

```json
{ "type": "mill", "len": 3, "protect": "mill" }
```

```json
{ "type": "step", "dirs": ["fwd", "side"], "fromNot": "far" }
```

```json
{ "type": "jump", "dirs": ["fwd", "side"], "chain": "forced" }
```

```json
{ "type": "approach-withdraw", "dirs": "all", "chain": "optional", "noRevisit": true, "noSameDir": true }
```

```json
{ "type": "step", "to": "putahi", "requires": "adjacent-enemy" }
```

```json
{
  "type": "custodial",
  "dirs": "orth",
  "immune": ["king"],
  "hostile": [
    { "set": "corners" },
    { "set": "throne", "to": "attackers" },
    { "set": "throne", "to": "defenders", "onlyEmpty": true }
  ]
}
```

```json
{ "type": "king-capture", "piece": "king", "throne": "throne", "edgeSafe": true }
```

### 4.4 `restricted`: points that few pieces may use

```json
[
  { "set": "corners", "allow": ["king"] },
  { "set": "throne", "allow": ["king"], "through": true }
]
```

Only the pieces in `allow` may stop on the set. With `through: true` the other pieces may still pass over it while it is empty (the tafl throne). An empty `allow` closes the points to everyone.

### 4.5 `win`: how the game ends

A list; the game ends when any rule fires. After every turn the engine checks `reach`, `line`, `eliminate` and `lose-when-none` in the order of the list, then the no-capture draw, then `blocked`; repeated positions are counted over the record of the game.

| type | meaning |
|---|---|
| `reach` | a side wins when one of its pieces (`piece`, default any) stands on a point of `set`; `side` limits the rule to one side |
| `eliminate` | a side with fewer than `below` pieces (on the board and in hand) loses; `below: 1` means no pieces left |
| `lose-when-none` | a side that no longer has a piece of kind `piece` loses (the king is captured) |
| `line` | a side wins by having `len` pieces (default 3) in a row along a board line; needs `board.lines` |
| `blocked` | the side to move, but unable to move, loses; with `"result": "draw"` the game is drawn instead |
| `draw` | `{ "repeat": n }`: the same position `n` times; `{ "noCaptureTurns": n }`: `n` turns in a row without a capture. These are conventions of the app, not historical rules: say so in `notes` |

```json
[
  { "type": "reach", "piece": "king", "set": "corners" },
  { "type": "lose-when-none", "piece": "king" },
  { "type": "blocked" },
  { "type": "draw", "repeat": 3 }
]
```

```json
{ "type": "eliminate", "below": 3 }
```

```json
{ "type": "draw", "noCaptureTurns": 100 }
```

## 5. How a turn works

- A **turn** may have several steps: a placement or a move, then forced captures in a chain (`chain`), then the removal of a piece after a mill. The app shows what is expected next, and *Undo* and *Redo* go back and forth by whole turns.
- When a rule needs a choice, for example approach or withdrawal in Fanorona, the app asks the player.
- The result is looked at after each turn. If the side to move has no legal move and a `blocked` rule exists, the game ends.
- A game that goes on for 1500 moves is stopped by the app (`Stopped: the move limit was reached`), so that two computer players can never loop for ever.

## 6. Before you open a pull request

1. `python scripts/validate.py` prints `0 problem(s)`.
2. Paste the file into **Your own game** in the app: *Validate* shows no error, and the rules text under the board reads like the real rules.
3. Play a few turns against the computer; try the unusual moves (captures, chains, the last piece).
4. `npm test` passes (`test/data.test.mjs` checks every file: sources, names, statuses). A new game also deserves a line in `test/engine.test.mjs` with the number of moves in the starting position, worked out by hand.
5. `notes` lists every choice you made and everything that is not implemented.

## 7. What the format cannot express yet

Dice and other chance; cards and hidden information; more than two players; boards that change; captures by stacking or by counting; scoring. Each of these is an open task — see `ISSUES_GOOD_FIRST.md`.
