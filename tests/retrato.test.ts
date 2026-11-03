import { getRetrato } from '@/lib/data';
import { computeVector } from '@/lib/scoring';
import { AXIS_IDS, type Question } from '@/lib/types';

const retrato = getRetrato();

test('5 perguntas, de 4 a 6 alternativas, cada uma mexendo em 2 ou 3 eixos de 0 a 100', () => {
  expect(retrato).toHaveLength(5);
  for (const p of retrato) {
    expect(p.opcoes.length).toBeGreaterThanOrEqual(4);
    expect(p.opcoes.length).toBeLessThanOrEqual(6);
    expect(new Set(p.opcoes.map(o => o.id)).size).toBe(p.opcoes.length);
    for (const o of p.opcoes) {
      const efeitos = Object.entries(o.efeitos);
      expect(efeitos.length).toBeGreaterThanOrEqual(2);
      expect(efeitos.length).toBeLessThanOrEqual(3);
      for (const [, v] of efeitos) expect(v).toBeGreaterThanOrEqual(0);
      for (const [, v] of efeitos) expect(v).toBeLessThanOrEqual(100);
    }
  }
});

test('todos os eixos aparecem no retrato, puxando para os dois lados', () => {
  for (const ax of AXIS_IDS) {
    const valores = retrato.flatMap(p => p.opcoes.map(o => o.efeitos[ax])).filter((v): v is number => v !== undefined);
    expect(Math.min(...valores)).toBeLessThan(40);
    expect(Math.max(...valores)).toBeGreaterThan(60);
  }
});

test('cada alternativa do retrato conta como uma pergunta a mais nos eixos que toca', () => {
  const q: Question = { id: 'controle_01', axis: 'controle', kind: 'likert', polarity: 'A', text: 'x' };
  const opcao = retrato[0].opcoes.find(o => o.id === 'd')!; // controle 90, rotina 60
  const v = computeVector([q], { controle_01: 0 }, retrato, { [retrato[0].id]: 'd' });
  expect(v.controle).toBe(round((0 + opcao.efeitos.controle!) / 2));
  expect(v.rotina).toBe(opcao.efeitos.rotina);
  expect(v.verdade).toBe(50);
  // Escolha desconhecida (link mexido, versão antiga) é ignorada.
  expect(computeVector([q], { controle_01: 0 }, retrato, { [retrato[0].id]: 'zz', outra: 'a' }).controle).toBe(0);
});

const round = (x: number) => Math.round(x * 10) / 10;
