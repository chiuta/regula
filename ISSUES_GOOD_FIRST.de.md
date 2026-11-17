# Gute erste Aufgaben

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · **Deutsch** · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Three Men’s Morris als mitgeliefertes Spiel hinzufügen: von `docs/examples/three-mens-morris.json` ausgehen, die Variante mit zwei weiteren Quellen vergleichen, die Namen in sieben Sprachen ergänzen und die Datei nach `data/games/` verschieben
- [ ] Muttersprachler die französischen, italienischen, spanischen, portugiesischen, deutschen und ungarischen Texte prüfen lassen: die `notes` der fünf Spiele und die Regelsätze (`r_*`) in `src/i18n.mjs`
- [ ] Traditionelle rumänische Brettspiele für zwei Personen ohne Würfel als Datendateien hinzufügen (ältere Verwandte fragen, für jede Regel ein Buch oder eine Seite zitieren)
- [ ] Sechs- und Zwölfmühle (Six Men’s Morris, Twelve Men’s Morris) als Datendateien hinzufügen, mit zitierter Quelle für die Regeln (Mühlen werden bereits unterstützt)
- [ ] Die fehlenden Tafl-Regeln im Motor ergänzen: den Schildwall-Fang, den Sieg der Verteidiger durch die Randfestung und den Sieg durch Einkreisen aller Verteidiger (neue `rules`-Felder, Sätze in acht Sprachen, Tests)
- [ ] Weitere Tafl-Varianten als Daten hinzufügen (Brandubh, Tablut, Fetlar), jede mit Quellen und Unterschieden zu den Kopenhagener Regeln
- [ ] Den Import eines gespeicherten Zugprotokolls ergänzen: eine Zugliste einfügen und auf dem Brett abspielen
- [ ] Eine stärkere Computerstufe ergänzen (zum Beispiel iterative Vertiefung mit Transpositionstabelle) und testen, dass sie die aktuelle mittlere Stufe schlägt
- [ ] Würfel und andere Zufallselemente für das Format entwerfen (ein Wurf mit Startwert, damit sich Protokolle abspielen lassen) und den Vorschlag in `docs/` schreiben
- [ ] Drei Kartenspiel-Beispiele mit einem `deck`-Abschnitt im Schema hinzufügen (noch nicht spielbar: beschreiben, mit Quellen)

Lege sie alle auf GitHub mit `scripts/create_issues.sh` an (benötigt die `gh`-CLI).
