// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { Continuar } from '@/components/Continuar';
import { saveLastResult, saveState } from '@/lib/quiz-state';

beforeEach(() => localStorage.clear());

test('sem nada salvo, não mostra nada', () => {
  const { container } = render(<Continuar />);
  expect(container.innerHTML).toBe('');
});

test('oferece continuar o quiz em andamento e ver o último resultado', async () => {
  saveState({ formato: 'completa', questionIds: Array.from({ length: 64 }, (_, i) => `q${i}`), answers: { q0: 1, q1: 2 }, index: 2 });
  saveLastResult('c=1&b=2&s=3&m=4&e=5&r=6&g=7&v=8');
  render(<Continuar />);
  const continuar = await screen.findByRole('link', { name: /Continuar de onde parou/ });
  expect(continuar.getAttribute('href')).toBe('/quiz/completa');
  expect(document.body.textContent).toContain('3 de 64');
  expect(screen.getByRole('link', { name: /Ver meu último resultado/ }).getAttribute('href')).toBe('/resultado?c=1&b=2&s=3&m=4&e=5&r=6&g=7&v=8');
});
