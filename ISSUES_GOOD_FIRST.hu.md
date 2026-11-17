# Jó első feladatok

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · **Magyar**

- [ ] A Three Men’s Morris felvétele a mellékelt játékok közé: kiindulás a `docs/examples/three-mens-morris.json` fájlból, a változat összevetése még két forrással, a nevek hozzáadása hét nyelven, és a fájl áthelyezése a `data/games/` mappába
- [ ] Anyanyelvi beszélőkkel átnézetni a francia, olasz, spanyol, portugál, német és magyar szövegeket: az öt játék `notes` jegyzeteit és a szabálymondatokat (`r_*`) a `src/i18n.mjs` fájlban
- [ ] Hagyományos román, kétszemélyes, kocka nélküli táblajátékok felvétele adatfájlként (idősebb rokonok megkérdezése, minden szabályhoz könyv vagy oldal idézése)
- [ ] A Six Men’s Morris és a Twelve Men’s Morris felvétele adatfájlként, a szabályok idézett forrásával (a malmok már támogatottak)
- [ ] A hiányzó tafl-szabályok hozzáadása a motorhoz: a pajzsfal-fogás, a védők győzelme a peremerőddel és a győzelem az összes védő bekerítésével (új `rules` mezők, mondatok nyolc nyelven, tesztek)
- [ ] További tafl-változatok felvétele adatként (Brandubh, Tablut, Fetlar), mindegyik forrásokkal és a koppenhágai szabályoktól való eltérésekkel
- [ ] Mentett lépéslista importálása: lépéslista beillesztése és lejátszása a táblán
- [ ] Erősebb számítógépes szint hozzáadása (például iteratív mélyítés transzpozíciós táblával), és annak tesztelése, hogy legyőzi a mostani közepes szintet
- [ ] Kockák és más véletlenelemek megtervezése a formátumhoz (magos dobás, hogy a lépéslisták újra lejátszhatók legyenek), és a javaslat megírása a `docs/` mappában
- [ ] Három kártyajáték-példa hozzáadása `deck` szakasszal a sémában (még nem játszhatók: leírni őket, forrásokkal)

Hozd létre mindet GitHubon a `scripts/create_issues.sh` szkripttel (a `gh` CLI szükséges).
