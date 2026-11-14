# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.1.0 · Letzte Aktualisierung: 2026-11-14

🌐 https://regula.chiuta.ro

> Beschreibe jedes traditionelle Brett- oder Kartenspiel in einer JSON-Datei und spiele es — eine Regel-Engine für alle Spiele.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha: Das Repository enthält die Struktur, das Datenschema oder die ersten Beispiele und die Beitragsleitfäden. Der Umfang unten ist der Plan, nicht das, was heute funktioniert.

## Geplanter Umfang

- Ein JSON-Schema v1.0 für Züge (Schritt, Sprung, Schlagen, Setzen), dokumentiert in `docs/moves.md`, und Unit-Tests für den Zugvalidator.
- Klassische Spiele als Daten: Mühle, Alquerque, Hnefatafl, Mu Torere und Fanorona, dazu fünf traditionelle rumänische Spiele.
- Ein minimaler Browser-Renderer für `board.type = grid` und ein Zufallszug-Gegner, der mit jeder gültigen Spieldatei funktioniert.
- Drei Kartenspiel-Beispiele mit einem Abschnitt `deck` im Schema.
- Regel-zu-Text-Generatoren (Englisch und Rumänisch) und ein kurzes Tutorial: „Das Spiel der Großeltern in 20 Minuten hinzufügen“.

Nichts davon ist bisher umgesetzt: Jeder Punkt ist eine fertig vorbereitete Aufgabe in `ISSUES_GOOD_FIRST.md`.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/games/example.json` nach `data/games/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
