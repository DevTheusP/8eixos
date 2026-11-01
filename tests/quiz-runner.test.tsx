// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { QuizRunner } from '@/app/quiz/[formato]/QuizRunner';
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

beforeEach(() => { sessionStorage.clear(); push.mockReset(); });

test('mostra Likert com 5 botões e progresso', async () => {
  const onlyLikert = pool.filter(q => q.kind === 'likert');
  render(<QuizRunner formato="curta" pool={onlyLikert} />);
  for (const t of ['Concordo totalmente', 'Concordo', 'Neutro', 'Discordo', 'Discordo totalmente']) {
    expect(await screen.findByRole('button', { name: t })).toBeTruthy();
  }
  fireEvent.click(screen.getByRole('button', { name: 'Concordo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Concordo' }));
  expect(screen.getByText('3 de 32')).toBeTruthy();
});

test('escolha forçada mostra as duas frases e 5 opções', async () => {
  const forced = pool.find(q => q.kind === 'forced')!;
  saveState({ formato: 'curta', questionIds: [forced.id], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} />);
  expect(await screen.findByText(forced.textLeft!)).toBeTruthy();
  expect(screen.getByText(forced.textRight!)).toBeTruthy();
  for (const t of ['Muito mais a da esquerda', 'Mais a da esquerda', 'Igual', 'Mais a da direita', 'Muito mais a da direita']) {
    expect(screen.getByRole('button', { name: t })).toBeTruthy();
  }
});

test('retoma do estado salvo', async () => {
  const ids = pool.slice(0, 32).map(q => q.id);
  saveState({ formato: 'curta', questionIds: ids, answers: Object.fromEntries(ids.slice(0, 5).map(id => [id, 1])), index: 5 });
  render(<QuizRunner formato="curta" pool={pool} />);
  expect(await screen.findByText('6 de 32')).toBeTruthy();
});

test('ao concluir vai para o resultado e limpa o progresso', async () => {
  const q = pool[0];
  saveState({ formato: 'curta', questionIds: [q.id], answers: {}, index: 0 });
  render(<QuizRunner formato="curta" pool={pool} />);
  fireEvent.click(await screen.findByRole('button', { name: 'Concordo totalmente' }));
  expect(push).toHaveBeenCalledWith('/resultado?c=0&b=50&s=50&m=50&e=50&r=50&g=50&v=50');
  expect(sessionStorage.getItem('quiz:curta')).toBeNull();
});
