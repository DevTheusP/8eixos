import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Compass, Fingerprint, Gem, HeartHandshake, Library, Scale, Users } from 'lucide-react';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { Compartilhar } from '@/components/result/Compartilhar';
import { Distincao } from '@/components/result/Distincao';
import { Eixos } from '@/components/result/Eixos';
import { Escolas } from '@/components/result/Escolas';
import { CompareForms } from '@/components/CompareForms';
import { Hero } from '@/components/result/Hero';
import { Apoie } from '@/components/Apoie';
import { Atalhos } from '@/components/result/Atalhos';
import { LembrarResultado } from '@/components/result/LembrarResultado';
import { Lida } from '@/components/result/Lida';
import { Livros } from '@/components/result/Livros';
import { Pensadores } from '@/components/result/Pensadores';
import { Section } from '@/components/result/Section';
import { Tracos } from '@/components/result/Tracos';
import { familyStyle } from '@/lib/family-theme';
import { buildResult } from '@/lib/result';
import { paramsToVector, vectorToParams } from '@/lib/url';
import { Invalido } from './Invalido';

export async function generateMetadata({ searchParams }: PageProps<'/resultado'>): Promise<Metadata> {
  const v = paramsToVector(await searchParams);
  if (!v) return { title: 'Seu resultado', robots: { index: false } };
  const r = buildResult(v);
  const titulo = `${r.school.school.name}: ${Math.round(r.school.score)}% compatível`;
  const descricao = `Minha filosofia de vida é ${r.school.school.name} e eu penso como ${r.thinker.thinker.name}. Qual é a sua?`;
  const imagem = { url: `/api/og?${vectorToParams(v)}`, width: 1200, height: 630, alt: titulo };
  return {
    title: titulo,
    description: descricao,
    robots: { index: false },
    openGraph: { title: titulo, description: descricao, images: [imagem], type: 'website' },
    twitter: { card: 'summary_large_image', title: titulo, description: descricao, images: [imagem.url] },
  };
}

const ITENS = [
  { id: 'escola', label: 'Sua escola' },
  { id: 'tracos', label: 'Traços' },
  { id: 'eixos', label: 'Eixos' },
  { id: 'distincao', label: 'Fora do comum' },
  { id: 'pensadores', label: 'Pensadores' },
  { id: 'escolas', label: 'Escolas' },
  { id: 'lida', label: 'Como você lida' },
  { id: 'livros', label: 'Livros' },
  { id: 'comparar', label: 'Comparar' },
];

async function Resultado({ searchParams }: { searchParams: PageProps<'/resultado'>['searchParams'] }) {
  const v = paramsToVector(await searchParams);
  if (!v) return <Invalido />;
  const result = buildResult(v);
  const params = vectorToParams(v);
  return (
    <div className="space-y-5" style={familyStyle(result.school.family)}>
      <LembrarResultado params={params} resumo={{ escola: result.school.school.name, familia: result.school.family.name, cor: result.school.family.color, score: Math.round(result.school.score) }} />
      <Atalhos itens={ITENS} />
      <div className="min-w-0 space-y-5">
        <div>
          <h1 className="arrive font-display text-4xl font-bold tracking-tight sm:text-5xl" style={{ '--d': '40ms' } as CSSProperties}>
            Sua filosofia <span className="text-brand">de vida</span>
          </h1>
        </div>
        <Hero result={result} params={params} share={<Compartilhar params={params} escola={result.school.school.name} score={result.school.score} pensador={result.thinker.thinker.name} />} />
        <Section id="tracos" title="Seus traços mais fortes" icon={Gem}><Tracos vector={v} /></Section>
        <Section id="eixos" title="Sua posição em cada eixo" icon={Compass}><Eixos vector={v} /></Section>
        <Section id="distincao" title="Onde você foge do comum" icon={Fingerprint}><Distincao result={result} /></Section>
        <Section id="pensadores" title="Pensadores mais próximos de você" icon={Users}><Pensadores result={result} /></Section>
        <Section id="escolas" title="Outras escolas e o seu oposto" icon={Library}><Escolas result={result} /></Section>
        <Section id="lida" title="Como você lida com…" icon={HeartHandshake}><Lida school={result.school.school} /></Section>
        <Livros title="Para ler" thinkerIds={[result.thinker.thinker.id, ...result.byDimension.map(d => d.thinker.id)]} />
        <Section id="comparar" title="Compare" icon={Scale}><CompareForms vector={v} /></Section>
        <Apoie id="apoie" />
      </div>
    </div>
  );
}

export default function ResultadoPage({ searchParams }: PageProps<'/resultado'>) {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Refazer quiz' }} />
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-mute">Calculando seu resultado…</p>}>
          <Resultado searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
