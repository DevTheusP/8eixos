// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { QuizRunner } from '@/app/quiz/[formato]/QuizRunner';
import { getAxes } from '@/lib/data';
import { saveState } from '@/lib/quiz-state';
import type { Question } from '@/lib/types';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const AX = ['controle', 'bemviver', 'sentido', 'mundo', 'eu', 'rotina', 'guia', 'verdade'] as const;
const pool: Question[] = AX.flatMap(axis => Array.from({ length: 15 }, (_, i) => ({
  id: `${axis}_${String(i + 1).padStart(2, '0')}`, axis, polarity: (i < 8 ? 'A' : 'B') as 'A' | 'B',
  ...(axis === 'bemviver' && i < 6
    ? { kind: 'forced' as const, textLeft: `esq ${i}`, textRight: `dir ${i}` }
    : { kind: 'likert' as const, text: `${axis} frase ${i}` }),
})));

beforeEach(() => { localStorage.clear(); push.mockReset(); });

test('mostra Likert com 5 botões e progresso', async () => {
  const onlyLikert = pool.filter(q => q.kind === 'likert');
  render(<QuizRunner formato="curta" pool={onlyLikert} />);
  for (const t of ['Concordo totalmente', 'Concordo', 'Neutro', 'Discordo', 'Discordo totalmente']) {
    expect(await screen.findByRole('button', { name: t })).toBeTruthy();
  }
  fireEvent.click(screen.getByRole('button', { name: 'Concordo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Concordo' }));
  expect(document.body.textContent).toContain('Pergunta 3 de 32');
  expect(document.body.textContent).toContain('6% concluído');
});

test('escolha forçada mostra as duas frases e 5 opções', async () => {
  const forced = pool.find(q => q.kind === 'forced')!;
  saveState({ formato: 'curta', questionIds: [forced.id], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} />);
  // No celular as frases ficam uma embaixo da outra: a etiqueta A/B vale nas duas disposições.
  expect((await screen.findByText(forced.textLeft!)).closest('[data-frase]')?.getAttribute('data-frase')).toBe('A');
  expect(screen.getByText(forced.textRight!).closest('[data-frase]')?.getAttribute('data-frase')).toBe('B');
  expect(document.body.textContent).not.toMatch(/esquerda|direita/);
  for (const t of ['Muito mais a frase\u00a0A', 'Mais a frase\u00a0A', 'Igual', 'Mais a frase\u00a0B', 'Muito mais a frase\u00a0B']) {
    expect(screen.getByRole('button', { name: t })).toBeTruthy();
  }
});

test('retoma do estado salvo', async () => {
  const ids = pool.slice(0, 32).map(q => q.id);
  saveState({ formato: 'curta', questionIds: ids, answers: Object.fromEntries(ids.slice(0, 5).map(id => [id, 1])), index: 5 });
  render(<QuizRunner formato="curta" pool={pool} />);
  await screen.findByRole('button', { name: 'Concordo totalmente' });
  expect(document.body.textContent).toContain('Pergunta 6 de 32');
});

test('ao concluir vai para o resultado e limpa o progresso', async () => {
  const q = pool[0];
  saveState({ formato: 'curta', questionIds: [q.id], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} />);
  fireEvent.click(await screen.findByRole('button', { name: 'Concordo totalmente' }));
  expect(push).toHaveBeenCalledWith('/resultado?c=0&b=50&s=50&m=50&e=50&r=50&g=50&v=50');
  expect(localStorage.getItem('quiz:curta')).toBeNull();
});

test('mostra o eixo da pergunta e explica no "Entenda"', async () => {
  saveState({ formato: 'curta', questionIds: ['guia_01'], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} axes={getAxes()} />);
  await screen.findByRole('button', { name: 'Concordo totalmente' });
  expect(screen.getByText('Guia')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: /O que isso mede/ }));
  // guia_01 é afirmação do polo A (Razão): concordar puxa pra Razão, discordar pra Emoção. Abre por cima, numa janela.
  const janela = screen.getByRole('dialog', { name: 'Sobre esta pergunta' });
  expect(janela.textContent).toMatch(/Se você concorda.*Razão/);
  expect(janela.textContent).toMatch(/Se você discorda.*Emoção/);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('com "Passar sozinho" desligado, só avança no botão', async () => {
  const ids = pool.filter(q => q.kind === 'likert').slice(0, 3).map(q => q.id);
  saveState({ formato: 'curta', questionIds: ids, answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} />);
  await screen.findByRole('button', { name: 'Concordo totalmente' });
  const avancar = screen.getByRole('button', { name: /^Avançar/ }) as HTMLButtonElement;
  expect(avancar.disabled).toBe(true);
  fireEvent.click(screen.getByRole('switch', { name: 'Passar sozinho ao responder' }));
  fireEvent.click(screen.getByRole('button', { name: 'Discordo' }));
  expect(document.body.textContent).toContain('Pergunta 1 de 3');
  expect(avancar.disabled).toBe(false);
  fireEvent.click(avancar);
  expect(document.body.textContent).toContain('Pergunta 2 de 3');
});

test('"Outra pergunta" substitui por outra do mesmo eixo', async () => {
  saveState({ formato: 'curta', questionIds: ['controle_01'], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} />);
  await screen.findByText('controle frase 0');
  fireEvent.click(screen.getByRole('button', { name: /Outra pergunta/ }));
  expect(screen.queryByText('controle frase 0')).toBeNull();
  expect(document.body.textContent).toMatch(/controle frase [1-7](?!\d)/);
});

test('teclas 1 a 5 respondem', async () => {
  const ids = pool.filter(q => q.kind === 'likert').slice(0, 3).map(q => q.id);
  saveState({ formato: 'curta', questionIds: ids, answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} />);
  await screen.findByRole('button', { name: 'Concordo totalmente' });
  act(() => { fireEvent.keyDown(window, { key: '2' }); });
  expect(document.body.textContent).toContain('Pergunta 2 de 3');
});

test('Recomeçar volta pra primeira pergunta', async () => {
  const ids = pool.slice(0, 32).map(q => q.id);
  saveState({ formato: 'curta', questionIds: ids, answers: { [ids[0]]: 1 }, index: 1 });
  render(<QuizRunner formato="curta" pool={pool} />);
  await screen.findByRole('button', { name: 'Concordo totalmente' });
  fireEvent.click(screen.getByRole('button', { name: /Recomeçar/ }));
  expect(document.body.textContent).toContain('Pergunta 1 de 32');
});

test('ao concluir registra as perguntas vistas, e o próximo sorteio evita repetir', async () => {
  const [q, trocada] = [pool[0], pool[1]];
  saveState({ formato: 'curta', questionIds: [q.id], answers: {}, index: 0, skipped: [trocada.id] });
  const { unmount } = render(<QuizRunner formato="curta" pool={pool} />);
  fireEvent.click(await screen.findByRole('button', { name: 'Concordo totalmente' }));
  expect(JSON.parse(localStorage.getItem('quiz:vistas')!)).toEqual({ [q.id]: 1, [trocada.id]: 1 });
  unmount();

  const todasMenosDuas = Object.fromEntries(pool.filter(x => x.axis === 'controle' && x.polarity === 'A').slice(2).map(x => [x.id, 5]));
  localStorage.setItem('quiz:vistas', JSON.stringify(todasMenosDuas));
  render(<QuizRunner formato="curta" pool={pool} />);
  await screen.findByRole('button', { name: /Concordo totalmente|Muito mais a frase\u00a0A/ });
  const sorteadas: string[] = JSON.parse(localStorage.getItem('quiz:curta')!).questionIds;
  expect(sorteadas.filter(id => id.startsWith('controle_') && Number(id.slice(-2)) <= 8).sort()).toEqual(['controle_01', 'controle_02']);
});

const retrato = [
  { id: 'feliz', pergunta: 'Uma vida feliz é…', opcoes: [
    { id: 'a', texto: 'Ser boa pessoa', efeitos: { bemviver: 0, rotina: 20 } },
    { id: 'b', texto: 'Aproveitar tudo', efeitos: { bemviver: 100, rotina: 90 } },
  ] },
];

test('depois da última pergunta vem o retrato final, que entra no resultado', async () => {
  saveState({ formato: 'curta', questionIds: [pool[0].id], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} retrato={retrato} />);
  fireEvent.click(await screen.findByRole('button', { name: 'Concordo totalmente' }));
  expect(push).not.toHaveBeenCalled();
  expect(screen.getByText('Seu retrato final')).toBeTruthy();
  expect(screen.getByText('Uma vida feliz é…')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Aproveitar tudo' }));
  expect(push).toHaveBeenCalledWith('/resultado?c=0&b=100&s=50&m=50&e=50&r=90&g=50&v=50');
});

test('pular o retrato vai direto ao resultado das perguntas normais', async () => {
  saveState({ formato: 'curta', questionIds: [pool[0].id], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} retrato={retrato} />);
  fireEvent.click(await screen.findByRole('button', { name: 'Concordo totalmente' }));
  fireEvent.click(screen.getByRole('button', { name: /Pular/ }));
  expect(push).toHaveBeenCalledWith('/resultado?c=0&b=50&s=50&m=50&e=50&r=50&g=50&v=50');
});

test('o retrato retoma de onde parou', async () => {
  saveState({ formato: 'curta', questionIds: [pool[0].id], answers: { [pool[0].id]: 0 }, index: 1, retrato: {} });
  render(<QuizRunner formato="curta" pool={pool} retrato={retrato} />);
  expect(await screen.findByText('Uma vida feliz é…')).toBeTruthy();
});
