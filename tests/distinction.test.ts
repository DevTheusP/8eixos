import { mostCommon, mostUnusual } from '@/lib/distinction';
import { AXIS_IDS, type Vector } from '@/lib/types';

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
test('posição incomum do lado B', () => {
  const cat = [10, 70, 80, 95].map(x => ({ ...neutro, mundo: x }));
  expect(mostUnusual({ ...neutro, mundo: 90 }, cat)).toEqual({ axis: 'mundo', pct: 75 });
});
test('posição mais comum = mais perto da mediana', () => {
  const cat = [10, 20, 30].map(x => ({ ...neutro, controle: x, guia: 90 }));
  expect(mostCommon({ ...neutro, controle: 20, guia: 10 }, cat)).toEqual({ axis: 'controle', centered: false });
});

describe('tensão interna', () => {
  test('acha o par de posições que quase ninguém do catálogo junta', async () => {
    const { tensao } = await import('@/lib/distinction');
    // Catálogo: quem é Aceitar (controle baixo) quase sempre é Disciplina (rotina baixa).
    const cat = [
      ...Array.from({ length: 9 }, () => ({ ...neutro, controle: 20, rotina: 20 })),
      { ...neutro, controle: 20, rotina: 80 },
    ];
    const r = tensao({ ...neutro, controle: 15, rotina: 85 }, cat)!;
    expect(r).toEqual({ a: { axis: 'controle', pole: 'A' }, b: { axis: 'rotina', pole: 'B' }, count: 1, total: 10 });
  });

  test('sem posições marcantes ou combinação comum, não inventa tensão', async () => {
    const { tensao } = await import('@/lib/distinction');
    const cat = Array.from({ length: 10 }, () => ({ ...neutro, controle: 20, rotina: 20 }));
    expect(tensao(neutro, cat)).toBeNull();
    expect(tensao({ ...neutro, controle: 15, rotina: 15 }, cat)).toBeNull();
  });
});
