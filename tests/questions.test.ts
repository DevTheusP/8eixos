import { getQuestions } from '@/lib/data';
import { AXIS_IDS } from '@/lib/types';

const qs = getQuestions();

test('120 perguntas, ids únicos e no formato', () => {
  expect(qs).toHaveLength(120);
  expect(new Set(qs.map(q => q.id)).size).toBe(120);
  for (const q of qs) expect(q.id).toMatch(new RegExp(`^${q.axis}_\\d{2}$`));
});

test.each(AXIS_IDS)('eixo %s: 15 perguntas, 8/7 por polo', ax => {
  const d = qs.filter(q => q.axis === ax);
  expect(d).toHaveLength(15);
  expect([7, 8]).toContain(d.filter(q => q.polarity === 'A').length);
});

test.each(['bemviver', 'eu'] as const)('%s tem ≥5 de escolha forçada', ax => {
  expect(qs.filter(q => q.axis === ax && q.kind === 'forced').length).toBeGreaterThanOrEqual(5);
});

test('campos certos por tipo e textos sem duplicata', () => {
  for (const q of qs) {
    if (q.kind === 'likert') expect(q.text).toBeTruthy();
    else {
      expect(q.textLeft).toBeTruthy();
      expect(q.textRight).toBeTruthy();
    }
  }
  const textos = qs.map(q => (q.text ?? `${q.textLeft}|${q.textRight}`).toLowerCase());
  expect(new Set(textos).size).toBe(120);
});
