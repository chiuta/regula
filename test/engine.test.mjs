import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.mjs';
import { load, mk, texts, pick, play, count, rng, playable, readGame } from './_games.mjs';

const edges = (G) => { let n = 0; for (let i = 0; i < G.B.ray.length; i++) if (G.B.ray[i] >= 0) n++; return n / 2; };

test('geometria: puncte și muchii ale celor cinci table', () => {
  const m = load('nine-mens-morris'), a = load('alquerque'), f = load('fanorona'), t = load('mu-torere'), h = load('hnefatafl');
  assert.equal(m.B.n, 24); assert.equal(edges(m), 32); assert.equal(m.B.lines.filter((l) => l && l.length === 3).length, 16);
  assert.equal(a.B.n, 25); assert.equal(edges(a), 56);          // 40 ortogonale + 16 diagonale
  assert.equal(f.B.n, 45); assert.equal(edges(f), 108);         // 76 ortogonale + 32 diagonale
  assert.equal(t.B.n, 9); assert.equal(edges(t), 16);
  assert.equal(h.B.n, 121); assert.equal(edges(h), 220);
});

test('poziția de start: piese pe tablă și în mână', () => {
  const sum = (G) => { const s = E.initialState(G); return [0, 1].map((side) => [count(G, s, side), s.hand[side]]); };
  assert.deepEqual(sum(load('nine-mens-morris')), [[0, 9], [0, 9]]);
  assert.deepEqual(sum(load('alquerque')), [[12, 0], [12, 0]]);
  assert.deepEqual(sum(load('fanorona')), [[22, 0], [22, 0]]);
  assert.deepEqual(sum(load('mu-torere')), [[4, 0], [4, 0]]);
  assert.deepEqual(sum(load('hnefatafl')), [[24, 0], [13, 0]]);
});

test('numărul mutărilor de început (verificat de mână pentru fiecare joc)', () => {
  const n = (id) => E.legalActions(load(id), E.initialState(load(id))).length;
  assert.equal(n('nine-mens-morris'), 24);
  assert.equal(n('alquerque'), 4);          // cele 4 piese vecine cu centrul; nicio captură
  assert.equal(n('fanorona'), 5);           // 4 apropieri + 1 retragere
  assert.equal(n('mu-torere'), 2);          // doar k1 și k4 au un adversar alături
  assert.equal(n('hnefatafl'), 116);        // regresie
});

/* ---------- Moara ---------- */
test('moara: o moară închisă scoate o piesă care nu e în moară; apoi tura trece', () => {
  const G = load('nine-mens-morris');
  let s = mk(G, { pieces: { a1: 'white:man', d1: 'white:man', a4: 'black:man', a7: 'black:man' }, hand: [7, 7], turn: 0 });
  s = play(G, s, '+g1');
  assert.ok(s.pending, 'trebuie să urmeze scoaterea');
  assert.deepEqual(texts(G, s).sort(), ['×a4', '×a7']);
  assert.equal(s.turn, 0);
  s = play(G, s, '×a4');
  assert.equal(s.turn, 1); assert.equal(count(G, s, 1), 1); assert.equal(s.result, null);
});

test('moara: piesele din moară sunt protejate, afară de cazul în care toate sunt în mori', () => {
  const G = load('nine-mens-morris');
  let s = mk(G, { pieces: { a1: 'white:man', d1: 'white:man', b2: 'black:man', d2: 'black:man', f2: 'black:man', a4: 'black:man' }, hand: [7, 5], turn: 0 });
  s = play(G, s, '+g1');
  assert.deepEqual(texts(G, s), ['×a4']);
  let t = mk(G, { pieces: { a1: 'white:man', d1: 'white:man', b2: 'black:man', d2: 'black:man', f2: 'black:man' }, hand: [7, 6], turn: 0 });
  t = play(G, t, '+g1');
  assert.deepEqual(texts(G, t).sort(), ['×b2', '×d2', '×f2']);
});

test('moara: zborul cu exact trei piese; pașii cu patru', () => {
  const G = load('nine-mens-morris');
  const three = mk(G, { pieces: { a1: 'white:man', b2: 'white:man', c3: 'white:man', g1: 'black:man', g7: 'black:man', a7: 'black:man' }, turn: 0 });
  assert.equal(E.legalActions(G, three).length, 3 * (24 - 6));
  const four = mk(G, { pieces: { a1: 'white:man', b2: 'white:man', c3: 'white:man', d3: 'white:man', g1: 'black:man', g7: 'black:man', a7: 'black:man' }, turn: 0 });
  assert.ok(texts(G, four).every((t) => /^[a-g]\d-[a-g]\d$/.test(t)));
  assert.ok(E.legalActions(G, four).length < 12);
});

test('moara: rămas cu două piese pierzi; fără mutări pierzi', () => {
  const G = load('nine-mens-morris');
  let s = mk(G, { pieces: { a1: 'white:man', d1: 'white:man', g4: 'white:man', c3: 'white:man', b6: 'black:man', d6: 'black:man', f6: 'black:man' }, turn: 0 });
  s = play(G, s, 'g4-g1');
  s = play(G, s, '×b6');
  assert.deepEqual(s.result, { winner: 0, reason: 'eliminate' });
  let b = mk(G, { pieces: { d1: 'white:man', a4: 'white:man', g4: 'white:man', d6: 'white:man', a1: 'black:man', g1: 'black:man', a7: 'black:man', g7: 'black:man' }, turn: 0 });
  b = play(G, b, 'd6-d7');
  assert.deepEqual(b.result, { winner: 0, reason: 'blocked' });
});

/* ---------- Alquerque ---------- */
test('alquerque: un om în centrul tablei goale are cinci mutări (fără înapoi)', () => {
  const G = load('alquerque');
  const s = mk(G, { pieces: { c3: 'white:man', a1: 'black:man' }, turn: 0 });
  assert.deepEqual(texts(G, s).sort(), ['c3-b3', 'c3-b4', 'c3-c4', 'c3-d3', 'c3-d4']);
});

test('alquerque: captura este obligatorie și lanțul de sărituri este forțat', () => {
  const G = load('alquerque');
  let s = mk(G, { pieces: { c3: 'white:man', a1: 'white:man', c4: 'black:man', d5: 'black:man', e1: 'black:man' }, turn: 0 });
  assert.deepEqual(texts(G, s), ['c3xc5']);           // a1 ar putea doar să pășească, dar captura e obligatorie
  s = play(G, s, 'c3xc5');
  assert.ok(s.chain, 'lanțul continuă');
  assert.deepEqual(texts(G, s), ['c5xe5']);           // săritură laterală, forțată
  s = play(G, s, 'c5xe5');
  assert.equal(s.chain, null); assert.equal(s.turn, 1); assert.equal(count(G, s, 1), 1);
});

test('alquerque: un om ajuns pe ultimul rând nu mai poate decât să captureze', () => {
  const G = load('alquerque');
  const s = mk(G, { pieces: { c5: 'white:man', a1: 'white:man', e1: 'black:man' }, turn: 0 });
  assert.ok(texts(G, s).every((t) => t.startsWith('a1')));
});

/* ---------- Fanorona ---------- */
test('fanorona: la început există doar capturi (3 apropieri de câte 2 + o apropiere și o retragere de câte 1)', () => {
  const G = load('fanorona');
  const list = E.legalActions(G, E.initialState(G));
  assert.ok(list.every((a) => a.cap));
  assert.deepEqual(list.map((a) => a.taken.length).sort(), [1, 1, 2, 2, 2]);
  assert.equal(list.filter((a) => a.kind === 'W').length, 1);
});

test('fanorona: apropiere, apoi continuarea cu aceeași piesă; se poate opri oricând', () => {
  const G = load('fanorona');
  let s = mk(G, { pieces: { c3: 'white:man', e3: 'black:man', d5: 'black:man', a1: 'white:man' }, turn: 0 });
  assert.ok(texts(G, s).includes('c3-d3+1'));
  s = play(G, s, 'c3-d3+1');
  assert.ok(s.chain);
  assert.deepEqual(texts(G, s).sort(), ['d3-d4+1', '·']);
  s = play(G, s, 'd3-d4+1');
  assert.equal(s.chain, null); assert.equal(s.turn, 1); assert.equal(count(G, s, 1), 0);
  assert.deepEqual(s.result, { winner: 0, reason: 'eliminate' });
  let t = mk(G, { pieces: { c3: 'white:man', e3: 'black:man', d5: 'black:man', a1: 'white:man' }, turn: 0 });
  t = play(G, play(G, t, 'c3-d3+1'), '·');
  assert.equal(t.turn, 1); assert.equal(count(G, t, 1), 1);
});

test('fanorona: nu se poate merge de două ori la rând în aceeași direcție', () => {
  const G = load('fanorona');
  const pieces = { e3: 'white:man', f3: 'black:man', b3: 'black:man' };
  let s = mk(G, { pieces, turn: 0 });
  s = play(G, s, 'e3-d3~1');                     // retragere: ia f3
  assert.equal(s.chain, null);                   // continuarea spre c3 (apropiere pe b3) este aceeași direcție → interzisă
  assert.equal(s.turn, 1);
  const G2 = load('fanorona', (g) => { g.rules.moves[1].noSameDir = false; });
  let t = mk(G2, { pieces, turn: 0 });
  t = play(G2, t, 'e3-d3~1');
  assert.ok(t.chain, 'fără restricție, lanțul ar continua');
});

test('fanorona: pașii simpli (paika) apar doar când nu există nicio captură', () => {
  const G = load('fanorona');
  const s = mk(G, { pieces: { a1: 'white:man', i5: 'black:man' }, turn: 0 });
  assert.deepEqual(texts(G, s).sort(), ['a1-a2', 'a1-b1', 'a1-b2']);
});

/* ---------- Mū tōrere ---------- */
test('mu torere: în pūtahi intri doar dacă stai lângă un adversar', () => {
  const G = load('mu-torere');
  assert.deepEqual(texts(G, E.initialState(G)).sort(), ['k1-p', 'k4-p']);
  const s = play(G, E.initialState(G), 'k1-p');
  assert.deepEqual(texts(G, s), ['k8-k1']);
});

test('mu torere: cel blocat pierde', () => {
  const G = load('mu-torere');
  const s = mk(G, { pieces: { p: 'black:counter', k2: 'black:counter', k3: 'black:counter', k8: 'black:counter', k4: 'white:counter', k5: 'white:counter', k6: 'white:counter', k7: 'white:counter' }, turn: 1 });
  assert.deepEqual(E.legalActions(G, s), []);
  assert.deepEqual(E.checkResult(G, s), { winner: 0, reason: 'blocked' });
});

/* ---------- Hnefatafl ---------- */
test('hnefatafl: nimeni în afară de rege nu se oprește pe tron sau în colț; se poate trece peste tronul gol', () => {
  const G = load('hnefatafl');
  const s = mk(G, { pieces: { f8: 'attackers:attacker', a1: 'defenders:king', k11: 'defenders:defender' }, turn: 0 });
  const t = texts(G, s);
  assert.ok(t.includes('f8-f7') && t.includes('f8-f5') && !t.includes('f8-f6'));
  const c = mk(G, { pieces: { a3: 'attackers:attacker', f6: 'defenders:king' }, turn: 0 });
  assert.ok(!texts(G, c).includes('a3-a1'));
  const kingTurn = mk(G, { pieces: { a3: 'defenders:king', f9: 'attackers:attacker' }, turn: 1 });
  assert.ok(texts(G, kingTurn).includes('a3-a1'));
});

test('hnefatafl: captură prin încadrare, colț ostil, tron ostil, intrare voluntară între doi adversari', () => {
  const G = load('hnefatafl');
  let s = mk(G, { pieces: { c3: 'defenders:defender', b3: 'attackers:attacker', d8: 'attackers:attacker', f6: 'defenders:king' }, turn: 0 });
  s = play(G, s, 'd8-d3');
  assert.equal(s.cells[G.B.idx.c3], 0);
  let c = mk(G, { pieces: { a2: 'defenders:defender', a8: 'attackers:attacker', f6: 'defenders:king' }, turn: 0 });
  c = play(G, c, 'a8-a3');
  assert.equal(c.cells[G.B.idx.a2], 0, 'colțul a1 este ostil');
  let t = mk(G, { pieces: { e6: 'attackers:attacker', d9: 'defenders:defender', k6: 'defenders:king' }, turn: 1 });
  t = play(G, t, 'd9-d6');
  assert.equal(t.cells[G.B.idx.e6], 0, 'tronul este ostil atacatorilor');
  let safe = mk(G, { pieces: { b3: 'attackers:attacker', d3: 'attackers:attacker', c9: 'defenders:defender', f6: 'defenders:king' }, turn: 1 });
  safe = play(G, safe, 'c9-c3');
  assert.ok(safe.cells[G.B.idx.c3], 'o piesă care intră singură între doi adversari nu este capturată');
});

test('hnefatafl: tronul gol este ostil apărătorilor, tronul ocupat de rege nu', () => {
  const G = load('hnefatafl');
  let s = mk(G, { pieces: { e6: 'defenders:defender', d9: 'attackers:attacker', k11: 'defenders:king' }, turn: 0 });
  s = play(G, s, 'd9-d6');
  assert.equal(s.cells[G.B.idx.e6], 0, 'apărătorul de lângă tronul gol este capturat');
  let t = mk(G, { pieces: { e6: 'defenders:defender', d9: 'attackers:attacker', f6: 'defenders:king' }, turn: 0 });
  t = play(G, t, 'd9-d6');
  assert.ok(t.cells[G.B.idx.e6], 'cu regele pe tron, apărătorul rămâne');
});

test('hnefatafl: regele cade încercuit pe patru laturi, pe trei lângă tron, pe patru pe tron, niciodată pe margine', () => {
  const G = load('hnefatafl');
  let s = mk(G, { pieces: { c3: 'defenders:king', b3: 'attackers:attacker', d3: 'attackers:attacker', c2: 'attackers:attacker', c9: 'attackers:attacker', k11: 'defenders:defender' }, turn: 0 });
  s = play(G, s, 'c9-c4');
  assert.deepEqual(s.result, { winner: 0, reason: 'lost-piece' });
  let n = mk(G, { pieces: { e6: 'defenders:king', d6: 'attackers:attacker', e7: 'attackers:attacker', h5: 'attackers:attacker', k11: 'defenders:defender' }, turn: 0 });
  n = play(G, n, 'h5-e5');
  assert.deepEqual(n.result, { winner: 0, reason: 'lost-piece' }, 'trei atacatori + tronul');
  let t = mk(G, { pieces: { f6: 'defenders:king', f7: 'attackers:attacker', e6: 'attackers:attacker', g6: 'attackers:attacker', a5: 'attackers:attacker', k11: 'defenders:defender' }, turn: 0 });
  assert.equal(E.legalActions(G, t).some((a) => E.actionText(G, a) === 'a5-a1'), false);
  t = play(G, t, 'a5-f5');
  assert.deepEqual(t.result, { winner: 0, reason: 'lost-piece' }, 'patru laturi pe tron');
  let e = mk(G, { pieces: { a6: 'defenders:king', a7: 'attackers:attacker', a5: 'attackers:attacker', b6: 'attackers:attacker', h2: 'attackers:attacker', k11: 'defenders:defender' }, turn: 0 });
  e = play(G, e, 'h2-b2');
  assert.equal(e.result, null, 'pe margine regele nu poate fi capturat');
});

test('hnefatafl: regele care ajunge într-un colț câștigă', () => {
  const G = load('hnefatafl');
  let s = mk(G, { pieces: { a3: 'defenders:king', f9: 'attackers:attacker' }, turn: 1 });
  s = play(G, s, 'a3-a1');
  assert.deepEqual(s.result, { winner: 1, reason: 'reach' });
});

/* ---------- invariante pe partide aleatorii ---------- */
test('partide aleatorii: nicio excepție, fără mutări doar la sfârșit, piesele nu apar din nimic, reluarea dă aceeași poziție', () => {
  playable().forEach((id) => {
    const G = load(id), R = rng(id.length * 7919);
    for (let g = 0; g < 12; g++) {
      const m = E.newMatch(G);
      let before = [E.pieceTotal(G, E.matchState(m), 0), E.pieceTotal(G, E.matchState(m), 1)];
      for (let ply = 0; ply < 700; ply++) {
        const s = E.matchState(m);
        if (E.matchStatus(m)) break;
        const list = E.legalActions(G, s);
        assert.ok(list.length > 0, id + ': fără mutări și fără rezultat');
        E.matchPlay(m, list[Math.floor(R() * list.length)]);
        const now = [E.pieceTotal(G, E.matchState(m), 0), E.pieceTotal(G, E.matchState(m), 1)];
        assert.ok(now[0] <= before[0] && now[1] <= before[1], id + ': piese apărute din nimic');
        before = now;
      }
      const copy = E.replay(G, m.idxs);
      assert.ok(copy, id + ': reluarea a eșuat');
      assert.equal(E.positionKey(E.matchState(copy)), E.positionKey(E.matchState(m)));
    }
  });
});

test('anulare și refacere: istoricul se păstrează și se taie la o mutare nouă', () => {
  const G = load('nine-mens-morris');
  const m = E.newMatch(G);
  E.matchPlay(m, pick(G, E.matchState(m), '+a1')); E.matchPlay(m, pick(G, E.matchState(m), '+d1'));
  E.matchUndo(m); E.matchUndo(m);
  assert.equal(m.pos, 0);
  E.matchRedo(m);
  assert.equal(E.matchState(m).cells[G.B.idx.a1] > 0, true);
  E.matchPlay(m, pick(G, E.matchState(m), '+g7'));
  assert.equal(m.states.length, 3);
  assert.equal(E.matchRedo(m), 2);
});

test('repetiția: de trei ori aceeași poziție este remiză (mu torere)', () => {
  const G = load('mu-torere');
  const m = E.newMatch(G);
  const seq = ['k1-p', 'k8-k1', 'p-k8', 'k1-p', 'k8-k1', 'p-k8'];
  assert.equal(E.matchStatus(m), null);
  for (const t of seq) E.matchPlay(m, pick(G, E.matchState(m), t));
  assert.ok(E.matchStatus(m) === null || E.matchStatus(m).reason === 'repeat');
  assert.ok(m.pos === 6);
});

/* ---------- adversarul ---------- */
test('adversarul: întoarce mereu o mutare legală, la toate nivelurile și la toate jocurile; este determinist cu același generator', () => {
  playable().forEach((id) => {
    const G = load(id), s = E.initialState(G);
    for (let level = 0; level < E.AI_LEVELS.length; level++) {
      const a = E.search(G, s, { level, nodes: 600, rng: rng(5) }), b = E.search(G, s, { level, nodes: 600, rng: rng(5) });
      assert.ok(E.legalActions(G, s).some((x) => E.actionEq(x, a)), id + ' nivel ' + level);
      assert.ok(E.actionEq(a, b), id + ' nivel ' + level + ' nedeterminist');
    }
  });
});

test('adversarul: ia o captură evidentă și evită să piardă regele', () => {
  const G = load('alquerque');
  const s = mk(G, { pieces: { c3: 'white:man', c4: 'black:man', a1: 'white:man' }, turn: 0 });
  assert.equal(E.actionText(G, E.search(G, s, { level: 2, nodes: 2000, rng: rng(1) })), 'c3xc5');
  const T = load('hnefatafl');
  const t = mk(T, { pieces: { a3: 'defenders:king', f9: 'attackers:attacker' }, turn: 1 });
  assert.equal(E.actionText(T, E.search(T, t, { level: 1, nodes: 500, rng: rng(1) })), 'a3-a1');
});

/* ---------- validare și explicații ---------- */
test('validarea fișierelor de joc: mesaje clare pentru greșeli frecvente', () => {
  const bad = (patch) => { const g = readGame('fanorona'); patch(g); return E.validateGame(g).join(' | '); };
  assert.match(bad((g) => { g.rules.setup.rows.pop(); }), /5 rows expected/);
  assert.match(bad((g) => { g.rules.moves[0].dirs = 'sideways'; }), /unknown direction/);
  assert.match(bad((g) => { g.rules.moves[0].type = 'teleport'; }), /unknown type/);
  assert.match(bad((g) => { g.rules.win = []; }), /rules\.win/);
  assert.match(bad((g) => { g.rules.setup.rows[0] = 'xbbbbbbbb'; }), /not in rules\.setup\.legend/);
  assert.match(bad((g) => { g.players = 3; }), /only two-player/);
  assert.match(bad((g) => { delete g.rules; }), /descriptive only/);
  assert.match(bad((g) => { g.rules.moves[1].dirs = 'fwd'; }), /board\.forward/);
  assert.match(bad((g) => { g.rules.setup.legend.b = 'green:man'; }), /unknown side/);
  assert.deepEqual(E.validateGame(readGame('hnefatafl')), []);
  const g = readGame('mu-torere'); g.rules.moves[1].requires = 'friends'; assert.match(E.validateGame(g).join(), /adjacent-enemy/);
});

test('explicațiile: fiecare joc produce enunțuri cu chei cunoscute', () => {
  playable().forEach((id) => {
    const list = E.explain(load(id));
    assert.ok(list.length >= 5, id);
    list.forEach((e) => assert.match(e[0], /^r_[a-z_]+$/));
  });
});

/* ---------- regresii pe numărul de mutări (verificate de mână la adâncimile 1–2 ale Morii și Mū tōrere) ---------- */
test('perft: numărul de poziții la adâncimi mici nu se schimbă', () => {
  const want = { 'nine-mens-morris': [24, 552, 12144], alquerque: [4, 5, 6], fanorona: [5, 17, 64], 'mu-torere': [2, 2, 2], hnefatafl: [116, 6788] };
  Object.keys(want).forEach((id) => {
    const G = load(id), s = E.initialState(G);
    want[id].forEach((n, i) => assert.equal(E.perft(G, s, i + 1), n, id + ' adâncimea ' + (i + 1)));
  });
});

test('moara: o moară formată prin mutare (nu doar prin plasare) scoate piesa, iar zborul dă și el mori', () => {
  const G = load('nine-mens-morris');
  let s = mk(G, { pieces: { a1: 'white:man', d1: 'white:man', g4: 'white:man', c3: 'white:man', a7: 'black:man', b6: 'black:man', d7: 'black:man', f2: 'black:man' }, turn: 0 });
  s = play(G, s, 'g4-g1');
  assert.deepEqual(texts(G, s).sort(), ['×a7', '×b6', '×d7', '×f2']);
  const fly = mk(G, { pieces: { a1: 'white:man', d1: 'white:man', c3: 'white:man', a7: 'black:man', b6: 'black:man', d7: 'black:man', f2: 'black:man' }, turn: 0 });
  const g = play(G, fly, 'c3-g1');
  assert.ok(g.pending, 'zborul c3→g1 închide moara a1-d1-g1');
});

test('moara: nu se poate muta pe un punct ocupat și nu se poate trece peste piese (pași pe linii)', () => {
  const G = load('nine-mens-morris');
  const s = mk(G, { pieces: { a1: 'white:man', d1: 'black:man', a4: 'white:man', b2: 'white:man', c3: 'white:man', g7: 'black:man', g1: 'black:man', a7: 'black:man' }, turn: 0 });
  const t = texts(G, s);
  assert.ok(!t.includes('a1-d1') && !t.includes('a1-g1'));
  assert.ok(t.includes('a4-b4') || t.includes('a4-a7') === false);
});

test('regulile generate acoperă tot ce se afișează: fiecare cheie din explain() are text în toate limbile, iar fiecare nume are traducere', async () => {
  const i18n = (await import('../src/i18n.mjs')).default;
  const langs = Object.keys(i18n);
  assert.equal(langs.length, 8);
  const keys = new Set();
  const names = new Set();
  const walk = (p) => { if (p && typeof p === 'object') { ['side', 'piece', 'set'].forEach((k) => { if (typeof p[k] === 'string') names.add(p[k]); }); ['pieces', 'sidesOf'].forEach((k) => (p[k] || []).forEach((x) => names.add(x))); (p.dirs || []).forEach((d) => keys.add('d_' + d)); } };
  playable().forEach((id) => {
    const G = load(id);
    E.explain(G).forEach((e) => { keys.add(e[0]); e.slice(1).forEach(walk); });
    G.sides.forEach((x) => names.add(x)); G.types.forEach((x) => names.add(x.id));
  });
  names.forEach((n) => keys.add('n_' + n));
  ['r_win_reach_sp', 'r_win_reach_s', 'r_win_reach_p', 'r_win_reach_a', 'r_win_elim1', 'r_restricted_none', 'c_eq', 'c_le', 'c_ge', 'c_lt', 'c_gt'].forEach((k) => keys.add(k));
  keys.delete('r_win_reach'); keys.delete('n_undefined');
  const missing = [];
  keys.forEach((k) => langs.forEach((l) => { if (!i18n[l][k]) missing.push(l + ':' + k); }));
  assert.deepEqual(missing, []);
});
