import { loadVistas, registrarVistas } from '@/lib/quiz-state';
import { advance, answer, back, canSwap, isDone, loadLastResult, loadState, saveLastResult, saveState, select, swap, type QuizState } from '@/lib/quiz-state';
import type { Question } from '@/lib/types';

const base = (): QuizState => ({ formato: 'curta', questionIds: ['a', 'b'], answers: {}, index: 0 });

afterEach(() => vi.unstubAllGlobals());

test('responder avança, voltar mantém a resposta', () => {
  let s = answer(base(), 0);
  expect(s.index).toBe(1);
  s = back(s);
  expect(s.index).toBe(0);
  expect(s.answers.a).toBe(0);
});
test('voltar na primeira pergunta não sai do lugar', () => {
  expect(back(base()).index).toBe(0);
});
test('conclui na última', () => {
  expect(isDone(answer(base(), 1))).toBe(false);
  expect(isDone(answer(answer(base(), 1), 3))).toBe(true);
});
test('salva e carrega do sessionStorage', () => {
  const mem = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) });
  saveState(answer(base(), 2));
  expect(loadState('curta')).toMatchObject({ index: 1, answers: { a: 2 } });
  expect(loadState('completa')).toBeNull();
});
test('storage indisponível não quebra', () => {
  vi.stubGlobal('localStorage', { getItem() { throw new Error(); }, setItem() { throw new Error(); } });
  expect(loadState('curta')).toBeNull();
  expect(() => saveState(base())).not.toThrow();
});
test('estado salvo corrompido é ignorado', () => {
  vi.stubGlobal('localStorage', { getItem: () => '{"formato":"curta","questionIds":"x"}', setItem() {} });
  expect(loadState('curta')).toBeNull();
});

describe('selecionar, avançar e trocar', () => {
  const pool: Question[] = [
    { id: 'c1', axis: 'controle', kind: 'likert', polarity: 'A', text: '1' },
    { id: 'c2', axis: 'controle', kind: 'likert', polarity: 'A', text: '2' },
    { id: 'c3', axis: 'controle', kind: 'likert', polarity: 'B', text: '3' },
    { id: 'g1', axis: 'guia', kind: 'likert', polarity: 'A', text: '4' },
  ];
  const s0 = (): QuizState => ({ formato: 'curta', questionIds: ['c1', 'g1'], answers: {}, index: 0 });

  test('selecionar grava sem avançar; avançar só depois de responder', () => {
    const s = select(s0(), 3);
    expect(s).toMatchObject({ index: 0, answers: { c1: 3 } });
    expect(advance(s0()).index).toBe(0);
    expect(advance(s).index).toBe(1);
  });

  test('trocar pega outra pergunta do mesmo eixo e polo, sem repetir', () => {
    const s = swap(select(s0(), 1), pool, () => 0);
    expect(s.questionIds).toEqual(['c2', 'g1']);
    expect(s.answers).toEqual({});
    expect(canSwap(s, pool)).toBe(false);
  });

  test('sem alternativa, trocar não muda nada', () => {
    const s: QuizState = { ...s0(), index: 1 };
    expect(canSwap(s, pool)).toBe(false);
    expect(swap(s, pool, () => 0)).toEqual(s);
  });
});

test('progresso sobrevive a fechar a aba (fica no localStorage)', () => {
  const mem = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) });
  saveState(answer(base(), 1));
  expect([...mem.keys()]).toEqual(['quiz:curta']);
});

test('guarda e devolve o último resultado', () => {
  const mem = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) });
  expect(loadLastResult()).toBeNull();
  saveLastResult('c=1&b=2&s=3&m=4&e=5&r=6&g=7&v=8');
  expect(loadLastResult()?.params).toBe('c=1&b=2&s=3&m=4&e=5&r=6&g=7&v=8');
  localStorage.setItem('quiz:ultimo-resultado', 'c=9&b=9&s=9&m=9&e=9&r=9&g=9&v=9');
  expect(loadLastResult()).toEqual({ params: 'c=9&b=9&s=9&m=9&e=9&r=9&g=9&v=9' });
});

test('resumo salvo com dados estranhos é descartado (só os parâmetros ficam)', () => {
  const mem = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) });
  localStorage.setItem('quiz:ultimo-resultado', JSON.stringify({ params: 'c=1&b=2&s=3&m=4&e=5&r=6&g=7&v=8', resumo: { escola: 'X', familia: 'Y', cor: 'red;background:url(//mal.example)', score: 50 } }));
  expect(loadLastResult()).toEqual({ params: 'c=1&b=2&s=3&m=4&e=5&r=6&g=7&v=8', resumo: undefined });
  localStorage.setItem('quiz:ultimo-resultado', JSON.stringify({ params: 'javascript:alert(1)' }));
  expect(loadLastResult()).toBeNull();
});

test('histórico de perguntas vistas soma a cada quiz e ignora lixo do navegador', () => {
  const mem = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) });
  expect(loadVistas()).toEqual({});
  registrarVistas(['controle_01', 'eu_03']);
  registrarVistas(['controle_01']);
  expect(loadVistas()).toEqual({ controle_01: 2, eu_03: 1 });
  mem.set('quiz:vistas', JSON.stringify({ controle_01: 'x', '<script>': 3, eu_03: -1, guia_02: 4 }));
  expect(loadVistas()).toEqual({ guia_02: 4 });
  mem.set('quiz:vistas', 'não é json');
  expect(loadVistas()).toEqual({});
});
