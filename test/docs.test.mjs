// Documentația nu are voie să se abată de la format: fragmentele JSON din docs/ se compară cu fișierele reale,
// jocul-exemplu din tutorial se joacă, iar mesajele de eroare citate în tutorial trebuie să existe.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';
import { GAMES_DIR } from './_games.mjs';
import { mk, play, texts } from './_games.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const read = (f) => fs.readFileSync(path.join(DOCS, f), 'utf8');
const EXAMPLE = JSON.parse(read('examples/three-mens-morris.json'));
const exampleG = () => { const r = E.compile(JSON.parse(JSON.stringify(EXAMPLE))); assert.deepEqual(r.errors, []); return r.G; };

function blocks(md) {
  const out = [];
  const re = /^```json\n([\s\S]*?)\n```$/gm;
  let m;
  while ((m = re.exec(md))) out.push(JSON.parse(m[1]));
  return out;
}
function subset(a, b) {
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((x, i) => deepEq(x, b[i]));
  if (a && typeof a === 'object') return !!b && typeof b === 'object' && !Array.isArray(b) && Object.keys(a).every((k) => k in b && subset(a[k], b[k]));
  return a === b;
}
function deepEq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function anywhere(snippet, node) {
  if (subset(snippet, node)) return true;
  if (Array.isArray(node)) return node.some((x) => anywhere(snippet, x));
  if (node && typeof node === 'object') return Object.keys(node).some((k) => anywhere(snippet, node[k]));
  return false;
}
const GAME_FILES = [
  ...fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(GAMES_DIR, f), 'utf8'))),
  EXAMPLE
];
const slug = (h) => h.toLowerCase().replace(/`/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');

test('moves.md și moves.ro.md: fiecare fragment JSON există, ca atare, într-un joc real', () => {
  ['moves.md', 'moves.ro.md'].forEach((f) => {
    const bl = blocks(read(f));
    assert.ok(bl.length >= 20, f + ': prea puține fragmente');
    bl.forEach((b, i) => assert.ok(GAME_FILES.some((g) => anywhere(b, g)), f + ' fragmentul ' + (i + 1) + ' nu se găsește în niciun joc: ' + JSON.stringify(b).slice(0, 90)));
  });
});

test('versiunea engleză și cea română au aceleași fragmente JSON și aceeași structură', () => {
  [['moves.md', 'moves.ro.md'], ['tutorial.md', 'tutorial.ro.md']].forEach(([a, b]) => {
    const A = read(a), B = read(b);
    assert.deepEqual(blocks(A), blocks(B), a + ' / ' + b + ': fragmentele diferă');
    const heads = (t) => (t.match(/^## /gm) || []).length;
    assert.equal(heads(A), heads(B), a + ' / ' + b + ': numărul de secțiuni');
    const code = (t) => (t.match(/^```/gm) || []).length;
    assert.equal(code(A), code(B), a + ' / ' + b + ': blocurile de cod');
  });
});

test('tutorialul: fragmentele se adună exact în fișierul-exemplu, fără chei lipsă sau în plus', () => {
  ['tutorial.md', 'tutorial.ro.md'].forEach((f) => {
    const merged = {};
    blocks(read(f)).forEach((b) => Object.keys(b).forEach((k) => { assert.ok(!(k in merged), f + ': cheia «' + k + '» apare de două ori'); merged[k] = b[k]; }));
    assert.deepEqual(Object.keys(merged).sort(), Object.keys(EXAMPLE).sort(), f);
    Object.keys(EXAMPLE).forEach((k) => assert.deepEqual(merged[k], EXAMPLE[k], f + ': ' + k));
  });
});

test('legăturile relative din docs/ duc la fișiere și titluri care există', () => {
  ['moves.md', 'moves.ro.md', 'tutorial.md', 'tutorial.ro.md'].forEach((f) => {
    const t = read(f);
    const re = /\]\(([^)#\s]+)(?:#([^)\s]+))?\)/g;
    let m;
    while ((m = re.exec(t))) {
      if (/^https?:/.test(m[1])) continue;
      const target = path.join(DOCS, m[1]);
      assert.ok(fs.existsSync(target), f + ': ' + m[1] + ' nu există');
      if (m[2]) {
        const heads = (fs.readFileSync(target, 'utf8').match(/^#{1,3} .*$/gm) || []).map((h) => slug(h.replace(/^#+ /, '')));
        assert.ok(heads.includes(m[2]), f + ': titlul «' + m[2] + '» nu există în ' + m[1] + ' (' + heads.join(', ') + ')');
      }
    }
  });
});

test('jocul-exemplu din tutorial: număr de mutări calculat de mână (9·8·7·6), victorie la plasare și la mutare, niciun blocaj posibil', () => {
  const G = exampleG();
  const s0 = E.initialState(G);
  assert.deepEqual([1, 2, 3, 4].map((d) => E.perft(G, s0, d)), [9, 72, 504, 3024]);
  assert.equal(E.explain(G).length > 4, true);
  // plasare: albul formează diagonala a1-b2-c3 la a treia piesă
  let s = s0;
  ['+a1', '+b1', '+b2', '+c1'].forEach((t) => { s = play(G, s, t); assert.equal(s.result, null); });
  s = play(G, s, '+c3');
  assert.deepEqual([s.result.winner, s.result.reason], [0, 'line']);
  // mutare: a1, c1, b2 contra a3, c3, a2; albul mută b2→b1 și formează rândul 1
  s = s0;
  ['+a1', '+a3', '+c1', '+c3', '+b2', '+a2'].forEach((t) => { s = play(G, s, t); assert.equal(s.result, null, t); });
  assert.ok(texts(G, s).includes('b2-b1'), texts(G, s).join(' '));
  s = play(G, s, 'b2-b1');
  assert.deepEqual([s.result.winner, s.result.reason], [0, 'line']);
  // «blocked» lipsește din regulile exemplului pentru că nu poate apărea: nicio poziție 3+3 fără rând nu lasă un jucător fără mutare
  const names = Object.keys(EXAMPLE.board.points);
  const combos = (arr, k, start = 0, cur = [], out = []) => { if (cur.length === k) { out.push(cur.slice()); return out; } for (let i = start; i < arr.length; i++) { cur.push(arr[i]); combos(arr, k, i + 1, cur, out); cur.pop(); } return out; };
  const hasLine = (set) => EXAMPLE.board.lines.some((l) => l.every((p) => set.has(p)));
  let positions = 0, stuck = 0;
  combos(names, 3).forEach((w) => combos(names.filter((n) => !w.includes(n)), 3).forEach((b) => {
    positions++;
    const pieces = {};
    w.forEach((n) => { pieces[n] = 'white:man'; }); b.forEach((n) => { pieces[n] = 'black:man'; });
    [0, 1].forEach((turn) => { if (!texts(G, mk(G, { pieces, hand: [0, 0], turn })).length && !hasLine(new Set(w)) && !hasLine(new Set(b))) stuck++; });
  }));
  assert.equal(positions, 1680);
  assert.equal(stuck, 0);
});

test('mesajele de eroare citate în tutorial sunt cele pe care le dă motorul', () => {
  const cases = [
    ['board.lines[3]: unknown point "a4"', (g) => { g.board.lines[3][2] = 'a4'; }],
    ['rules.moves[0]: unknown type "dorp" (known: drop, step, slide, fly, jump, approach-withdraw, mill, custodial, king-capture)', (g) => { g.rules.moves[0].type = 'dorp'; }],
    ['rules.moves[0]: a drop rule needs rules.hand', (g) => { delete g.rules.hand; }],
    ['rules.win[0]: the board has no line of 4 points', (g) => { g.rules.win[0].len = 4; }]
  ];
  const tut = read('tutorial.md') + read('tutorial.ro.md');
  cases.forEach(([msg, patch]) => {
    assert.ok(tut.includes(msg), 'tutorialul nu citează «' + msg + '»');
    const g = JSON.parse(JSON.stringify(EXAMPLE));
    patch(g);
    assert.ok(E.compile(g).errors.includes(msg), 'motorul nu dă «' + msg + '»: ' + E.compile(g).errors.join(' | '));
  });
});

test('fiecare fragment din moves.md pentru reguli compilează în jocul căruia îi aparține (nu doar seamănă cu el)', () => {
  // fișierele reale compilează; fragmentele sunt subseturi ale lor, deci formatul documentat este cel acceptat de motor
  GAME_FILES.filter((g) => g.rules).forEach((g) => assert.deepEqual(E.compile(JSON.parse(JSON.stringify(g))).errors, [], g.id));
});
