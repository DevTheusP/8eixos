import { BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta } from '@/components/Cta';
import { SiteHeader } from '@/components/SiteHeader';
import { affiliateUrl } from '@/lib/books';
import { getBooks, getFamilies, getSchools, getThinkers } from '@/lib/data';
import { familyStyle } from '@/lib/family-theme';

export const metadata: Metadata = {
  title: 'Livros de filosofia de vida para começar',
  description: 'Os livros essenciais de cada escola: estoicismo, epicurismo, budismo, existencialismo e mais, com indicação de por onde começar.',
};

export default function LivrosPage() {
  const thinkers = new Map(getThinkers().map(t => [t.id, t]));
  const books = getBooks();
  const familias = new Map(getFamilies().map(f => [f.id, f]));
  // Livro entra na escola do autor; autores sem escola ficam num grupo à parte.
  const grupos = [
    ...getSchools().map(s => ({ id: s.id, titulo: s.name, familia: familias.get(s.familyId)!, livros: books.filter(b => thinkers.get(b.thinkerId)?.schoolId === s.id) })),
    { id: 'outros', titulo: 'Outros pensadores', familia: null, livros: books.filter(b => !thinkers.get(b.thinkerId)?.schoolId) },
  ].filter(g => g.livros.length > 0);

  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8 sm:px-6">
        <div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Livros pra começar</h1>
          <p className="mt-3 max-w-2xl text-mute">Uma obra de entrada de cada pensador, separada por escola. Comece pela escola que apareceu no seu resultado.</p>
        </div>
        {grupos.map(g => (
          <section key={g.id} style={g.familia ? familyStyle(g.familia) : undefined}>
            <h2 className="mb-3 flex items-center gap-2 font-display text-2xl font-bold text-brand">
              <BookOpen aria-hidden size={20} />
              {g.familia ? <Link href={`/escolas/${g.id}`} className="hover:underline">{g.titulo}</Link> : g.titulo}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.livros.map(b => (
                <a key={b.id} href={affiliateUrl(b, process.env.NEXT_PUBLIC_AMAZON_TAG)} target="_blank" rel="sponsored noopener noreferrer" data-track="clique_amazon" data-track-livro={b.title}
                  className="press rounded-2xl border border-line bg-card p-4 hover:border-brand">
                  <p className="font-display text-lg font-bold leading-tight">{b.title}</p>
                  <p className="text-sm text-mute">{thinkers.get(b.thinkerId)?.name}{b.year > 0 ? `, ${b.year}` : ''}</p>
                  <p className="mt-2 text-sm font-semibold text-brand">Ver na Amazon</p>
                </a>
              ))}
            </div>
          </section>
        ))}
        <Cta />
      </main>
    </>
  );
}
