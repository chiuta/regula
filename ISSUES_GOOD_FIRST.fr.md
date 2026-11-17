# Bonnes premières tâches

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · **Français** · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Ajouter le Three Men’s Morris comme jeu fourni : partir de `docs/examples/three-mens-morris.json`, comparer la variante avec deux autres sources, ajouter les noms en sept langues et déplacer le fichier dans `data/games/`
- [ ] Faire relire par des locuteurs natifs les textes français, italiens, espagnols, portugais, allemands et hongrois : les `notes` des cinq jeux et les phrases de règles (`r_*`) de `src/i18n.mjs`
- [ ] Ajouter sous forme de fichiers de données des jeux de plateau traditionnels roumains à deux joueurs, sans dés (interroger les aînés, citer un livre ou une page pour chaque règle)
- [ ] Ajouter le Six Men’s Morris et le Twelve Men’s Morris sous forme de fichiers de données, avec une source citée pour les règles (les moulins sont déjà pris en charge)
- [ ] Ajouter au moteur les règles tafl manquantes : la capture par mur de boucliers, la victoire des défenseurs par fort de bord et la victoire par encerclement de tous les défenseurs (nouveaux champs `rules`, phrases en huit langues, tests)
- [ ] Ajouter d’autres variantes du tafl sous forme de données (Brandubh, Tablut, Fetlar), chacune avec ses sources et ses différences avec les règles de Copenhague
- [ ] Ajouter l’import d’un historique enregistré : coller une liste de coups et la rejouer sur le plateau
- [ ] Ajouter un niveau d’ordinateur plus fort (par exemple approfondissement itératif avec table de transposition) et tester qu’il bat le niveau moyen actuel
- [ ] Concevoir les dés et autres formes de hasard pour le format (un tirage à graine, pour que les historiques puissent être rejoués) et rédiger la proposition dans `docs/`
- [ ] Ajouter trois exemples de jeux de cartes avec une section `deck` dans le schéma (ils ne sont pas encore jouables : les décrire, avec leurs sources)

Créez-les toutes sur GitHub avec `scripts/create_issues.sh` (nécessite la CLI `gh`).
