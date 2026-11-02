import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Cta } from '@/components/Cta';
import { CreditoRetrato, Retrato } from '@/components/Retrato';
import { SiteHeader } from '@/components/SiteHeader';
import { Eixos } from '@/components/result/Eixos';
import { Livros } from '@/components/result/Livros';
import { Section } from '@/components/result/Section';
import { getFamilies, getSchools, getThinkers, getVectors } from '@/lib/data';
import { familyStyle } from '@/lib/family-theme';
import { parecidos } from '@/lib/catalogo';
import { rank } from '@/lib/matching';
import { resumo } from '@/lib/text';

export function generateStaticParams() {
  return getThinkers().map(t => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<'/pensadores/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const t = getThinkers().find(x => x.id === id);
  if (!t) return {};
  return { title: `Filosofia de ${t.name}`, description: resumo(t.bio) };
}

async function Pensador({ params }: { params: PageProps<'/pensadores/[id]'>['params'] }) {
  const { id } = await params;
  const t = getThinkers().find(x => x.id === id);
  if (!t) notFound();
  const vectors = getVectors();
  const schools = new Map(getSchools().map(s => [s.id, s]));
  const escola = t.schoolId ? schools.get(t.schoolId) : undefined;
  const maisProxima = rank(vectors.thinkers[t.id], vectors.schools)[0];
  // Sem escola própria, o pensador usa a cor da família da escola mais parecida com ele.
  const familia = getFamilies().find(f => f.id === (escola ?? schools.get(maisProxima.id)!).familyId)!;

  return (
    <article className="space-y-5" style={familyStyle(familia)}>
      <header className="flex flex-col gap-5 rounded-3xl bg-brand-soft p-6 sm:flex-row sm:items-center sm:p-8">
        <Retrato thinker={t} size={120} />
        <div>
          <h1 className="font-display text-4xl font-bold text-brand sm:text-5xl">{t.name}</h1>
          <p className="mt-1 text-mute">{t.descriptor} · {t.years}</p>
          {escola && (
            <Link href={`/escolas/${escola.id}`} className="mt-3 inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              {escola.name}
            </Link>
          )}
        </div>
      </header>
      <Section id="bio" title="Quem foi">
        <p>{t.bio}</p>
        <div className="mt-4"><CreditoRetrato thinker={t} /></div>
      </Section>
      <Section id="eixos" title="Nos 8 eixos">
        <Eixos vector={vectors.thinkers[t.id]} />
        <p className="mt-5 text-sm text-mute">
          Pelas respostas, a escola mais parecida com o pensamento de {t.name} é{' '}
          <Link href={`/escolas/${maisProxima.id}`} className="font-semibold text-brand">{schools.get(maisProxima.id)!.name}</Link>{' '}
          ({Math.round(maisProxima.score)}%).
        </p>
      </Section>
      <Section id="parecidos" title={`Quem pensa parecido com ${t.name}`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {parecidos('thinker', t.id, 4).map(p => {
            const o = getThinkers().find(x => x.id === p.id)!;
            return (
              <Link key={o.id} href={`/pensadores/${o.id}`} className="press flex items-center gap-3 rounded-2xl bg-tile p-3 hover:bg-brand-soft">
                <Retrato thinker={o} size={48} />
                <div className="min-w-0 flex-1"><p className="font-semibold">{o.name}</p><p className="truncate text-sm text-mute">{o.descriptor}</p></div>
                <span className="font-display font-bold text-brand">{Math.round(p.score)}%</span>
              </Link>
            );
          })}
        </div>
      </Section>
      <Livros title="Para ler" thinkerIds={[t.id]} />
      <Cta />
    </article>
  );
}

export default function PensadorPage({ params }: PageProps<'/pensadores/[id]'>) {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}><Pensador params={params} /></Suspense>
      </main>
    </>
  );
}
