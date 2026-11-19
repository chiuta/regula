# Come contribuire — REGULA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · **Italiano** · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versione: 0.2.1 · Ultimo aggiornamento: 2026-11-20

1. Fai il fork di questo repository.
2. Copia `data/games/example.json` in `data/games/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Regole

- Una voce = un file.
- Cita sempre una fonte.
- Contribuisci solo con materiale che puoi condividere legalmente (niente testi protetti copiati).
- Sii gentile: vedi il Codice di condotta.

## Aggiungere un gioco

1. Leggi `docs/tutorial.md` (20 minuti) e tieni aperto `docs/moves.md`: descrive ogni campo.
2. Copia `data/games/example.json` in `data/games/<id>.json`. La sola descrizione (`name`, `region`, `setup`, `moves`, `win`, `sources`) è già un contributo valido; aggiungi `rules` per rendere il gioco giocabile.
3. Esegui `python scripts/validate.py`, poi incolla il file in **Il tuo gioco** nell’app: *Convalida* nomina ogni errore.
4. Per un gioco giocabile aggiungi `names` in `ro fr de es it hu pt`, uno `status` onesto e `notes` in `en` e `ro` su ogni scelta fatta; cita una fonte per ogni regola.
5. Aggiungi a `test/engine.test.mjs` il numero delle prime mosse, calcolato a mano, ed esegui `npm test`.
6. Per aggiungere un nuovo tipo di mossa o di vittoria, modifica `src/engine.mjs` (`MOVE_TYPES` o `WIN_TYPES`, `compile`, `explain`), aggiungi le frasi della regola in tutte e otto le lingue in `src/i18n.mjs`, estendi `schema.json` e `docs/moves.md` e aggiungi test.
7. Esegui `node scripts/build.mjs` e fai il commit dell’`index.html` rigenerato insieme a `src/`.
