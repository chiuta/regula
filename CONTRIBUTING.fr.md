# Contribuer — REGULA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · **Français** · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version : 0.2.1 · Dernière mise à jour : 2026-11-20

1. Forkez ce dépôt.
2. Copiez `data/games/example.json` dans `data/games/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Règles

- Une entrée = un fichier.
- Citez toujours une source.
- Ne contribuez qu'avec du matériel que vous pouvez légalement partager (pas de texte protégé copié).
- Soyez bienveillant : voir le Code de conduite.

## Ajouter un jeu

1. Lisez `docs/tutorial.md` (20 minutes) et gardez `docs/moves.md` ouvert : il décrit chaque champ.
2. Copiez `data/games/example.json` vers `data/games/<id>.json`. La description seule (`name`, `region`, `setup`, `moves`, `win`, `sources`) est déjà une contribution valide ; ajoutez `rules` pour rendre le jeu jouable.
3. Lancez `python scripts/validate.py`, puis collez le fichier dans **Votre propre jeu** de l’application : *Valider* nomme chaque erreur.
4. Pour un jeu jouable, ajoutez `names` en `ro fr de es it hu pt`, un `status` honnête et des `notes` en `en` et `ro` sur chaque choix fait ; citez une source pour chaque règle.
5. Ajoutez à `test/engine.test.mjs` le nombre de premiers coups, calculé à la main, et lancez `npm test`.
6. Pour ajouter un nouveau type de coup ou de victoire, modifiez `src/engine.mjs` (`MOVE_TYPES` ou `WIN_TYPES`, `compile`, `explain`), ajoutez les phrases de la règle dans les huit langues dans `src/i18n.mjs`, complétez `schema.json` et `docs/moves.md`, et ajoutez des tests.
7. Lancez `node scripts/build.mjs` et validez l’`index.html` régénéré avec `src/`.
