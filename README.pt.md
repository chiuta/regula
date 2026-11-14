# REGULA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.1.0 · Última atualização: 2026-11-14

🌐 https://regula.chiuta.ro

> Descreva qualquer jogo tradicional de tabuleiro ou de cartas num ficheiro JSON e jogue — um só motor de regras para todos os jogos.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa: o repositório contém a estrutura, o esquema de dados ou os primeiros exemplos e os guias de contribuição. O âmbito abaixo é o plano, não o que funciona hoje.

## Âmbito previsto

- Um esquema JSON v1.0 para os movimentos (passo, salto, captura, colocação), documentado em `docs/moves.md`, e testes unitários para o validador de movimentos.
- Jogos clássicos como dados: Moinho, Alquerque, Hnefatafl, Mu Torere e Fanorona, mais cinco jogos tradicionais romenos.
- Um renderizador mínimo no navegador para `board.type = grid` e um adversário de movimentos aleatórios que funciona com qualquer ficheiro de jogo válido.
- Três exemplos de jogos de cartas com uma secção `deck` no esquema.
- Geradores de regras em texto (inglês e romeno) e um breve tutorial: «Adiciona o jogo dos teus avós em 20 minutos».

Nada disto está ainda implementado: cada ponto é uma tarefa preparada em `ISSUES_GOOD_FIRST.md`.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/games/example.json` para `data/games/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
