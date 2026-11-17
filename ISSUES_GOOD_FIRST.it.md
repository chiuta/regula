# Buoni primi compiti

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · **Italiano** · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Aggiungere il Three Men’s Morris come gioco incluso: partire da `docs/examples/three-mens-morris.json`, confrontare la variante con altre due fonti, aggiungere i nomi in sette lingue e spostare il file in `data/games/`
- [ ] Far rivedere da madrelingua i testi in francese, italiano, spagnolo, portoghese, tedesco e ungherese: le `notes` dei cinque giochi e le frasi delle regole (`r_*`) in `src/i18n.mjs`
- [ ] Aggiungere come file di dati giochi da tavolo tradizionali rumeni per due giocatori, senza dadi (chiedere ai parenti più anziani, citare un libro o una pagina per ogni regola)
- [ ] Aggiungere il Six Men’s Morris e il Twelve Men’s Morris come file di dati, con una fonte citata per le regole (i mulini sono già supportati)
- [ ] Aggiungere al motore le regole tafl mancanti: la cattura con il muro di scudi, la vittoria dei difensori con il forte sul bordo e la vittoria accerchiando tutti i difensori (nuovi campi `rules`, frasi in otto lingue, test)
- [ ] Aggiungere altre varianti del tafl come dati (Brandubh, Tablut, Fetlar), ciascuna con le sue fonti e le differenze rispetto alle regole di Copenaghen
- [ ] Aggiungere l’importazione di un registro salvato: incollare un elenco di mosse e rigiocarlo sulla scacchiera
- [ ] Aggiungere un livello di computer più forte (per esempio approfondimento iterativo con tabella di trasposizione) e verificare che batta l’attuale livello medio
- [ ] Progettare i dadi e altre forme di casualità per il formato (un lancio con seme, così i registri si possono rigiocare) e scrivere la proposta in `docs/`
- [ ] Aggiungere tre esempi di giochi di carte con una sezione `deck` nello schema (non sono ancora giocabili: descriverli, con le fonti)

Crea tutte le issue su GitHub con `scripts/create_issues.sh` (richiede la CLI `gh`).
