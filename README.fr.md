# REGULA

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.2.0 · Dernière mise à jour : 2026-11-17

🌐 https://regula.chiuta.ro

> Décrivez n'importe quel jeu de plateau ou de cartes traditionnel dans un fichier JSON et jouez-y — un seul moteur de règles pour tous les jeux.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha, utilisable : cinq jeux classiques à deux joueurs se jouent dans l’unique fichier `index.html` (à ouvrir hors ligne, sans serveur), contre l’ordinateur ou une autre personne ; les règles de chaque jeu sont écrites en huit langues à partir des mêmes données que celles que joue le moteur, et vous pouvez coller votre propre fichier de jeu. Les limites sont listées plus bas.

## Ce que fait l’application

- Joue cinq jeux classiques décrits dans des fichiers de données : Jeu du moulin, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenhague 11 × 11, simplifié). Chacun a une origine, une indication de la fiabilité des règles, des notes sur les choix faits et des sources.
- Chaque camp peut être une personne, un joueur aléatoire ou l’ordinateur à deux niveaux ; coups à la souris, au doigt ou au clavier ; annuler, rétablir, un conseil et un historique des coups que l’on peut copier.
- Écrit les règles du jeu choisi en huit langues, générées à partir des mêmes données que celles que joue le moteur : le texte et le jeu ne peuvent donc pas se contredire.
- Votre propre jeu : collez un jeu en JSON, validez-le avec des messages qui nomment le champ fautif, jouez-y et téléchargez-le. Rien n’est envoyé.
- Interface en huit langues, thèmes sombre et clair, un bouton étiqueté pour chaque point (lecteurs d’écran, clavier), utilisable dès 360 px de large ; sans réseau, sans suivi.
- Installable comme une application et disponible hors ligne après la première visite lorsqu’elle est servie en HTTPS (un service worker conserve la page ; rien d’autre n’est stocké ni envoyé). Ouverte depuis un fichier téléchargé, elle fonctionne de la même manière, sans installation.

## Comment ça marche

- Un fichier JSON par jeu dans `data/games/`, vérifié par `schema.json` ; le format est décrit dans `docs/moves.md` et le tutoriel est `docs/tutorial.md` (anglais et roumain).
- `src/engine.mjs` est le moteur de règles (sans écran, sans réseau) : il compile un jeu, liste les coups légaux, les applique et cherche avec minimax et élagage alpha–bêta pour l’adversaire ordinateur.
- `src/ui.js`, `src/i18n.mjs` et `src/app.css` forment l’interface ; `node scripts/build.mjs` construit l’unique `index.html` (`--check` vérifie qu’il correspond).
- `npm test` lance les tests du moteur (nombres de coups calculés à la main), des fichiers de données et de la documentation ; `python scripts/validate.py` vérifie les fichiers JSON. Le développement demande Node.js 24 ou plus récent ; la page elle-même demande seulement un navigateur qui connaît ES2017.
- `manifest.webmanifest`, `sw.js` et les icônes sont produits par `node scripts/build.mjs` via le kit commun (section `pwa` de `src/app.json`) ; `--check` les vérifie aussi, et `npm test` contrôle que le manifeste, la version du service worker et la CSP correspondent à la page.

## Limites, dites clairement

- Les jeux historiques sont des reconstitutions : les sources sont incomplètes et les choix modernes sont indiqués pour chaque jeu. Ce ne sont pas des règles de tournoi.
- Le hnefatafl est simplifié : la prise par mur de boucliers, la victoire par fort de bord et la victoire par encerclement de tous les défenseurs manquent.
- L’adversaire informatique est une courte recherche minimax (facile : profondeur 2 ; moyen : profondeur 5, avec limite de nœuds) ; il joue raisonnablement, pas parfaitement. Le niveau aléatoire joue au hasard.
- Les nulles par répétition ou par tours sans prise sont des conventions de l’application, indiquées pour chaque jeu. Les jeux de cartes ne sont pas encore jouables.
- Le moteur ne gère que des jeux à deux joueurs sur plateaux en grille ou en graphe ; il n’y a pas encore de règles pour les dés, les cartes cachées ou davantage de joueurs.
- Les jeux traditionnels roumains autres que la Moara (Țintar) manquent : leurs règles n’ont pas été vérifiées dans des sources. Voir les tâches ouvertes.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/games/example.json` dans `data/games/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.
5. Pour modifier le moteur ou l’interface, éditez `src/`, puis lancez `npm test` et `node scripts/build.mjs` (voir `CONTRIBUTING.md`).

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
