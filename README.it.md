# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.2.0 · Ultimo aggiornamento: 2026-11-17

🌐 https://regula.chiuta.ro

> Descrivi qualsiasi gioco tradizionale da tavolo o di carte in un file JSON e giocaci — un solo motore di regole per tutti i giochi.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alpha, utilizzabile: cinque giochi classici per due giocatori si giocano nell’unico file `index.html` (si apre offline, senza server), contro il computer o un’altra persona; le regole di ogni gioco sono scritte in otto lingue a partire dagli stessi dati che il motore gioca, e puoi incollare il tuo file di gioco. I limiti sono elencati più sotto.

## Cosa fa

- Gioca cinque giochi classici da file di dati: Mulino, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenaghen 11 × 11, semplificato). Ognuno ha un’origine, un’indicazione di quanto sono sicure le regole, note sulle scelte fatte e fonti.
- Ogni lato può essere una persona, un giocatore casuale o il computer a due livelli; mosse con il mouse, con il dito o con la tastiera; annulla, ripeti, un suggerimento e un registro delle mosse che si può copiare.
- Scrive le regole del gioco scelto in otto lingue, generate dagli stessi dati che il motore gioca, quindi il testo e il gioco non possono contraddirsi.
- Il tuo gioco: incolla un gioco come JSON, convalidalo con messaggi che nominano il campo sbagliato, giocalo e scaricalo. Non viene caricato nulla.
- Interfaccia in otto lingue, temi scuro e chiaro, un pulsante con etichetta per ogni punto (lettori di schermo, tastiera), funziona da 360 px di larghezza; senza rete, senza tracciamento.
- Installabile come app e disponibile offline dopo la prima visita quando è servita via HTTPS (un service worker conserva la pagina; nient’altro viene memorizzato o inviato). Aperta da un file scaricato funziona allo stesso modo, senza installazione.

## Come funziona

- Un file JSON per gioco in `data/games/`, controllato da `schema.json`; il formato è descritto in `docs/moves.md` e il tutorial è `docs/tutorial.md` (inglese e rumeno).
- `src/engine.mjs` è il motore delle regole (senza schermo, senza rete): compila un gioco, elenca le mosse legali, le applica e cerca con minimax e potatura alfa–beta per l’avversario computer.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` sono l’interfaccia; `node scripts/build.mjs` costruisce l’unico `index.html` (`--check` verifica che corrisponda).
- `npm test` esegue i test del motore (numeri di mosse calcolati a mano), dei file di dati e della documentazione; `python scripts/validate.py` controlla i file JSON. Lo sviluppo richiede Node.js 24 o più recente; la pagina stessa richiede solo un browser che conosca ES2017.
- `manifest.webmanifest`, `sw.js` e le icone sono prodotti da `node scripts/build.mjs` tramite il kit comune (sezione `pwa` di `src/app.json`); anche `--check` li verifica, e `npm test` controlla che il manifest, la versione del service worker e la CSP corrispondano alla pagina.

## Limiti, dichiarati con chiarezza

- I giochi storici sono ricostruzioni: le fonti sono incomplete e le scelte moderne sono indicate per ogni gioco. Non sono regole da torneo.
- L’hnefatafl è semplificato: mancano la cattura del muro di scudi, la vittoria con il forte sul bordo e la vittoria per accerchiamento di tutti i difensori.
- L’avversario informatico usa una breve ricerca minimax (facile: profondità 2; medio: profondità 5, con limite di nodi); gioca in modo ragionevole, non perfetto. Il livello casuale muove a caso.
- Le patte per ripetizione o per turni senza cattura sono convenzioni dell’app, indicate per ogni gioco. I giochi di carte non sono ancora giocabili.
- Il motore gestisce solo giochi per due su tavolieri a griglia o a grafo; non ci sono ancora regole per dadi, carte nascoste o più giocatori.
- Mancano i giochi tradizionali rumeni oltre alla Moara (Țintar): le loro regole non sono state verificate nelle fonti. Vedi le attività aperte.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/games/example.json` in `data/games/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.
5. Per modificare il motore o l’interfaccia, modifica `src/`, poi esegui `npm test` e `node scripts/build.mjs` (vedi `CONTRIBUTING.md`).

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
