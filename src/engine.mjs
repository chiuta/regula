// REGULA · motorul de reguli (logică pură, fără DOM). Sintaxă ES2017; documentat în docs/moves.md.
// Un joc este un fișier JSON: «board» (geometria), «pieces», iar în «rules» poziția de start, mutările și condițiile de câștig.
// compile(game) → {G, errors}; initialState(G); legalActions(G, s); apply(G, s, a); search(G, s, opt); explain(G).

const D8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]]; // E V N S NE SV NV SE
const O8 = [1, 0, 3, 2, 5, 4, 7, 6];
export const MOVE_TYPES = ['drop', 'step', 'slide', 'fly', 'jump', 'approach-withdraw', 'mill', 'custodial', 'king-capture'];
export const WIN_TYPES = ['reach', 'eliminate', 'lose-when-none', 'blocked', 'line', 'draw'];
export const DIR_TOKENS = ['all', 'orth', 'diag', 'fwd', 'side', 'back'];
export const ENGINE_VERSION = 1;

function arr(v) { return v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]; }
function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
function letter(i) { return String.fromCharCode(97 + i); }
function sideOf(c) { return (c - 1) & 1; }
function typeOf(c) { return (c - 1) >> 1; }

/* ---------------- geometria tablei ---------------- */
function buildBoard(b, sides, bad) {
  const B = { type: b.type, n: 0, names: [], idx: {}, xy: [], D: 0, ray: null, opp: null, lines: [], sets: {}, fwd: [null, null], w: 0, h: 0 };
  if (b.type === 'grid') {
    const w = b.w, h = b.h;
    if (!(Number.isInteger(w) && Number.isInteger(h) && w >= 1 && h >= 1 && w <= 26 && h <= 26)) { bad('board: a grid needs integer w and h between 1 and 26'); return null; }
    const diag = b.diagonals || 'none';
    if (['none', 'all', 'alternate'].indexOf(diag) < 0) bad('board.diagonals must be none, all or alternate');
    B.w = w; B.h = h; B.n = w * h; B.D = 8; B.opp = O8;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const nm = letter(x) + (y + 1); B.idx[nm] = B.names.length; B.names.push(nm); B.xy.push([x, y]); }
    B.ray = new Int16Array(B.n * 8).fill(-1);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = y * w + x;
      for (let d = 0; d < 8; d++) {
        if (d >= 4 && (diag === 'none' || (diag === 'alternate' && ((x + y) & 1)))) continue;
        const nx = x + D8[d][0], ny = y + D8[d][1];
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) B.ray[p * 8 + d] = ny * w + nx;
      }
    }
  } else if (b.type === 'graph') {
    const pts = b.points;
    if (!isObj(pts) || !Object.keys(pts).length) { bad('board.points: an object name -> [x, y] is required for graph boards'); return null; }
    Object.keys(pts).forEach(function (nm) {
      const c = pts[nm];
      if (!Array.isArray(c) || c.length !== 2 || typeof c[0] !== 'number' || typeof c[1] !== 'number') bad('board.points.' + nm + ': [x, y] numbers required');
      B.idx[nm] = B.names.length; B.names.push(nm); B.xy.push(Array.isArray(c) && c.length === 2 ? [Number(c[0]) || 0, Number(c[1]) || 0] : [0, 0]);
    });
    B.n = B.names.length;
    const lines = arr(b.lines).concat(arr(b.edges));
    B.D = lines.length * 2;
    B.opp = []; for (let d = 0; d < B.D; d++) B.opp.push(d ^ 1);
    B.ray = new Int16Array(Math.max(1, B.n * B.D)).fill(-1);
    lines.forEach(function (ln, li) {
      const names = arr(ln);
      const ids = names.map(function (nm) { if (!(nm in B.idx)) { bad('board.lines[' + li + ']: unknown point "' + nm + '"'); return -1; } return B.idx[nm]; });
      if (ids.length < 2 || ids.indexOf(-1) >= 0) { B.lines[li] = null; return; }
      for (let k = 0; k + 1 < ids.length; k++) { B.ray[ids[k] * B.D + 2 * li] = ids[k + 1]; B.ray[ids[k + 1] * B.D + 2 * li + 1] = ids[k]; }
      B.lines[li] = ids;
    });
  } else { bad('board.type must be "grid" or "graph"'); return null; }
  const fw = isObj(b.forward) ? b.forward : {};
  Object.keys(fw).forEach(function (sid) {
    const si = sides.indexOf(sid);
    if (si < 0) { bad('board.forward: unknown side "' + sid + '"'); return; }
    const v = fw[sid];
    if (Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number') B.fwd[si] = [v[0], v[1]]; else bad('board.forward.' + sid + ': [dx, dy] required');
  });
  const mk = function (list, where) {
    const m = new Uint8Array(B.n);
    arr(list).forEach(function (pn) { if (!(pn in B.idx)) bad(where + ': unknown point "' + pn + '"'); else m[B.idx[pn]] = 1; });
    return m;
  };
  const sets = isObj(b.sets) ? b.sets : {};
  Object.keys(sets).forEach(function (nm) {
    const v = sets[nm];
    if (Array.isArray(v)) { const m = mk(v, 'board.sets.' + nm); B.sets[nm] = [m, m]; }
    else if (isObj(v)) B.sets[nm] = [mk(v[sides[0]], 'board.sets.' + nm + '.' + sides[0]), mk(v[sides[1]], 'board.sets.' + nm + '.' + sides[1])];
    else bad('board.sets.' + nm + ': a list of points, or an object side -> list');
  });
  if (b.type === 'grid') {
    const builtin = function (nm, fn) {
      if (B.sets[nm]) return;
      const m = new Uint8Array(B.n);
      for (let p = 0; p < B.n; p++) if (fn(B.xy[p][0], B.xy[p][1])) m[p] = 1;
      B.sets[nm] = [m, m];
    };
    builtin('edge', function (x, y) { return x === 0 || y === 0 || x === B.w - 1 || y === B.h - 1; });
    builtin('corners', function (x, y) { return (x === 0 || x === B.w - 1) && (y === 0 || y === B.h - 1); });
    builtin('center', function (x, y) { return Math.abs(2 * x - (B.w - 1)) <= 1 && Math.abs(2 * y - (B.h - 1)) <= 1; });
  }
  return B;
}

/* ---------------- compilarea unui joc ---------------- */
export function compile(game) {
  const errors = [];
  const bad = function (m) { errors.push(m); };
  const R = game && game.rules;
  if (!isObj(R)) return { G: null, errors: ['rules: missing — this entry is descriptive only and cannot be played'] };
  const sides = arr(R.sides).map(String);
  if (sides.length !== 2 || sides[0] === sides[1]) bad('rules.sides: two different side ids are required');
  if (game.players !== undefined && game.players !== 2) bad('players: only two-player games can be played');
  const sideIx = function (id, where) { const i = sides.indexOf(String(id)); if (i < 0) bad(where + ': unknown side "' + id + '"'); return i; };
  if (!isObj(game.board)) return { G: null, errors: errors.concat(['board: an object is required']) };
  const B = buildBoard(game.board, sides, bad);
  if (!B) return { G: null, errors: errors };

  const types = arr(game.pieces).map(function (p, i) {
    return { i: i, id: String(p.id), side: p.side === undefined ? -1 : sideIx(p.side, 'pieces.' + p.id + '.side'), value: typeof p.value === 'number' ? p.value : 1, glyph: p.glyph ? String(p.glyph) : '' };
  });
  if (!types.length) bad('pieces: at least one piece type is required');
  const tix = {};
  types.forEach(function (t) { tix[t.id] = t.i; });
  const typeIdx = function (id, where) { if (!(String(id) in tix)) { bad(where + ': unknown piece "' + id + '"'); return -1; } return tix[String(id)]; };
  const typeSet = function (v, where) {
    if (v === undefined) return null;
    const s = new Set();
    arr(v).forEach(function (id) { const t = typeIdx(id, where); if (t >= 0) s.add(t); });
    return s;
  };
  const setMasks = function (nm, where) {
    if (!B.sets[nm]) { bad(where + ': unknown set "' + nm + '"'); return [new Uint8Array(B.n), new Uint8Array(B.n)]; }
    return B.sets[nm];
  };
  const CMP = /^(==|<=|>=|<|>)\s*(\d+)$/;
  const parseCmp = function (v, where) {
    const m = CMP.exec(String(v));
    if (!m) { bad(where + ': expected a comparison such as "==3" or "<=2"'); return null; }
    return { op: m[1], v: Number(m[2]) };
  };
  const dirOK = function (spec, where) {
    const toks = spec === undefined ? ['all'] : arr(spec).map(String);
    toks.forEach(function (t) { if (DIR_TOKENS.indexOf(t) < 0) bad(where + ': unknown direction "' + t + '"'); });
    const needF = toks.some(function (t) { return t === 'fwd' || t === 'side' || t === 'back'; });
    const ok = [new Uint8Array(B.n * B.D), new Uint8Array(B.n * B.D)];
    for (let si = 0; si < 2; si++) {
      const f = B.fwd[si];
      if (needF && !f) { bad(where + ': "fwd", "side" and "back" need board.forward for side ' + sides[si]); continue; }
      for (let p = 0; p < B.n; p++) for (let d = 0; d < B.D; d++) {
        const q = B.ray[p * B.D + d];
        if (q < 0) continue;
        const dx = B.xy[q][0] - B.xy[p][0], dy = B.xy[q][1] - B.xy[p][1];
        const dot = f ? dx * f[0] + dy * f[1] : 0;
        let v = false;
        for (let k = 0; k < toks.length; k++) {
          const t = toks[k];
          if (t === 'all') v = true;
          else if (t === 'orth') v = v || dx === 0 || dy === 0;
          else if (t === 'diag') v = v || (dx !== 0 && dy !== 0);
          else if (t === 'fwd') v = v || dot > 0;
          else if (t === 'side') v = v || dot === 0;
          else if (t === 'back') v = v || dot < 0;
        }
        if (v) ok[si][p * B.D + d] = 1;
      }
    }
    return ok;
  };

  // poziția de start
  const cells = new Array(B.n).fill(0);
  const su = isObj(R.setup) ? R.setup : null;
  if (!su) bad('rules.setup: an object with "rows" or "points" is required');
  const put = function (p, spec, where) {
    const m = /^([^:]+):(.+)$/.exec(String(spec));
    if (!m) { bad(where + ': expected "side:piece", got "' + spec + '"'); return; }
    const si = sides.indexOf(m[1]), ti = m[2] in tix ? tix[m[2]] : -1;
    if (si < 0) { bad(where + ': unknown side "' + m[1] + '"'); return; }
    if (ti < 0) { bad(where + ': unknown piece "' + m[2] + '"'); return; }
    if (types[ti].side >= 0 && types[ti].side !== si) { bad(where + ': piece "' + m[2] + '" does not belong to side "' + m[1] + '"'); return; }
    cells[p] = 1 + ti * 2 + si;
  };
  if (su && su.rows !== undefined) {
    const rows = arr(su.rows), legend = isObj(su.legend) ? su.legend : {};
    if (B.type !== 'grid') bad('rules.setup.rows: only grid boards can use rows');
    else if (rows.length !== B.h) bad('rules.setup.rows: ' + B.h + ' rows expected, got ' + rows.length);
    else rows.forEach(function (row, r) {
      const s = String(row);
      if (s.length !== B.w) { bad('rules.setup.rows[' + r + ']: ' + B.w + ' characters expected, got ' + s.length); return; }
      for (let x = 0; x < B.w; x++) {
        const ch = s.charAt(x);
        if (ch === '.') continue;
        if (!(ch in legend)) { bad('rules.setup.rows[' + r + ']: symbol "' + ch + '" is not in rules.setup.legend'); continue; }
        if (legend[ch] === null) continue;
        put((B.h - 1 - r) * B.w + x, legend[ch], 'rules.setup.rows[' + r + '][' + x + ']');
      }
    });
  }
  if (su && su.points !== undefined) {
    if (!isObj(su.points)) bad('rules.setup.points: an object point -> "side:piece" is required');
    else Object.keys(su.points).forEach(function (nm) {
      if (!(nm in B.idx)) bad('rules.setup.points: unknown point "' + nm + '"'); else put(B.idx[nm], su.points[nm], 'rules.setup.points.' + nm);
    });
  }
  if (su && su.rows === undefined && su.points === undefined) bad('rules.setup: "rows" or "points" is required');
  const hand = [0, 0];
  if (R.hand !== undefined) {
    if (!isObj(R.hand)) bad('rules.hand: an object side -> number is required');
    else Object.keys(R.hand).forEach(function (sid) {
      const si = sideIx(sid, 'rules.hand'), v = R.hand[sid];
      if (si >= 0) { if (!Number.isInteger(v) || v < 0) bad('rules.hand.' + sid + ': a non-negative integer is required'); else hand[si] = v; }
    });
  }
  const first = R.first === undefined ? 0 : sideIx(R.first, 'rules.first');

  // regulile de mutare
  const moves = [];
  const restricted = [];
  const millAt = [];
  if (!Array.isArray(R.moves) || !R.moves.length) bad('rules.moves: a non-empty array of move rules is required');
  arr(R.moves).forEach(function (m, i) {
    const where = 'rules.moves[' + i + ']';
    if (!isObj(m)) { bad(where + ': an object is required'); return; }
    if (MOVE_TYPES.indexOf(m.type) < 0) { bad(where + ': unknown type "' + m.type + '" (known: ' + MOVE_TYPES.join(', ') + ')'); return; }
    const r = { i: i, type: m.type, sides: null, pieces: null, when: null, from: null, fromNot: null, to: null, toNot: null, requires: null, chain: 'none', max: Infinity };
    if (m.sides !== undefined) { r.sides = new Set(); arr(m.sides).forEach(function (id) { const si = sideIx(id, where + '.sides'); if (si >= 0) r.sides.add(si); }); }
    r.pieces = typeSet(m.pieces !== undefined ? m.pieces : m.piece, where + '.pieces');
    if (m.when !== undefined) {
      if (!isObj(m.when)) bad(where + '.when: an object is required');
      else {
        r.when = {};
        if (m.when.hand !== undefined) { if (m.when.hand === 'some' || m.when.hand === 'none') r.when.hand = m.when.hand; else bad(where + '.when.hand: "some" or "none"'); }
        if (m.when.pieces !== undefined) r.when.pieces = parseCmp(m.when.pieces, where + '.when.pieces');
      }
    }
    ['from', 'fromNot', 'to', 'toNot'].forEach(function (k) { if (m[k] !== undefined && !(k === 'to' && m[k] === 'empty')) r[k] = setMasks(String(m[k]), where + '.' + k); });
    if (m.requires !== undefined) { if (m.requires === 'adjacent-enemy') r.requires = m.requires; else bad(where + '.requires: only "adjacent-enemy" is known'); }
    if (m.chain !== undefined) { if (['none', 'optional', 'forced'].indexOf(m.chain) >= 0) r.chain = m.chain; else bad(where + '.chain: none, optional or forced'); }
    if (m.max !== undefined) { if (Number.isInteger(m.max) && m.max >= 1) r.max = m.max; else bad(where + '.max: an integer >= 1'); }
    const t = m.type;
    if (t === 'drop') {
      r.drop = [-1, -1];
      for (let si = 0; si < 2; si++) {
        if (m.piece !== undefined) { const ti = typeIdx(m.piece, where + '.piece'); r.drop[si] = ti; }
        else { const f = types.filter(function (x) { return x.side < 0 || x.side === si; })[0]; r.drop[si] = f ? f.i : -1; }
      }
      if (!hand[0] && !hand[1]) bad(where + ': a drop rule needs rules.hand');
    } else if (t === 'step' || t === 'slide') {
      r.dirs = dirOK(m.dirs, where + '.dirs');
      if (t === 'step') r.max = 1;
    } else if (t === 'jump') {
      r.dirs = dirOK(m.dirs, where + '.dirs');
      r.immune = typeSet(m.immune, where + '.immune');
    } else if (t === 'approach-withdraw') {
      r.dirs = dirOK(m.dirs, where + '.dirs');
      r.noRevisit = m.noRevisit !== false; r.noSameDir = m.noSameDir !== false;
    } else if (t === 'mill') {
      r.len = Number.isInteger(m.len) && m.len >= 3 ? m.len : 3;
      r.protect = m.protect === 'none' ? 'none' : 'mill';
      const at = new Array(B.n);
      for (let p = 0; p < B.n; p++) at[p] = [];
      B.lines.forEach(function (ln) { if (ln && ln.length === r.len) ln.forEach(function (p) { at[p].push(ln); }); });
      millAt[i] = at;
      if (!B.lines.some(function (ln) { return ln && ln.length === r.len; })) bad(where + ': the board has no line of ' + r.len + ' points');
    } else if (t === 'custodial') {
      r.dirs = dirOK(m.dirs === undefined ? 'orth' : m.dirs, where + '.dirs');
      r.immune = typeSet(m.immune, where + '.immune');
      r.anvil = typeSet(m.anvil, where + '.anvil');
      r.hostile = arr(m.hostile).map(function (h, k) {
        if (!isObj(h) || typeof h.set !== 'string') { bad(where + '.hostile[' + k + ']: {"set": name} required'); return { mask: [new Uint8Array(B.n)], to: -1, onlyEmpty: false }; }
        return { mask: setMasks(h.set, where + '.hostile[' + k + ']'), to: h.to === undefined ? -1 : sideIx(h.to, where + '.hostile[' + k + '].to'), onlyEmpty: h.onlyEmpty === true };
      });
    } else if (t === 'king-capture') {
      r.dirs = dirOK('orth', where);
      r.piece = typeIdx(m.piece, where + '.piece');
      r.throne = m.throne !== undefined ? setMasks(String(m.throne), where + '.throne') : null;
      r.edgeSafe = m.edgeSafe !== false;
    }
    moves.push(r);
  });
  arr(R.restricted).forEach(function (x, i) {
    const where = 'rules.restricted[' + i + ']';
    if (!isObj(x) || typeof x.set !== 'string') { bad(where + ': {"set": name, "allow": [pieces]} required'); return; }
    restricted.push({ mask: setMasks(x.set, where)[0], allow: typeSet(x.allow, where + '.allow') || new Set(), through: x.through === true });
  });

  // condițiile de câștig
  const win = [];
  if (!Array.isArray(R.win) || !R.win.length) bad('rules.win: a non-empty array of win rules is required');
  arr(R.win).forEach(function (w, i) {
    const where = 'rules.win[' + i + ']';
    if (!isObj(w)) { bad(where + ': an object is required'); return; }
    if (WIN_TYPES.indexOf(w.type) < 0) { bad(where + ': unknown type "' + w.type + '" (known: ' + WIN_TYPES.join(', ') + ')'); return; }
    const x = { type: w.type };
    if (w.type === 'reach') {
      x.set = setMasks(String(w.set), where + '.set'); x.piece = w.piece === undefined ? -1 : typeIdx(w.piece, where + '.piece'); x.side = w.side === undefined ? -1 : sideIx(w.side, where + '.side');
      x.setName = String(w.set);
    } else if (w.type === 'eliminate') { x.below = Number.isInteger(w.below) && w.below >= 1 ? w.below : 1; }
    else if (w.type === 'lose-when-none') { x.piece = typeIdx(w.piece, where + '.piece'); }
    else if (w.type === 'blocked') { x.draw = w.result === 'draw'; }
    else if (w.type === 'line') { x.len = Number.isInteger(w.len) && w.len >= 2 ? w.len : 3; if (!B.lines.some(function (ln) { return ln && ln.length >= x.len; })) bad(where + ': the board has no line of ' + x.len + ' points'); }
    else if (w.type === 'draw') {
      if (w.noCaptureTurns === undefined && w.repeat === undefined) bad(where + ': "noCaptureTurns" or "repeat" is required');
      if (w.noCaptureTurns !== undefined) { if (Number.isInteger(w.noCaptureTurns) && w.noCaptureTurns >= 1) x.noCaptureTurns = w.noCaptureTurns; else bad(where + '.noCaptureTurns: an integer >= 1'); }
      if (w.repeat !== undefined) { if (Number.isInteger(w.repeat) && w.repeat >= 2) x.repeat = w.repeat; else bad(where + '.repeat: an integer >= 2'); }
    }
    win.push(x);
  });
  if (!errors.length && !legalAtStart()) bad('the starting position has no legal move for the first player (check rules.moves and rules.setup)');
  if (errors.length) return { G: null, errors: errors };
  const G = {
    game: game, id: String(game.id || ''), sides: sides, B: B, types: types, moves: moves, win: win, restricted: restricted, millAt: millAt,
    mandatory: R.mandatoryCapture === true, first: first, init: { cells: cells, hand: hand }
  };
  return { G: G, errors: [] };

  function legalAtStart() {
    // verificare pe o copie provizorie: dacă blocarea e o regulă de câștig, un start blocat e permis doar dacă există și alte mutări
    const tmp = { B: B, types: types, moves: moves, win: [], restricted: restricted, millAt: millAt, mandatory: R.mandatoryCapture === true, first: first, init: { cells: cells, hand: hand }, sides: sides };
    const s = { cells: cells.slice(), hand: hand.slice(), turn: first, ply: 0, chain: null, pending: null, quiet: 0, tcap: false, mover: -1, result: null };
    return legalActions(tmp, s).length > 0;
  }
}

/* ---------------- starea ---------------- */
export function initialState(G) {
  const s = { cells: G.init.cells.slice(), hand: G.init.hand.slice(), turn: G.first, ply: 0, chain: null, pending: null, quiet: 0, tcap: false, mover: -1, result: null };
  s.result = terminal(G, s);
  return s;
}
export function pieceTotal(G, s, side) {
  let n = s.hand[side];
  for (let p = 0; p < G.B.n; p++) { const c = s.cells[p]; if (c && sideOf(c) === side) n++; }
  return n;
}
export function cellInfo(G, s, p) {
  const c = s.cells[p];
  return c ? { side: sideOf(c), type: typeOf(c), id: G.types[typeOf(c)].id } : null;
}
export function positionKey(s) { return s.turn + '|' + s.hand.join(',') + '|' + s.cells.join(''); }

function cmpOK(n, c) {
  if (c.op === '==') return n === c.v;
  if (c.op === '<=') return n <= c.v;
  if (c.op === '>=') return n >= c.v;
  if (c.op === '<') return n < c.v;
  return n > c.v;
}
function active(G, s, r, side) {
  if (r.sides && !r.sides.has(side)) return false;
  const w = r.when;
  if (!w) return true;
  if (w.hand === 'some' && !(s.hand[side] > 0)) return false;
  if (w.hand === 'none' && s.hand[side] > 0) return false;
  if (w.pieces && !cmpOK(pieceTotal(G, s, side), w.pieces)) return false;
  return true;
}
// 0 = liber; 1 = se poate doar trece prin el; 2 = blocat pentru piesa de tipul t
function restr(G, p, t) {
  let st = 0;
  for (let i = 0; i < G.restricted.length; i++) {
    const x = G.restricted[i];
    if (!x.mask[p] || x.allow.has(t)) continue;
    if (x.through) st = Math.max(st, 1); else return 2;
  }
  return st;
}
function destOK(r, side, q) {
  if (r.to && !r.to[side][q]) return false;
  if (r.toNot && r.toNot[side][q]) return false;
  return true;
}
function srcOK(G, s, r, side, p, c) {
  if (r.pieces && !r.pieces.has(typeOf(c))) return false;
  if (r.from && !r.from[side][p]) return false;
  if (r.fromNot && r.fromNot[side][p]) return false;
  if (r.requires === 'adjacent-enemy') {
    const B = G.B;
    let found = false;
    for (let d = 0; d < B.D && !found; d++) { const q = B.ray[p * B.D + d]; if (q >= 0 && s.cells[q] && sideOf(s.cells[q]) !== side) found = true; }
    if (!found) return false;
  }
  return true;
}

/* ---------------- generarea mutărilor ---------------- */
function genDrop(G, s, r, out) {
  const side = s.turn;
  if (!(s.hand[side] > 0)) return;
  const t = r.drop[side];
  if (t < 0) return;
  for (let q = 0; q < G.B.n; q++) {
    if (s.cells[q] !== 0 || !destOK(r, side, q) || restr(G, q, t) !== 0) continue;
    out.push({ k: 'drop', to: q, t: t });
  }
}
function genSlide(G, s, r, out) {
  const B = G.B, side = s.turn, D = B.D, ok = r.dirs[side];
  for (let p = 0; p < B.n; p++) {
    const c = s.cells[p];
    if (!c || sideOf(c) !== side || !srcOK(G, s, r, side, p, c)) continue;
    const t = typeOf(c);
    for (let d = 0; d < D; d++) {
      if (!ok[p * D + d]) continue;
      let q = B.ray[p * D + d], steps = 1;
      while (q >= 0 && steps <= r.max) {
        if (s.cells[q] !== 0) break;
        const rs = restr(G, q, t);
        if (rs === 0 && destOK(r, side, q)) out.push({ k: 'move', from: p, to: q });
        if (rs === 2) break;
        q = B.ray[q * D + d]; steps++;
      }
    }
  }
}
function genFly(G, s, r, out) {
  const B = G.B, side = s.turn;
  for (let p = 0; p < B.n; p++) {
    const c = s.cells[p];
    if (!c || sideOf(c) !== side || !srcOK(G, s, r, side, p, c)) continue;
    const t = typeOf(c);
    for (let q = 0; q < B.n; q++) if (s.cells[q] === 0 && destOK(r, side, q) && restr(G, q, t) === 0) out.push({ k: 'move', from: p, to: q });
  }
}
function genJump(G, s, r, out, only, ri) {
  const B = G.B, side = s.turn, D = B.D, ok = r.dirs[side];
  for (let p = only >= 0 ? only : 0; p < (only >= 0 ? only + 1 : B.n); p++) {
    const c = s.cells[p];
    if (!c || sideOf(c) !== side || !srcOK(G, s, r, side, p, c)) continue;
    const t = typeOf(c);
    for (let d = 0; d < D; d++) {
      if (!ok[p * D + d]) continue;
      const a = B.ray[p * D + d];
      if (a < 0 || !s.cells[a] || sideOf(s.cells[a]) === side) continue;
      if (r.immune && r.immune.has(typeOf(s.cells[a]))) continue;
      const b = B.ray[a * D + d];
      if (b < 0 || s.cells[b] !== 0 || restr(G, b, t) !== 0 || !destOK(r, side, b)) continue;
      out.push({ k: 'jump', from: p, over: a, to: b, ri: ri, cap: true });
    }
  }
}
function lineTaken(G, s, side, start, d) {
  const B = G.B, taken = [];
  let x = start;
  while (x >= 0 && s.cells[x] && sideOf(s.cells[x]) !== side) { taken.push(x); x = B.ray[x * B.D + d]; }
  return taken;
}
function genFano(G, s, r, out, only, ch, ri) {
  const B = G.B, side = s.turn, D = B.D, ok = r.dirs[side];
  for (let p = only >= 0 ? only : 0; p < (only >= 0 ? only + 1 : B.n); p++) {
    const c = s.cells[p];
    if (!c || sideOf(c) !== side || !srcOK(G, s, r, side, p, c)) continue;
    const t = typeOf(c);
    for (let d = 0; d < D; d++) {
      if (!ok[p * D + d]) continue;
      if (ch && r.noSameDir && d === ch.last) continue;
      const q = B.ray[p * D + d];
      if (q < 0 || s.cells[q] !== 0 || restr(G, q, t) !== 0 || !destOK(r, side, q)) continue;
      if (ch && r.noRevisit && ch.visited.indexOf(q) >= 0) continue;
      const ap = B.ray[q * D + d];
      if (ap >= 0 && s.cells[ap] && sideOf(s.cells[ap]) !== side) out.push({ k: 'fano', from: p, to: q, d: d, kind: 'A', taken: lineTaken(G, s, side, ap, d), ri: ri, cap: true });
      const bk = B.ray[p * D + B.opp[d]];
      if (bk >= 0 && s.cells[bk] && sideOf(s.cells[bk]) !== side) out.push({ k: 'fano', from: p, to: q, d: d, kind: 'W', taken: lineTaken(G, s, side, bk, B.opp[d]), ri: ri, cap: true });
    }
  }
}
function continuations(G, s, ch) {
  const r = G.moves[ch.ri], out = [];
  if (r.type === 'jump') genJump(G, s, r, out, ch.at, ch.ri); else genFano(G, s, r, out, ch.at, ch, ch.ri);
  return out;
}
function dedupe(list) {
  const seen = {}, out = [];
  list.forEach(function (a) {
    const k = a.k + ':' + (a.from === undefined ? '' : a.from) + ':' + (a.to === undefined ? '' : a.to) + ':' + (a.kind || '') + ':' + (a.over === undefined ? '' : a.over) + ':' + (a.t === undefined ? '' : a.t) + ':' + (a.at === undefined ? '' : a.at);
    if (!seen[k]) { seen[k] = 1; out.push(a); }
  });
  return out;
}

export function legalActions(G, s) {
  if (s.result) return [];
  if (s.pending) return s.pending.pts.map(function (p) { return { k: 'remove', at: p }; });
  if (s.chain) {
    const out = continuations(G, s, s.chain);
    if (G.moves[s.chain.ri].chain === 'optional') out.push({ k: 'stop' });
    return out;
  }
  const out = [], side = s.turn;
  for (let i = 0; i < G.moves.length; i++) {
    const r = G.moves[i];
    if (!active(G, s, r, side)) continue;
    if (r.type === 'drop') genDrop(G, s, r, out);
    else if (r.type === 'step' || r.type === 'slide') genSlide(G, s, r, out);
    else if (r.type === 'fly') genFly(G, s, r, out);
    else if (r.type === 'jump') genJump(G, s, r, out, -1, i);
    else if (r.type === 'approach-withdraw') genFano(G, s, r, out, -1, null, i);
  }
  let res = out;
  if (G.mandatory) { const caps = out.filter(function (a) { return a.cap; }); if (caps.length) res = caps; }
  return dedupe(res);
}

/* ---------------- efecte: capturi prin încadrare, regele, mori ---------------- */
function doCustodial(G, s, r, side, to) {
  const B = G.B, D = B.D;
  if (r.pieces && !r.pieces.has(typeOf(s.cells[to]))) return 0;
  const caught = [];
  for (let d = 0; d < D; d++) {
    if (!r.dirs[side][to * D + d]) continue;
    const a = B.ray[to * D + d];
    if (a < 0) continue;
    const c = s.cells[a];
    if (!c || sideOf(c) === side || (r.immune && r.immune.has(typeOf(c)))) continue;
    const b = B.ray[a * D + d];
    if (b < 0) continue;
    const cb = s.cells[b];
    let hit = !!cb && sideOf(cb) === side && (!r.anvil || r.anvil.has(typeOf(cb)));
    if (!hit) {
      for (let i = 0; i < r.hostile.length && !hit; i++) {
        const h = r.hostile[i];
        if (h.mask[0][b] && (h.to < 0 || h.to === sideOf(c)) && (!h.onlyEmpty || cb === 0)) hit = true;
      }
    }
    if (hit) caught.push(a);
  }
  caught.forEach(function (a) { s.cells[a] = 0; });
  return caught.length;
}
function doKing(G, s, r, side, to) {
  const B = G.B, D = B.D;
  let n = 0;
  for (let d = 0; d < D; d++) {
    if (!r.dirs[0][to * D + d]) continue;
    const a = B.ray[to * D + d];
    if (a < 0) continue;
    const c = s.cells[a];
    if (!c || sideOf(c) === side || typeOf(c) !== r.piece) continue;
    const onThrone = !!(r.throne && r.throne[0][a]);
    let ok = true;
    for (let e = 0; e < D && ok; e++) {
      if (!r.dirs[0][a * D + e]) continue;
      const nb = B.ray[a * D + e];
      if (nb < 0) { if (r.edgeSafe) ok = false; continue; }
      const cn = s.cells[nb];
      const own = !!cn && sideOf(cn) === side;
      const throneHostile = !!(r.throne && r.throne[0][nb] && !onThrone && cn === 0);
      if (!(own || throneHostile)) ok = false;
    }
    if (ok) { s.cells[a] = 0; n++; }
  }
  return n;
}
function millFormed(G, r, s, side, p) {
  const lines = G.millAt[r.i][p];
  for (let i = 0; i < lines.length; i++) {
    let all = true;
    for (let k = 0; k < lines[i].length && all; k++) { const c = s.cells[lines[i][k]]; if (!c || sideOf(c) !== side) all = false; }
    if (all) return true;
  }
  return false;
}
function inMill(G, r, s, side, p) {
  const lines = G.millAt[r.i][p];
  for (let i = 0; i < lines.length; i++) {
    let all = true;
    for (let k = 0; k < lines[i].length && all; k++) { const c = s.cells[lines[i][k]]; if (!c || sideOf(c) !== side) all = false; }
    if (all) return true;
  }
  return false;
}
function millRemovable(G, r, s, side) {
  const all = [], free = [];
  for (let p = 0; p < G.B.n; p++) {
    const c = s.cells[p];
    if (!c || sideOf(c) === side) continue;
    all.push(p);
    if (!inMill(G, r, s, sideOf(c), p)) free.push(p);
  }
  return r.protect === 'mill' && free.length ? free : all;
}
function placeEffects(G, ns, side, to) {
  let removed = 0, mill = null;
  for (let i = 0; i < G.moves.length; i++) {
    const r = G.moves[i];
    if (r.sides && !r.sides.has(side)) continue;
    if (r.type === 'custodial') removed += doCustodial(G, ns, r, side, to);
    else if (r.type === 'king-capture') removed += doKing(G, ns, r, side, to);
    else if (r.type === 'mill') mill = r;
  }
  let pending = null;
  if (mill && millFormed(G, mill, ns, side, to)) { const pts = millRemovable(G, mill, ns, side); if (pts.length) pending = { pts: pts }; }
  return { removed: removed, pending: pending };
}

/* ---------------- sfârșitul jocului ---------------- */
function terminal(G, s) {
  const B = G.B;
  const count = function (side, t) { let n = 0; for (let p = 0; p < B.n; p++) { const c = s.cells[p]; if (c && sideOf(c) === side && (t === undefined || typeOf(c) === t)) n++; } return n; };
  for (let i = 0; i < G.win.length; i++) {
    const w = G.win[i];
    if (w.type === 'reach') {
      for (let side = 0; side < 2; side++) {
        if (w.side >= 0 && w.side !== side) continue;
        const m = w.set[side];
        for (let p = 0; p < B.n; p++) if (m[p]) { const c = s.cells[p]; if (c && sideOf(c) === side && (w.piece < 0 || typeOf(c) === w.piece)) return { winner: side, reason: 'reach' }; }
      }
    } else if (w.type === 'line' && s.mover >= 0) {
      for (let li = 0; li < B.lines.length; li++) {
        const ln = B.lines[li];
        if (!ln || ln.length < w.len) continue;
        for (let st = 0; st + w.len <= ln.length; st++) {
          let all = true;
          for (let k = 0; k < w.len && all; k++) { const c = s.cells[ln[st + k]]; if (!c || sideOf(c) !== s.mover) all = false; }
          if (all) return { winner: s.mover, reason: 'line' };
        }
      }
    } else if (w.type === 'eliminate') {
      for (let side = 0; side < 2; side++) if (pieceTotal(G, s, side) < w.below) return { winner: 1 - side, reason: 'eliminate' };
    } else if (w.type === 'lose-when-none') {
      for (let side = 0; side < 2; side++) {
        const tp = G.types[w.piece];
        if ((tp.side < 0 || tp.side === side) && count(side, w.piece) === 0) return { winner: 1 - side, reason: 'lost-piece' };
      }
    }
  }
  for (let i = 0; i < G.win.length; i++) {
    const w = G.win[i];
    if (w.type === 'draw' && w.noCaptureTurns && s.quiet >= w.noCaptureTurns) return { winner: -1, reason: 'quiet' };
  }
  for (let i = 0; i < G.win.length; i++) {
    const w = G.win[i];
    if (w.type === 'blocked' && !legalActions(G, s).length) return w.draw ? { winner: -1, reason: 'blocked' } : { winner: 1 - s.turn, reason: 'blocked' };
  }
  return null;
}
function endTurn(G, ns, side) {
  ns.quiet = ns.tcap ? 0 : ns.quiet + 1;
  ns.tcap = false; ns.mover = side; ns.turn = 1 - side; ns.ply++; ns.chain = null; ns.pending = null;
  ns.result = terminal(G, ns);
}

export function checkResult(G, s) { return terminal(G, s); }

export function apply(G, s, a) {
  const side = s.turn;
  const ns = { cells: s.cells.slice(), hand: s.hand.slice(), turn: side, ply: s.ply, chain: null, pending: null, quiet: s.quiet, tcap: s.tcap, mover: s.mover, result: null };
  let captured = 0, keep = false;
  if (a.k === 'drop') {
    ns.cells[a.to] = 1 + a.t * 2 + side; ns.hand[side]--;
    const e = placeEffects(G, ns, side, a.to);
    captured = e.removed;
    if (e.pending) { ns.pending = e.pending; keep = true; }
  } else if (a.k === 'move') {
    ns.cells[a.to] = ns.cells[a.from]; ns.cells[a.from] = 0;
    const e = placeEffects(G, ns, side, a.to);
    captured = e.removed;
    if (e.pending) { ns.pending = e.pending; keep = true; }
  } else if (a.k === 'jump' || a.k === 'fano') {
    ns.cells[a.to] = ns.cells[a.from]; ns.cells[a.from] = 0;
    if (a.k === 'jump') { ns.cells[a.over] = 0; captured = 1; } else { a.taken.forEach(function (p) { ns.cells[p] = 0; }); captured = a.taken.length; }
    if (G.moves[a.ri].chain !== 'none') {
      const ch = { ri: a.ri, at: a.to, visited: (s.chain ? s.chain.visited : [a.from]).concat([a.to]), last: a.k === 'fano' ? a.d : -1 };
      if (continuations(G, ns, ch).length) { ns.chain = ch; keep = true; }
    }
  } else if (a.k === 'remove') { ns.cells[a.at] = 0; captured = 1; }
  if (captured) ns.tcap = true;
  if (!keep) endTurn(G, ns, side);
  return ns;
}

/* ---------------- partida (istoric, anulare, repetiții) ---------------- */
export function newMatch(G) { return { G: G, states: [initialState(G)], idxs: [], pos: 0 }; }
export function matchState(m) { return m.states[m.pos]; }
export function matchPlay(m, a) {
  const s = m.states[m.pos], list = legalActions(m.G, s);
  const i = list.findIndex(function (x) { return actionEq(x, a); });
  if (i < 0) return false;
  m.states.length = m.pos + 1; m.idxs.length = m.pos;
  m.states.push(apply(m.G, s, list[i])); m.idxs.push(i); m.pos++;
  return true;
}
export function matchUndo(m) { if (m.pos > 0) m.pos--; return m.pos; }
export function matchRedo(m) { if (m.pos < m.states.length - 1) m.pos++; return m.pos; }
export function matchStatus(m) {
  const s = m.states[m.pos];
  if (s.result) return s.result;
  const reps = m.G.win.filter(function (w) { return w.type === 'draw' && w.repeat; }).map(function (w) { return w.repeat; });
  if (reps.length && !s.chain && !s.pending) {
    const need = Math.min.apply(null, reps), key = positionKey(s);
    let n = 0;
    for (let i = 0; i <= m.pos; i++) { const x = m.states[i]; if (!x.chain && !x.pending && positionKey(x) === key) n++; }
    if (n >= need) return { winner: -1, reason: 'repeat' };
  }
  return null;
}
export function replay(G, idxs) {
  const m = newMatch(G);
  for (let i = 0; i < idxs.length; i++) {
    const list = legalActions(G, matchState(m));
    if (!Number.isInteger(idxs[i]) || idxs[i] < 0 || idxs[i] >= list.length) return null;
    m.states.push(apply(G, matchState(m), list[idxs[i]])); m.idxs.push(idxs[i]); m.pos++;
  }
  return m;
}
export function actionEq(a, b) {
  return a.k === b.k && a.from === b.from && a.to === b.to && a.over === b.over && a.at === b.at && a.t === b.t && a.kind === b.kind && a.d === b.d;
}
export function actionText(G, a) {
  const nm = function (p) { return G.B.names[p]; };
  if (a.k === 'drop') return '+' + nm(a.to);
  if (a.k === 'move') return nm(a.from) + '-' + nm(a.to);
  if (a.k === 'jump') return nm(a.from) + 'x' + nm(a.to);
  if (a.k === 'fano') return nm(a.from) + '-' + nm(a.to) + (a.kind === 'A' ? '+' : '~') + a.taken.length;
  if (a.k === 'remove') return '×' + nm(a.at);
  return '·';
}

/* ---------------- adversarul ---------------- */
export const AI_LEVELS = [{ id: 'random', depth: 0, nodes: 0 }, { id: 'easy', depth: 2, nodes: 4000 }, { id: 'medium', depth: 5, nodes: 40000 }];
function evalState(G, s, root, goal) {
  if (s.result) return s.result.winner === root ? 100000 - s.ply : s.result.winner < 0 ? 0 : -100000 + s.ply;
  let v = 0;
  for (let p = 0; p < G.B.n; p++) { const c = s.cells[p]; if (c) v += (sideOf(c) === root ? 1 : -1) * G.types[typeOf(c)].value; }
  for (let side = 0; side < 2; side++) v += (side === root ? 1 : -1) * s.hand[side] * G.types[0].value;
  if (goal) {
    for (let p = 0; p < G.B.n; p++) {
      const c = s.cells[p];
      if (!c) continue;
      const sd = sideOf(c);
      for (let i = 0; i < goal.length; i++) {
        const g = goal[i];
        if ((g.side < 0 || g.side === sd) && (g.piece < 0 || g.piece === typeOf(c))) v += (sd === root ? -1 : 1) * 0.25 * Math.min(g.dist[p], 20);
      }
    }
  }
  return v;
}
function goalDistances(G) {
  const B = G.B, out = [];
  G.win.forEach(function (w) {
    if (w.type !== 'reach') return;
    const dist = new Array(B.n).fill(99), q = [];
    for (let p = 0; p < B.n; p++) if (w.set[0][p]) { dist[p] = 0; q.push(p); }
    for (let h = 0; h < q.length; h++) for (let d = 0; d < B.D; d++) { const r = B.ray[q[h] * B.D + d]; if (r >= 0 && dist[r] > dist[q[h]] + 1) { dist[r] = dist[q[h]] + 1; q.push(r); } }
    out.push({ side: w.side, piece: w.piece, dist: dist });
  });
  return out;
}
export function search(G, s, opt) {
  const o = opt || {};
  const rng = o.rng || Math.random;
  const acts = legalActions(G, s);
  if (!acts.length) return null;
  if (acts.length === 1) return acts[0];
  const lv = typeof o.level === 'number' ? AI_LEVELS[Math.max(0, Math.min(AI_LEVELS.length - 1, o.level))] : AI_LEVELS[1];
  if (!lv.depth) return acts[Math.floor(rng() * acts.length)];
  const maxNodes = o.nodes || lv.nodes, maxDepth = o.depth || lv.depth, root = s.turn, goal = goalDistances(G);
  let nodes = 0;
  const order = function (list) { return list.slice().sort(function (x, y) { return (y.cap ? 1 : 0) - (x.cap ? 1 : 0) || (y.k === 'remove' ? 1 : 0) - (x.k === 'remove' ? 1 : 0); }); };
  const ab = function (st, depth, alpha, beta) {
    nodes++;
    if (st.result || depth === 0 || nodes > maxNodes) return evalState(G, st, root, goal);
    const list = order(legalActions(G, st));
    if (!list.length) return evalState(G, st, root, goal);
    const max = st.turn === root;
    let best = max ? -Infinity : Infinity;
    for (let i = 0; i < list.length; i++) {
      const v = ab(apply(G, st, list[i]), depth - 1, alpha, beta);
      if (max) { if (v > best) best = v; if (v > alpha) alpha = v; } else { if (v < best) best = v; if (v < beta) beta = v; }
      if (beta <= alpha) break;
    }
    return best;
  };
  let chosen = order(acts)[0];
  const ordered = order(acts);
  for (let depth = 1; depth <= maxDepth; depth++) {
    const scores = [];
    let alpha = -Infinity;
    for (let i = 0; i < ordered.length; i++) {
      const v = ab(apply(G, s, ordered[i]), depth - 1, alpha - 0.01, Infinity);
      scores.push(v);
      if (v > alpha) alpha = v;
      if (nodes > maxNodes && depth > 1) break;
    }
    if (nodes > maxNodes && depth > 1) break;
    let bestV = -Infinity;
    scores.forEach(function (v) { if (v > bestV) bestV = v; });
    const ties = ordered.filter(function (a, i) { return scores[i] >= bestV - 1e-9; });
    chosen = ties[Math.floor(rng() * ties.length)];
    ordered.sort(function (x, y) { return (x === chosen ? -1 : 0) - (y === chosen ? -1 : 0); });
  }
  return chosen;
}
export function perft(G, s, depth) {
  if (depth === 0 || s.result) return 1;
  const list = legalActions(G, s);
  let n = 0;
  for (let i = 0; i < list.length; i++) n += perft(G, apply(G, s, list[i]), depth - 1);
  return n;
}

/* ---------------- regulile în text: lista de enunțuri, localizate în interfață ---------------- */
// Fiecare enunț este [cheie, parametri…]; un parametru poate fi un număr, un text sau {piece|set|side|dirs: …}.
export function explain(G) {
  const out = [], B = G.B, g = G.game;
  const sideP = function (i) { return { side: G.sides[i] }; };
  const pcs = function (set) { return { pieces: set ? Array.from(set).map(function (i) { return G.types[i].id; }) : [] }; };
  const st = initialState(G);
  for (let si = 0; si < 2; si++) { let n = 0; for (let p = 0; p < B.n; p++) if (st.cells[p] && sideOf(st.cells[p]) === si) n++; out.push(['r_start', sideP(si), n, st.hand[si]]); }
  out.push(['r_first', sideP(G.first)]);
  if (G.mandatory) out.push(['r_mandatory']);
  const dirsOf = function (m) { return { dirs: m.dirs === undefined ? ['all'] : arr(m.dirs) }; };
  arr(g.rules.moves).forEach(function (m, idx) {
    const r = G.moves[idx];
    if (!r) return;
    if (r.when && r.when.hand === 'some') out.push(['r_when_hand_some']);
    if (r.when && r.when.hand === 'none') out.push(['r_when_hand_none']);
    if (r.when && r.when.pieces) out.push(['r_when_pieces', { cmp: r.when.pieces.op, v: r.when.pieces.v }]);
    if (r.sides) out.push(['r_only_sides', { sidesOf: Array.from(r.sides).map(function (i) { return G.sides[i]; }) }]);
    switch (m.type) {
      case 'drop': out.push(['r_drop', { piece: G.types[r.drop[0] >= 0 ? r.drop[0] : 0].id }]); break;
      case 'step': out.push(['r_step', dirsOf(m)]); break;
      case 'slide': out.push(['r_slide', dirsOf(m)]); break;
      case 'fly': out.push(['r_fly']); break;
      case 'jump': out.push(['r_jump', dirsOf(m)]); out.push([r.chain === 'forced' ? 'r_chain_forced' : r.chain === 'optional' ? 'r_chain_optional' : 'r_chain_none']); break;
      case 'approach-withdraw':
        out.push(['r_aw', dirsOf(m)]); out.push([r.chain === 'forced' ? 'r_chain_forced' : r.chain === 'optional' ? 'r_chain_optional' : 'r_chain_none']);
        if (r.chain !== 'none' && r.noSameDir) out.push(['r_nosame']);
        if (r.chain !== 'none' && r.noRevisit) out.push(['r_norevisit']);
        break;
      case 'mill': out.push([r.protect === 'mill' ? 'r_mill' : 'r_mill_free', r.len]); break;
      case 'custodial':
        out.push(['r_custodial']);
        arr(m.hostile).forEach(function (h) { out.push([h.onlyEmpty ? 'r_hostile_empty' : 'r_hostile', { set: h.set }, h.to === undefined ? { all: true } : sideP(G.sides.indexOf(h.to))]); });
        if (r.immune && r.immune.size) out.push(['r_immune', pcs(r.immune)]);
        break;
      case 'king-capture':
        out.push([r.throne ? 'r_king_throne' : 'r_king', { piece: G.types[r.piece].id }, { set: m.throne }]);
        if (r.edgeSafe) out.push(['r_king_edge', { piece: G.types[r.piece].id }]);
        break;
      default: break;
    }
    if (r.from && m.from) out.push(['r_mod_from', { set: m.from }]);
    if (r.fromNot && m.fromNot) out.push(['r_mod_from_not', { set: m.fromNot }]);
    if (r.to && m.to && m.to !== 'empty') out.push(['r_mod_to', { set: m.to }]);
    if (r.toNot && m.toNot) out.push(['r_mod_to_not', { set: m.toNot }]);
    if (r.requires) out.push(['r_mod_requires']);
    if (r.pieces && m.type !== 'drop' && m.type !== 'king-capture') out.push(['r_only_pieces', pcs(r.pieces)]);
  });
  arr(g.rules.restricted).forEach(function (x) {
    out.push(['r_restricted', { set: x.set }, { pieces: arr(x.allow) }]);
    if (x.through) out.push(['r_through', { set: x.set }]);
  });
  G.win.forEach(function (w, i) {
    const raw = g.rules.win[i];
    if (w.type === 'reach') out.push(['r_win_reach', w.side >= 0 ? sideP(w.side) : { all: true }, w.piece >= 0 ? { piece: G.types[w.piece].id } : { all: true }, { set: raw.set }]);
    else if (w.type === 'eliminate') out.push(['r_win_elim', w.below]);
    else if (w.type === 'lose-when-none') out.push(['r_win_none', { piece: G.types[w.piece].id }]);
    else if (w.type === 'blocked') out.push([w.draw ? 'r_draw_blocked' : 'r_win_blocked']);
    else if (w.type === 'line') out.push(['r_win_line', w.len]);
    else if (w.type === 'draw') {
      if (w.repeat) out.push(['r_draw_repeat', w.repeat]);
      if (w.noCaptureTurns) out.push(['r_draw_quiet', w.noCaptureTurns]);
    }
  });
  return out;
}

/* ---------------- verificare completă a unui fișier de joc (pentru contribuitori) ---------------- */
export function validateGame(game) {
  const res = compile(game);
  return res.errors;
}
export function boardLayout(G, size) {
  // coordonate de desen (y crește în jos): grila are pasul «size»; graful se scalează la ~6 pași
  const B = G.B;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  B.xy.forEach(function (c) { minX = Math.min(minX, c[0]); maxX = Math.max(maxX, c[0]); minY = Math.min(minY, c[1]); maxY = Math.max(maxY, c[1]); });
  const sp = Math.max(maxX - minX, maxY - minY) || 1;
  const k = B.type === 'grid' ? size : size * 6 / sp;
  return { pos: B.xy.map(function (c) { return [(c[0] - minX) * k, (maxY - c[1]) * k]; }), w: (maxX - minX) * k, h: (maxY - minY) * k, k: k };
}
