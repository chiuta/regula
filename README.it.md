# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.1.0 · Ultimo aggiornamento: 2026-11-14

🌐 https://regula.chiuta.ro

> Descrivi qualsiasi gioco tradizionale da tavolo o di carte in un file JSON e giocaci — un solo motore di regole per tutti i giochi.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alpha: il repository contiene la struttura, lo schema dati o i primi esempi e le guide al contributo. L’ambito qui sotto è il piano, non ciò che funziona oggi.

## Ambito previsto

- Uno schema JSON v1.0 per le mosse (passo, salto, cattura, posa), documentato in `docs/moves.md`, e test unitari per il validatore di mosse.
- Giochi classici come dati: Mulino, Alquerque, Hnefatafl, Mu Torere e Fanorona, più cinque giochi tradizionali romeni.
- Un renderer minimo nel browser per `board.type = grid` e un avversario a mosse casuali che funziona con qualsiasi file di gioco valido.
- Tre esempi di giochi di carte con una sezione `deck` nello schema.
- Generatori di regole in testo (inglese e romeno) e un breve tutorial: «Aggiungi il gioco dei tuoi nonni in 20 minuti».

Nulla di tutto ciò è ancora implementato: ogni voce è un compito pronto in `ISSUES_GOOD_FIRST.md`.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/games/example.json` in `data/games/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
