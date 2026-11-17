# Sarcini bune pentru început

[English](ISSUES_GOOD_FIRST.md) · **Română** · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Adaugă Three Men’s Morris ca joc inclus: pornește de la `docs/examples/three-mens-morris.json`, compară varianta cu încă două surse, adaugă numele în șapte limbi și mută fișierul în `data/games/`
- [ ] Cere vorbitorilor nativi să revizuiască textele în franceză, italiană, spaniolă, portugheză, germană și maghiară: `notes` ale celor cinci jocuri și propozițiile regulilor (`r_*`) din `src/i18n.mjs`
- [ ] Adaugă jocuri de masă tradiționale românești pentru doi jucători, fără zaruri (întreabă rudele mai în vârstă, citează o carte sau o pagină pentru fiecare regulă), ca fișiere de date
- [ ] Adaugă Six Men’s Morris și Twelve Men’s Morris ca fișiere de date, cu o sursă citată pentru reguli (morile sunt deja acceptate)
- [ ] Adaugă în motor regulile tafl lipsă: captura „zid de scuturi”, victoria apărătorilor prin fort pe margine și victoria prin încercuirea tuturor apărătorilor (câmpuri `rules` noi, propoziții în opt limbi, teste)
- [ ] Adaugă alte variante tafl ca date (Brandubh, Tablut, Fetlar), fiecare cu sursele ei și diferențele față de regulile de la Copenhaga
- [ ] Adaugă importul unei înregistrări salvate: lipește o listă de mutări și redă-o pe tablă
- [ ] Adaugă un nivel mai puternic al calculatorului (de exemplu aprofundare iterativă cu tabel de transpoziție) și testează că bate nivelul mediu actual
- [ ] Proiectează zarurile și alte forme de șansă pentru format (o aruncare cu sămânță, ca înregistrările să poată fi redate) și scrie propunerea în `docs/`
- [ ] Adaugă trei exemple de jocuri de cărți cu o secțiune `deck` în schemă (încă nu se pot juca: descrie-le, cu surse)

Creează-le pe toate pe GitHub cu `scripts/create_issues.sh` (cere CLI-ul `gh`).
