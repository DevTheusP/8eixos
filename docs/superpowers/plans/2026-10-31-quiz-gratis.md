# Quiz de filosofia de vida (parte grátis) — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lançar o quiz grátis completo: 3 formatos de quiz, catálogo de 12 escolas e ~30 pensadores, página de resultado, card de story, comparação e páginas de SEO. Sem pagamento (isso é o plano 2).

**Architecture:** App Next.js sem backend próprio. Os dados ficam em JSON versionado em `data/`, validados com Zod. A lógica (cálculo do vetor, match, seleção de perguntas) fica em funções puras em `src/lib/`, testadas com Vitest. O resultado vive na URL (8 valores), então não há banco nesta fase. Os vetores do catálogo são calculados das respostas arquivadas por um script, com a mesma fórmula do usuário.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Zod, Vitest, `next/og` (card PNG), tsx (scripts).

**Spec:** `docs/superpowers/specs/2026-10-31-quiz-filosofia-design.md`. Mockup da página de resultado: `docs/superpowers/specs/2026-10-31-resultado-mockup.html`.

## Global Constraints

- Idioma único: português do Brasil, com acentuação correta em toda a interface e nos dados.
- Exatamente 8 eixos, com estes ids e polos (A → B), nesta ordem:
  `controle` (Aceitar → Transformar), `bemviver` (Virtude → Prazer), `sentido` (Dado → Criado por mim), `mundo` (Bom → Hostil), `eu` (Indivíduo → Comunidade), `rotina` (Disciplina → Espontaneidade), `guia` (Razão → Emoção), `verdade` (Certeza → Dúvida).
- Valor de eixo: número de 0 a 100 = % em direção ao polo B (0 = totalmente A, 50 = centro, 100 = totalmente B).
- Escala de resposta: índice 0–4, valor `(4 - índice) / 4` → 1,00 / 0,75 / 0,50 / 0,25 / 0,00. Índice 0 = "Concordo totalmente" (Likert) ou "Muito mais a frase da esquerda" (escolha forçada).
- Banco: 120 perguntas, 15 por eixo, 8 de um polo e 7 do outro. Nos eixos `bemviver` e `eu`, pelo menos 5 das 15 são de escolha forçada.
- Formatos: `curta` 32 (4 por eixo), `completa` 64 (8 por eixo, marcada "Recomendada"), `profunda` 120 (15 por eixo). Todos grátis.
- Proibido escrever "100% de precisão" ou prometer precisão científica. A profunda é "a leitura mais detalhada".
- Nada de texto, pergunta, vetor ou layout literal copiado do 12axes (a licença dele proíbe).
- Tom neutro sobre religião: escolas religiosas e seculares com o mesmo tratamento.
- Não parecer diagnóstico psicológico.
- Retratos só de domínio público ou licença livre (Wikimedia Commons), com fonte e licença registradas.
- Link de afiliado: `https://www.amazon.com.br/s?k=<consulta>&i=stripbooks&tag=<NEXT_PUBLIC_AMAZON_TAG>`.
- Flag `NEXT_PUBLIC_PAYWALL_ENABLED` (padrão desligado): com ela desligada, nada do relatório aparece.
- Commits sem `Co-Authored-By` nem "Generated with Claude" (regra do usuário).

## Review Focus

1. **URL de resultado adulterada** (parâmetro faltando, `abc`, `150`, `-3`): mostrar a página "resultado inválido" com link pro quiz, nunca erro 500. Valores válidos fora de 0–100 não existem. Coberto na Task 2.
2. **Respostas todas neutras** (vetor todo 50): o match não pode dividir por zero nem dar NaN, os eixos aparecem como "Equilibrado" e "O que te distingue" mostra só a posição mais comum. Coberto nas Tasks 5 e 10.
3. **Recarregar ou voltar no meio do quiz:** o progresso continua (sessionStorage, com try/catch). Sem storage, o quiz funciona do zero. Coberto na Task 9.
4. **Link de amigo inválido em "Compare"** (outro site, texto qualquer, link sem parâmetros): mensagem "Esse link não é de um resultado" sem quebrar a página. Coberto nas Tasks 2 e 11.
5. **Pensador sem livro ou sem retrato:** a página renderiza com placeholder (iniciais) e a seção de livros pula esse pensador. Coberto na Task 11.

---

## Estrutura de arquivos

```
data/
  axes.json  families.json  questions.json  schools.json  thinkers.json  books.json
  answers/school/<id>.json   answers/thinker/<id>.json
  generated/vectors.json
public/retratos/<thinkerId>.webp
scripts/
  build-vectors.ts  validate-profile.ts  check-axes.ts
.claude/commands/novo-perfil.md
src/lib/
  types.ts  schemas.ts  data.ts  scoring.ts  labels.ts  url.ts
  selection.ts  matching.ts  distinction.ts  books.ts  compare.ts
src/app/
  page.tsx                      home + escolha de formato
  quiz/[formato]/page.tsx       + QuizRunner.tsx (client)
  resultado/page.tsx            + components/result/*.tsx
  comparar/page.tsx
  api/card/route.tsx
  escolas/page.tsx  escolas/[id]/page.tsx
  pensadores/page.tsx  pensadores/[id]/page.tsx
  sobre/page.tsx  privacidade/page.tsx  sitemap.ts  robots.ts
tests/*.test.ts
```

---

### Task 1: Base do projeto, tipos, schemas e eixos

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `.gitignore`, `.env.example`
- Create: `src/lib/types.ts`, `src/lib/schemas.ts`, `src/lib/data.ts`
- Create: `data/axes.json`, `data/families.json`
- Test: `tests/data.test.ts`

**Interfaces:**
- Produces (`src/lib/types.ts`):
  - `type AxisId = 'controle'|'bemviver'|'sentido'|'mundo'|'eu'|'rotina'|'guia'|'verdade'`
  - `const AXIS_IDS: readonly AxisId[]` (ordem dos Global Constraints)
  - `type Vector = Record<AxisId, number>`
  - `type AnswerIndex = 0|1|2|3|4`
  - `interface Axis { id: AxisId; name: string; poleA: string; poleB: string; param: string }` (`param` = letra da URL: c, b, s, m, e, r, g, v)
  - `interface Question { id: string; axis: AxisId; kind: 'likert'|'forced'; polarity: 'A'|'B'; text?: string; textLeft?: string; textRight?: string }`. Likert usa `text`; escolha forçada usa `textLeft`/`textRight`. `polarity` = polo da afirmação (Likert) ou da frase da esquerda (forçada).
  - `interface Family { id: string; name: string }`
  - `interface School { id: string; name: string; familyId: string; quote: string; summary: string; lida: { sofrimento: string; morte: string; felicidade: string; relacoes: string }; thinkerIds: string[] }`
  - `interface Thinker { id: string; name: string; descriptor: string; years: string; schoolId: string | null; bio: string; portrait: { file: string; source: string; license: string } | null }`
  - `interface Book { id: string; thinkerId: string; title: string; year: number; amazonQuery: string }`
  - `interface ProfileAnswers { profileId: string; kind: 'school'|'thinker'; answers: Record<string, AnswerIndex>; notes?: Record<string, string> }`
- Produces (`src/lib/data.ts`): `getAxes(): Axis[]`, `getFamilies(): Family[]`, `getQuestions(): Question[]`, `getSchools(): School[]`, `getThinkers(): Thinker[]`, `getBooks(): Book[]`, `getVectors(): { schools: Record<string, Vector>; thinkers: Record<string, Vector> }`. Cada um lê o JSON, valida com o schema Zod correspondente de `schemas.ts` e lança erro com o nome do arquivo se for inválido. Arquivo ausente (catálogo ainda vazio) = lista vazia.

- [ ] **Step 1:** `npx create-next-app@latest . --ts --tailwind --app --src-dir --eslint --no-import-alias --use-npm`; instalar `zod`, `vitest`, `tsx`; `git init`; scripts no `package.json`: `"test": "vitest run"`, `"vectors": "tsx scripts/build-vectors.ts"`, `"validate": "tsx scripts/validate-profile.ts"`, `"check:axes": "tsx scripts/check-axes.ts"`. `.env.example` com `NEXT_PUBLIC_SITE_URL=`, `NEXT_PUBLIC_AMAZON_TAG=` e `NEXT_PUBLIC_PAYWALL_ENABLED=false`.
- [ ] **Step 2: Teste que falha** em `tests/data.test.ts`:

```ts
test('8 eixos na ordem e com params únicos', () => {
  const axes = getAxes();
  expect(axes.map(a => a.id)).toEqual(['controle','bemviver','sentido','mundo','eu','rotina','guia','verdade']);
  expect(new Set(axes.map(a => a.param)).size).toBe(8);
  expect(axes.find(a => a.id === 'mundo')).toMatchObject({ poleA: 'Bom', poleB: 'Hostil' });
});
test('famílias da v1', () => {
  expect(getFamilies().map(f => f.id)).toEqual(['virtude','oriente','sentido','prazer','duvida','cristas']);
});
```

- [ ] **Step 3:** Rodar `npx vitest run tests/data.test.ts`. Esperado: FAIL (módulo não existe).
- [ ] **Step 4:** Implementar os tipos, os schemas Zod, `data.ts`, `axes.json` (nomes: Controle, Bem viver, Sentido, Mundo, Eu, Rotina, Guia, Verdade; polos dos Global Constraints) e `families.json` (Filosofias da virtude, Caminhos orientais, Filosofias do sentido, Filosofias do prazer, Filosofias da dúvida, Tradições cristãs).
- [ ] **Step 5:** Rodar `npx vitest run`. Esperado: PASS.
- [ ] **Step 6:** `git add -A && git commit -m "feat: base do projeto, tipos e eixos"`

---

### Task 2: Cálculo do vetor, rótulos e URL do resultado

**Files:**
- Create: `src/lib/scoring.ts`, `src/lib/labels.ts`, `src/lib/url.ts`
- Test: `tests/scoring.test.ts`, `tests/url.test.ts`

**Interfaces:**
- Consumes: `Question`, `AnswerIndex`, `Vector`, `AXIS_IDS`, `getAxes()`
- Produces:
  - `answerValue(i: AnswerIndex): number` → `(4 - i) / 4`
  - `computeVector(questions: Question[], answers: Record<string, AnswerIndex>): Vector`. Para cada pergunta respondida: `towardB = polarity === 'B' ? value : 1 - value`. Eixo = média × 100, arredondado a 1 casa. Eixo sem nenhuma resposta = 50.
  - `intensity(v: number): { label: 'Equilibrado'|'Tende'|'Forte'|'Muito forte'; pole: 'A'|'B'|null; percent: number }`, com `d = |v - 50|`: `d < 10` → Equilibrado (pole null); `< 20` → Tende; `< 35` → Forte; senão Muito forte. `percent = round(max(v, 100 - v))`.
  - `vectorToParams(v: Vector): string` → `c=72&b=22.5&...` na ordem dos eixos, 1 casa decimal sem zeros sobrando.
  - `paramsToVector(p: Record<string, string | string[] | undefined>): Vector | null`. Retorna `null` se faltar parâmetro ou se algum não for número finito entre 0 e 100.
  - `parseResultLink(input: string): Vector | null`. Aceita URL completa (qualquer host) ou só a query string; extrai os parâmetros e usa `paramsToVector`.

- [ ] **Step 1: Testes que falham**

```ts
// scoring.test.ts
const q = (id: string, axis: AxisId, polarity: 'A'|'B'): Question => ({ id, axis, kind: 'likert', polarity, text: id });
test('concordar totalmente com afirmação do polo A puxa para 0', () => {
  expect(computeVector([q('x','controle','A')], { x: 0 }).controle).toBe(0);
});
test('mistura de polos', () => {
  const qs = [q('a','guia','A'), q('b','guia','B')];
  expect(computeVector(qs, { a: 0, b: 1 }).guia).toBe(37.5); // (0 + 0.75)/2
});
test('eixo sem respostas fica em 50', () => {
  expect(computeVector([], {}).verdade).toBe(50);
});
test('intensidade', () => {
  expect(intensity(50)).toEqual({ label: 'Equilibrado', pole: null, percent: 50 });
  expect(intensity(28)).toEqual({ label: 'Forte', pole: 'A', percent: 72 });
  expect(intensity(90)).toEqual({ label: 'Muito forte', pole: 'B', percent: 90 });
});

// url.test.ts
const v: Vector = { controle: 72, bemviver: 22.5, sentido: 50, mundo: 40, eu: 62, rotina: 30, guia: 25, verdade: 64 };
const params = (x: Vector) => Object.fromEntries(new URLSearchParams(vectorToParams(x)));
test('ida e volta', () => {
  expect(paramsToVector(params(v))).toEqual(v);
});
test.each([[{}], [{ c: 'abc' }], [{ ...params(v), c: '150' }], [{ ...params(v), g: '-3' }]])('inválido → null', (p) => {
  expect(paramsToVector(p)).toBeNull();
});
test('link de amigo', () => {
  expect(parseResultLink(`https://qualquer.site/resultado?${vectorToParams(v)}`)).toEqual(v);
  expect(parseResultLink('oi tudo bem')).toBeNull();
  expect(parseResultLink('https://google.com')).toBeNull();
});
```

- [ ] **Step 2:** `npx vitest run tests/scoring.test.ts tests/url.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `scoring.ts`, `labels.ts` e `url.ts` com as assinaturas acima.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS.
- [ ] **Step 5:** `git commit -am "feat: cálculo do vetor, rótulos e URL do resultado"`

---

### Task 3: Seleção de perguntas por formato

**Files:**
- Create: `src/lib/selection.ts`
- Test: `tests/selection.test.ts` (com um banco fictício `pool` gerado no teste: 15 por eixo, 8 A e 7 B)

**Interfaces:**
- Produces:
  - `type Formato = 'curta'|'completa'|'profunda'`
  - `const FORMATOS: Record<Formato, { perguntas: number; porEixo: number; minutos: number; titulo: string; descricao: string; recomendado: boolean }>`: curta 32/4/5, completa 64/8/10 (recomendado), profunda 120/15/20.
  - `selectQuestions(pool: Question[], formato: Formato, rng?: () => number): Question[]`. Por eixo, pega `porEixo / 2` de cada polaridade (na profunda, todas). Embaralha a ordem final intercalando eixos, sem duas perguntas seguidas do mesmo eixo quando possível. `rng` padrão = `Math.random`.
  - `seededRng(seed: number): () => number` (mulberry32), pros testes.

- [ ] **Step 1: Testes que falham**

```ts
test.each([['curta', 32, 4], ['completa', 64, 8]] as const)('%s equilibrado', (f, total, porEixo) => {
  const sel = selectQuestions(pool, f, seededRng(1));
  expect(sel).toHaveLength(total);
  for (const ax of AXIS_IDS) {
    const doEixo = sel.filter(q => q.axis === ax);
    expect(doEixo).toHaveLength(porEixo);
    expect(doEixo.filter(q => q.polarity === 'A')).toHaveLength(porEixo / 2);
  }
  expect(new Set(sel.map(q => q.id)).size).toBe(total);
});
test('profunda usa o banco inteiro', () => {
  expect(selectQuestions(pool, 'profunda', seededRng(1))).toHaveLength(120);
});
test('nenhum texto promete 100%', () => {
  expect(JSON.stringify(FORMATOS)).not.toMatch(/100\s*%/);
});
```

- [ ] **Step 2:** `npx vitest run tests/selection.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `selection.ts`.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS.
- [ ] **Step 5:** `git commit -am "feat: seleção equilibrada de perguntas por formato"`

---

### Task 4: Banco de 120 perguntas (conteúdo)

**Files:**
- Create: `data/questions.json`
- Test: `tests/questions.test.ts`

**Interfaces:**
- Consumes: `getQuestions()`, `Question`
- Produces: ids no formato `<eixo>_<nn>` (ex.: `controle_01` … `controle_15`). As Tasks 6 e 7 usam esses ids nas respostas do catálogo.

Regras de conteúdo (pra quem escreve):
- Frases curtas, primeira pessoa ou afirmação geral, sem jargão ("Ataraxia" não; "Prefiro uma vida tranquila a uma vida intensa" sim).
- Nada de pergunta sobre saúde mental ou sintomas.
- Escolha forçada só onde os dois polos soam bem. As duas frases devem ser igualmente desejáveis.
- Cada eixo tem 8 afirmações de um polo e 7 do outro (alternar entre eixos qual polo tem 8).

- [ ] **Step 1: Teste que falha**

```ts
const qs = getQuestions();
test('120 perguntas, ids únicos e no formato', () => {
  expect(qs).toHaveLength(120);
  expect(new Set(qs.map(q => q.id)).size).toBe(120);
  for (const q of qs) expect(q.id).toMatch(new RegExp(`^${q.axis}_\\d{2}$`));
});
test.each(AXIS_IDS)('eixo %s: 15 perguntas, 8/7 por polo', (ax) => {
  const d = qs.filter(q => q.axis === ax);
  expect(d).toHaveLength(15);
  expect([7, 8]).toContain(d.filter(q => q.polarity === 'A').length);
});
test.each(['bemviver', 'eu'] as const)('%s tem ≥5 de escolha forçada', (ax) => {
  expect(qs.filter(q => q.axis === ax && q.kind === 'forced').length).toBeGreaterThanOrEqual(5);
});
test('campos certos por tipo e textos sem duplicata', () => {
  for (const q of qs) {
    if (q.kind === 'likert') expect(q.text).toBeTruthy();
    else { expect(q.textLeft).toBeTruthy(); expect(q.textRight).toBeTruthy(); }
  }
  const textos = qs.map(q => (q.text ?? q.textLeft + '|' + q.textRight).toLowerCase());
  expect(new Set(textos).size).toBe(120);
});
```

- [ ] **Step 2:** `npx vitest run tests/questions.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Escrever `data/questions.json` seguindo as regras de conteúdo.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. Depois, **o usuário revisa o texto** antes do commit (é o conteúdo central do produto).
- [ ] **Step 5:** `git commit -am "content: banco de 120 perguntas"`

---

### Task 5: Motor de match e calibração

**Files:**
- Create: `src/lib/matching.ts`
- Test: `tests/matching.test.ts`

**Interfaces:**
- Consumes: `Vector`, `AxisId`, `AXIS_IDS`, `seededRng`
- Produces:
  - `matchScore(user: Vector, profile: Vector, axes?: AxisId[]): number` (0–100, 1 casa). `axes` restringe o cálculo a um subconjunto (padrão: todos).
  - `rank(user: Vector, profiles: Record<string, Vector>, axes?: AxisId[]): { id: string; score: number }[]`, em ordem decrescente; empate desempata por id.
  - `DIMENSOES: Record<'acao'|'sentido'|'pensar', { label: string; axes: AxisId[] }>`: acao = "Na ação" [controle, rotina, eu]; sentido = "No sentido" [sentido, mundo, bemviver]; pensar = "No pensar" [guia, verdade].

Fórmula (decisão do plano; o teste de calibração é o juiz):

```
para cada eixo i do subconjunto (n eixos):
  u_i = (user_i - 50)/50,  p_i = (profile_i - 50)/50       // em [-1, 1]
  d_i = |user_i - profile_i| / 100
  se u_i·p_i < 0 e |u_i| > 0.2 e |p_i| > 0.2: d_i += 0.25 · min(|u_i|, |p_i|)
  d_i = min(d_i, 1)
eixos     = 1 - média(d_i)
|u|, |p|  = normas euclidianas dos vetores u e p
amort     = min(1, |u| / (0.25·√n))                          // perto do centro, direção é ruído
cos       = (|u| = 0 ou |p| = 0) ? 0 : (u·p)/(|u||p|)
direcao   = amort·(cos+1)/2 + (1-amort)·eixos
intensid  = 1 - ||u| - |p|| / √n
pior      = 1 - max(d_i)
score     = 100·(0.45·eixos + 0.30·direcao + 0.15·intensid + 0.10·pior)
```

- [ ] **Step 1: Testes que falham**

```ts
const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;
test('perfil idêntico = 100', () => {
  const v = { ...neutro, controle: 20, guia: 80 };
  expect(matchScore(v, v)).toBe(100);
});
test('tudo neutro não gera NaN', () => {
  expect(Number.isFinite(matchScore(neutro, neutro))).toBe(true);
  expect(Number.isFinite(matchScore(neutro, { ...neutro, mundo: 90 }))).toBe(true);
});
test('oposto pontua menos que vizinho', () => {
  const u = { ...neutro, controle: 20, bemviver: 25 };
  expect(matchScore(u, { ...neutro, controle: 25, bemviver: 30 }))
    .toBeGreaterThan(matchScore(u, { ...neutro, controle: 80, bemviver: 75 }));
});
test('moderado não casa melhor com extremo do que com moderado', () => {
  const u = { ...neutro, sentido: 35, verdade: 35 };
  expect(matchScore(u, { ...neutro, sentido: 35, verdade: 35 }))
    .toBeGreaterThan(matchScore(u, { ...neutro, sentido: 0, verdade: 0 }));
});
test('calibração com catálogo sintético', () => {
  const rng = seededRng(42);
  const catalogo = Object.fromEntries(Array.from({ length: 20 }, (_, k) =>
    [`p${k}`, Object.fromEntries(AXIS_IDS.map(a => [a, Math.round(rng() * 100)])) as Vector]));
  let acertos = 0, total = 0;
  for (const [id, v] of Object.entries(catalogo)) for (let t = 0; t < 20; t++) {
    const ruidoso = Object.fromEntries(AXIS_IDS.map(a => [a, Math.min(100, Math.max(0, v[a] + (rng() - 0.5) * 30))])) as Vector;
    if (rank(ruidoso, catalogo).slice(0, 3).some(r => r.id === id)) acertos++;
    total++;
  }
  expect(acertos / total).toBeGreaterThanOrEqual(0.9);
});
```

- [ ] **Step 2:** `npx vitest run tests/matching.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `matching.ts` com a fórmula acima.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. Se a calibração falhar, ajustar só os pesos (somando 1) e registrar os valores finais no topo do arquivo.
- [ ] **Step 5:** `git commit -am "feat: motor de match com teste de calibração"`

---

### Task 6: Pipeline do catálogo (validação, vetores, comando de perfil)

**Files:**
- Create: `scripts/validate-profile.ts`, `scripts/build-vectors.ts`, `scripts/check-axes.ts`, `src/lib/catalog-checks.ts`, `.claude/commands/novo-perfil.md`
- Test: `tests/catalog-checks.test.ts`

**Interfaces:**
- Consumes: `computeVector`, `getQuestions`, `getVectors`, `ProfileAnswers`, `Vector`
- Produces (`src/lib/catalog-checks.ts`, funções puras usadas pelos scripts e testes):
  - `checkProfileAnswers(pa: ProfileAnswers, questions: Question[]): string[]`: erros quando faltar resposta pra alguma das 120 perguntas, quando houver id desconhecido ou quando mais de 40% das respostas forem índice 2 (neutras demais).
  - `findNearDuplicate(v: Vector, others: Record<string, Vector>): string | null`: id do outro perfil quando a diferença máxima entre eixos for menor que 8.
  - `axisCorrelations(vectors: Vector[]): { a: AxisId; b: AxisId; r: number }[]`: Pearson de todos os 28 pares (`a` antes de `b` na ordem de `AXIS_IDS`).
  - `loadAllAnswers(): ProfileAnswers[]`: lê `data/answers/**`.
- Scripts:
  - `npm run validate -- <school|thinker> <id>`: roda as duas checagens. Sai com código 1 e lista os erros.
  - `npm run vectors`: lê as respostas, calcula com `computeVector` e grava `data/generated/vectors.json` (chaves ordenadas).
  - `npm run check:axes`: imprime os pares e sai com código 1 se algum `|r| > 0.7`.
- `.claude/commands/novo-perfil.md`: comando do Claude Code `/novo-perfil <school|thinker> <nome>`. Instruções: pesquisar a escola ou pensador em fontes primárias; responder as 120 perguntas uma a uma, no papel, com uma linha de justificativa cada (em `notes`); gravar `data/answers/<kind>/<id>.json`; preencher a entrada em `schools.json`/`thinkers.json` (e livros em `books.json`) seguindo os Global Constraints; rodar `npm run validate`, `npm run vectors` e `npm test`; não commitar sem revisão do usuário.

- [ ] **Step 1: Testes que falham**

```ts
const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;
test('perfil incompleto ou neutro demais', () => {
  const qs = getQuestions();
  const todas2 = Object.fromEntries(qs.map(q => [q.id, 2 as AnswerIndex]));
  expect(checkProfileAnswers({ profileId: 'x', kind: 'school', answers: todas2 }, qs).join()).toMatch(/neutr/i);
  expect(checkProfileAnswers({ profileId: 'x', kind: 'school', answers: {} }, qs).length).toBeGreaterThan(0);
});
test('quase duplicado', () => {
  const a = { ...neutro, controle: 20 };
  expect(findNearDuplicate({ ...a, controle: 25 }, { a })).toBe('a');
  expect(findNearDuplicate({ ...a, controle: 40 }, { a })).toBeNull();
});
test('correlação perfeita é detectada', () => {
  const vs = [10, 40, 70].map(x => ({ ...neutro, controle: x, rotina: x }));
  expect(axisCorrelations(vs).find(c => c.a === 'controle' && c.b === 'rotina')!.r).toBeCloseTo(1);
});
test('vectors.json está em dia com as respostas', () => {
  const qs = getQuestions(); const vs = getVectors();
  for (const pa of loadAllAnswers()) {
    const grupo = pa.kind === 'school' ? vs.schools : vs.thinkers;
    expect(grupo[pa.profileId]).toEqual(computeVector(qs, pa.answers));
  }
});
```

- [ ] **Step 2:** `npx vitest run tests/catalog-checks.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `catalog-checks.ts`, os três scripts e o comando `novo-perfil.md`.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS.
- [ ] **Step 5:** `git add -A && git commit -m "feat: pipeline do catálogo e comando /novo-perfil"`

---

### Task 7: Catálogo da v1 (conteúdo)

**Files:**
- Create: `data/schools.json`, `data/thinkers.json`, `data/books.json`, `data/answers/**`, `data/generated/vectors.json`, `public/retratos/*.webp`
- Test: `tests/catalog.test.ts`

**Interfaces:**
- Consumes: `/novo-perfil`, `npm run validate|vectors|check:axes`, `rank`, `axisCorrelations`
- Produces: o catálogo real usado por todas as páginas.

Escolas (12): `estoicismo`, `epicurismo`, `cinismo`, `ceticismo`, `budismo`, `taoismo`, `cristianismo-agostiniano`, `existencialismo-cristao`, `existencialismo-ateu`, `absurdismo`, `niilismo`, `logoterapia`.
Famílias: virtude = estoicismo, cinismo; prazer = epicurismo; duvida = ceticismo, niilismo; oriente = budismo, taoismo; cristas = cristianismo-agostiniano, existencialismo-cristao; sentido = existencialismo-ateu, absurdismo, logoterapia.

Pensadores (30): `marco-aurelio`, `seneca`, `epicteto`, `epicuro`, `lucrecio`, `diogenes`, `antistenes`, `pirro`, `sexto-empirico`, `montaigne`, `buda`, `thich-nhat-hanh`, `lao-tse`, `zhuangzi`, `agostinho`, `pascal`, `kierkegaard`, `dostoievski`, `gabriel-marcel`, `cs-lewis`, `sartre`, `simone-de-beauvoir`, `camus`, `nietzsche`, `schopenhauer`, `cioran`, `viktor-frankl`, `confucio`, `aristoteles`, `thoreau`.

Estoicismo e seus pensadores recebem o texto mais caprichado (é a escola com mais demanda).

- [ ] **Step 1: Teste que falha**

```ts
test('catálogo da v1 completo e consistente', () => {
  expect(getSchools()).toHaveLength(12);
  expect(getThinkers().length).toBeGreaterThanOrEqual(30);
  const vs = getVectors();
  for (const s of getSchools()) expect(vs.schools[s.id]).toBeDefined();
  for (const t of getThinkers()) expect(vs.thinkers[t.id]).toBeDefined();
  for (const b of getBooks()) expect(getThinkers().some(t => t.id === b.thinkerId)).toBe(true);
  for (const t of getThinkers()) if (t.portrait) expect(existsSync(`public/retratos/${t.portrait.file}`)).toBe(true);
});
test('eixos não redundantes no catálogo real', () => {
  const todos = [...Object.values(getVectors().schools), ...Object.values(getVectors().thinkers)];
  expect(axisCorrelations(todos).filter(c => Math.abs(c.r) > 0.7)).toEqual([]);
});
test('calibração no catálogo real de escolas', () => {
  // mesmo método do teste de calibração da Task 5, trocando o catálogo sintético por getVectors().schools: ≥ 0,9 no top 3
});
```

- [ ] **Step 2:** `npx vitest run tests/catalog.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Rodar `/novo-perfil` pra cada escola e pensador acima. Baixar os retratos da Wikimedia Commons, converter pra webp 400×400 e registrar fonte e licença.
- [ ] **Step 4:** `npm run vectors && npm run check:axes && npx vitest run`. Esperado: PASS. Se `check:axes` falhar, voltar ao spec: reescrever itens do par correlacionado (Task 4) e refazer as respostas afetadas. **O usuário revisa** os textos do catálogo antes do commit.
- [ ] **Step 5:** `git add data public/retratos tests && git commit -m "content: catálogo da v1 (12 escolas, 30 pensadores)"`

---

### Task 8: Home e escolha de formato

**Files:**
- Create: `src/app/page.tsx`, `src/app/layout.tsx` (substituir), `src/app/globals.css`
- Test: `tests/home.test.tsx` (Testing Library: instalar `@testing-library/react` e `jsdom`, `environment: 'jsdom'` pros `.tsx`)

**Interfaces:**
- Consumes: `FORMATOS`
- Produces: tokens de cor CSS em `globals.css` (`--bg`, `--card`, `--line`, `--ink`, `--mute`, `--navy`, `--soft`, `--gold`, `--wine`, com os valores do mockup), usados por todas as páginas. Fontes Bricolage Grotesque e Inter via `next/font/google`.

- [ ] **Step 1: Teste que falha**: a home renderiza 3 cartões com "32", "64" e "120 perguntas", só a "completa" tem o selo "Recomendada", cada botão leva a `/quiz/<formato>` e o texto não contém "100%". Embaixo dos cartões: "Anônimo, sem cadastro", "Resultado imediato" e "Todos os formatos usam os mesmos 8 eixos".
- [ ] **Step 2:** `npx vitest run tests/home.test.tsx`. Esperado: FAIL.
- [ ] **Step 3:** Implementar. Chamada principal: "Qual é a sua filosofia de vida?" + subtítulo sobre escolas e pensadores. Layout responsivo com margem lateral de 16px no celular.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. Ver no navegador (`npm run dev`) em 375px e em desktop.
- [ ] **Step 5:** `git add -A && git commit -m "feat: home e escolha de formato"`

---

### Task 9: Tela do quiz

**Files:**
- Create: `src/app/quiz/[formato]/page.tsx`, `src/app/quiz/[formato]/QuizRunner.tsx`, `src/lib/quiz-state.ts`
- Test: `tests/quiz-state.test.ts`, `tests/quiz-runner.test.tsx`

**Interfaces:**
- Consumes: `selectQuestions`, `computeVector`, `vectorToParams`, `getQuestions`, `Formato`
- Produces (`quiz-state.ts`, puro):
  - `interface QuizState { formato: Formato; questionIds: string[]; answers: Record<string, AnswerIndex>; index: number }`
  - `answer(s: QuizState, i: AnswerIndex): QuizState` (grava e avança), `back(s: QuizState): QuizState`, `isDone(s: QuizState): boolean`
  - `saveState(s: QuizState): void` / `loadState(formato: Formato): QuizState | null` em `sessionStorage['quiz:<formato>']`, ambos em try/catch (falha = no-op / null)
- `page.tsx`: `formato` inválido → `notFound()`. Passa ao cliente o banco inteiro e uma seleção sorteada no servidor; se houver estado salvo, o cliente usa os `questionIds` dele.

- [ ] **Step 1: Testes que falham**

```ts
const base = (): QuizState => ({ formato: 'curta', questionIds: ['a','b'], answers: {}, index: 0 });
test('responder avança, voltar mantém a resposta', () => {
  let s = answer(base(), 0); expect(s.index).toBe(1);
  s = back(s); expect(s.index).toBe(0); expect(s.answers.a).toBe(0);
});
test('conclui na última', () => {
  expect(isDone(answer(answer(base(), 1), 3))).toBe(true);
});
test('storage indisponível não quebra', () => {
  vi.stubGlobal('sessionStorage', { getItem() { throw new Error(); }, setItem() { throw new Error(); } });
  expect(loadState('curta')).toBeNull();
  expect(() => saveState(base())).not.toThrow();
});
```

Em `quiz-runner.test.tsx`: Likert mostra 5 botões ("Concordo totalmente", "Concordo", "Neutro", "Discordo", "Discordo totalmente"); escolha forçada mostra as duas frases lado a lado e 5 botões ("Muito mais a da esquerda", "Mais a da esquerda", "Igual", "Mais a da direita", "Muito mais a da direita"); a barra de progresso mostra "3 de 32"; com estado salvo no índice 5, a tela abre na 6ª pergunta.

- [ ] **Step 2:** `npx vitest run tests/quiz-state.test.ts tests/quiz-runner.test.tsx`. Esperado: FAIL.
- [ ] **Step 3:** Implementar. Ao concluir: `computeVector` → limpar o storage → `router.push('/resultado?' + vectorToParams(v))`.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. Fazer um quiz curto inteiro no navegador, recarregar no meio e confirmar que retoma.
- [ ] **Step 5:** `git add -A && git commit -m "feat: tela do quiz com progresso salvo"`

---

### Task 10: Resultado, parte 1 (topo, eixos, distinção, pensadores, escolas)

**Files:**
- Create: `src/app/resultado/page.tsx`, `src/app/resultado/Invalido.tsx`, `src/components/result/{Hero,Eixos,Distincao,Pensadores,Escolas,Indice}.tsx`, `src/lib/distinction.ts`, `src/lib/result.ts`
- Test: `tests/distinction.test.ts`, `tests/result.test.ts`

**Interfaces:**
- Consumes: `paramsToVector`, `rank`, `DIMENSOES`, `intensity`, getters do catálogo
- Produces:
  - `mostUnusual(u: Vector, catalog: Vector[]): { axis: AxisId; pct: number } | null`. Só considera eixos com `|u-50| ≥ 10`. Pra cada eixo, `pct` = % do catálogo com `(p-50)·lado < (u-50)·lado`, onde `lado = sign(u-50)`. Retorna o maior `pct` (arredondado), ou `null` se nenhum eixo se qualificar.
  - `mostCommon(u: Vector, catalog: Vector[]): { axis: AxisId; centered: boolean }`: eixo com menor `|u - mediana do catálogo|`; `centered = |u-50| < 10`.
  - `buildResult(v: Vector)` em `result.ts`, que retorna `{ school: { school: School; family: Family; score: number }; otherSchools: { school: School; score: number }[] /* 3 */; opposite: School; thinker: { thinker: Thinker; score: number }; byDimension: { dim: keyof typeof DIMENSOES; thinker: Thinker; score: number }[] /* 3, sem repetir o principal */; farthestThinkers: Thinker[] /* 3 */; unusual: ReturnType<typeof mostUnusual>; common: ReturnType<typeof mostCommon> }`. O catálogo de comparação de `unusual`/`common` são as escolas.
- `page.tsx`: `paramsToVector(searchParams)`; `null` → `<Invalido/>` ("Não conseguimos ler esse resultado" + botão pro quiz). Ordem das seções e visual como no mockup (seções 1–5), mais o índice lateral fixo no desktop e oculto no celular. O botão "Compartilhar no story" no topo é ligado na Task 12 (até lá, desabilitado).

- [ ] **Step 1: Testes que falham**

```ts
const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;
test('tudo neutro: sem posição incomum, comum centralizada', () => {
  const cat = [10, 30, 70].map(x => ({ ...neutro, guia: x }));
  expect(mostUnusual(neutro, cat)).toBeNull();
  expect(mostCommon(neutro, cat).centered).toBe(true);
});
test('posição incomum', () => {
  const cat = [10, 30, 45, 55].map(x => ({ ...neutro, bemviver: x }));
  expect(mostUnusual({ ...neutro, bemviver: 5 }, cat)).toEqual({ axis: 'bemviver', pct: 100 });
});
test('buildResult com catálogo real', () => {
  const r = buildResult(getVectors().schools['estoicismo']);
  expect(r.school.school.id).toBe('estoicismo');
  expect(r.otherSchools).toHaveLength(3);
  expect(r.opposite.id).not.toBe('estoicismo');
  expect(r.byDimension.map(d => d.thinker.id)).not.toContain(r.thinker.thinker.id);
});
```

- [ ] **Step 2:** `npx vitest run tests/distinction.test.ts tests/result.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implementar as funções e os componentes.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. No navegador: `/resultado?c=50&b=50&s=50&m=50&e=50&r=50&g=50&v=50` (tudo equilibrado, sem erro) e `/resultado?c=abc` (tela de inválido).
- [ ] **Step 5:** `git add -A && git commit -m "feat: página de resultado, parte 1"`

---

### Task 11: Resultado, parte 2 (como você lida, livros, comparar)

**Files:**
- Create: `src/components/result/{Lida,Livros,Comparar}.tsx`, `src/components/Retrato.tsx`, `src/lib/books.ts`, `src/lib/compare.ts`, `src/app/comparar/page.tsx`
- Test: `tests/books.test.ts`, `tests/compare.test.ts`, `tests/retrato.test.tsx`

**Interfaces:**
- Consumes: `buildResult`, `parseResultLink`, `paramsToVector`, `vectorToParams`, `getBooks`, `getThinkers`, `getVectors`
- Produces:
  - `affiliateUrl(b: Book, tag: string | undefined): string`. Sem tag, o link sai sem `&tag=`.
  - `booksFor(thinkerIds: string[], books: Book[]): { thinkerId: string; book: Book }[]`: o primeiro livro de cada pensador, pulando quem não tem livro, no máximo 3.
  - `compareVectors(a: Vector, b: Vector): { axis: AxisId; a: number; b: number; diff: number; sameSide: boolean }[]`, ordenado por `diff` decrescente. `sameSide` = os dois do mesmo lado do 50 (ou um deles no centro).
  - `<Retrato thinker size>`: a imagem ou, sem retrato, um círculo com as iniciais.
  - `/comparar?<params de A>&outro=<valor>`: `outro` é um link de resultado (via `parseResultLink`) ou `pensador:<id>`. Inválido → mensagem "Esse link não é de um resultado" e o formulário de novo.
- Seção "Como você lida com…": mostra só `sofrimento` da escola principal enquanto `NEXT_PUBLIC_PAYWALL_ENABLED !== 'true'` (os outros três não aparecem; com a flag ligada, aparecem borrados, e o desbloqueio é do plano 2).
- Seção "Compare": campo pra colar o link do amigo + select de pensador. Os dois levam a `/comparar`.

- [ ] **Step 1: Testes que falham**

```ts
const b: Book = { id: 'm', thinkerId: 'marco-aurelio', title: 'Meditações', year: 180, amazonQuery: 'Meditações Marco Aurélio' };
test('link de afiliado', () => {
  expect(affiliateUrl(b, 'x-20')).toBe('https://www.amazon.com.br/s?k=Medita%C3%A7%C3%B5es+Marco+Aur%C3%A9lio&i=stripbooks&tag=x-20');
  expect(affiliateUrl(b, undefined)).not.toContain('tag=');
});
test('pensador sem livro é pulado', () => {
  expect(booksFor(['sem-livro', 'marco-aurelio'], [b]).map(x => x.thinkerId)).toEqual(['marco-aurelio']);
});
test('comparação ordena pela maior diferença', () => {
  const r = compareVectors({ ...neutro, guia: 10 }, { ...neutro, guia: 90, verdade: 60 });
  expect(r[0]).toMatchObject({ axis: 'guia', diff: 80, sameSide: false });
});
```

Em `retrato.test.tsx`: pensador com `portrait: null` e nome "Viktor Frankl" renderiza "VF" e nenhuma `<img>`.

- [ ] **Step 2:** `npx vitest run tests/books.test.ts tests/compare.test.ts tests/retrato.test.tsx`. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. No navegador: colar `oi` no campo de comparar (mensagem de erro) e um link válido (tabela por eixo).
- [ ] **Step 5:** `git add -A && git commit -m "feat: página de resultado, parte 2, e comparação"`

---

### Task 12: Card de story

**Files:**
- Create: `src/app/api/card/route.tsx`, `src/components/result/Compartilhar.tsx`
- Test: `tests/card.test.ts`

**Interfaces:**
- Consumes: `paramsToVector`, `buildResult`, `intensity`, `getAxes`
- Produces: `GET /api/card?<params>` → PNG 1080×1920 (`ImageResponse` de `next/og`) com escola + %, família, pensador principal + %, os 8 eixos em grade 2×4 (nome + polo dominante + %) e o endereço do site no rodapé. Params inválidos → 400.
  - `<Compartilhar params>`: usa `navigator.share({ files })` quando `navigator.canShare?.({ files })` for verdadeiro; senão, baixa o PNG (`<a download="minha-filosofia.png">`).

- [ ] **Step 1: Teste que falha**: chamar o handler `GET` direto com `new Request('http://x/api/card?' + vectorToParams(v))` → status 200 e `content-type` `image/png`; com `?c=abc` → 400.
- [ ] **Step 2:** `npx vitest run tests/card.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implementar. Fontes carregadas como ArrayBuffer (Bricolage Grotesque, Inter).
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. Abrir `/api/card?...` no navegador e conferir o visual. Ligar o botão do topo (Task 10) ao `<Compartilhar>`.
- [ ] **Step 5:** `git add -A && git commit -m "feat: card de story"`

---

### Task 13: Páginas de SEO, sobre e privacidade

**Files:**
- Create: `src/app/escolas/page.tsx`, `src/app/escolas/[id]/page.tsx`, `src/app/pensadores/page.tsx`, `src/app/pensadores/[id]/page.tsx`, `src/app/sobre/page.tsx`, `src/app/privacidade/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Consumes: getters do catálogo, `affiliateUrl`, `booksFor`, `<Retrato>`, `<Eixos>`, `rank`
- Produces:
  - `generateStaticParams` em `[id]` (todas as escolas e pensadores); id desconhecido → `notFound()`.
  - `generateMetadata`: título `"<Nome>: o que é, ideias e pensadores"` (escola) e `"Filosofia de <Nome>"` (pensador), com o nome do site como template em `layout.tsx`; descrição = primeiros 155 caracteres do `summary`/`bio`.
  - Escola: resumo, frase, "como lida com sofrimento", os 8 eixos (`<Eixos>`), pensadores dela, escolas mais próximas (via `rank` entre escolas), livros, CTA "Faça o quiz".
  - Pensador: retrato, descritor, bio, eixos, escola, livros, CTA.
  - `/sobre`: como o cálculo funciona em linguagem simples + a frase "É uma ferramenta pra explorar ideias. Não é um teste científico nem diagnóstico psicológico."
  - `/privacidade`: não há cadastro, e as respostas não saem do navegador (só os 8 números na URL do resultado).
  - `sitemap.ts`: home, sobre, listagens e todas as páginas de escola e pensador, com base em `NEXT_PUBLIC_SITE_URL`.

- [ ] **Step 1: Teste que falha**: `generateStaticParams()` de escolas retorna 12 ids; `sitemap()` contém `/escolas/estoicismo` e `/pensadores/marco-aurelio`; `generateMetadata({ params: Promise.resolve({ id: 'estoicismo' }) })` tem título começando com "Estoicismo"; o arquivo de `/sobre` contém "Não é um teste científico".
- [ ] **Step 2:** `npx vitest run tests/seo.test.ts`. Esperado: FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** Rodar de novo. Esperado: PASS. `npm run build` deve gerar estaticamente todas as páginas de escolas e pensadores, sem erro.
- [ ] **Step 5:** `git add -A && git commit -m "feat: páginas de escolas, pensadores, sobre e sitemap"`

---

### Task 14: CI e preparação do deploy

**Files:**
- Create: `.github/workflows/ci.yml`, `README.md`

**Interfaces:**
- Consumes: scripts `test`, `check:axes`, `build`

- [ ] **Step 1:** Workflow do CI em push e PR com Node 20: `npm ci`, `npm test`, `npm run check:axes`, `npm run build`.
- [ ] **Step 2:** README em português: o que é, como rodar (`npm run dev`), como adicionar um perfil (`/novo-perfil`), variáveis (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_AMAZON_TAG`, `NEXT_PUBLIC_PAYWALL_ENABLED`) e licença (todos os direitos reservados, até o usuário decidir outra).
- [ ] **Step 3:** Rodar localmente `npm ci && npm test && npm run check:axes && npm run build`. Esperado: tudo verde.
- [ ] **Step 4:** `git add -A && git commit -m "chore: CI e README"`
- [ ] **Step 5:** Entregar ao usuário os passos do deploy, que dependem das contas dele: criar o repositório no GitHub, importar na Vercel, definir as variáveis e cadastrar a tag de afiliado na Amazon Associados.

---

## Depois deste plano

Plano 2 (separado): relatório pago. Blocos de texto por eixo e escola, rota do relatório no servidor, Mercado Pago Pix atrás de uma interface de gateway, webhook, token HMAC ligado ao hash do vetor, Supabase (cobrança, hash, e-mail, status, data), e-mail com o link, página de reembolso e flag de paywall.
