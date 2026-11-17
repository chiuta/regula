# Adaugă jocul bunicilor în 20 de minute

[English](tutorial.md) · **Română** · Referință: [formatul fișierelor de joc](moves.ro.md)

Îți trebuie un editor de text și un joc pe care două persoane îl joacă pe o tablă, cu piese. Nu instalezi nimic: aplicația îți verifică fișierul în browser. Vom scrie **Three Men’s Morris**, un joc destul de mic ca să încapă pe un ecran; fișierul terminat este [`examples/three-mens-morris.json`](examples/three-mens-morris.json), iar blocurile `json` de mai jos se adună exact în acel fișier (`npm test` verifică asta). Textele din fișier (`name`, `setup`, `moves`, `win`) se scriu în engleză; traducerile merg în `names` și `notes`.

## 1. Scrie întâi regulile pe hârtie (5 minute)

Întreabă persoana care știe jocul și notează răspunsuri scurte la aceste întrebări:

1. Câte piese are fiecare jucător și unde pornesc?
2. Jucătorul pune piese, le mută sau face amândouă?
3. Cum merge o piesă? Un punct pe rând, oricât, sărind?
4. Cum se capturează piesele, dacă se capturează?
5. Cum se termină partida? Cine câștigă și când e remiză?
6. De unde ai învățat jocul și există o carte sau o pagină care îl descrie?

Apoi desenează tabla și dă fiecărui punct un nume: `a1` jos în stânga, `b1` în dreapta lui, `a2` deasupra.

```
a3 — b3 — c3
| \  |  / |
a2 — b2 — c2
| /  |  \ |
a1 — b1 — c1
```

## 2. Începe fișierul: cine, unde, cât de sigur (2 minute)

Copiază `data/games/example.json` în `data/games/<id>.json`; `id` folosește litere mici, cifre și `-`. Păstrează numele fișierului și `id` egale.

```json
{
  "id": "three-mens-morris",
  "name": "Three Men's Morris",
  "region": "Europe (Roman times and the Middle Ages)",
  "players": 2,
  "status": "reconstructed"
}
```

`status` spune jucătorului cât să se încreadă în reguli: `established` (bine documentat), `reconstructed` (alcătuit din bucăți, cu alegeri moderne), `simplified` (lipsește o parte din regulile reale) sau `unverified` (încă necomparat cu o sursă).

## 3. Regulile în cuvinte și sursele (3 minute)

Aceste patru câmpuri sunt pentru oameni. Scrie-le în engleză, cu cuvintele tale, și citează de unde ai învățat jocul. Un joc cu doar aceste câmpuri (fără `rules`) este deja o contribuție validă: aplicația îl arată ca descriere.

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

## 4. Tabla și piesele (4 minute)

Tabla noastră nu e o grilă simplă, fiindcă diagonalele trec doar prin centru; deci e un **graf**: punctele cu coordonate și liniile ca liste de puncte. Punctele consecutive de pe o linie sunt vecine, iar o linie de trei este ceea ce formează un rând câștigător.

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

O tablă dreptunghiulară e mai scurtă: `{ "type": "grid", "w": 5, "h": 5, "diagonals": "alternate" }` (vezi [formatul](moves.ro.md#2-board)). Urmează piesele; fără `side`, ambii jucători folosesc același fel, iar `count` este câte are fiecare:

```json
{
  "pieces": [
    { "id": "man", "count": 3 }
  ]
}
```

## 5. Regulile pentru motor (4 minute)

Aici cuvintele devin date. Cele două laturi, cine începe, câte piese mai sunt în mână și o poziție de start (aici goală: `{ "points": {} }`):

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

Citește-l cum ar spune-o bunicii: *cât timp mai sunt piese în mână, pune una (`drop`); când mâna e goală, mută un pas de-a lungul unei linii (`step`). Trei în rând câștigă (`line`); aceeași poziție de trei ori înseamnă remiză (`draw`).* Ultima regulă este o convenție a aplicației, nu face parte din jocul vechi; spune-o în `notes`. Multe jocuri spun și ce se întâmplă cu un jucător care nu mai poate muta: `{ "type": "blocked" }` îl face să piardă (vezi Mū tōrere). Aici lipsește, fiindcă pe această tablă nimeni nu poate fi blocat înainte ca cineva să aibă deja un rând.

Dacă jocul vechi cere ceva ce formatul nu poate spune încă (zaruri, cărți, trei jucători), lasă `rules` deoparte, termină descrierea și deschide o sarcină (issue): așa crește formatul.

## 6. Încearcă-l (3 minute)

1. Deschide aplicația și alege **Jocul tău (JSON)…** din lista de jocuri.
2. Lipește tot fișierul și apasă **Verifică**. O greșeală e numită cu locul ei, de exemplu:
   - `board.lines[3]: unknown point "a4"` — o greșeală de scriere într-un nume de punct;
   - `rules.moves[0]: unknown type "dorp" (known: drop, step, slide, fly, jump, approach-withdraw, mill, custodial, king-capture)`;
   - `rules.moves[0]: a drop rule needs rules.hand` — ai uitat `hand`;
   - `rules.win[0]: the board has no line of 4 points` — `len` e mai lung decât orice linie desenată.
3. Apasă **Joacă acest joc**. Joacă-l împotriva calculatorului, apoi împotriva ta, încercând cazurile ciudate: ultima piesă, un jucător blocat, o greșeală pe care te-ai aștepta s-o interzică regulile.
4. Sub tablă, aplicația scrie regulile pe care le-a înțeles, în limba ta. Compară-le cu ce ai scris pe hârtie: este cel mai bun test.

## 7. Note, nume, pull request (restul)

```json
{
  "notes": {
    "en": "Sources differ on the moving phase: some let a piece go to any empty point, most describe a step to an adjacent point along a line. This file uses the step. Some sources also forbid the first piece in the centre; this file does not. A draw by the same position three times is a convention of the app.",
    "ro": "Sursele diferă la faza de mutare: unele lasă piesa să meargă pe orice punct liber, cele mai multe descriu un pas pe un punct vecin, de-a lungul unei linii. Fișierul folosește pasul. Unele surse interzic și prima piesă în centru; fișierul nu o face. Remiza prin aceeași poziție de trei ori este o convenție a aplicației."
  }
}
```

În `notes` ești sincer: fiecare alegere făcută între variantele unei reguli și fiecare regulă pe care ai lăsat-o deoparte. Jocurile care nu sunt `established` cer note în `en` și `ro`.

Ca să adaugi jocul în aplicație:

1. Pune fișierul în `data/games/`; adaugă `names` în `ro fr de es it hu pt` (un nume de care ești sigur, sau întreabă în pull request).
2. `python scripts/validate.py` trebuie să afișeze `0 problem(s)`.
3. `npm test` trebuie să treacă. Adaugă în `test/engine.test.mjs` numărul primelor mutări posibile, calculat de mână (aici 9: oricare dintre cele nouă puncte).
4. Deschide un pull request. Contribuțiile de date nu cer programare, iar fiecare traducere, corectură sau sursă ajută.
