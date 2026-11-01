import { answer, back, isDone, loadState, saveState, type QuizState } from '@/lib/quiz-state';

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
  vi.stubGlobal('sessionStorage', { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) });
  saveState(answer(base(), 2));
  expect(loadState('curta')).toMatchObject({ index: 1, answers: { a: 2 } });
  expect(loadState('completa')).toBeNull();
});
test('storage indisponível não quebra', () => {
  vi.stubGlobal('sessionStorage', { getItem() { throw new Error(); }, setItem() { throw new Error(); } });
  expect(loadState('curta')).toBeNull();
  expect(() => saveState(base())).not.toThrow();
});
test('estado salvo corrompido é ignorado', () => {
  vi.stubGlobal('sessionStorage', { getItem: () => '{"formato":"curta","questionIds":"x"}', setItem() {} });
  expect(loadState('curta')).toBeNull();
});
