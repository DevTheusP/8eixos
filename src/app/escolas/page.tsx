import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta } from '@/components/Cta';
import { SiteHeader } from '@/components/SiteHeader';
import { getFamilies, getSchools } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Escolas filosóficas de vida',
  description: 'Estoicismo, epicurismo, budismo, existencialismo e outras escolas filosóficas explicadas de forma simples.',
};

export default function EscolasPage() {
  const schools = getSchools();
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Escolas filosóficas</h1>
        {getFamilies().map(f => {
          const daFamilia = schools.filter(s => s.familyId === f.id);
          if (daFamilia.length === 0) return null;
          return (
            <section key={f.id}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy">{f.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {daFamilia.map(s => (
                  <Link key={s.id} href={`/escolas/${s.id}`} className="rounded-2xl border border-line bg-card p-5 hover:bg-soft">
                    <p className="font-display text-2xl font-bold">{s.name}</p>
                    <p className="mt-1 text-sm text-mute">“{s.quote}”</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
        <Cta />
      </main>
    </>
  );
}
