# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

🌐 https://regula.chiuta.ro

> Beschreibe jedes traditionelle Brett- oder Kartenspiel in einer JSON-Datei und spiele es — eine Regel-Engine für alle Spiele.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha, nutzbar: fünf klassische Spiele für zwei Personen sind in der einen Datei `index.html` spielbar (offline öffnen, ohne Server), gegen den Computer oder eine andere Person; die Regeln jedes Spiels werden in acht Sprachen aus denselben Daten geschrieben, die der Motor spielt, und du kannst deine eigene Spieldatei einfügen. Die Grenzen stehen weiter unten.

## Was es kann

- Spielt fünf klassische Spiele aus Datendateien: Mühle, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Kopenhagen 11 × 11, vereinfacht). Jedes hat eine Herkunft, eine Angabe zur Verlässlichkeit der Regeln, Hinweise zu den getroffenen Entscheidungen und Quellen.
- Jede Seite kann ein Mensch, ein Zufallsspieler oder der Computer auf zwei Stufen sein; Züge per Maus, Fingertipp oder Tastatur; Rückgängig, Wiederholen, ein Tipp und ein kopierbares Zugprotokoll.
- Schreibt die Regeln des gewählten Spiels in acht Sprachen, erzeugt aus denselben Daten, die der Motor spielt – Text und Spiel können sich also nicht widersprechen.
- Dein eigenes Spiel: Spiel als JSON einfügen, mit Meldungen prüfen, die das fehlerhafte Feld nennen, spielen und herunterladen. Es wird nichts hochgeladen.
- Oberfläche in acht Sprachen, dunkles und helles Design, ein beschrifteter Knopf für jeden Punkt (Screenreader, Tastatur), nutzbar ab 360 px Breite; ohne Netzwerk, ohne Tracking.
- Als App installierbar und nach dem ersten Besuch offline verfügbar, wenn sie über HTTPS ausgeliefert wird (ein Service Worker behält die Seite; sonst wird nichts gespeichert oder gesendet). Aus einer heruntergeladenen Datei geöffnet, funktioniert sie genauso, ohne Installation.

## Wie es funktioniert

- Eine JSON-Datei pro Spiel in `data/games/`, geprüft durch `schema.json`; das Format steht in `docs/moves.md`, die Anleitung in `docs/tutorial.md` (Englisch und Rumänisch).
- `src/engine.mjs` ist der Regelmotor (ohne Bildschirm, ohne Netzwerk): Er kompiliert ein Spiel, listet die erlaubten Züge auf, wendet sie an und sucht mit Minimax und Alpha-Beta-Beschneidung für den Computergegner.
- `src/ui.js`, `src/i18n.mjs` und `src/app.css` bilden die Oberfläche; `node scripts/build.mjs` baut die eine `index.html` (`--check` prüft, ob sie übereinstimmt).
- `npm test` führt die Tests des Motors (von Hand berechnete Zugzahlen), der Datendateien und der Dokumentation aus; `python scripts/validate.py` prüft die JSON-Dateien. Für die Entwicklung braucht man Node.js 24 oder neuer; die Seite selbst braucht nur einen Browser, der ES2017 kennt.
- `manifest.webmanifest`, `sw.js` und die Symbole erzeugt `node scripts/build.mjs` über das gemeinsame Kit (Abschnitt `pwa` in `src/app.json`); `--check` prüft sie ebenfalls, und `npm test` stellt sicher, dass Manifest, Service-Worker-Version und CSP zur Seite passen.

## Grenzen, offen gesagt

- Die historischen Spiele sind Rekonstruktionen: Die Quellen sind lückenhaft, und moderne Festlegungen sind bei jedem Spiel vermerkt. Es sind keine Turnierregeln.
- Hnefatafl ist vereinfacht: Der Schildwall-Schlag, der Randfestungs-Sieg und der Sieg durch Einkreisen aller Verteidiger fehlen.
- Der Computergegner nutzt eine kurze Minimax-Suche (leicht: Tiefe 2; mittel: Tiefe 5 mit Knotenlimit); er spielt vernünftig, nicht perfekt. Die Stufe „zufällig“ zieht zufällig.
- Remis durch Wiederholung oder durch Züge ohne Schlag sind Konventionen der App und bei jedem Spiel vermerkt. Kartenspiele sind noch nicht spielbar.
- Die Engine verarbeitet nur Zwei-Personen-Spiele auf Gitter- oder Graphbrettern; für Würfel, verdeckte Karten oder mehr Spieler gibt es noch keine Regeln.
- Traditionelle rumänische Spiele außer Moara (Țintar) fehlen: Ihre Regeln wurden nicht anhand von Quellen geprüft. Siehe die offenen Aufgaben.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/games/example.json` nach `data/games/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.
5. Um den Motor oder die Oberfläche zu ändern, bearbeite `src/` und führe dann `npm test` und `node scripts/build.mjs` aus (siehe `CONTRIBUTING.md`).

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
