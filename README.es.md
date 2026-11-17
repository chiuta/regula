# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.2.0 · Última actualización: 2026-11-17

🌐 https://regula.chiuta.ro

> Describe cualquier juego tradicional de mesa o de cartas en un archivo JSON y juega — un solo motor de reglas para todos los juegos.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa, utilizable: cinco juegos clásicos para dos jugadores se juegan en el único archivo `index.html` (se abre sin conexión, sin servidor), contra el ordenador o contra otra persona; las reglas de cada juego se escriben en ocho idiomas a partir de los mismos datos que juega el motor, y puedes pegar tu propio archivo de juego. Los límites están listados más abajo.

## Qué hace

- Juega cinco juegos clásicos desde archivos de datos: Juego del molino, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenhague 11 × 11, simplificado). Cada uno tiene un origen, una indicación de lo seguras que son las reglas, notas sobre las decisiones tomadas y fuentes.
- Cada bando puede ser una persona, un jugador aleatorio o el ordenador en dos niveles; jugadas con el ratón, con el dedo o con el teclado; deshacer, rehacer, una sugerencia y un registro de jugadas que se puede copiar.
- Escribe las reglas del juego elegido en ocho idiomas, generadas a partir de los mismos datos que juega el motor, así que el texto y el juego no pueden contradecirse.
- Tu propio juego: pega un juego como JSON, valídalo con mensajes que nombran el campo erróneo, juégalo y descárgalo. No se sube nada.
- Interfaz en ocho idiomas, temas oscuro y claro, un botón con etiqueta para cada punto (lectores de pantalla, teclado), funciona desde 360 px de ancho; sin red, sin rastreo.
- Instalable como aplicación y disponible sin conexión tras la primera visita cuando se sirve por HTTPS (un service worker conserva la página; no se guarda ni se envía nada más). Abierta desde un archivo descargado funciona igual, sin instalación.

## Cómo funciona

- Un archivo JSON por juego en `data/games/`, comprobado por `schema.json`; el formato se describe en `docs/moves.md` y el tutorial es `docs/tutorial.md` (inglés y rumano).
- `src/engine.mjs` es el motor de reglas (sin pantalla, sin red): compila un juego, enumera las jugadas legales, las aplica y busca con minimax y poda alfa–beta para el rival ordenador.
- `src/ui.js`, `src/i18n.mjs` y `src/app.css` son la interfaz; `node scripts/build.mjs` construye el único `index.html` (`--check` verifica que coincide).
- `npm test` ejecuta las pruebas del motor (números de jugadas calculados a mano), de los archivos de datos y de la documentación; `python scripts/validate.py` comprueba los archivos JSON. El desarrollo requiere Node.js 24 o más reciente; la página en sí solo requiere un navegador que conozca ES2017.
- `manifest.webmanifest`, `sw.js` y los iconos los produce `node scripts/build.mjs` mediante el kit común (sección `pwa` de `src/app.json`); `--check` también los verifica, y `npm test` comprueba que el manifiesto, la versión del service worker y la CSP coincidan con la página.

## Límites, dichos con claridad

- Los juegos históricos son reconstrucciones: las fuentes son incompletas y las elecciones modernas se indican en cada juego. No son reglas de torneo.
- El hnefatafl está simplificado: faltan la captura por muro de escudos, la victoria por fuerte en el borde y la victoria por cerco de todos los defensores.
- El rival informático usa una búsqueda minimax corta (fácil: profundidad 2; medio: profundidad 5, con límite de nodos); juega razonablemente, no a la perfección. El nivel aleatorio mueve al azar.
- Las tablas por repetición o por turnos sin captura son convenciones de la aplicación, indicadas en cada juego. Los juegos de cartas aún no se pueden jugar.
- El motor solo maneja juegos de dos jugadores en tableros de cuadrícula o de grafo; aún no hay reglas para dados, cartas ocultas ni más jugadores.
- Faltan los juegos tradicionales rumanos aparte de la Moara (Țintar): sus reglas no se verificaron en fuentes. Véanse las tareas abiertas.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/games/example.json` en `data/games/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.
5. Para cambiar el motor o la interfaz, edita `src/` y ejecuta `npm test` y `node scripts/build.mjs` (consulta `CONTRIBUTING.md`).

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
