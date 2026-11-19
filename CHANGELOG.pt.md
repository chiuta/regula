# Registo de alterações

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · **Português** · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Não lançado]

## [0.2.1] - 2026-11-20

### Alterado
- fff-kit 1.8.1: quando o navegador bloqueia o armazenamento ou não o tem (`localStorage`/`sessionStorage` lançam um erro ou não existem), a página arranca com um armazenamento temporário em memória em vez de parar; os dados não são mantidos depois de fechar a página.
- fff-kit 1.8.1: o guia que aumenta os controlos pequenos para 44 px mede agora também a largura do corpo da página e do elemento pai, pelo que uma fila de botões já não pode sair do ecrã (o grupo fica intacto quando o aumento o tornaria demasiado largo).

## [0.2.0] - 2026-11-17

### Adicionado
- Cinco jogos jogáveis como ficheiros de dados em `data/games/`: Jogo do moinho, Alquerque, Fanorona, Mū tōrere, Hnefatafl (Copenhaga 11 × 11, simplificado), cada um com fontes e notas sobre as escolhas feitas.
- Um motor de regras (`src/engine.mjs`) para jogos de dois jogadores em tabuleiros de grelha e de grafo: colocação, passos, deslizamentos, voo, saltos, aproximação e afastamento, moinhos, captura por custódia e do rei, pontos reservados, regras de vitória e de empate; um adversário computador (minimax com poda alfa–beta).
- Interface: um botão com etiqueta para cada ponto (rato, toque, teclado, leitor de ecrã), um tipo de jogador para cada lado, anular e refazer, sugestão, registo das jogadas, regras escritas em oito idiomas a partir dos dados do jogo e o seu próprio jogo como JSON (validar, jogar, descarregar).
- `schema.json` alargado (board, pieces, rules, status, names, notes); `docs/moves.md` (o formato) e `docs/tutorial.md` (20 minutos), em inglês e romeno, com um jogo de exemplo testado.
- Testes: `node --test` para o motor (números de jogadas calculados à mão), os dados e a documentação; testes de navegador no hub (oito idiomas, acessibilidade, estado guardado hostil, ecrãs pequenos).
- `src/` e `scripts/build.mjs`: o único `index.html` é agora construído a partir das fontes, e `--check` verifica-o.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT traduzidos para as oito línguas.
- README em inglês, romeno, francês, italiano, espanhol, português, alemão e húngaro: secções de estado e de âmbito previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalável (PWA): `manifest.webmanifest`, `sw.js` e os ícones são gerados pelo kit comum (`fff-kit/pwa`); a página funciona offline após a primeira visita por HTTPS.

### Alterado
- O workflow corre em Ubuntu 26.04 com Node.js 26 e executa também os testes e a verificação da compilação.

## [0.1.0] - 2026-11-13

### Adicionado
- Esqueleto inicial: estrutura, esquema de dados ou primeiros exemplos, guias de contribuição em oito línguas.
