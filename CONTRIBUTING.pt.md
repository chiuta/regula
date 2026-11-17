# Como contribuir — REGULA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · **Português** · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versão: 0.2.0 · Última atualização: 2026-11-17

1. Faça um fork deste repositório.
2. Copie `data/games/example.json` para `data/games/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Regras

- Uma entrada = um ficheiro.
- Cite sempre uma fonte.
- Contribua apenas com material que possa partilhar legalmente (sem texto protegido copiado).
- Seja gentil: veja o Código de Conduta.

## Acrescentar um jogo

1. Leia `docs/tutorial.md` (20 minutos) e mantenha `docs/moves.md` aberto: descreve cada campo.
2. Copie `data/games/example.json` para `data/games/<id>.json`. A descrição sozinha (`name`, `region`, `setup`, `moves`, `win`, `sources`) já é uma contribuição válida; acrescente `rules` para tornar o jogo jogável.
3. Execute `python scripts/validate.py` e cole o ficheiro em **O seu jogo** na aplicação: *Validar* nomeia cada erro.
4. Para um jogo jogável acrescente `names` em `ro fr de es it hu pt`, um `status` honesto e `notes` em `en` e `ro` sobre cada escolha feita; cite uma fonte para cada regra.
5. Acrescente a `test/engine.test.mjs` o número de primeiras jogadas, calculado à mão, e execute `npm test`.
6. Para acrescentar um novo tipo de jogada ou de vitória, edite `src/engine.mjs` (`MOVE_TYPES` ou `WIN_TYPES`, `compile`, `explain`), acrescente as frases da regra nos oito idiomas em `src/i18n.mjs`, alargue `schema.json` e `docs/moves.md` e acrescente testes.
7. Execute `node scripts/build.mjs` e faça commit do `index.html` regenerado juntamente com `src/`.
