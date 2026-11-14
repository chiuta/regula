# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.1.0 · Última actualización: 2026-11-14

🌐 https://regula.chiuta.ro

> Describe cualquier juego tradicional de mesa o de cartas en un archivo JSON y juega — un solo motor de reglas para todos los juegos.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa: el repositorio contiene la estructura, el esquema de datos o los primeros ejemplos y las guías de contribución. El alcance de abajo es el plan, no lo que funciona hoy.

## Alcance previsto

- Un esquema JSON v1.0 para los movimientos (paso, salto, captura, colocación), documentado en `docs/moves.md`, y pruebas unitarias para el validador de movimientos.
- Juegos clásicos como datos: Molino, Alquerque, Hnefatafl, Mu Torere y Fanorona, más cinco juegos tradicionales rumanos.
- Un renderizador mínimo en el navegador para `board.type = grid` y un oponente de movimientos aleatorios que funciona con cualquier archivo de juego válido.
- Tres ejemplos de juegos de cartas con una sección `deck` en el esquema.
- Generadores de reglas en texto (inglés y rumano) y un breve tutorial: «Añade el juego de tus abuelos en 20 minutos».

Nada de esto está implementado todavía: cada punto es una tarea preparada en `ISSUES_GOOD_FIRST.md`.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/games/example.json` en `data/games/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
