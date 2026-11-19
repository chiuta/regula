# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.2.1 · Última atualização: 2026-11-20

🌐 https://regula.chiuta.ro

> Descreva qualquer jogo tradicional de tabuleiro ou de cartas num ficheiro JSON e jogue — um só motor de regras para todos os jogos.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa, utilizável: cinco jogos clássicos para dois jogadores jogam-se no único ficheiro `index.html` (abre-se offline, sem servidor), contra o computador ou outra pessoa; as regras de cada jogo estão escritas em oito idiomas a partir dos mesmos dados que o motor joga, e pode colar o seu próprio ficheiro de jogo. Os limites estão listados mais abaixo.

## O que faz

- Joga cinco jogos clássicos a partir de ficheiros de dados: Jogo do moinho, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenhaga 11 × 11, simplificado). Cada um tem uma origem, uma indicação da fiabilidade das regras, notas sobre as escolhas feitas e fontes.
- Cada lado pode ser uma pessoa, um jogador aleatório ou o computador em dois níveis; jogadas com o rato, com o dedo ou com o teclado; anular, refazer, uma sugestão e um registo das jogadas que se pode copiar.
- Escreve as regras do jogo escolhido em oito idiomas, geradas a partir dos mesmos dados que o motor joga, pelo que o texto e o jogo não se podem contradizer.
- O seu próprio jogo: cole um jogo em JSON, valide-o com mensagens que nomeiam o campo errado, jogue-o e descarregue-o. Nada é enviado.
- Interface em oito idiomas, temas escuro e claro, um botão com etiqueta para cada ponto (leitores de ecrã, teclado), funciona desde 360 px de largura; sem rede, sem rastreamento.
- Instalável como aplicação e disponível offline após a primeira visita quando servida por HTTPS (um service worker guarda a página; nada mais é guardado ou enviado). Aberta a partir de um ficheiro descarregado funciona da mesma forma, sem instalação.

## Como funciona

- Um ficheiro JSON por jogo em `data/games/`, verificado por `schema.json`; o formato está descrito em `docs/moves.md` e o tutorial é `docs/tutorial.md` (inglês e romeno).
- `src/engine.mjs` é o motor de regras (sem ecrã, sem rede): compila um jogo, enumera as jogadas legais, aplica-as e procura com minimax e poda alfa–beta para o adversário computador.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` são a interface; `node scripts/build.mjs` constrói o único `index.html` (`--check` verifica que coincide).
- `npm test` executa os testes do motor (números de jogadas calculados à mão), dos ficheiros de dados e da documentação; `python scripts/validate.py` verifica os ficheiros JSON. O desenvolvimento requer Node.js 24 ou mais recente; a página em si só requer um navegador que conheça ES2017.
- `manifest.webmanifest`, `sw.js` e os ícones são produzidos por `node scripts/build.mjs` através do kit comum (secção `pwa` de `src/app.json`); `--check` também os verifica, e `npm test` confirma que o manifesto, a versão do service worker e a CSP correspondem à página.

## Limites, ditos com clareza

- Os jogos históricos são reconstruções: as fontes são incompletas e as escolhas modernas vêm indicadas em cada jogo. Não são regras de torneio.
- O hnefatafl está simplificado: faltam a captura por muro de escudos, a vitória por forte na borda e a vitória por cerco de todos os defensores.
- O adversário informático usa uma pesquisa minimax curta (fácil: profundidade 2; médio: profundidade 5, com limite de nós); joga de forma razoável, não perfeita. O nível aleatório joga ao acaso.
- Os empates por repetição ou por jogadas sem captura são convenções da aplicação, indicadas em cada jogo. Os jogos de cartas ainda não se podem jogar.
- O motor só trata jogos de dois jogadores em tabuleiros de grelha ou de grafo; ainda não há regras para dados, cartas ocultas ou mais jogadores.
- Faltam os jogos tradicionais romenos além da Moara (Țintar): as suas regras não foram verificadas em fontes. Veja as tarefas em aberto.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/games/example.json` para `data/games/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.
5. Para alterar o motor ou a interface, edite `src/` e execute `npm test` e `node scripts/build.mjs` (veja `CONTRIBUTING.md`).

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
