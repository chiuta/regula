# Registro de cambios

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · **Español** · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Sin publicar]

## [0.2.0] - 2026-11-17

### Añadido
- Cinco juegos jugables como archivos de datos en `data/games/`: Juego del molino, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenhague 11 × 11, simplificado), cada uno con fuentes y notas sobre las decisiones tomadas.
- Un motor de reglas (`src/engine.mjs`) para juegos de dos jugadores en tableros de cuadrícula y de grafo: colocación, pasos, deslizamientos, vuelo, saltos, aproximación y retirada, molinos, captura por custodia y del rey, puntos reservados, reglas de victoria y de tablas; un rival ordenador (minimax con poda alfa–beta).
- Interfaz: un botón con etiqueta para cada punto (ratón, táctil, teclado, lector de pantalla), un tipo de jugador para cada bando, deshacer y rehacer, sugerencia, registro de jugadas, reglas escritas en ocho idiomas a partir de los datos del juego y tu propio juego como JSON (validar, jugar, descargar).
- `schema.json` ampliado (board, pieces, rules, status, names, notes); `docs/moves.md` (el formato) y `docs/tutorial.md` (20 minutos), en inglés y rumano, con un juego de ejemplo probado.
- Pruebas: `node --test` para el motor (números de jugadas calculados a mano), los datos y la documentación; pruebas de navegador en el hub (ocho idiomas, accesibilidad, estado guardado hostil, pantallas pequeñas).
- `src/` y `scripts/build.mjs`: el único `index.html` se construye ahora a partir de las fuentes, y `--check` lo verifica.
- ISSUES_GOOD_FIRST y CODE_OF_CONDUCT traducidos a los ocho idiomas.
- README en inglés, rumano, francés, italiano, español, portugués, alemán y húngaro: secciones de estado y de alcance previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalable (PWA): `manifest.webmanifest`, `sw.js` y los iconos los genera el kit común (`fff-kit/pwa`); la página funciona sin conexión tras la primera visita por HTTPS.

### Cambiado
- El workflow se ejecuta en Ubuntu 26.04 con Node.js 26 y ejecuta también las pruebas y la comprobación de la compilación.

## [0.1.0] - 2026-11-13

### Añadido
- Esqueleto inicial: estructura, esquema de datos o primeros ejemplos, guías de contribución en ocho idiomas.
