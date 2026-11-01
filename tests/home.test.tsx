// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import Home from '@/app/page';

test('home com os 3 formatos, só a completa recomendada', () => {
  const { container } = render(<Home />);
  const cards = screen.getAllByRole('article');
  expect(cards).toHaveLength(3);
  // A recomendada vem primeiro: é a escolha que a página sugere.
  expect(within(cards[0]).getByText('64')).toBeTruthy();
  expect(within(cards[1]).getByText('32')).toBeTruthy();
  expect(within(cards[2]).getByText('120')).toBeTruthy();
  expect(screen.getAllByText('Recomendada')).toHaveLength(1);
  expect(within(cards[0]).getByText('Recomendada')).toBeTruthy();
  const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'));
  expect(hrefs).toEqual(expect.arrayContaining(['/quiz/curta', '/quiz/completa', '/quiz/profunda']));
  expect(container.textContent).not.toMatch(/100\s*%/);
  for (const t of ['Anônimo, sem cadastro', 'Resultado imediato', 'Todos os formatos usam os mesmos 8 eixos']) {
    expect(screen.getByText(t)).toBeTruthy();
  }
  expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Qual é a sua filosofia de vida\?/);
});
