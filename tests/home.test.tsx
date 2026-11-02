// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { existsSync } from 'node:fs';
import Home from '@/app/page';

test('home com os 3 formatos, só a completa recomendada', () => {
  const { container } = render(<Home />);
  const cards = screen.getAllByRole('article');
  expect(cards).toHaveLength(3);
  expect(within(cards[0]).getByText('32')).toBeTruthy();
  expect(within(cards[1]).getByText('64')).toBeTruthy();
  expect(within(cards[2]).getByText('120')).toBeTruthy();
  expect(screen.getAllByText('Recomendada')).toHaveLength(1);
  expect(within(cards[1]).getByText('Recomendada')).toBeTruthy();
  const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'));
  expect(hrefs).toEqual(expect.arrayContaining(['/quiz/curta', '/quiz/completa', '/quiz/profunda']));
  expect(container.textContent).not.toMatch(/100\s*%/);
  for (const t of ['Anônimo, sem cadastro', 'Resultado imediato', 'Os três formatos medem os mesmos 8 eixos']) {
    expect(screen.getByText(t)).toBeTruthy();
  }
  expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Qual é a sua filosofia de vida\?/);
});

test('mostra exemplos de card, o que você descobre e perguntas frequentes', () => {
  const { container } = render(<Home />);
  // Exemplos da home são imagens fixas e leves (npm run exemplos), não geradas na hora.
  const exemplos = [...container.querySelectorAll('.leque img[src^="/exemplos/"]')];
  expect(exemplos).toHaveLength(3);
  for (const img of exemplos) expect(existsSync(`public${img.getAttribute('src')}`)).toBe(true);
  expect(screen.getByRole('heading', { name: 'O que você vai descobrir' })).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Perguntas frequentes' })).toBeTruthy();
  expect(container.querySelectorAll('details').length).toBeGreaterThanOrEqual(5);
  const ld = container.querySelector('script[type="application/ld+json"]');
  expect(JSON.parse(ld!.textContent!)['@type']).toBe('FAQPage');
});

test('seção de transparência com link pro código e pra sugerir correções', async () => {
  const { SITE_REPO } = await import('@/lib/site');
  render(<Home />);
  expect(screen.getByRole('heading', { name: 'Feito à vista de todos' })).toBeTruthy();
  const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'));
  expect(hrefs).toContain(SITE_REPO);
  expect(hrefs).toContain(`${SITE_REPO}/issues`);
  expect(screen.getByText(/não mudam o cálculo/)).toBeTruthy();
});
