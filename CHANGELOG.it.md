# Registro delle modifiche

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · **Italiano** · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non rilasciato]

## [0.2.0] - 2026-11-17

### Aggiunto
- Cinque giochi giocabili come file di dati in `data/games/`: Mulino, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenaghen 11 × 11, semplificato), ciascuno con fonti e note sulle scelte fatte.
- Un motore di regole (`src/engine.mjs`) per giochi a due su tavolieri a griglia e a grafo: piazzamento, passi, scivolamenti, volo, salti, avvicinamento e allontanamento, mulini, cattura per custodia e del re, punti riservati, regole di vittoria e di patta; un avversario computer (minimax con potatura alfa–beta).
- Interfaccia: un pulsante con etichetta per ogni punto (mouse, tocco, tastiera, lettore di schermo), un tipo di giocatore per ogni lato, annulla e ripeti, suggerimento, registro delle mosse, regole scritte in otto lingue dai dati del gioco e il tuo gioco come JSON (convalida, gioco, download).
- `schema.json` esteso (board, pieces, rules, status, names, notes); `docs/moves.md` (il formato) e `docs/tutorial.md` (20 minuti), in inglese e rumeno, con un gioco di esempio testato.
- Test: `node --test` per il motore (numeri di mosse calcolati a mano), i dati e la documentazione; test del browser nell’hub (otto lingue, accessibilità, stato memorizzato ostile, schermi piccoli).
- `src/` e `scripts/build.mjs`: l’unico `index.html` è ora costruito dai sorgenti e `--check` lo verifica.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT tradotti in tutte e otto le lingue.
- README in inglese, rumeno, francese, italiano, spagnolo, portoghese, tedesco e ungherese: sezioni di stato e di ambito previsto (derivate da `ISSUES_GOOD_FIRST.md`).
- Installabile (PWA): `manifest.webmanifest`, `sw.js` e le icone sono generati dal kit comune (`fff-kit/pwa`); la pagina funziona offline dopo la prima visita via HTTPS.

### Modificato
- Il workflow gira su Ubuntu 26.04 con Node.js 26 ed esegue anche i test e il controllo della build.

## [0.1.0] - 2026-11-13

### Aggiunto
- Scheletro iniziale: struttura, schema dei dati o primi esempi, guide al contributo in otto lingue.
