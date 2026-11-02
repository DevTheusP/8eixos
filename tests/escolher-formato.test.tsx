// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import EscolherFormato from '@/app/quiz/page';
import { FORMATOS } from '@/lib/selection';

test('botão principal da home leva pra escolha do formato', () => {
  render(<Home />);
  expect(screen.getByRole('link', { name: /Descobrir minha filosofia/ }).getAttribute('href')).toBe('/quiz');
});

test('página de formato oferece os três formatos com perguntas e tempo', () => {
  const { container } = render(<EscolherFormato />);
  expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
  const hrefs = [...container.querySelectorAll('a')].map(a => a.getAttribute('href'));
  expect(hrefs).toEqual(expect.arrayContaining(['/quiz/curta', '/quiz/completa', '/quiz/profunda']));
  for (const f of Object.values(FORMATOS)) {
    expect(screen.getByText(String(f.perguntas))).toBeTruthy();
    expect(screen.getByText(`Aprox. ${f.minutos} min`, { exact: false })).toBeTruthy();
  }
  expect(screen.getByText('Recomendada')).toBeTruthy();
});
