---
description: Cria ou refaz um perfil do catálogo (escola ou pensador) respondendo as 120 perguntas no papel
argument-hint: <school|thinker> <nome>
---

Crie o perfil do catálogo pedido em `$ARGUMENTS` (primeiro argumento: `school` ou `thinker`; o resto: o nome).

## Regras que valem pra todo o texto

- Português do Brasil, com acentuação correta.
- Tom neutro: escolas religiosas e seculares com o mesmo respeito. Descrever, não pregar nem ridicularizar.
- Não parecer diagnóstico psicológico.
- Nada copiado do 12axes ou de outro quiz.
- Fiel às fontes primárias. Quando a tradição é dividida, seguir a posição central dela e registrar a dúvida em `notes`.

## Passos

1. **Id:** minúsculas, sem acento, com hífens (ex.: `marco-aurelio`, `existencialismo-cristao`).
2. **Pesquisar** o que a escola ou o pensador defende sobre: aceitar x transformar, virtude x prazer, de onde vem o sentido, se o mundo é bom ou hostil, indivíduo x comunidade, disciplina x espontaneidade, razão x emoção, certeza x dúvida.
3. **Responder as 120 perguntas** de `data/questions.json`, uma por uma, como a escola ou o pensador responderia. Escala por índice:
   - Likert: 0 = Concordo totalmente, 1 = Concordo, 2 = Neutro, 3 = Discordo, 4 = Discordo totalmente.
   - Escolha forçada: 0 = Muito mais a da esquerda, 1 = Mais a da esquerda, 2 = Igual, 3 = Mais a da direita, 4 = Muito mais a da direita.
   - Use neutro (2) só quando a posição for de fato indiferente; no máximo 40% das respostas.
   - Gravar em `data/answers/<kind>/<id>.json`:
     `{ "profileId": "<id>", "kind": "<kind>", "answers": { "<questionId>": 0..4 }, "notes": { "<questionId>": "justificativa curta" } }`
     com uma justificativa de uma linha pra cada resposta.
4. **Preencher os textos:**
   - Escola, em `data/schools.json`: `{ id, name, familyId, quote, summary, lida: { sofrimento, morte, felicidade, relacoes }, thinkerIds }`.
     - `familyId` vem de `data/families.json`.
     - `quote`: frase em primeira pessoa, até 140 caracteres, que alguém dessa escola diria sobre a própria vida.
     - `summary`: 2–3 frases, a primeira com até 155 caracteres (vira descrição de SEO).
     - Cada campo de `lida`: 1–2 frases sobre como essa escola encara o tema.
   - Pensador, em `data/thinkers.json`: `{ id, name, descriptor, years, schoolId, bio, portrait }`.
     - `descriptor`: ex. "Imperador romano, estoico".
     - `years`: ex. "121–180" ou "c. 341–270 a.C.".
     - `bio`: 2–3 frases, a primeira com até 155 caracteres.
     - `portrait`: `{ file: "<id>.webp", source: "<URL da página do arquivo na Wikimedia Commons>", license: "<licença>" }`, só de domínio público ou licença livre. Sem imagem adequada: `null`.
   - Livros, em `data/books.json`: 1–2 obras do pensador, `{ id, thinkerId, title, year, amazonQuery }`. `amazonQuery` = título + autor. `year` negativo pra a.C.
5. **Retrato:** baixar da Wikimedia Commons, recortar quadrado e converter pra webp 400×400 em `public/retratos/<id>.webp`.
6. **Validar:** `npm run validate -- <kind> <id>`, `npm run vectors` e `npm test`. Corrigir até tudo passar.
7. **Não commitar.** Mostrar ao usuário o vetor resultante e os textos pra revisão.
