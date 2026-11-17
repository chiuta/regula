import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';
import i18n from '../src/i18n.mjs';
import { GAMES_DIR, readGame, load, playable } from './_games.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['ro', 'en', 'fr', 'de', 'es', 'it', 'hu', 'pt'];
const files = fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith('.json'));

test('fiecare fișier de joc: id = numele fișierului, câmpurile obligatorii, surse http(s), stare cunoscută', () => {
  assert.ok(files.length >= 6);
  files.forEach((f) => {
    const g = readGame(f.replace(/\.json$/, ''));
    if (f !== 'example.json') assert.equal(g.id, f.replace(/\.json$/, ''), f + ': id');   // șablonul example.json păstrează id-ul jocului pe care îl descrie
    ['name', 'region', 'setup', 'win'].forEach((k) => assert.ok(typeof g[k] === 'string' && g[k].length > 2, f + ': ' + k));
    assert.ok(Array.isArray(g.moves) && g.moves.length >= 1, f + ': moves');
    assert.ok(Array.isArray(g.pieces) && g.pieces.length >= 1, f + ': pieces');
    assert.ok(Array.isArray(g.sources) && g.sources.length >= 1 && g.sources.every((u) => /^https?:\/\/\S+$/.test(u)), f + ': sources');
    if (g.status !== undefined) assert.ok(['established', 'reconstructed', 'simplified', 'unverified'].includes(g.status), f + ': status');
  });
});

test('jocurile jucabile: se compilează fără erori, au nume localizate și note pentru cele nesigure', () => {
  const ids = playable();
  assert.deepEqual(ids.sort(), ['alquerque', 'fanorona', 'hnefatafl', 'mu-torere', 'nine-mens-morris']);
  ids.forEach((id) => {
    const g = readGame(id);
    assert.deepEqual(E.validateGame(g), [], id);
    assert.ok(g.status, id + ': status lipsă');
    LANGS.filter((l) => l !== 'en').forEach((l) => assert.ok(g.names && g.names[l], id + ': nume în ' + l));
    if (g.status !== 'established') assert.ok(g.notes && g.notes.en && g.notes.ro, id + ': note despre alegeri pentru un joc ' + g.status);
  });
});

test('cele cinci jocuri incluse au numele și notele în toate cele opt limbi (restul jocurilor pot avea doar en și ro; celelalte limbi revin la engleză)', () => {
  ['nine-mens-morris', 'alquerque', 'fanorona', 'mu-torere', 'hnefatafl'].forEach((id) => {
    const g = readGame(id);
    LANGS.forEach((l) => {
      assert.ok(g.notes && typeof g.notes[l] === 'string' && g.notes[l].length > 60, id + ': nota în ' + l);
      assert.ok(g.names && g.names[l], id + ': numele în ' + l);
    });
    assert.equal(g.names.en, g.name, id + ': names.en repetă name');
  });
});

test('numărul de piese din poziția de start coincide cu «pieces» din fișier, pe fiecare latură', () => {
  playable().forEach((id) => {
    const g = readGame(id), G = load(id), s = E.initialState(G);
    G.sides.forEach((sd, si) => {
      const want = g.pieces.filter((p) => p.side === undefined || p.side === sd).reduce((a, p) => a + p.count, 0);
      assert.equal(E.pieceTotal(G, s, si), want, id + ' ' + sd);
    });
  });
});

test('descrierea-șablon (example.json) este doar descriptivă: schema o acceptă, motorul o refuză cu un mesaj clar', () => {
  const g = readGame('example');
  assert.equal(g.rules, undefined);
  assert.match(E.validateGame(g).join(), /descriptive only/);
});

test('schema.json: fișierele jucabile folosesc doar chei cunoscute la nivel superior și în board', () => {
  const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schema.json'), 'utf8'));
  const top = Object.keys(schema.properties), board = Object.keys(schema.properties.board.properties);
  playable().forEach((id) => {
    const g = readGame(id);
    Object.keys(g).forEach((k) => assert.ok(top.includes(k), id + ': cheie necunoscută «' + k + '»'));
    Object.keys(g.board).forEach((k) => assert.ok(board.includes(k), id + ': board.' + k));
  });
  const mt = schema.properties.rules.properties.moves.items.properties.type.enum;
  assert.deepEqual(mt.slice().sort(), E.MOVE_TYPES.slice().sort(), 'tipurile de mutări din schemă = cele din motor');
  const wt = schema.properties.rules.properties.win.items.properties.type.enum;
  assert.deepEqual(wt.slice().sort(), E.WIN_TYPES.slice().sort(), 'tipurile de victorie din schemă = cele din motor');
});

test('texte: opt limbi cu aceleași chei și aceiași substituenți, fără șiruri goale', () => {
  assert.deepEqual(Object.keys(i18n).sort(), LANGS.slice().sort());
  const ref = Object.keys(i18n.en);
  const ph = (s) => (String(s).match(/\{\d\}/g) || []).sort().join('');
  LANGS.forEach((l) => {
    assert.deepEqual(Object.keys(i18n[l]), ref, l + ': chei');
    ref.forEach((k) => { assert.ok(i18n[l][k] && i18n[l][k].trim(), l + ':' + k + ' gol'); assert.equal(ph(i18n[l][k]), ph(i18n.en[k]), l + ':' + k + ' substituenți'); });
  });
  ['nav', 'title', 'open'].forEach((k) => assert.ok(i18n.en[k]));
});

test('codul sursă: sintaxă compatibilă cu ES2017 și fără atribute style în interfață', () => {
  const bad = [/\?\./, /\?\?/, /\.padStart\(|\.padEnd\(/, /\.flat\(|\.flatMap\(/, /Object\.fromEntries|\.replaceAll\(|structuredClone|\.at\(-?\d/, /\(\?<[=!a-z]/, /\{\s*\.\.\.[a-z]/i, /\bBigInt\b|\d+n\b/];
  ['engine.mjs', 'ui.js', 'i18n.mjs'].forEach((f) => {
    const t = fs.readFileSync(path.join(ROOT, 'src', f), 'utf8').split('\n').filter((l) => !/^\s*(\/\/|\/\*)/.test(l)).join('\n');
    bad.forEach((re) => assert.ok(!re.test(t.replace(/'(?:[^'\\\n]|\\.)*'/g, "''")), f + ': ' + re));
  });
  assert.ok(!/style\s*=\s*["']/.test(fs.readFileSync(path.join(ROOT, 'src', 'ui.js'), 'utf8')));
});
