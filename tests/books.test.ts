import { affiliateUrl, booksFor } from '@/lib/books';
import type { Book } from '@/lib/types';

const b: Book = { id: 'm', thinkerId: 'marco-aurelio', title: 'Meditações', year: 180, amazonQuery: 'Meditações Marco Aurélio' };

test('link de afiliado', () => {
  expect(affiliateUrl(b, 'x-20')).toBe('https://www.amazon.com.br/s?k=Medita%C3%A7%C3%B5es+Marco+Aur%C3%A9lio&i=stripbooks&tag=x-20');
  expect(affiliateUrl(b, undefined)).not.toContain('tag=');
  expect(affiliateUrl(b, '')).not.toContain('tag=');
});
test('pensador sem livro é pulado e no máximo 3', () => {
  const outros = ['a', 'b', 'c', 'd'].map(t => ({ ...b, id: t, thinkerId: t }));
  expect(booksFor(['sem-livro', 'marco-aurelio'], [b]).map(x => x.thinkerId)).toEqual(['marco-aurelio']);
  expect(booksFor(['a', 'b', 'c', 'd'], outros)).toHaveLength(3);
});
test('pega só o primeiro livro de cada pensador', () => {
  const dois = [b, { ...b, id: 'm2', title: 'Outro' }];
  expect(booksFor(['marco-aurelio'], dois)).toEqual([{ thinkerId: 'marco-aurelio', book: b }]);
});

test('capa real do livro quando existe, e nada quando não tem (cai na capa desenhada)', async () => {
  const { capaDoLivro } = await import('@/lib/books');
  expect(capaDoLivro('marco-aurelio-1')).toBe('/capas/marco-aurelio-1.webp');
  expect(capaDoLivro('cioran-1')).toBeNull();
  expect(capaDoLivro('../../etc/passwd')).toBeNull();
});
