import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Compass, Fingerprint, HeartHandshake, Library, Scale, Users } from 'lucide-react';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { Compartilhar } from '@/components/result/Compartilhar';
import { Distincao } from '@/components/result/Distincao';
import { Eixos } from '@/components/result/Eixos';
import { Escolas } from '@/components/result/Escolas';
import { CompareForms } from '@/components/CompareForms';
import { Hero } from '@/components/result/Hero';
import { Indice } from '@/components/result/Indice';
import { Lida } from '@/components/result/Lida';
import { Livros } from '@/components/result/Livros';
import { Pensadores } from '@/components/result/Pensadores';
import { Section } from '@/components/result/Section';
import { familyStyle } from '@/lib/family-theme';
import { buildResult } from '@/lib/result';
import { paramsToVector, vectorToParams } from '@/lib/url';
import { Invalido } from './Invalido';

export const metadata: Metadata = { title: 'Seu resultado', robots: { index: false } };

const ITENS = [
  { id: 'escola', label: 'Sua escola' },
  { id: 'eixos', label: '8 eixos' },
  { id: 'distincao', label: 'Distinção' },
  { id: 'pensadores', label: 'Pensadores' },
  { id: 'escolas', label: 'Escolas' },
  { id: 'lida', label: 'Como você lida' },
  { id: 'livros', label: 'Livros' },
  { id: 'comparar', label: 'Compare' },
];

async function Resultado({ searchParams }: { searchParams: PageProps<'/resultado'>['searchParams'] }) {
  const v = paramsToVector(await searchParams);
  if (!v) return <Invalido />;
  const result = buildResult(v);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_230px]" style={familyStyle(result.school.family)}>
      <div className="min-w-0 space-y-5">
        <div>
          <p className="arrive mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">— Análise concluída</p>
          <h1 className="arrive font-display text-4xl font-bold tracking-tight sm:text-5xl" style={{ '--d': '40ms' } as CSSProperties}>
            Sua filosofia <span className="text-brand">de vida</span>
          </h1>
        </div>
        <Hero result={result} share={<Compartilhar params={vectorToParams(v)} />} />
        <Section id="eixos" title="Seus 8 eixos" icon={Compass}><Eixos vector={v} /></Section>
        <Section id="distincao" title="O que te distingue" icon={Fingerprint}><Distincao result={result} /></Section>
        <Section id="pensadores" title="Pensadores mais próximos de você" icon={Users}><Pensadores result={result} /></Section>
        <Section id="escolas" title="Outras escolas e o seu oposto" icon={Library}><Escolas result={result} /></Section>
        <Section id="lida" title="Como você lida com…" icon={HeartHandshake}><Lida school={result.school.school} /></Section>
        <Livros title="Para ler" thinkerIds={[result.thinker.thinker.id, ...result.byDimension.map(d => d.thinker.id)]} />
        <Section id="comparar" title="Compare" icon={Scale}><CompareForms vector={v} /></Section>
      </div>
      <aside><Indice itens={ITENS} /></aside>
    </div>
  );
}

export default function ResultadoPage({ searchParams }: PageProps<'/resultado'>) {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Refazer quiz' }} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-mute">Calculando seu resultado…</p>}>
          <Resultado searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
