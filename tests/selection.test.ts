import { FORMATOS, seededRng, selectQuestions } from '@/lib/selection';
import { AXIS_IDS, type Question } from '@/lib/types';

const pool: Question[] = AXIS_IDS.flatMap(axis =>
  Array.from({ length: 15 }, (_, i) => ({
    id: `${axis}_${String(i + 1).padStart(2, '0')}`,
    axis,
    kind: 'likert' as const,
    polarity: (i < 8 ? 'A' : 'B') as 'A' | 'B',
    text: `${axis} ${i}`,
  })),
);

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

test('não repete eixo em sequência', () => {
  const sel = selectQuestions(pool, 'completa', seededRng(7));
  for (let i = 1; i < sel.length; i++) expect(sel[i].axis).not.toBe(sel[i - 1].axis);
});

test('formatos com os números do spec e nenhum texto promete 100%', () => {
  expect(FORMATOS.curta).toMatchObject({ perguntas: 32, porEixo: 4, minutos: 5, recomendado: false });
  expect(FORMATOS.completa).toMatchObject({ perguntas: 64, porEixo: 8, minutos: 10, recomendado: true });
  expect(FORMATOS.profunda).toMatchObject({ perguntas: 120, porEixo: 15, minutos: 20, recomendado: false });
  expect(JSON.stringify(FORMATOS)).not.toMatch(/100\s*%/);
});

test('prefere as perguntas que a pessoa ainda não viu', () => {
  const primeira = selectQuestions(pool, 'completa', seededRng(3));
  const vistas = Object.fromEntries(primeira.map(q => [q.id, 1]));
  const segunda = selectQuestions(pool, 'completa', seededRng(3), vistas);
  // Cada polo tem 7 ou 8 perguntas e a completa usa 4: na segunda vez só repete o que faltar.
  for (const ax of AXIS_IDS) for (const p of ['A', 'B'] as const) {
    const novas = segunda.filter(q => q.axis === ax && q.polarity === p && !vistas[q.id]);
    const disponiveis = pool.filter(q => q.axis === ax && q.polarity === p && !vistas[q.id]).length;
    expect(novas.length).toBe(Math.min(4, disponiveis));
  }
});

test('na curta, quatro rodadas passam por todas as perguntas antes de repetir', () => {
  const vistas: Record<string, number> = {};
  const ids = new Set<string>();
  for (let i = 0; i < 4; i++) {
    for (const q of selectQuestions(pool, 'curta', seededRng(i), vistas)) {
      ids.add(q.id);
      vistas[q.id] = (vistas[q.id] ?? 0) + 1;
    }
  }
  // 8 eixos × (8 + 7) = 120, mas 4 rodadas × 2 por polo = 8 por polo: cobre os de 7 e quase todos os de 8.
  for (const ax of AXIS_IDS) for (const p of ['A', 'B'] as const) {
    const total = pool.filter(q => q.axis === ax && q.polarity === p).length;
    expect(pool.filter(q => q.axis === ax && q.polarity === p && ids.has(q.id)).length).toBe(total);
  }
});
