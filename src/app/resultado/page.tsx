import type { Metadata } from 'next';
import { Compass, Fingerprint, HeartHandshake, Library, Scale, Users } from 'lucide-react';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { Compartilhar } from '@/components/result/Compartilhar';
import { Distincao } from '@/components/result/Distincao';
import { Eixos } from '@/components/result/Eixos';
import { Escolas } from '@/components/result/Escolas';
import { CompareForms } from '@/components/CompareForms';
import { Hero } from '@/components/result/Hero';
import { Lida } from '@/components/result/Lida';
import { Livros } from '@/components/result/Livros';
import { Pensadores } from '@/components/result/Pensadores';
import { Section } from '@/components/result/Section';
import { buildResult } from '@/lib/result';
import { paramsToVector, vectorToParams } from '@/lib/url';
import { Invalido } from './Invalido';

export const metadata: Metadata = { title: 'Seu resultado', robots: { index: false } };

async function Resultado({ searchParams }: { searchParams: PageProps<'/resultado'>['searchParams'] }) {
  const v = paramsToVector(await searchParams);
  if (!v) return <Invalido />;
  const result = buildResult(v);
  return (
    <div className="space-y-12">
        <Hero result={result} share={<Compartilhar params={vectorToParams(v)} />} />
        <Section id="eixos" title="Seus 8 eixos" icon={Compass}><Eixos vector={v} /></Section>
        <Section id="distincao" title="O que te distingue" icon={Fingerprint}><Distincao result={result} /></Section>
        <Section id="pensadores" title="Pensadores mais próximos de você" icon={Users}><Pensadores result={result} /></Section>
        <Section id="escolas" title="Outras escolas e o seu oposto" icon={Library}><Escolas result={result} /></Section>
        <Section id="lida" title="Como você lida com…" icon={HeartHandshake}><Lida school={result.school.school} /></Section>
        <Livros title="Para ler" thinkerIds={[result.thinker.thinker.id, ...result.byDimension.map(d => d.thinker.id)]} />
        <Section id="comparar" title="Compare" icon={Scale}><CompareForms vector={v} /></Section>
    </div>
  );
}

export default function ResultadoPage({ searchParams }: PageProps<'/resultado'>) {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Refazer quiz' }} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-mute">Calculando seu resultado…</p>}>
          <Resultado searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
