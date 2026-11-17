# REGULA — formatul fișierelor de joc (v1)

[English](moves.md) · **Română** · Tutorial: [English](tutorial.md) · [Română](tutorial.ro.md)

Un joc este **un singur fișier JSON** în `data/games/`. Îl verifică două lucruri:

- `python scripts/validate.py` verifică *forma* față de `schema.json` (cere `pip install jsonschema`);
- motorul (`src/engine.mjs`) verifică *sensul* la încărcarea jocului. Fiecare eroare numește câmpul, de exemplu `rules.setup.rows: 5 rows expected, got 4`. Cardul **Jocul tău** din aplicație arată aceleași mesaje, așa că poți încerca un fișier fără să instalezi nimic.

Un fișier are două părți:

1. **descrierea**, scrisă pentru oameni (`name`, `region`, `setup`, `moves`, `win`, `sources`, `notes`) — mereu obligatorie;
2. **regulile**, scrise pentru motor (`rules`) — opționale. Un fișier fără `rules` rămâne valid: aplicația îi arată descrierea și spune că încă nu se poate juca (vezi `data/games/example.json`, care descrie jocul Fox and Geese).

`board` și `pieces` sunt obligatorii în ambele cazuri, fiindcă fac parte și din descriere.

Blocurile de cod marcate `json` de mai jos sunt verificate de `npm test` față de fișierele reale de joc, deci nu se pot abate de la format.

## 1. Nivelul de sus

| câmp | obligatoriu | sens |
|---|---|---|
| `id` | da | litere mici, cifre și `-`; fișierul se numește `<id>.json` |
| `name` | da | numele în engleză |
| `names` | nu | numele în alte limbi: `{ "ro": "…", "fr": "…" }` (coduri `ro fr de es it hu pt`; o intrare `en` poate repeta `name`) |
| `region` | da | unde și când se juca, în câteva cuvinte |
| `players` | da | 1–8; motorul joacă doar `2` |
| `status` | nu | cât de sigure sunt regulile: `established`, `reconstructed`, `simplified` sau `unverified` — se arată jucătorului |
| `board` | da | geometria, §2 |
| `pieces` | da | felurile de piese, §3 |
| `setup`, `moves`, `win` | da | regulile în cuvinte: o propoziție, o listă de propoziții, o propoziție (în engleză) |
| `sources` | da | cel puțin o legătură sau o trimitere; doar legăturile `http(s)` devin apăsabile |
| `notes` | nu | `{ "en": "…", "ro": "…" }` — alegerile tale, ce nu e implementat; celelalte limbi revin la `en` |
| `rules` | nu | regulile citibile de mașină, §4 |

Fii sincer în `status` și `notes`: dacă ai reconstituit o regulă, spune-o. Nu copia text din cărți de reguli cu drepturi de autor; descrie regulile cu cuvintele tale și citează sursa.

## 2. `board`

### 2.1 Table de tip grilă

```json
{ "type": "grid", "w": 9, "h": 5, "diagonals": "alternate" }
```

- `w`, `h`: coloane și rânduri, 1–26.
- `diagonals`: `none` (implicit), `all` sau `alternate` — diagonale doar prin punctele unde coloană + rând este par (modelul din Alquerque și Fanorona).
- `render`: `lines` (implicit: puncte unite prin linii) sau `cells` (pătrate colorate, ca în jocurile tafl).
- Numele punctelor sunt o literă și un număr: `a1` este punctul din **stânga-jos**; coloanele merg `a, b, c…` spre dreapta, iar rândurile `1, 2, 3…` în sus.

```json
{ "type": "grid", "w": 11, "h": 11, "render": "cells", "sets": { "throne": ["f6"] } }
```

Grilele vin cu trei seturi de puncte gata făcute: `edge` (marginea), `corners` (colțurile) și `center` (punctul din mijloc, sau cele două ori patru puncte din mijloc când dimensiunea e pară).

### 2.2 Table de tip graf

Un graf enumeră punctele și liniile dintre ele. Îl folosești pentru tot ce nu e dreptunghi: Moara (Nine Men’s Morris), Mū tōrere, tabla Three Men’s Morris din tutorial.

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

- `points`: `nume → [x, y]`. Numerele servesc doar la desen; `y` crește în sus. Orice nume e bun.
- `lines`: fiecare linie e o listă de nume de puncte, în ordine. **Punctele consecutive de pe o linie sunt vecine.** Morile (`mill`) și rândurile câștigătoare (`line`) se găsesc pe linii lungi, așa că desenează un rând de trei ca o singură linie cu trei puncte, nu ca două muchii.
- `edges`: perechi `["p", "q"]` opționale care fac două puncte vecine fără a forma o linie.

### 2.3 Seturi de puncte

`sets` dă nume unor grupuri de puncte, ca regulile să se poată referi la ele (`"fromNot": "far"`, `"set": "corners"`). Un set este fie o listă simplă, fie un obiect cu câte o listă pe latură (se folosește lista laturii care mută).

```json
{ "far": { "white": ["a5", "b5", "c5", "d5", "e5"], "black": ["a1", "b1", "c1", "d1", "e1"] } }
```

### 2.4 Sensul jocului

Jocurile în care piesele nu pot merge înapoi trebuie să știe care e înainte. `forward` dă fiecărei laturi o direcție `[dx, dy]` (`[0, 1]` înseamnă în sus pe tablă); cuvintele de direcție `fwd`, `side` și `back` (§4.3) devin atunci disponibile.

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

- `id`: numele folosit în reguli; `count`: câte sunt la început (pentru fiecare latură, când nu există `side`, ca la `man` din Moară).
- `side`: latura căreia îi aparține piesa; las-o deoparte când ambele laturi folosesc același fel de piesă.
- `value`: cât valorează piesa pentru adversarul calculator (implicit 1). `glyph`: o literă opțională desenată pe piesă.

## 4. `rules`

### 4.1 Laturi și mână

```json
{ "sides": ["white", "black"], "first": "white", "mandatoryCapture": true }
```

```json
{ "hand": { "white": 9, "black": 9 } }
```

- `sides`: exact două identificatoare (litere mici, cifre, `-`). Aplicația numește alb, negru, atacatori și apărători în fiecare limbă și le colorează potrivit; alte identificatoare se afișează ca atare.
- `first`: latura care mută prima (implicit: prima din listă).
- `mandatoryCapture`: cu `true`, cine poate captura trebuie să captureze.
- `hand`: piesele care încep în mână, de pus cu o regulă `drop` (§4.3).

### 4.2 `setup`: poziția de start

Pentru grile, dă rândurile **de sus în jos**, câte un caracter pe punct; `.` este un punct gol, iar `legend` spune ce înseamnă celelalte caractere, ca `"latură:piesă"`:

```json
{
  "rows": ["bbbbbbbbb", "bbbbbbbbb", "bwbw.bwbw", "wwwwwwwww", "wwwwwwwww"],
  "legend": { "b": "black:man", "w": "white:man" }
}
```

Pentru orice tablă poți numi direct punctele. `{ "points": {} }` înseamnă tablă goală (jocuri care încep cu piese în mână):

```json
{ "points": { "k1": "black:counter", "k2": "black:counter", "k5": "white:counter" } }
```

Motorul refuză un joc în care primul jucător nu are nicio mutare legală la start.

### 4.3 `moves`: felurile în care se poate muta o piesă

`moves` este o listă; o mutare e legală dacă **oricare** regulă din listă o permite. Fiecare regulă are un `type` și, opțional, aceste câmpuri comune:

| câmp | sens |
|---|---|
| `piece` / `pieces` | felurile de piese la care se aplică regula (implicit: toate) |
| `sides` | laturile la care se aplică regula (implicit: ambele) |
| `dirs` | direcții, un cuvânt sau o listă (implicit `all`; la `custodial` implicit `orth`): `all`, `orth` (orizontal și vertical), `diag`, `fwd`, `side`, `back` (ultimele trei cer `board.forward`) |
| `when` | `{ "hand": "some" \| "none", "pieces": "<comparație>" }` — regula e disponibilă doar cât timp latura mai are (`some`) sau nu mai are (`none`) piese în mână și/sau cât timp latura are un anumit număr total de piese pe tablă și în mână: `"==3"`, `">3"`, `"<=2"`… |
| `from`, `fromNot`, `to`, `toNot` | piesa trebuie (să nu) plece sau (să nu) ajungă pe un set de puncte numit |
| `requires` | `"adjacent-enemy"`: doar o piesă aflată lângă o piesă inamică poate face asta |
| `chain` | după o captură: `"none"` (implicit), `"optional"` (aceeași piesă poate captura din nou, sau se oprește) sau `"forced"` (trebuie să continue) |
| `max` | distanța cea mai mare, pentru `slide` |

Cele nouă tipuri:

| tip | ce face |
|---|---|
| `drop` | pune o piesă din mână pe orice punct gol (`piece` spune care; cere `rules.hand`) |
| `step` | mută un punct de-a lungul unei linii, pe un vecin gol |
| `slide` | mută pe oricâte puncte goale de-a lungul unei linii |
| `fly` | mută pe orice punct gol |
| `jump` | captură sărind peste un inamic vecin, pe punctul gol de imediat după el; `immune` enumeră piesele care nu pot fi capturate astfel |
| `approach-withdraw` | Fanorona: pas pe un vecin gol și captura șirului neîntrerupt de piese inamice din fața lui (apropiere) sau din spatele lui (retragere). Într-un lanț piesa nu are voie să se întoarcă pe un punct vizitat (`noRevisit`) și nici să meargă de două ori în aceeași direcție (`noSameDir`); ambele sunt implicit `true` |
| `mill` | când o mutare sau o plasare formează o linie de `len` piese proprii (implicit 3, de-a lungul unei linii a tablei), scoate o piesă inamică; `protect: "mill"` (implicit) cruță piesele aflate într-o moară inamică, în afară de cazul în care toate sunt, iar `"none"` nu cruță nicio piesă |
| `custodial` | captura din tafl: o piesă inamică e capturată când mutarea ta o prinde în linie dreaptă între piesa mutată și altă piesă a ta (`anvil` limitează felurile care contează) sau un punct ostil; `hostile` enumeră intrări `{ "set", "to", "onlyEmpty" }` (`to`: latura ale cărei piese sunt amenințate; `onlyEmpty`: ostil doar cât timp nu stă nimeni pe el); `immune` enumeră piesele care nu pot fi capturate astfel |
| `king-capture` | piesa numită de `piece` e capturată doar când piese inamice ocupă toate cele patru laturi; un punct gol din setul `throne` contează ca piesă inamică, iar pe tron sunt necesare toate cele patru laturi; cu `edgeSafe` (implicit `true`) nu poate fi capturată pe marginea tablei |

Exemple reale din jocurile incluse:

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

### 4.4 `restricted`: puncte pe care le pot folosi puține piese

```json
[
  { "set": "corners", "allow": ["king"] },
  { "set": "throne", "allow": ["king"], "through": true }
]
```

Doar piesele din `allow` se pot opri pe set. Cu `through: true`, celelalte piese pot totuși trece peste el cât timp e gol (tronul din tafl). Un `allow` gol închide punctele pentru toți.

### 4.5 `win`: cum se termină jocul

O listă; jocul se termină când se declanșează oricare regulă. După fiecare tură motorul verifică `reach`, `line`, `eliminate` și `lose-when-none` în ordinea listei, apoi remiza fără capturi, apoi `blocked`; pozițiile repetate se numără pe înregistrarea partidei.

| tip | sens |
|---|---|
| `reach` | o latură câștigă când una dintre piesele ei (`piece`, implicit oricare) stă pe un punct din `set`; `side` limitează regula la o latură |
| `eliminate` | latura cu mai puțin de `below` piese (pe tablă și în mână) pierde; `below: 1` înseamnă că nu mai are nicio piesă |
| `lose-when-none` | latura care nu mai are nicio piesă de felul `piece` pierde (regele a fost capturat) |
| `line` | o latură câștigă având `len` piese (implicit 3) într-un rând, de-a lungul unei linii a tablei; cere `board.lines` |
| `blocked` | latura la mutare, dar care nu poate muta, pierde; cu `"result": "draw"` partida e remiză |
| `draw` | `{ "repeat": n }`: aceeași poziție de `n` ori; `{ "noCaptureTurns": n }`: `n` ture la rând fără capturi. Sunt convenții ale aplicației, nu reguli istorice: spune-o în `notes` |

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

## 5. Cum decurge o tură

- O **tură** poate avea mai mulți pași: o plasare sau o mutare, apoi capturi forțate în lanț (`chain`), apoi scoaterea unei piese după o moară. Aplicația arată ce urmează, iar *Anulează* și *Reface* merg înapoi și înainte pe ture întregi.
- Când o regulă cere o alegere, de exemplu apropiere sau retragere la Fanorona, aplicația îl întreabă pe jucător.
- Rezultatul se verifică după fiecare tură. Dacă latura la mutare nu are nicio mutare legală și există o regulă `blocked`, partida se termină.
- O partidă care ajunge la 1500 de mutări e oprită de aplicație („Oprit: s-a atins limita de mutări.”), ca doi jucători calculator să nu se învârtă la nesfârșit.

## 6. Înainte de a deschide un pull request

1. `python scripts/validate.py` afișează `0 problem(s)`.
2. Lipește fișierul în **Jocul tău** din aplicație: *Verifică* nu arată nicio eroare, iar textul regulilor de sub tablă se citește ca regulile adevărate.
3. Joacă câteva ture împotriva calculatorului; încearcă mutările neobișnuite (capturi, lanțuri, ultima piesă).
4. `npm test` trece (`test/data.test.mjs` verifică fiecare fișier: surse, nume, stări). Un joc nou merită și un rând în `test/engine.test.mjs` cu numărul de mutări din poziția de start, calculat de mână.
5. `notes` enumeră fiecare alegere pe care ai făcut-o și tot ce nu e implementat.

## 7. Ce nu poate exprima încă formatul

Zaruri și alte forme de șansă; cărți și informații ascunse; mai mult de doi jucători; table care se schimbă; capturi prin suprapunere sau prin numărare; punctaj. Fiecare este o sarcină deschisă — vezi `ISSUES_GOOD_FIRST.md`.
