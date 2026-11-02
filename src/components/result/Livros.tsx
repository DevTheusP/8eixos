import { BookOpen } from 'lucide-react';
import { affiliateUrl, booksFor, capaDoLivro } from '@/lib/books';
import { getBooks, getThinkers } from '@/lib/data';
import type { Book } from '@/lib/types';
import { Section } from './Section';

export function ano(y: number) {
  return y < 0 ? `${-y} a.C.` : String(y);
}

// Capa do livro: a real quando existe; senão, uma capa desenhada na cor da marca.
export function Capa({ book }: { book: Book }) {
  const capa = capaDoLivro(book.id);
  if (capa) {
    // eslint-disable-next-line @next/next/no-img-element -- capas pequenas já otimizadas em webp
    return <img src={capa} alt={`Capa de ${book.title}`} loading="lazy" className="aspect-[2/3] w-full rounded-lg object-cover shadow-[0_18px_30px_-16px_rgb(0_0_0_/_0.8)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]" />;
  }
  return (
    <span aria-hidden className="relative flex aspect-[2/3] w-full flex-col justify-end overflow-hidden rounded-lg bg-brand-strong p-3 shadow-[0_18px_30px_-16px_rgb(0_0_0_/_0.8)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]">
      <span className="absolute inset-y-0 left-0 w-2 bg-black/25" />
      <span className="font-display text-sm font-bold leading-tight text-white">{book.title}</span>
    </span>
  );
}

export function Livros({ thinkerIds, title }: { thinkerIds: string[]; title?: string }) {
  const nomes = new Map(getThinkers().map(t => [t.id, t.name]));
  const livros = booksFor(thinkerIds, getBooks());
  if (livros.length === 0) return null;
  const grade = (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {livros.map(({ thinkerId, book }) => (
        <a
          key={book.id}
          href={affiliateUrl(book, process.env.NEXT_PUBLIC_AMAZON_TAG)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          data-track="clique_amazon"
          data-track-livro={book.title}
          className="press group flex min-w-0 flex-col rounded-2xl bg-tile p-3 transition-colors hover:bg-tile-strong"
        >
          <Capa book={book} />
          <span className="mt-3 font-bold leading-snug">{book.title}</span>
          <span className="mt-0.5 text-sm text-mute">{nomes.get(thinkerId)} · {ano(book.year)}</span>
          <span className="mt-auto pt-3 text-sm font-semibold text-brand">Ver na Amazon <span className="nudge">→</span></span>
        </a>
      ))}
    </div>
  );
  return title ? <Section id="livros" title={title} icon={BookOpen}>{grade}</Section> : grade;
}
