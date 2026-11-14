# REGULA

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.1.0 · Ultima actualizare: 2026-11-14

🌐 https://regula.chiuta.ro

> Descrie orice joc tradițional de tablă sau de cărți într-un fișier JSON și joacă-l — un singur motor de reguli pentru toate jocurile.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa: depozitul conține structura, schema de date sau primele exemple și ghidurile de contribuție. Domeniul de mai jos este planul, nu ceea ce funcționează azi.

## Domeniu planificat

- O schemă JSON v1.0 pentru mutări (pas, săritură, captură, plasare), documentată în `docs/moves.md`, și teste unitare pentru validatorul de mutări.
- Jocuri clasice ca date: Moara, Alquerque, Hnefatafl, Mu Torere și Fanorona, plus cinci jocuri tradiționale românești.
- Un randator minimal în browser pentru `board.type = grid` și un adversar cu mutări aleatorii care funcționează cu orice fișier de joc valid.
- Trei exemple de jocuri de cărți cu o secțiune `deck` în schemă.
- Generatoare de reguli în text (engleză și română) și un tutorial scurt: „Adaugă jocul bunicilor tăi în 20 de minute”.

Nimic din asta nu este implementat încă: fiecare punct este o sarcină gata pregătită în `ISSUES_GOOD_FIRST.md`.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/games/example.json` în `data/games/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
