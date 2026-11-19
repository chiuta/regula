# Änderungsprotokoll

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · **Deutsch** · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Unveröffentlicht]

## [0.2.1] - 2026-11-20

### Geändert
- fff-kit 1.8.1: Blockiert der Browser den Speicher oder fehlt er (`localStorage`/`sessionStorage` lösen einen Fehler aus oder fehlen), startet die Seite mit einem temporären Arbeitsspeicher, statt anzuhalten; die Daten bleiben nach dem Schließen der Seite nicht erhalten.
- fff-kit 1.8.1: Die Hilfe, die kleine Bedienelemente auf 44 px vergrößert, misst jetzt auch die Breite des Seitenkörpers und des übergeordneten Elements; eine Schaltflächenreihe kann den Bildschirm also nicht mehr verlassen (die Gruppe bleibt unverändert, wenn die Vergrößerung sie zu breit machen würde).

## [0.2.0] - 2026-11-17

### Hinzugefügt
- Fünf spielbare Spiele als Datendateien in `data/games/`: Mühle, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Kopenhagen 11 × 11, vereinfacht), jedes mit Quellen und Hinweisen zu den getroffenen Entscheidungen.
- Ein Regelmotor (`src/engine.mjs`) für Zwei-Personen-Spiele auf Gitter- und Graphbrettern: Setzen, Schritte, Gleiten, Fliegen, Sprünge, Annähern und Zurückziehen, Mühlen, Fang durch Einklemmen und Königsfang, gesperrte Punkte, Sieg- und Remisregeln; ein Computergegner (Minimax mit Alpha-Beta-Beschneidung).
- Oberfläche: ein beschrifteter Knopf für jeden Punkt (Maus, Touch, Tastatur, Screenreader), ein Spielertyp je Seite, Rückgängig und Wiederholen, Tipp, Zugprotokoll, Regeln in acht Sprachen aus den Spieldaten und dein eigenes Spiel als JSON (prüfen, spielen, herunterladen).
- `schema.json` erweitert (board, pieces, rules, status, names, notes); `docs/moves.md` (das Format) und `docs/tutorial.md` (20 Minuten), auf Englisch und Rumänisch, mit einem getesteten Beispielspiel.
- Tests: `node --test` für den Motor (von Hand berechnete Zugzahlen), die Daten und die Dokumentation; Browsertests im Hub (acht Sprachen, Barrierefreiheit, feindlicher gespeicherter Zustand, kleine Bildschirme).
- `src/` und `scripts/build.mjs`: Die eine `index.html` wird jetzt aus Quellen gebaut, `--check` prüft sie.
- ISSUES_GOOD_FIRST und CODE_OF_CONDUCT in alle acht Sprachen übersetzt.
- README auf Englisch, Rumänisch, Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch und Ungarisch: Abschnitte zu Status und geplantem Umfang (abgeleitet aus `ISSUES_GOOD_FIRST.md`).
- Installierbar (PWA): `manifest.webmanifest`, `sw.js` und die Symbole werden vom gemeinsamen Kit (`fff-kit/pwa`) erzeugt; die Seite funktioniert nach dem ersten Besuch über HTTPS offline.

### Geändert
- Der Workflow läuft auf Ubuntu 26.04 mit Node.js 26 und führt auch die Tests und die Build-Prüfung aus.

## [0.1.0] - 2026-11-13

### Hinzugefügt
- Erstes Gerüst: Struktur, Datenschema oder erste Beispiele, Beitragsanleitungen in acht Sprachen.
