# Boas primeiras tarefas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · **Português** · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Acrescentar o Three Men’s Morris como jogo incluído: partir de `docs/examples/three-mens-morris.json`, comparar a variante com outras duas fontes, acrescentar os nomes em sete idiomas e mover o ficheiro para `data/games/`
- [ ] Pedir a falantes nativos que revejam os textos em francês, italiano, espanhol, português, alemão e húngaro: as `notes` dos cinco jogos e as frases das regras (`r_*`) em `src/i18n.mjs`
- [ ] Acrescentar como ficheiros de dados jogos de tabuleiro tradicionais romenos para dois jogadores, sem dados (perguntar aos familiares mais velhos, citar um livro ou uma página para cada regra)
- [ ] Acrescentar o Six Men’s Morris e o Twelve Men’s Morris como ficheiros de dados, com uma fonte citada para as regras (os moinhos já são suportados)
- [ ] Acrescentar ao motor as regras tafl em falta: a captura por muro de escudos, a vitória dos defensores com o forte na margem e a vitória por cercar todos os defensores (novos campos `rules`, frases em oito idiomas, testes)
- [ ] Acrescentar outras variantes do tafl como dados (Brandubh, Tablut, Fetlar), cada uma com as suas fontes e as suas diferenças em relação às regras de Copenhaga
- [ ] Acrescentar a importação de um registo guardado: colar uma lista de jogadas e reproduzi-la no tabuleiro
- [ ] Acrescentar um nível de computador mais forte (por exemplo aprofundamento iterativo com tabela de transposição) e testar que vence o nível médio atual
- [ ] Desenhar os dados e outras formas de acaso para o formato (um lançamento com semente, para que os registos possam ser reproduzidos) e escrever a proposta em `docs/`
- [ ] Acrescentar três exemplos de jogos de cartas com uma secção `deck` no esquema (ainda não se podem jogar: descrevê-los, com fontes)

Cria-as todas no GitHub com `scripts/create_issues.sh` (requer a CLI `gh`).
