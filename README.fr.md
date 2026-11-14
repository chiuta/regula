# REGULA

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.1.0 · Dernière mise à jour : 2026-11-14

🌐 https://regula.chiuta.ro

> Décrivez n'importe quel jeu de plateau ou de cartes traditionnel dans un fichier JSON et jouez-y — un seul moteur de règles pour tous les jeux.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha : le dépôt contient la structure, le schéma de données ou les premiers exemples et les guides de contribution. Le périmètre ci-dessous est le plan, pas ce qui fonctionne aujourd’hui.

## Périmètre prévu

- Un schéma JSON v1.0 pour les coups (pas, saut, capture, pose), documenté dans `docs/moves.md`, et des tests unitaires pour le validateur de coups.
- Des jeux classiques comme données : Moulin, Alquerque, Hnefatafl, Mu Torere et Fanorona, plus cinq jeux traditionnels roumains.
- Un rendu minimal dans le navigateur pour `board.type = grid` et un adversaire à coups aléatoires qui fonctionne avec tout fichier de jeu valide.
- Trois exemples de jeux de cartes avec une section `deck` dans le schéma.
- Des générateurs de règles en texte (anglais et roumain) et un court tutoriel : « Ajoutez le jeu de vos grands-parents en 20 minutes ».

Rien de tout cela n’est encore implémenté : chaque point est une tâche prête dans `ISSUES_GOOD_FIRST.md`.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/games/example.json` dans `data/games/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
