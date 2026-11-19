# Journal des modifications

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · **Français** · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non publié]

## [0.2.1] - 2026-11-20

### Modifié
- fff-kit 1.8.1 : lorsque le navigateur bloque le stockage ou en est dépourvu (`localStorage`/`sessionStorage` lèvent une erreur ou sont absents), la page démarre avec un stockage temporaire en mémoire au lieu de s’arrêter ; les données ne sont pas conservées après la fermeture de la page.
- fff-kit 1.8.1 : le dispositif qui agrandit les petits contrôles à 44 px mesure désormais aussi la largeur du corps de la page et de l’élément parent ; une rangée de boutons ne peut donc plus sortir de l’écran (le groupe reste inchangé lorsque l’agrandissement le ferait déborder).

## [0.2.0] - 2026-11-17

### Ajouté
- Cinq jeux jouables sous forme de fichiers de données dans `data/games/` : Jeu du moulin, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenhague 11 × 11, simplifié), chacun avec des sources et des notes sur les choix faits.
- Un moteur de règles (`src/engine.mjs`) pour les jeux à deux joueurs sur plateaux en grille et en graphe : placement, pas, glissements, vol, sauts, approche et retrait, moulins, capture par encadrement et capture du roi, points réservés, règles de victoire et de nulle ; un adversaire ordinateur (minimax avec élagage alpha–bêta).
- Interface : un bouton étiqueté pour chaque point (souris, toucher, clavier, lecteur d’écran), un type de joueur pour chaque camp, annuler et rétablir, conseil, historique des coups, règles écrites en huit langues à partir des données du jeu, et votre propre jeu en JSON (validation, jeu, téléchargement).
- `schema.json` étendu (board, pieces, rules, status, names, notes) ; `docs/moves.md` (le format) et `docs/tutorial.md` (20 minutes), en anglais et en roumain, avec un jeu d’exemple testé.
- Tests : `node --test` pour le moteur (nombres de coups calculés à la main), les données et la documentation ; tests de navigateur dans le hub (huit langues, accessibilité, état stocké hostile, petits écrans).
- `src/` et `scripts/build.mjs` : l’unique `index.html` est désormais construit à partir des sources, et `--check` le vérifie.
- ISSUES_GOOD_FIRST et CODE_OF_CONDUCT traduits dans les huit langues.
- README en anglais, roumain, français, italien, espagnol, portugais, allemand et hongrois : sections d’état et de périmètre prévu (dérivées de `ISSUES_GOOD_FIRST.md`).
- Installable (PWA) : `manifest.webmanifest`, `sw.js` et les icônes sont générés par le kit commun (`fff-kit/pwa`) ; la page fonctionne hors ligne après la première visite en HTTPS.

### Modifié
- Le workflow s’exécute sur Ubuntu 26.04 avec Node.js 26 et lance aussi les tests et la vérification de la construction.

## [0.1.0] - 2026-11-13

### Ajouté
- Squelette initial : structure, schéma de données ou premiers exemples, guides de contribution en huit langues.
