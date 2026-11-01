// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { CreditoRetrato } from '@/components/Retrato';
import { getThinkers } from '@/lib/data';

const base = { id: 'x', name: 'X', descriptor: 'd', years: 'y', schoolId: null, bio: 'b' };

test('mostra licença e link da fonte quando há retrato', () => {
  const { container } = render(<CreditoRetrato thinker={{ ...base, portrait: { file: 'x.webp', source: 'https://commons.wikimedia.org/wiki/File:X.jpg', license: 'CC BY-SA 3.0' } }} />);
  expect(container.textContent).toContain('CC BY-SA 3.0');
  expect(container.querySelector('a')?.getAttribute('href')).toBe('https://commons.wikimedia.org/wiki/File:X.jpg');
});
test('sem retrato não mostra crédito', () => {
  const { container } = render(<CreditoRetrato thinker={{ ...base, portrait: null }} />);
  expect(container.innerHTML).toBe('');
});
test('catálogo tem retratos com fonte do Commons', () => {
  const com = getThinkers().filter(t => t.portrait);
  expect(com.length).toBeGreaterThanOrEqual(26);
  for (const t of com) expect(t.portrait!.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
});

test('página de créditos lista todos os retratos', async () => {
  const { default: Creditos } = await import('@/app/creditos/page');
  const { container } = render(<Creditos />);
  const links = [...container.querySelectorAll('a[href^="https://commons"]')];
  expect(links.length).toBe(getThinkers().filter(t => t.portrait).length);
});
