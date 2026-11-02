import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Cta } from '@/components/Cta';
import { Retrato } from '@/components/Retrato';
import { SiteHeader } from '@/components/SiteHeader';
import { Eixos } from '@/components/result/Eixos';
import { Livros } from '@/components/result/Livros';
import { Section } from '@/components/result/Section';
import { getFamilies, getSchools, getThinkers, getVectors } from '@/lib/data';
import { rank } from '@/lib/matching';
import { familyStyle } from '@/lib/family-theme';
import { resumo, tituloSofrimento } from '@/lib/text';

export function generateStaticParams() {
  return getSchools().map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<'/escolas/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const s = getSchools().find(x => x.id === id);
  if (!s) return {};
  return { title: `${s.name}: o que é, ideias e pensadores`, description: resumo(s.summary) };
}

async function Escola({ params }: { params: PageProps<'/escolas/[id]'>['params'] }) {
  const { id } = await params;
  const s = getSchools().find(x => x.id === id);
  if (!s) notFound();
  const familia = getFamilies().find(f => f.id === s.familyId)!;
  const vectors = getVectors();
  const thinkers = getThinkers().filter(t => s.thinkerIds.includes(t.id));
  const outras = Object.fromEntries(Object.entries(vectors.schools).filter(([k]) => k !== s.id));
  const proximas = rank(vectors.schools[s.id], outras).slice(0, 3);
  const nomes = new Map(getSchools().map(x => [x.id, x.name]));

  return (
    <article className="space-y-5" style={familyStyle(familia)}>
      <header className="rounded-3xl bg-brand-soft p-6 sm:p-8">
        <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">{familia.name}</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-brand sm:text-5xl">{s.name}</h1>
        <blockquote className="mt-4 text-lg text-brand sm:text-xl">“{s.quote}”</blockquote>
        <p className="mt-4">{s.summary}</p>
      </header>
      <Section id="sofrimento" title={tituloSofrimento(s.name)}>
        <p>{s.lida.sofrimento}</p>
      </Section>
      <Section id="eixos" title="Nos 8 eixos"><Eixos vector={vectors.schools[s.id]} /></Section>
      {thinkers.length > 0 && (
        <Section id="pensadores" title="Pensadores ligados a esta escola">
          <div className="grid gap-3 sm:grid-cols-2">
            {thinkers.map(t => (
              <Link key={t.id} href={`/pensadores/${t.id}`} className="lift press flex items-center gap-3 rounded-2xl bg-tile p-3">
                <Retrato thinker={t} size={56} />
                <div><p className="font-semibold">{t.name}</p><p className="text-sm text-mute">{t.descriptor}</p></div>
              </Link>
            ))}
          </div>
        </Section>
      )}
      <Section id="comparar-escolas" title={`Compare ${s.name.toLowerCase()} com outra escola`}>
        <div className="flex flex-wrap gap-2">
          {getSchools().filter(x => x.id !== s.id).map(x => {
            const [a, b] = [s.id, x.id].sort();
            return <Link key={x.id} href={`/escolas/${a}/vs/${b}`} className="press rounded-full border border-line bg-card px-3 py-1.5 text-sm hover:border-brand">{x.name}</Link>;
          })}
        </div>
      </Section>
      <Section id="proximas" title="Escolas mais parecidas">
        <ul className="space-y-1">
          {proximas.map(p => (
            <li key={p.id} className="flex justify-between">
              <Link href={`/escolas/${p.id}`} className="hover:text-brand">{nomes.get(p.id)}</Link>
              <span className="font-semibold text-brand">{Math.round(p.score)}%</span>
            </li>
          ))}
        </ul>
      </Section>
      <Livros title="Para ler" thinkerIds={s.thinkerIds} />
      <Cta />
    </article>
  );
}

export default function EscolaPage({ params }: PageProps<'/escolas/[id]'>) {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}><Escola params={params} /></Suspense>
      </main>
    </>
  );
}
