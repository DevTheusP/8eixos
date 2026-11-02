// @vitest-environment jsdom
import { render } from '@testing-library/react';
import LivrosPage from '@/app/livros/page';
import sitemap from '@/app/sitemap';
import { getBooks } from '@/lib/data';

test('lista todos os livros do catálogo com link de afiliado', () => {
  const { container } = render(<LivrosPage />);
  const links = [...container.querySelectorAll('a[href^="https://www.amazon.com.br/s?"]')];
  expect(links).toHaveLength(getBooks().length);
  for (const a of links) expect(a.getAttribute('rel')).toContain('sponsored');
});

test('sitemap inclui /livros', () => {
  expect(sitemap().some(e => e.url.endsWith('/livros'))).toBe(true);
});
