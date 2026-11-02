import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Cta } from '@/components/Cta';
import { SiteHeader } from '@/components/SiteHeader';
import { Section } from '@/components/result/Section';
import { paresDeEscolas } from '@/lib/catalogo';
import { compareVectors, resumoComparacao } from '@/lib/compare';
import { getAxes, getFamilies, getSchools, getVectors } from '@/lib/data';
import { matchScore } from '@/lib/matching';

type P = PageProps<'/escolas/[id]/vs/[outro]'>;

export function generateStaticParams() {
  return paresDeEscolas();
}

function achar(id: string, outro: string) {
  const s = getSchools();
  const a = s.find(x => x.id === id);
  const b = s.find(x => x.id === outro);
  return a && b && id < outro ? { a, b } : null;
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id, outro } = await params;
  const par = achar(id, outro);
  if (!par) return {};
  return {
    title: `${par.a.name} × ${par.b.name}: diferenças e semelhanças`,
    description: `Onde ${par.a.name.toLowerCase()} e ${par.b.name.toLowerCase()} concordam e onde se separam, eixo por eixo: controle, prazer, sentido, razão e mais.`,
  };
}

async function Comparativo({ params }: { params: P['params'] }) {
  const { id, outro } = await params;
  const par = achar(id, outro);
  if (!par) notFound();
  const { a, b } = par;
  const vs = getVectors().schools;
  const axes = new Map(getAxes().map(x => [x.id, x]));
  const fam = new Map(getFamilies().map(f => [f.id, f]));
  const { concordam, divergem } = resumoComparacao(vs[a.id], vs[b.id]);
  const polo = (axis: keyof typeof vs[string], v: number) => { const x = axes.get(axis)!; return (v < 50 ? x.poleA : x.poleB).toLowerCase(); };
  const corA = fam.get(a.familyId)!.color;
  const corB = fam.get(b.familyId)!.color;

  return (
    <article className="space-y-5">
      <header className="rounded-3xl border border-line bg-card p-6 sm:p-8">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          <Link href={`/escolas/${a.id}`} style={{ color: corA }} className="hover:underline">{a.name}</Link> ×{' '}
          <Link href={`/escolas/${b.id}`} style={{ color: corB }} className="hover:underline">{b.name}</Link>
        </h1>
        <p className="mt-3 text-lg">As duas escolas são <strong>{Math.round(matchScore(vs[a.id], vs[b.id]))}% compatíveis</strong> nos 8 eixos.</p>
      </header>
      <Section id="resumo" title="Onde concordam e onde se separam">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-brand-soft p-4">
            <p className="font-semibold text-brand">Concordam</p>
            <ul className="mt-2 space-y-1 text-sm">{concordam.length ? concordam.map(c => <li key={c.axis}><strong>{axes.get(c.axis)!.name}:</strong> as duas puxam pra {polo(c.axis, c.a)}</li>) : <li>Quase em nada.</li>}</ul>
          </div>
          <div className="rounded-2xl bg-amber-faint p-4">
            <p className="font-semibold text-amber">Se separam</p>
            <ul className="mt-2 space-y-1 text-sm">{divergem.length ? divergem.map(c => <li key={c.axis}><strong>{axes.get(c.axis)!.name}:</strong> {a.name.toLowerCase()} {polo(c.axis, c.a)}, {b.name.toLowerCase()} {polo(c.axis, c.b)}</li>) : <li>Quase em nada.</li>}</ul>
          </div>
        </div>
      </Section>
      <Section id="eixos" title="Eixo por eixo">
        <ul className="space-y-4">
          {compareVectors(vs[a.id], vs[b.id]).map(c => {
            const ax = axes.get(c.axis)!;
            return (
              <li key={c.axis}>
                <p className="text-sm font-semibold">{ax.name}</p>
                <div className="relative my-2 h-2 rounded-full bg-track">
                  <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] bg-white" style={{ left: `${c.a}%`, borderColor: corA }} title={a.name} />
                  <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] bg-white" style={{ left: `${c.b}%`, borderColor: corB }} title={b.name} />
                </div>
                <div className="flex justify-between text-xs text-mute"><span>{ax.poleA}</span><span>{ax.poleB}</span></div>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-xs text-mute"><span style={{ color: corA }}>●</span> {a.name} <span className="ml-3" style={{ color: corB }}>●</span> {b.name}</p>
      </Section>
      <Cta />
    </article>
  );
}

export default function ComparativoPage({ params }: P) {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}><Comparativo params={params} /></Suspense>
      </main>
    </>
  );
}
