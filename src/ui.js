/* REGULA · interfața. Folosește din ambalaj: I18N, DATA, tr(), fmt() și funcțiile din engine.mjs. */
var STORE_KEY = 'regula.state';
var CUSTOM_KEY = 'regula.custom';
var ORDER = ['nine-mens-morris', 'alquerque', 'fanorona', 'mu-torere', 'hnefatafl'];
var CMPKEY = { '==': 'c_eq', '<=': 'c_le', '>=': 'c_ge', '<': 'c_lt', '>': 'c_gt' };
var PRE_KEYS = { r_when_hand_some: 1, r_when_hand_none: 1, r_when_pieces: 1, r_only_sides: 1 };
var SUF_KEYS = { r_mod_from: 1, r_mod_from_not: 1, r_mod_to: 1, r_mod_to_not: 1, r_mod_requires: 1, r_only_pieces: 1, r_chain_forced: 1, r_chain_optional: 1, r_chain_none: 1, r_nosame: 1, r_norevisit: 1, r_hostile: 1, r_hostile_empty: 1, r_immune: 1, r_king_edge: 1, r_through: 1 };
var MOVE_CAP = 1500, UNIT = 52, PAD = 48, MAX_JSON = 200000;
var S = { id: '', game: null, G: null, errs: [], match: null, acts: [], lv: [-1, 1], sel: -1, hint: null, choice: null, busy: false, timer: 0, gen: 0, msg: '', cap: false, focus: 0 };
var cur = { el: null, lang: 'en', L: null };
var geo = { G: null, host: null };
var customGame = null, customText = '', booted = false, lvKey = '';

function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function f1(v) { return Math.round(v * 10) / 10; }
function hasKey(lang, k) { return !!(I18N[lang] && Object.prototype.hasOwnProperty.call(I18N[lang], k)); }
function makeL(lang) {
  return {
    lang: lang,
    t: function (k) { return tr(lang, k); },
    name: function (id) { var k = 'n_' + id; return hasKey(lang, k) ? tr(lang, k) : String(id); }
  };
}
function gameIds() {
  var ids = Object.keys(typeof DATA === 'undefined' ? {} : DATA);
  ids.sort(function (a, b) { var ia = ORDER.indexOf(a), ib = ORDER.indexOf(b); if (ia < 0) ia = 99; if (ib < 0) ib = 99; return ia - ib || (a < b ? -1 : a > b ? 1 : 0); });
  return ids;
}
function hasGame(id) { return typeof DATA !== 'undefined' && Object.prototype.hasOwnProperty.call(DATA, id); }
function gameName(g, lang) { return String((g && g.names && g.names[lang]) || (g && g.name) || (g && g.id) || '?'); }
function clampLv(v) { return v === 0 || v === 1 || v === 2 ? v : -1; }

/* ---------- starea salvată ---------- */
function loadStore() { try { var r = JSON.parse(localStorage.getItem(STORE_KEY)); if (r && typeof r === 'object') return r; } catch (e) { /* stocarea poate lipsi */ } return null; }
function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ id: S.id, lv: S.lv, idxs: S.match ? S.match.idxs.slice(0, S.match.pos) : [] })); } catch (e) { /* ignorat */ }
}
function rebuildActs() {
  var m = S.match, G = S.G;
  S.acts = [];
  for (var i = 0; i < m.idxs.length; i++) { var a = legalActions(G, m.states[i])[m.idxs[i]]; S.acts.push(a ? actionText(G, a) : '?'); }
}
function useGame(id) {
  var g = id === 'custom' ? customGame : (hasGame(id) ? DATA[id] : null);
  clearAI();
  S.id = id; S.game = g || null; S.G = null; S.errs = []; S.match = null; S.acts = []; S.sel = -1; S.hint = null; S.choice = null; S.msg = ''; S.cap = false; S.focus = 0;
  if (!g || typeof g !== 'object') return;
  if (g.rules) {
    var res = compile(g);
    if (res.G) { S.G = res.G; S.match = newMatch(res.G); } else S.errs = res.errors;
  }
}
function boot() {
  if (booted) return;
  booted = true;
  var st = loadStore(), ids = gameIds();
  try { var ct = localStorage.getItem(CUSTOM_KEY); if (ct) { var o = JSON.parse(ct); if (o && typeof o === 'object' && !Array.isArray(o)) { customGame = o; customText = ct; } } } catch (e) { /* ignorat */ }
  var id = st && typeof st.id === 'string' ? st.id : ids[0];
  if (id === 'custom' ? !customGame : !hasGame(id)) id = ids[0];
  if (st && Array.isArray(st.lv) && st.lv.length === 2) S.lv = [clampLv(st.lv[0]), clampLv(st.lv[1])];
  useGame(id);
  if (S.G && st && st.id === id && Array.isArray(st.idxs) && st.idxs.length) {
    var m = replay(S.G, st.idxs);
    if (m) { S.match = m; rebuildActs(); }
  }
}

/* ---------- adversarul ---------- */
function clearAI() { S.gen++; if (S.timer) { clearTimeout(S.timer); S.timer = 0; } S.busy = false; }
function humanTurn() {
  if (!S.G || S.busy || S.cap) return false;
  var m = S.match;
  if (matchStatus(m)) return false;
  return S.lv[matchState(m).turn] < 0;
}
function scheduleAI() {
  clearAI();
  if (!S.G || S.cap) return;
  var m = S.match;
  if (matchStatus(m)) return;
  if (S.lv[matchState(m).turn] < 0) return;
  if (m.pos >= MOVE_CAP) { S.cap = true; renderAll(); return; }
  var gen = S.gen, both = S.lv[0] >= 0 && S.lv[1] >= 0;
  S.busy = true;
  renderAll();
  S.timer = setTimeout(function () {
    S.timer = 0;
    if (gen !== S.gen) return;
    var st = matchState(S.match), a = null;
    try { a = search(S.G, st, { level: S.lv[st.turn] }); } catch (e) { a = null; }
    if (gen !== S.gen) return;
    S.busy = false;
    if (!a || !doPlay(a)) renderAll();
  }, both ? 260 : 420);
}
function doPlay(a) {
  var m = S.match, txt = actionText(S.G, a);
  if (!matchPlay(m, a)) return false;
  S.acts.length = m.pos - 1;
  S.acts.push(txt);
  S.sel = -1; S.hint = null; S.choice = null; S.msg = '';
  setText(cur.el && cur.el.querySelector('#rg-copied'), '');
  saveStore();
  renderAll();
  scheduleAI();
  return true;
}
function newGame() {
  if (!S.G) return;
  clearAI();
  S.match = newMatch(S.G); S.acts = []; S.sel = -1; S.hint = null; S.choice = null; S.msg = ''; S.cap = false;
  saveStore();
  renderAll();
  scheduleAI();
}
function isBoundary(i) { var s = S.match.states[i]; return !s.chain && !s.pending; }
function anyHuman() { return S.lv[0] < 0 || S.lv[1] < 0; }
function jumpTo(pos) {
  clearAI();
  S.match.pos = pos; S.sel = -1; S.hint = null; S.choice = null; S.msg = ''; S.cap = false;
  saveStore();
  renderAll();
  scheduleAI();
}
function undo() {
  var m = S.match;
  if (!S.G || m.pos <= 0) return;
  var j = m.pos - 1;
  while (j > 0 && (!isBoundary(j) || (anyHuman() && S.lv[m.states[j].turn] >= 0))) j--;
  jumpTo(j);
}
function redo() {
  var m = S.match, last = m.states.length - 1;
  if (!S.G || m.pos >= last) return;
  var j = m.pos + 1;
  while (j < last && (!isBoundary(j) || (anyHuman() && !m.states[j].result && S.lv[m.states[j].turn] >= 0))) j++;
  jumpTo(j);
}
function onHint() {
  if (!humanTurn()) return;
  var L = cur.L;
  S.hint = null; S.msg = ''; S.choice = null; S.busy = true;
  renderAll();
  var gen = ++S.gen;
  setTimeout(function () {
    if (gen !== S.gen) return;
    var a = null;
    try { a = search(S.G, matchState(S.match), { level: 2 }); } catch (e) { a = null; }
    S.busy = false;
    S.hint = a;
    S.msg = a ? fmt(L.t('hint_is'), actionText(S.G, a)) : L.t('hint_none');
    renderAll();
  }, 30);
}

/* ---------- modelul afișat ---------- */
function buildModel() {
  var G = S.G, m = S.match, st = matchState(m), res = matchStatus(m), acts = res ? [] : legalActions(G, st);
  var md = { st: st, res: res, acts: acts, sel: -1, dests: {}, movable: {}, removable: {}, canStop: false, forced: false, drops: false, last: -1, hintPts: {} };
  if (!res) {
    if (st.pending) acts.forEach(function (a) { md.removable[a.at] = 1; });
    else if (st.chain) {
      md.sel = st.chain.at; md.forced = G.moves[st.chain.ri].chain === 'forced';
      acts.forEach(function (a) { if (a.k === 'stop') md.canStop = true; else md.dests[a.to] = 1; });
    } else {
      acts.forEach(function (a) { if (a.k === 'drop') { md.dests[a.to] = 1; md.drops = true; } else if (a.from !== undefined) md.movable[a.from] = 1; });
      if (S.sel >= 0 && md.movable[S.sel]) { md.sel = S.sel; acts.forEach(function (a) { if (a.from === S.sel) md.dests[a.to] = 1; }); }
    }
  }
  if (m.pos > 0) {
    var la = legalActions(G, m.states[m.pos - 1])[m.idxs[m.pos - 1]];
    if (la) md.last = la.to !== undefined ? la.to : la.at !== undefined ? la.at : -1;
  }
  if (S.hint) { ['from', 'to', 'at'].forEach(function (k) { if (S.hint[k] !== undefined) md.hintPts[S.hint[k]] = 1; }); }
  return md;
}

/* ---------- geometria tablei ---------- */
function specialMask(G) {
  var m = [], p;
  for (p = 0; p < G.B.n; p++) m.push(0);
  G.restricted.forEach(function (x) { for (var q = 0; q < G.B.n; q++) if (x.mask[q]) m[q] = 1; });
  G.moves.forEach(function (r) { if (r.type === 'custodial' && r.hostile) r.hostile.forEach(function (h) { for (var q = 0; q < G.B.n; q++) if (h.mask[0][q]) m[q] = 1; }); });
  return m;
}
function computeGeo() {
  var G = S.G, B = G.B, lay = boardLayout(G, UNIT), gap = Infinity, i, j;
  for (i = 0; i < B.n; i++) for (j = i + 1; j < B.n; j++) {
    var dx = lay.pos[i][0] - lay.pos[j][0], dy = lay.pos[i][1] - lay.pos[j][1], d2 = dx * dx + dy * dy;
    if (d2 < gap) gap = d2;
  }
  gap = isFinite(gap) ? Math.sqrt(gap) : UNIT;
  var unit = Math.min(gap, UNIT * 1.1);
  geo = { G: G, host: null, lay: lay, unit: unit, hit: unit * 0.96, r: unit * 0.36, W: lay.w + 2 * PAD, H: lay.h + 2 * PAD, spec: specialMask(G), cells: G.game.board.render === 'cells' && B.type === 'grid' };
}
var TONES = { white: 0, black: 1, attackers: 1, defenders: 0 };
function tone(si) {
  var ids = S.G.sides, t = [TONES.hasOwnProperty(ids[0]) ? TONES[ids[0]] : 0, TONES.hasOwnProperty(ids[1]) ? TONES[ids[1]] : 1];
  if (t[0] === t[1]) t = [0, 1];
  return t[si];
}
function ptXY(p) { return [PAD + geo.lay.pos[p][0], PAD + geo.lay.pos[p][1]]; }
function ring(cls, p, r) { var c = ptXY(p); return '<circle class="' + cls + '" cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(r) + '"/>'; }
function boardSVG(md) {
  var G = S.G, B = G.B, st = md.st, g = geo, o = [], p, d, c, q, x, y;
  o.push('<svg class="rg-svg" viewBox="0 0 ' + f1(g.W) + ' ' + f1(g.H) + '" width="' + f1(g.W) + '" height="' + f1(g.H) + '" aria-hidden="true" focusable="false">');
  if (g.cells) {
    for (p = 0; p < B.n; p++) { c = ptXY(p); o.push('<rect class="rg-cell' + (g.spec[p] ? ' rg-sp' : '') + '" x="' + f1(c[0] - UNIT / 2) + '" y="' + f1(c[1] - UNIT / 2) + '" width="' + UNIT + '" height="' + UNIT + '"/>'); }
  } else {
    var dd = '';
    for (p = 0; p < B.n; p++) for (d = 0; d < B.D; d++) {
      q = B.ray[p * B.D + d];
      if (q > p) { var a = ptXY(p), b = ptXY(q); dd += 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]); }
    }
    o.push('<path class="rg-edge" d="' + dd + '"/>');
    for (p = 0; p < B.n; p++) if (g.spec[p]) o.push(ring('rg-spm', p, g.r + 6));
  }
  // etichete: litere și cifre pe tablele grilă, nume lângă puncte pe grafuri
  if (B.type === 'grid') {
    var half = g.cells ? UNIT / 2 : 0;
    for (x = 0; x < B.w; x++) { c = ptXY(x); o.push('<text class="rg-lbl" x="' + f1(c[0]) + '" y="' + f1(PAD + g.lay.h + half + 15) + '" text-anchor="middle">' + String.fromCharCode(97 + x) + '</text>'); }
    for (y = 0; y < B.h; y++) { c = ptXY(y * B.w); o.push('<text class="rg-lbl" x="' + f1(PAD - half - 12) + '" y="' + f1(c[1] + 4) + '" text-anchor="middle">' + (y + 1) + '</text>'); }
  } else if (B.n <= 40) {
    for (p = 0; p < B.n; p++) { c = ptXY(p); o.push('<text class="rg-lbl" x="' + f1(c[0] + g.r + 2) + '" y="' + f1(c[1] - g.r + 2) + '">' + esc(B.names[p]) + '</text>'); }
  }
  if (md.last >= 0) o.push(ring('rg-last', md.last, g.r + 6));
  if (md.sel >= 0) o.push(ring('rg-sel', md.sel, g.r + 8));
  if (!md.res) for (p = 0; p < B.n; p++) if (md.dests[p] && !st.cells[p]) o.push(ring('rg-dest', p, g.unit * 0.13));
  for (p = 0; p < B.n; p++) {
    var ci = cellInfo(G, st, p);
    if (!ci) continue;
    c = ptXY(p);
    var R = g.r, tp = G.types[ci.type], mk = '';
    if (ci.type === 1) mk = '<circle class="rg-m" r="' + f1(R * 0.5) + '"/>';
    else if (ci.type >= 2) mk = '<path class="rg-m" d="M0 ' + f1(-R * 0.55) + 'V' + f1(R * 0.55) + 'M' + f1(-R * 0.55) + ' 0H' + f1(R * 0.55) + '"/>';
    if (tp.glyph) mk += '<text class="rg-gl" text-anchor="middle" dy=".35em">' + esc(tp.glyph) + '</text>';
    o.push('<g class="rg-pc rg-s' + tone(ci.side) + '" transform="translate(' + f1(c[0]) + ' ' + f1(c[1]) + ')"><circle class="rg-b" r="' + f1(R) + '"/>' + mk + '</g>');
  }
  for (p = 0; p < B.n; p++) if (md.removable[p]) o.push(ring('rg-rm', p, g.r + 6));
  for (p = 0; p < B.n; p++) if (md.hintPts[p]) o.push(ring('rg-hint', p, g.r + 10));
  o.push('</svg>');
  return o.join('');
}
function buildButtons() {
  var host = geo.host, B = S.G.B, p, b, c;
  host.textContent = '';
  for (p = 0; p < B.n; p++) {
    c = ptXY(p);
    b = document.createElement('button');
    b.type = 'button'; b.className = 'rg-pt'; b.setAttribute('data-p', String(p)); b.tabIndex = -1;
    b.style.left = ((c[0] - geo.hit / 2) / geo.W * 100) + '%';
    b.style.top = ((c[1] - geo.hit / 2) / geo.H * 100) + '%';
    b.style.width = (geo.hit / geo.W * 100) + '%';
    b.style.height = (geo.hit / geo.H * 100) + '%';
    host.appendChild(b);
  }
}
function updateButtons(md) {
  var btns = cur.el.querySelectorAll('#rg-ov .rg-pt'), L = cur.L, G = S.G, st = md.st, human = humanTurn(), i, b, ci, lab, fl;
  for (i = 0; i < btns.length; i++) {
    b = btns[i];
    ci = cellInfo(G, st, i);
    lab = ci ? fmt(L.t('aria_piece'), G.B.names[i], L.name(G.sides[ci.side]), L.name(G.types[ci.type].id)) : fmt(L.t('aria_empty'), G.B.names[i]);
    fl = [];
    if (human) {
      if (md.sel === i) fl.push(L.t('aria_sel'));
      if (md.dests[i]) fl.push(L.t('aria_dest'));
      if (md.removable[i]) fl.push(L.t('aria_rm'));
      if (md.movable[i] && md.sel !== i) fl.push(L.t('aria_mov'));
    }
    if (md.hintPts[i]) fl.push(L.t('aria_hint'));
    b.setAttribute('aria-label', fl.length ? lab + ' — ' + fl.join(', ') : lab);
    b.setAttribute('aria-pressed', md.sel === i ? 'true' : 'false');
    b.tabIndex = i === S.focus ? 0 : -1;
  }
}
function neighborIn(p, dx, dy) {
  var pos = geo.lay.pos, best = -1, bs = Infinity, ox = pos[p][0], oy = pos[p][1], q;
  for (q = 0; q < pos.length; q++) {
    if (q === p) continue;
    var vx = pos[q][0] - ox, vy = pos[q][1] - oy, along = vx * dx + vy * dy;
    if (along <= 0.01) continue;
    var sc = along + 2.2 * Math.abs(vx * dy - vy * dx);
    if (sc < bs) { bs = sc; best = q; }
  }
  return best;
}
function onKey(ev) {
  var b = ev.target && ev.target.closest ? ev.target.closest('.rg-pt') : null;
  if (!b || !S.G) return;
  var p = +b.getAttribute('data-p'), k = ev.key, dx = 0, dy = 0;
  if (k === 'ArrowRight' || k === 'Right') dx = 1; else if (k === 'ArrowLeft' || k === 'Left') dx = -1;
  else if (k === 'ArrowDown' || k === 'Down') dy = 1; else if (k === 'ArrowUp' || k === 'Up') dy = -1;
  else if (k === 'Escape' || k === 'Esc') { if (S.sel >= 0 || S.choice) { S.sel = -1; S.choice = null; renderAll(); } return; }
  else if (k === 'Home') { dx = 0; dy = 0; focusPoint(0); ev.preventDefault(); return; }
  else if (k === 'End') { focusPoint(S.G.B.n - 1); ev.preventDefault(); return; }
  else return;
  ev.preventDefault();
  var q = neighborIn(p, dx, dy);
  if (q >= 0) focusPoint(q);
}
function focusPoint(q) {
  var btns = cur.el.querySelectorAll('#rg-ov .rg-pt');
  if (!btns[q]) return;
  S.focus = q;
  for (var i = 0; i < btns.length; i++) btns[i].tabIndex = i === q ? 0 : -1;
  btns[q].focus();
}

/* ---------- interacțiunea ---------- */
function pickOne(list) {
  if (list.length === 1) { doPlay(list[0]); return; }
  S.choice = list;
  renderAll();
}
function onPoint(p) {
  if (!humanTurn()) return;
  var st = matchState(S.match), acts = legalActions(S.G, st), list;
  S.hint = null; S.msg = ''; S.choice = null;
  if (st.pending) {
    list = acts.filter(function (a) { return a.at === p; });
    if (list.length) { doPlay(list[0]); return; }
    renderAll(); return;
  }
  if (st.chain) {
    list = acts.filter(function (a) { return a.k !== 'stop' && a.to === p; });
    if (list.length) { pickOne(list); return; }
    renderAll(); return;
  }
  if (S.sel >= 0) {
    list = acts.filter(function (a) { return a.from === S.sel && a.to === p; });
    if (list.length) { pickOne(list); return; }
    if (p === S.sel) { S.sel = -1; renderAll(); return; }
  }
  list = acts.filter(function (a) { return a.k === 'drop' && a.to === p; });
  if (list.length && S.sel < 0) { pickOne(list); return; }
  if (acts.some(function (a) { return a.from === p; })) { S.sel = p; renderAll(); return; }
  S.sel = -1;
  renderAll();
}
function onStop() {
  if (!humanTurn()) return;
  var acts = legalActions(S.G, matchState(S.match)), a = acts.filter(function (x) { return x.k === 'stop'; })[0];
  if (a) doPlay(a);
}
function onLevel(ev) {
  var t = ev.target;
  if (!t || !t.getAttribute) return;
  var side = +t.getAttribute('data-side');
  if (side !== 0 && side !== 1) return;
  S.lv[side] = clampLv(+t.value);
  S.msg = ''; S.hint = null;
  saveStore();
  scheduleAI();
  renderAll();
}
function onGame(ev) {
  var id = ev.target.value;
  useGame(id);
  saveStore();
  lvKey = '';
  renderAll();
  renderRules();
  scheduleAI();
}

/* ---------- înregistrarea mutărilor ---------- */
function turnList() {
  var m = S.match, turns = [], c = null, i;
  if (!m) return turns;
  for (i = 0; i < m.idxs.length && i < S.acts.length; i++) {
    if (!c) { c = { side: m.states[i].turn, acts: [], first: i }; turns.push(c); }
    c.acts.push(S.acts[i]);
    var s1 = m.states[i + 1];
    if (s1 && !s1.chain && !s1.pending) c = null;
  }
  return turns;
}
function recordText() { return turnList().map(function (t, i) { return (i + 1) + '. ' + t.acts.join(' '); }).join('  '); }
function copyText(text, done) {
  function ok() { if (done) done(); }
  function fallback() {
    var ta = document.createElement('textarea');
    ta.value = text; ta.className = 'rg-offscreen'; ta.setAttribute('readonly', '');
    document.body.appendChild(ta); ta.select();
    try { if (document.execCommand('copy')) ok(); } catch (e) { /* ignorat */ }
    document.body.removeChild(ta);
  }
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(ok, fallback); return; } } catch (e) { /* trecem la varianta veche */ }
  fallback();
}
function downloadText(name, text) {
  try {
    var url = URL.createObjectURL(new Blob([text], { type: 'application/json' })), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  } catch (e) { /* ignorat */ }
}

/* ---------- randarea ---------- */
function setText(el, t) { if (el && el.textContent !== t) el.textContent = t; }
function syncSelects() {
  var el = cur.el, L = cur.L, ids = gameIds(), sel = el.querySelector('#rg-game');
  if (!sel) return;
  var key = cur.lang + '|' + S.id + '|' + (S.G ? S.G.sides.join() : '');
  if (lvKey !== key) {
    lvKey = key;
    var html = ids.map(function (id) { var g = DATA[id]; return '<option value="' + esc(id) + '">' + esc(gameName(g, cur.lang)) + (g && g.rules ? '' : ' (' + esc(L.t('opt_desc')) + ')') + '</option>'; }).join('');
    html += '<option value="custom">' + esc(L.t('opt_custom')) + '</option>';
    sel.innerHTML = html;
    var lv = '';
    if (S.G) {
      [0, 1].forEach(function (si) {
        var opts = [[-1, 'lv_human'], [0, 'lv_random'], [1, 'lv_easy'], [2, 'lv_medium']].map(function (x) { return '<option value="' + x[0] + '"' + (S.lv[si] === x[0] ? ' selected' : '') + '>' + esc(L.t(x[1])) + '</option>'; }).join('');
        lv += '<label class="rg-f" for="rg-lv' + si + '"><span><i class="rg-sw rg-sw' + tone(si) + '"></i>' + esc(fmt(L.t('lbl_side'), L.name(S.G.sides[si]))) + '</span><select id="rg-lv' + si + '" data-side="' + si + '" class="sel rg-inp">' + opts + '</select></label>';
      });
    }
    el.querySelector('#rg-lvs').innerHTML = lv;
  }
  sel.value = S.id;
}
function statusText(md) {
  var L = cur.L, G = S.G;
  if (S.cap) return L.t('st_cap');
  if (md.res) {
    var why = hasKey('en', 'why_' + md.res.reason) ? ' — ' + L.t('why_' + md.res.reason) : '';
    if (md.res.winner < 0) return L.t('st_draw') + why + '.';
    return fmt(L.t('st_win'), L.name(G.sides[md.res.winner])) + why + '.';
  }
  var who = L.name(G.sides[md.st.turn]);
  if (S.busy) return fmt(L.t('st_think'), who);
  var t = fmt(L.t('st_turn'), who);
  if (S.lv[md.st.turn] >= 0) return t;
  if (md.st.pending) return t + ' ' + L.t('st_pending');
  if (md.st.chain) return t + ' ' + L.t(md.forced ? 'st_chain_forced' : 'st_chain');
  if (md.sel >= 0) return t + ' ' + L.t('st_dest');
  return t + ' ' + L.t(md.drops ? 'st_drop' : 'st_pick');
}
function renderBoard(md) {
  var el = cur.el, box = el.querySelector('#rg-box'), none = el.querySelector('#rg-none'), L = cur.L;
  if (!S.G) {
    box.hidden = true; none.hidden = false;
    var msg = '';
    if (S.errs.length) msg = '<p>' + esc(L.t('bad_game')) + '</p><ul class="rg-list">' + S.errs.slice(0, 12).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>';
    else if (S.game && !S.game.rules) msg = '<p>' + esc(L.t('not_playable')) + '</p>';
    else msg = '<p>' + esc(L.t('custom_hint')) + '</p>';
    none.innerHTML = msg;
    return;
  }
  box.hidden = false; none.hidden = true;
  var host = el.querySelector('#rg-ov');
  if (geo.G !== S.G) computeGeo();
  if (geo.host !== host) {
    geo.host = host;
    buildButtons();
    box.className = 'rg-box' + (S.G.B.n > 40 ? ' rg-big' : '');
  }
  host.setAttribute('aria-label', fmt(L.t('aria_board'), gameName(S.game, cur.lang)));
  el.querySelector('#rg-svg').innerHTML = boardSVG(md);
  updateButtons(md);
}
function renderStatus(md) {
  var el = cur.el, L = cur.L, G = S.G;
  if (!G) {
    setText(el.querySelector('#rg-status'), ''); el.querySelector('#rg-counts').textContent = ''; setText(el.querySelector('#rg-msg'), '');
    el.querySelector('#rg-choice').hidden = true;
    return;
  }
  setText(el.querySelector('#rg-status'), statusText(md));
  var cn = el.querySelector('#rg-counts'), chtml = [0, 1].map(function (si) { var tot = pieceTotal(G, md.st, si), h = md.st.hand[si]; return '<span class="rg-cs"><i class="rg-sw rg-sw' + tone(si) + '"></i>' + esc(fmt(L.t('st_counts'), L.name(G.sides[si]), tot - h, h)) + '</span>'; }).join(' ');
  if (cn.innerHTML !== chtml) cn.innerHTML = chtml;
  setText(el.querySelector('#rg-msg'), S.msg);
  var ch = el.querySelector('#rg-choice');
  if (S.choice && S.choice.length) {
    var h = '<span>' + esc(L.t('choose')) + '</span>';
    S.choice.forEach(function (a, i) {
      var label = a.k === 'fano' ? fmt(L.t(a.kind === 'A' ? 'opt_approach' : 'opt_withdraw'), a.taken.length) : fmt(L.t('opt_other'), i + 1) + ' · ' + actionText(G, a);
      h += '<button type="button" class="btn rg-ch" data-i="' + i + '">' + esc(label) + '</button>';
    });
    ch.innerHTML = h; ch.hidden = false;
    var first = ch.querySelector('.rg-ch');
    if (first && first.focus) setTimeout(function () { first.focus(); }, 0);
  } else { ch.hidden = true; ch.textContent = ''; }
}
function renderControls(md) {
  var el = cur.el, m = S.match, has = !!S.G, human = has && humanTurn();
  el.querySelector('#rg-new').disabled = !has;
  el.querySelector('#rg-undo').disabled = !has || m.pos <= 0;
  el.querySelector('#rg-redo').disabled = !has || m.pos >= m.states.length - 1;
  el.querySelector('#rg-hint').disabled = !has || !human;
  el.querySelector('#rg-stop').hidden = !(has && human && md && md.canStop);
  el.querySelector('#rg-copy').disabled = !has || !m.idxs.length;
  var lv = el.querySelectorAll('#rg-lvs select');
  for (var i = 0; i < lv.length; i++) { var si = +lv[i].getAttribute('data-side'); if (+lv[i].value !== S.lv[si]) lv[i].value = String(S.lv[si]); }
}
function renderRecord() {
  var el = cur.el, host = el.querySelector('#rg-rec'), L = cur.L;
  if (!S.G) { host.textContent = ''; return; }
  var turns = turnList();
  if (!turns.length) { host.innerHTML = '<li class="rg-none">' + esc(L.t('rec_empty')) + '</li>'; return; }
  var pos = S.match.pos;
  host.innerHTML = turns.map(function (t, i) { return '<li class="rg-r' + t.side + (t.first >= pos ? ' rg-fut' : '') + '"><b>' + (i + 1) + '.</b> ' + esc(t.acts.join(' ')) + '</li>'; }).join('');
}
function renderAll() {
  if (!cur.el) return;
  syncSelects();
  var md = S.G ? buildModel() : null;
  renderBoard(md);
  renderStatus(md);
  renderControls(md);
  renderRecord();
}

/* ---------- regulile în text ---------- */
function argText(L, a) {
  if (typeof a === 'number' || typeof a === 'string') return String(a);
  if (!a) return '';
  if (a.all) return L.t('n_all');
  if (a.side !== undefined) return L.name(a.side);
  if (a.piece !== undefined) return L.name(a.piece);
  if (a.set !== undefined) return L.name(a.set);
  if (a.pieces) return a.pieces.map(function (x) { return L.name(x); }).join(', ');
  if (a.sidesOf) return a.sidesOf.map(function (x) { return L.name(x); }).join(', ');
  if (a.dirs) return a.dirs.map(function (x) { return L.t('d_' + x); }).join(', ');
  return '';
}
function ruleText(L, key, a) {
  if (key === 'r_when_pieces') return fmt(L.t(key), L.t(CMPKEY[a[0].cmp] || 'c_eq'), a[0].v);
  if (key === 'r_win_reach') {
    var hs = a[0].side !== undefined, hp = a[1].piece !== undefined;
    return fmt(L.t('r_win_reach_' + (hs ? (hp ? 'sp' : 's') : (hp ? 'p' : 'a'))), hs ? L.name(a[0].side) : '', hp ? L.name(a[1].piece) : '', L.name(a[2].set));
  }
  if (key === 'r_win_elim' && a[0] === 1) key = 'r_win_elim1';
  if (key === 'r_restricted' && !(a[1].pieces || []).length) return fmt(L.t('r_restricted_none'), L.name(a[0].set));
  return fmt.apply(null, [L.t(key)].concat(a.map(function (x) { return argText(L, x); })));
}
function ruleItems(G, L) {
  var items = [], pre = [];
  explain(G).forEach(function (e) {
    var key = e[0], txt = ruleText(L, key, e.slice(1));
    if (PRE_KEYS[key]) { pre.push(txt); return; }
    if (SUF_KEYS[key] && items.length) { items[items.length - 1] += ' ' + txt; return; }
    items.push((pre.length ? pre.join(' ') + ' ' : '') + txt);
    pre = [];
  });
  return items;
}
function safeUrl(u) { return /^https?:\/\/[^\s"<>]+$/.test(String(u)); }
function renderRules() {
  var host = document.getElementById('rg-rulesbox'), L = cur.L, g = S.game;
  if (!host) return;
  var h = '';
  if (!g) { host.innerHTML = '<p>' + esc(L.t('custom_hint')) + '</p>'; return; }
  h += '<h3>' + esc(gameName(g, cur.lang)) + '</h3>';
  if (g.region) h += '<p><b>' + esc(L.t('h_region')) + ':</b> ' + esc(g.region) + '</p>';
  if (g.status && hasKey('en', 'stat_' + g.status)) h += '<p class="rg-badge"><b>' + esc(L.t('h_status')) + ':</b> ' + esc(L.t('stat_' + g.status)) + '</p>';
  if (S.G) h += '<p class="note">' + esc(L.t('rules_gen')) + '</p><ul class="rg-rules">' + ruleItems(S.G, L).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  else if (S.errs.length) h += '<p>' + esc(L.t('bad_game')) + '</p><ul class="rg-list">' + S.errs.slice(0, 12).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>';
  else h += '<p>' + esc(L.t('not_playable')) + '</p>';
  var notes = g.notes && typeof g.notes === 'object' ? (g.notes[cur.lang] || g.notes.en) : (typeof g.notes === 'string' ? g.notes : '');
  if (notes) h += '<h3>' + esc(L.t('h_notes')) + '</h3><p class="rg-notes">' + esc(notes) + '</p>';
  var orig = '';
  if (g.setup) orig += '<p>' + esc(g.setup) + '</p>';
  if (Array.isArray(g.moves) && g.moves.length) orig += '<ul class="rg-list">' + g.moves.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  if (g.win) orig += '<p>' + esc(g.win) + '</p>';
  if (orig) h += '<details class="rg-orig"><summary>' + esc(L.t('h_orig')) + '</summary>' + orig + '</details>';
  if (Array.isArray(g.sources) && g.sources.length) h += '<h3>' + esc(L.t('h_sources')) + '</h3><ul class="rg-list rg-src">' + g.sources.map(function (u) { return safeUrl(u) ? '<li><a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(u) + '</a></li>' : '<li>' + esc(u) + '</li>'; }).join('') + '</ul>';
  host.innerHTML = h;
}

/* ---------- jocul propriu ---------- */
function customMsg(html, bad) {
  var m = document.getElementById('rg-cmsg');
  if (!m) return;
  m.innerHTML = html;
  m.className = 'rg-cmsg' + (bad ? ' rg-bad' : '');
}
function checkCustom() {
  var L = cur.L, ta = document.getElementById('rg-json'), text = ta ? ta.value : '';
  if (text.length > MAX_JSON) { customMsg(esc(L.t('custom_big')), true); return null; }
  var obj;
  try { obj = JSON.parse(text); } catch (e) { customMsg(esc(fmt(L.t('custom_json'), e && e.message ? e.message : String(e))), true); return null; }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { customMsg(esc(fmt(L.t('custom_json'), '{ … }')), true); return null; }
  if (!obj.rules) { customMsg(esc(L.t('not_playable')), true); return null; }
  var res = compile(obj);
  if (!res.G) { customMsg(esc(L.t('custom_err')) + '<ul class="rg-list">' + res.errors.slice(0, 20).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>', true); return null; }
  customMsg(esc(fmt(L.t('custom_ok'), res.G.B.n, res.G.moves.length)), false);
  return { obj: obj, text: text };
}
function playCustom() {
  var ok = checkCustom();
  if (!ok) return;
  customGame = ok.obj; customText = ok.text;
  try { localStorage.setItem(CUSTOM_KEY, ok.text); } catch (e) { /* ignorat */ }
  useGame('custom');
  saveStore();
  lvKey = '';
  renderAll();
  renderRules();
  scheduleAI();
  var top = cur.el.querySelector('#rg-game');
  if (top && top.scrollIntoView) top.scrollIntoView();
}

/* ---------- montarea ---------- */
function mount(el, lang) {
  cur.el = el; cur.lang = lang; cur.L = makeL(lang);
  boot();
  var L = cur.L, card = el.parentNode;
  if (card && card.classList) card.classList.add('in');
  geo.host = null; lvKey = '';
  el.innerHTML = '<p class="rg-intro">' + esc(L.t('intro')) + '</p>' +
    '<div class="rg-bar"><label class="rg-f" for="rg-game"><span>' + esc(L.t('lbl_game')) + '</span><select id="rg-game" class="sel rg-inp"></select></label><div class="rg-lvs" id="rg-lvs"></div></div>' +
    '<div class="rg-bar rg-ctl"><button type="button" class="btn pri" id="rg-new">' + esc(L.t('btn_new')) + '</button><button type="button" class="btn" id="rg-undo">' + esc(L.t('btn_undo')) + '</button><button type="button" class="btn" id="rg-redo">' + esc(L.t('btn_redo')) + '</button><button type="button" class="btn" id="rg-hint">' + esc(L.t('btn_hint')) + '</button><button type="button" class="btn" id="rg-stop" hidden>' + esc(L.t('btn_stop')) + '</button></div>' +
    '<p class="rg-status" id="rg-status" role="status" aria-live="polite"></p><p class="rg-counts" id="rg-counts"></p><p class="rg-msg" id="rg-msg" role="status" aria-live="polite"></p>' +
    '<div class="rg-choice" id="rg-choice" role="group" hidden></div>' +
    '<div class="rg-scroll"><div class="rg-box" id="rg-box"><div id="rg-svg"></div><div class="rg-ov" id="rg-ov" role="group"></div></div></div><div class="rg-nogame" id="rg-none" hidden></div>' +
    '<h3>' + esc(L.t('h_record')) + '</h3><p class="note">' + esc(L.t('rec_hint')) + '</p><ol class="rg-rec" id="rg-rec"></ol>' +
    '<p><button type="button" class="btn" id="rg-copy">' + esc(L.t('btn_copy')) + '</button> <span class="rg-copied" id="rg-copied" role="status" aria-live="polite"></span></p>';
  var extra = [['rg-rules-card', 'rg-rules-h', L.t('h_rules'), '<div id="rg-rulesbox"></div>'],
    ['rg-custom-card', 'rg-custom-h', L.t('h_custom'), '<p>' + esc(L.t('custom_hint')) + '</p><label class="rg-f" for="rg-json"><span>' + esc(L.t('lbl_json')) + '</span></label><textarea id="rg-json" class="rg-json" spellcheck="false" rows="14"></textarea>' +
      '<div class="rg-bar"><button type="button" class="btn" id="rg-validate">' + esc(L.t('btn_validate')) + '</button><button type="button" class="btn pri" id="rg-play">' + esc(L.t('btn_play')) + '</button><button type="button" class="btn" id="rg-load">' + esc(L.t('btn_load')) + '</button><button type="button" class="btn" id="rg-down">' + esc(L.t('btn_download')) + '</button></div><div class="rg-cmsg" id="rg-cmsg" role="status" aria-live="polite"></div>'],
    ['rg-lim-card', 'rg-lim-h', L.t('h_limits'), '<ul class="rg-list">' + [1, 2, 3, 4, 5, 6].map(function (i) { return '<li>' + esc(L.t('lim_' + i)) + '</li>'; }).join('') + '</ul>']];
  var html = extra.map(function (x) { return '<section class="card rv in rg-card" id="' + x[0] + '"><h2 id="' + x[1] + '">' + esc(x[2]) + '</h2>' + x[3] + '</section>'; }).join('');
  if (card && card.insertAdjacentHTML) card.insertAdjacentHTML('afterend', html);
  var ta = document.getElementById('rg-json');
  if (ta) ta.value = customText;
  el.querySelector('#rg-game').addEventListener('change', onGame);
  el.querySelector('#rg-lvs').addEventListener('change', onLevel);
  el.querySelector('#rg-new').addEventListener('click', newGame);
  el.querySelector('#rg-undo').addEventListener('click', undo);
  el.querySelector('#rg-redo').addEventListener('click', redo);
  el.querySelector('#rg-hint').addEventListener('click', onHint);
  el.querySelector('#rg-stop').addEventListener('click', onStop);
  el.querySelector('#rg-copy').addEventListener('click', function () { copyText(recordText(), function () { setText(el.querySelector('#rg-copied'), cur.L.t('copied')); }); });
  var ov = el.querySelector('#rg-ov');
  ov.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('.rg-pt') : null;
    if (!b) return;
    S.focus = +b.getAttribute('data-p');
    onPoint(S.focus);
  });
  ov.addEventListener('keydown', onKey);
  el.querySelector('#rg-choice').addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('.rg-ch') : null;
    if (!b || !S.choice) return;
    var a = S.choice[+b.getAttribute('data-i')];
    if (a) doPlay(a);
  });
  document.getElementById('rg-validate').addEventListener('click', checkCustom);
  document.getElementById('rg-play').addEventListener('click', playCustom);
  document.getElementById('rg-load').addEventListener('click', function () { if (S.game) { document.getElementById('rg-json').value = JSON.stringify(S.game, null, 2); customMsg('', false); } });
  document.getElementById('rg-down').addEventListener('click', function () {
    var t = document.getElementById('rg-json').value || (S.game ? JSON.stringify(S.game, null, 2) : '');
    if (t) downloadText((S.game && S.game.id ? S.game.id : 'game') + '.json', t);
  });
  renderRules();
  renderAll();
  scheduleAI();
}
