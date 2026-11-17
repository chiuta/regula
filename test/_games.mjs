// Ajutoare pentru teste: încărcarea jocurilor și construirea de poziții.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const GAMES_DIR = path.join(ROOT, 'data', 'games');
export function readGame(id) { return JSON.parse(fs.readFileSync(path.join(GAMES_DIR, id + '.json'), 'utf8')); }
export function load(id, patch) {
  const g = readGame(id);
  if (patch) patch(g);
  const r = E.compile(g);
  if (r.errors.length) throw new Error(id + ': ' + r.errors.join('; '));
  return r.G;
}
export function playable() {
  return fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith('.json') && f !== 'example.json').map((f) => f.replace(/\.json$/, ''));
}
// poziție arbitrară: pieces = {punct: 'latură:piesă'}, hand = [n0, n1], turn = 0|1
export function mk(G, o) {
  const s = E.initialState(G);
  s.cells = new Array(G.B.n).fill(0);
  Object.keys(o.pieces || {}).forEach((nm) => {
    const [sd, tp] = o.pieces[nm].split(':');
    const si = G.sides.indexOf(sd), ti = G.types.findIndex((t) => t.id === tp);
    if (si < 0 || ti < 0 || !(nm in G.B.idx)) throw new Error('mk: ' + nm + ' ' + o.pieces[nm]);
    s.cells[G.B.idx[nm]] = 1 + ti * 2 + si;
  });
  s.hand = o.hand || [0, 0]; s.turn = o.turn || 0;
  s.result = null; s.ply = 0; s.quiet = 0; s.chain = null; s.pending = null; s.mover = -1; s.tcap = false;
  return s;
}
export function texts(G, s) { return E.legalActions(G, s).map((a) => E.actionText(G, a)); }
export function pick(G, s, txt) {
  const a = E.legalActions(G, s).find((x) => E.actionText(G, x) === txt);
  if (!a) throw new Error('mutare inexistentă «' + txt + '»; posibile: ' + texts(G, s).join(' '));
  return a;
}
export function play(G, s, txt) { return E.apply(G, s, pick(G, s, txt)); }
export function count(G, s, side) { let n = 0; for (let p = 0; p < G.B.n; p++) if (s.cells[p] && ((s.cells[p] - 1) & 1) === side) n++; return n; }
// generator pseudoaleator determinist (mulberry32)
export function rng(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
