import { existsSync } from 'node:fs';
import path from 'node:path';
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

// Capa real (public/capas/<id>.webp, tirada da Open Library) quando existe; sem ela, o cartão desenha uma capa.
export function capaDoLivro(id: string): string | null {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  return existsSync(path.join(process.cwd(), 'public', 'capas', `${id}.webp`)) ? `/capas/${id}.webp` : null;
}
