import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CompareForms } from '@/components/CompareForms';
import { SiteHeader } from '@/components/SiteHeader';
import { Section } from '@/components/result/Section';
import { compareVectors } from '@/lib/compare';
import { getAxes, getThinkers, getVectors } from '@/lib/data';
import { matchScore } from '@/lib/matching';
import type { Vector } from '@/lib/types';
import { paramsToVector, parseResultLink, vectorToParams } from '@/lib/url';

export const metadata: Metadata = { title: 'Comparar resultados', robots: { index: false } };

function resolveOutro(outro: string | undefined): { nome: string; vector: Vector } | null {
  if (!outro) return null;
  if (outro.startsWith('pensador:')) {
    const id = outro.slice('pensador:'.length);
    const t = getThinkers().find(x => x.id === id);
    const v = getVectors().thinkers[id];
    return t && v ? { nome: t.name, vector: v } : null;
  }
  const v = parseResultLink(outro);
  return v ? { nome: 'A outra pessoa', vector: v } : null;
}

async function Comparacao({ searchParams }: { searchParams: PageProps<'/comparar'>['searchParams'] }) {
  const sp = await searchParams;
  const eu = paramsToVector(sp);
  if (!eu) {
    return <p className="text-center text-mute">Não conseguimos ler o seu resultado. <Link href="/" className="text-brand underline">Fazer o quiz</Link></p>;
  }
  const outroRaw = Array.isArray(sp.outro) ? sp.outro[0] : sp.outro;
  const outro = resolveOutro(outroRaw);
  const axes = new Map(getAxes().map(a => [a.id, a]));
  return (
    <div className="space-y-5">
      <Link href={`/resultado?${vectorToParams(eu)}`} className="text-sm text-brand">← Voltar ao meu resultado</Link>
      {!outro ? (
        <Section id="comparar" title="Comparar">
          <p className="mb-4 rounded-xl bg-rose-faint px-4 py-3 text-sm text-rose">Esse link não é de um resultado. Confira se copiou o endereço inteiro.</p>
          <CompareForms vector={eu} />
        </Section>
      ) : (
        <Section id="comparar" title={`Você e ${outro.nome === 'A outra pessoa' ? 'a outra pessoa' : outro.nome}`}>
          <p className="mb-5 font-display text-4xl font-bold text-brand">{Math.round(matchScore(eu, outro.vector))}% de compatibilidade</p>
          <ul className="space-y-4">
            {compareVectors(eu, outro.vector).map(c => {
              const ax = axes.get(c.axis)!;
              return (
                <li key={c.axis}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{ax.name}</span>
                    <span className={c.sameSide ? 'text-brand' : 'text-rose'}>{c.sameSide ? 'Do mesmo lado' : 'Em lados opostos'} · {Math.round(c.diff)} pts</span>
                  </div>
                  <div className="relative my-2 h-2 rounded-full bg-track">
                    <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-brand bg-white" style={{ left: `${c.a}%` }} title="Você" />
                    <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-rose bg-white" style={{ left: `${c.b}%` }} title={outro.nome} />
                  </div>
                  <div className="flex justify-between text-xs text-mute"><span>{ax.poleA}</span><span>{ax.poleB}</span></div>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-xs text-mute"><span className="text-brand">●</span> Você <span className="ml-3 text-rose">●</span> {outro.nome}</p>
        </Section>
      )}
    </div>
  );
}

export default function CompararPage({ searchParams }: PageProps<'/comparar'>) {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-mute">Comparando…</p>}>
          <Comparacao searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
