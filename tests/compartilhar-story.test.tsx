// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Compartilhar } from '@/components/result/Compartilhar';

const props = { params: 'c=10&b=20&s=30&m=40&e=50&r=60&g=70&v=80', escola: 'Estoicismo', score: 90, pensador: 'Marco Aurélio' };
let fetches = 0;
let share: ReturnType<typeof vi.fn>;
let copiar: ReturnType<typeof vi.fn>;
let avisar: ((e: { isIntersecting: boolean }[]) => void) | null = null;

beforeEach(() => {
  fetches = 0;
  vi.stubGlobal('fetch', vi.fn(async () => { fetches++; return new Response(new Blob(['png'], { type: 'image/png' })); }));
  share = vi.fn(async () => {});
  copiar = vi.fn(async () => {});
  Object.assign(navigator, { share, canShare: () => true, clipboard: { writeText: copiar } });
  vi.stubGlobal('IntersectionObserver', class { constructor(cb: typeof avisar) { avisar = cb; } observe() {} disconnect() {} });
});
afterEach(() => vi.unstubAllGlobals());

test('a imagem do story é preparada antes do toque, quando o botão aparece na tela', async () => {
  render(<Compartilhar {...props} />);
  expect(fetches).toBe(0);
  await act(async () => avisar!([{ isIntersecting: true }]));
  await waitFor(() => expect(fetches).toBe(1));
});

test('compartilhar manda só a imagem (assim o Instagram oferece Stories) e deixa o link copiado para o adesivo', async () => {
  render(<Compartilhar {...props} />);
  await act(async () => avisar!([{ isIntersecting: true }]));
  await waitFor(() => expect(fetches).toBe(1));
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: /story do Instagram/ })); });
  expect(copiar).toHaveBeenCalledWith(location.href);
  expect(share).toHaveBeenCalledTimes(1);
  const dados = share.mock.calls[0][0];
  expect(dados.files).toHaveLength(1);
  expect(dados.text).toBeUndefined();
  expect(dados.url).toBeUndefined();
  expect(fetches).toBe(1);
  expect(screen.getByRole('status').textContent).toMatch(/adesivo de link/);
});
