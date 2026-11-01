import { affiliateUrl, booksFor } from '@/lib/books';
import { getBooks, getThinkers } from '@/lib/data';

export function Livros({ thinkerIds }: { thinkerIds: string[] }) {
  const nomes = new Map(getThinkers().map(t => [t.id, t.name]));
  const livros = booksFor(thinkerIds, getBooks());
  if (livros.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {livros.map(({ thinkerId, book }) => (
        <a
          key={book.id}
          href={affiliateUrl(book, process.env.NEXT_PUBLIC_AMAZON_TAG)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="rounded-2xl bg-tile p-4 hover:bg-soft"
        >
          <p className="font-display text-lg font-bold leading-tight">{book.title}</p>
          <p className="text-sm text-mute">{nomes.get(thinkerId)}</p>
          <p className="mt-2 text-sm font-semibold text-navy">Ver na Amazon →</p>
        </a>
      ))}
    </div>
  );
}
