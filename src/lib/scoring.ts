import { AXIS_IDS, type AnswerIndex, type AxisId, type Question, type RetratoPergunta, type Vector } from './types';

export const answerValue = (i: AnswerIndex): number => (4 - i) / 4;

export const round1 = (x: number): number => Math.round(x * 10) / 10;

// O retrato final entra como uma resposta a mais, com o mesmo peso, em cada eixo que a alternativa escolhida toca.
export function computeVector(
  questions: Question[], answers: Record<string, AnswerIndex>,
  retrato: RetratoPergunta[] = [], escolhas: Record<string, string> = {},
): Vector {
  const sums = Object.fromEntries(AXIS_IDS.map(a => [a, { total: 0, n: 0 }])) as Record<AxisId, { total: number; n: number }>;
  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined) continue;
    const value = answerValue(a);
    sums[q.axis].total += q.polarity === 'B' ? value : 1 - value;
    sums[q.axis].n += 1;
  }
  for (const p of retrato) {
    const opcao = p.opcoes.find(o => o.id === escolhas[p.id]);
    for (const [eixo, valor] of Object.entries(opcao?.efeitos ?? {}) as [AxisId, number][]) {
      sums[eixo].total += valor / 100;
      sums[eixo].n += 1;
    }
  }
  return Object.fromEntries(
    AXIS_IDS.map(a => [a, sums[a].n === 0 ? 50 : round1((sums[a].total / sums[a].n) * 100)]),
  ) as Vector;
}
