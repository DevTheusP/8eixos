import { BookOpen } from 'lucide-react';
import { affiliateUrl, booksFor } from '@/lib/books';
import { getBooks, getThinkers } from '@/lib/data';
import { Section } from './Section';

export function Livros({ thinkerIds, title }: { thinkerIds: string[]; title?: string }) {
  const nomes = new Map(getThinkers().map(t => [t.id, t.name]));
  const livros = booksFor(thinkerIds, getBooks());
  if (livros.length === 0) return null;
  const grade = (
    <div className="grid gap-3 sm:grid-cols-3">
      {livros.map(({ thinkerId, book }) => (
        <a
          key={book.id}
          href={affiliateUrl(book, process.env.NEXT_PUBLIC_AMAZON_TAG)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          data-track="clique_amazon"
          data-track-livro={book.title}
          className="lift press group flex gap-4 rounded-2xl bg-tile p-4"
        >
          {/* Capa desenhada: lombada escura e título na cor da marca, no lugar de foto de capa. */}
          <span aria-hidden className="relative flex h-28 w-20 flex-none flex-col justify-end overflow-hidden rounded-md rounded-l-sm bg-brand-strong p-2 shadow-[0_10px_20px_-12px_rgb(23_26_46_/_0.6)]">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-black/20" />
            <span className="line-clamp-4 font-display text-[11px] font-bold leading-tight text-white">{book.title}</span>
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-lg font-bold leading-tight">{book.title}</span>
            <span className="text-sm text-mute">{nomes.get(thinkerId)}{book.year ? ` · ${book.year < 0 ? `${-book.year} a.C.` : book.year}` : ''}</span>
            <span className="mt-auto pt-2 text-sm font-semibold text-brand">Ver na Amazon <span className="nudge">→</span></span>
          </span>
        </a>
      ))}
    </div>
  );
  return title ? <Section id="livros" title={title} icon={BookOpen}>{grade}</Section> : grade;
}
