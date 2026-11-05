// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { FimDoResultado } from '@/components/result/FimDoResultado';

let avisar: ((e: { isIntersecting: boolean }[]) => void) | null = null;
class ObservadorFalso {
  constructor(cb: (e: { isIntersecting: boolean }[]) => void) { avisar = cb; }
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  localStorage.clear();
  avisar = null;
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = ObservadorFalso;
});

const props = { params: 'c=1&b=2&s=3&m=4&e=5&r=6&g=7&v=8', escola: 'Estoicismo', score: 96, pensador: 'Marco Aurélio' };

test('cartão do fim só aparece quando a pessoa chega ao fim, fecha e não volta pro mesmo resultado', () => {
  const { unmount } = render(<FimDoResultado {...props} />);
  expect(screen.queryByRole('dialog')).toBeNull();
  act(() => avisar!([{ isIntersecting: true }]));
  expect(screen.getByRole('dialog', { name: /Gostou do seu resultado/ })).toBeTruthy();
  expect(screen.getByRole('button', { name: /story do Instagram/ })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  unmount();

  render(<FimDoResultado {...props} />);
  act(() => avisar?.([{ isIntersecting: true }]));
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('tecla Esc fecha o cartão', () => {
  render(<FimDoResultado {...props} />);
  act(() => avisar!([{ isIntersecting: true }]));
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
});
