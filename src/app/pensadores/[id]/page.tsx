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
import { getSchools, getThinkers, getVectors } from '@/lib/data';
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

  return (
    <article className="space-y-5">
      <header className="flex flex-col gap-5 rounded-3xl bg-soft p-6 sm:flex-row sm:items-center sm:p-8">
        <Retrato thinker={t} size={120} />
        <div>
          <h1 className="font-display text-4xl font-bold text-navy sm:text-5xl">{t.name}</h1>
          <p className="mt-1 text-mute">{t.descriptor} · {t.years}</p>
          {escola && (
            <Link href={`/escolas/${escola.id}`} className="mt-3 inline-block rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
              {escola.name}
            </Link>
          )}
        </div>
      </header>
      <Section id="bio" title="Quem foi"><p>{t.bio}</p></Section>
      <Section id="eixos" title="Nos 8 eixos">
        <Eixos vector={vectors.thinkers[t.id]} />
        <p className="mt-5 text-sm text-mute">
          Pelas respostas, a escola mais parecida com o pensamento de {t.name} é{' '}
          <Link href={`/escolas/${maisProxima.id}`} className="font-semibold text-navy">{schools.get(maisProxima.id)!.name}</Link>{' '}
          ({Math.round(maisProxima.score)}%).
        </p>
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
