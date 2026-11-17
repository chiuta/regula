# Buenas primeras tareas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · **Español** · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Añadir el Three Men’s Morris como juego incluido: partir de `docs/examples/three-mens-morris.json`, comparar la variante con otras dos fuentes, añadir los nombres en siete idiomas y mover el archivo a `data/games/`
- [ ] Pedir a hablantes nativos que revisen los textos en francés, italiano, español, portugués, alemán y húngaro: las `notes` de los cinco juegos y las frases de reglas (`r_*`) de `src/i18n.mjs`
- [ ] Añadir como archivos de datos juegos de tablero tradicionales rumanos para dos jugadores, sin dados (preguntar a los familiares mayores, citar un libro o una página para cada regla)
- [ ] Añadir el Six Men’s Morris y el Twelve Men’s Morris como archivos de datos, con una fuente citada para las reglas (los molinos ya están soportados)
- [ ] Añadir al motor las reglas tafl que faltan: la captura por muro de escudos, la victoria de los defensores con el fuerte del borde y la victoria por cercar a todos los defensores (nuevos campos `rules`, frases en ocho idiomas, pruebas)
- [ ] Añadir otras variantes del tafl como datos (Brandubh, Tablut, Fetlar), cada una con sus fuentes y sus diferencias con las reglas de Copenhague
- [ ] Añadir la importación de un registro guardado: pegar una lista de jugadas y reproducirla en el tablero
- [ ] Añadir un nivel de ordenador más fuerte (por ejemplo profundización iterativa con tabla de transposición) y comprobar que gana al nivel medio actual
- [ ] Diseñar los dados y otras formas de azar para el formato (una tirada con semilla, para poder reproducir los registros) y escribir la propuesta en `docs/`
- [ ] Añadir tres ejemplos de juegos de cartas con una sección `deck` en el esquema (aún no se pueden jugar: describirlos, con fuentes)

Créalas todas en GitHub con `scripts/create_issues.sh` (requiere la CLI `gh`).
