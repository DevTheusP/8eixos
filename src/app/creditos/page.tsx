import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { getThinkers } from '@/lib/data';

export const metadata: Metadata = { title: 'Créditos das imagens' };

export default function CreditosPage() {
  const com = getThinkers().filter(t => t.portrait).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8 sm:px-6">
        <h1 className="font-display text-4xl font-bold">Créditos das imagens</h1>
        <p className="text-mute">Os retratos vêm da Wikimedia Commons, em domínio público ou sob licenças Creative Commons. Foram recortados e redimensionados.</p>
        <p className="text-mute">As capas dos livros vêm da <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className="underline">Open Library</a> e pertencem às suas editoras. Aparecem só para identificar cada obra.</p>
        <ul className="space-y-1 text-sm">
          {com.map(t => (
            <li key={t.id}>
              {t.name}:{' '}
              <a href={t.portrait!.source} target="_blank" rel="noopener noreferrer" className="text-brand underline">fonte</a>{' '}
              · {t.portrait!.license}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
