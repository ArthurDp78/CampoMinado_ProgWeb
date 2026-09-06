# Campo Minado 💣

Projeto desenvolvido para a atividade da disciplina **GAC116 - Programação Web**.

```json
{
  "nome": "Campo Minado",
  "descricao": "Jogo de Campo Minado desenvolvido com HTML, CSS e JavaScript puro.",
  "autores": "Arthur Soares Marques",
  "turma": "14B"
}
```

---

## 📝 Descrição

Uma versão limpa, elegante e responsiva do clássico jogo **Campo Minado**. O tabuleiro é composto por uma grade de 10×10 células com 15 minas distribuídas aleatoriamente a cada partida.

---

## 🎯 Objetivo

O objetivo do jogador é revelar todas as células seguras do tabuleiro (85 células no total) sem clicar em nenhuma das 15 minas escondidas.

---

## 🕹️ Como Jogar

- **Clique Esquerdo**: Revela a célula selecionada.
- **Clique Direito**: Coloca ou remove uma bandeira (🚩) para marcar a posição de uma possível mina.
- **Número nas células**: Indica a quantidade exata de minas existentes nas 8 células vizinhas.
- **Abertura automática**: Ao clicar em uma célula sem minas vizinhas (0), as células adjacentes seguras são reveladas automaticamente.

---

## 📜 Regras Principais

1. O tabuleiro possui tamanho **10 × 10** (100 células) e **15 minas**.
2. As posições das minas são geradas de forma aleatória a cada nova partida.
3. Se o jogador clicar em uma célula com mina: **💥 GAME OVER!** (Derrota) — todas as minas são reveladas.
4. Se o jogador revelar todas as 85 células seguras: **🏆 VOCÊ VENCEU!** (Vitória).
5. O jogo conta com um **cronômetro** que registra o tempo de partida.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando **exclusivamente** tecnologias nativas da web, sem o uso de frameworks ou bibliotecas externas:

* **HTML5**: Estrutura semântica das telas e interface.
* **CSS3**: Estilização minimalista, modernidade visual, Flexbox, CSS Grid e responsividade.
* **JavaScript (Vanilla JS)**: Matriz 2D, lógica do tabuleiro, propagação recursiva de células zeradas, manipulação do DOM e controle do cronômetro (`setInterval`).

---

## 🌐 GitHub Pages

Link da versão publicada:

Link: (https://arthurdp78.github.io/CampoMinado_ProgWeb/)

---

## 👤 Informações do Aluno

- **Autor**: Arthur Soares Marques
- **Disciplina**: GAC116 - Programação Web
- **Licença**: [MIT](LICENSE)
