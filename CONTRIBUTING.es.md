# Cómo contribuir — REGULA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · **Español** · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versión: 0.2.1 · Última actualización: 2026-11-20

1. Haz un fork de este repositorio.
2. Copia `data/games/example.json` en `data/games/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Reglas

- Una entrada = un archivo.
- Cita siempre una fuente.
- Aporta solo material que puedas compartir legalmente (sin texto protegido copiado).
- Sé amable: consulta el Código de conducta.

## Añadir un juego

1. Lee `docs/tutorial.md` (20 minutos) y ten abierto `docs/moves.md`: describe cada campo.
2. Copia `data/games/example.json` en `data/games/<id>.json`. La descripción sola (`name`, `region`, `setup`, `moves`, `win`, `sources`) ya es una contribución válida; añade `rules` para que el juego se pueda jugar.
3. Ejecuta `python scripts/validate.py` y pega el archivo en **Su propio juego** de la aplicación: *Validar* nombra cada error.
4. Para un juego jugable añade `names` en `ro fr de es it hu pt`, un `status` sincero y `notes` en `en` y `ro` sobre cada decisión tomada; cita una fuente para cada regla.
5. Añade a `test/engine.test.mjs` el número de primeras jugadas, calculado a mano, y ejecuta `npm test`.
6. Para añadir un nuevo tipo de jugada o de victoria, edita `src/engine.mjs` (`MOVE_TYPES` o `WIN_TYPES`, `compile`, `explain`), añade las frases de la regla en los ocho idiomas en `src/i18n.mjs`, amplía `schema.json` y `docs/moves.md` y añade pruebas.
7. Ejecuta `node scripts/build.mjs` y haz commit del `index.html` regenerado junto con `src/`.
