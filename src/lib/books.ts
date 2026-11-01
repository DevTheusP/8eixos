import type { Book } from './types';

export function affiliateUrl(b: Book, tag: string | undefined): string {
  const params = new URLSearchParams({ k: b.amazonQuery, i: 'stripbooks' });
  if (tag) params.set('tag', tag);
  return `https://www.amazon.com.br/s?${params.toString()}`;
}

export function booksFor(thinkerIds: string[], books: Book[]): { thinkerId: string; book: Book }[] {
  const out: { thinkerId: string; book: Book }[] = [];
  for (const thinkerId of thinkerIds) {
    const book = books.find(b => b.thinkerId === thinkerId);
    if (book) out.push({ thinkerId, book });
    if (out.length === 3) break;
  }
  return out;
}
