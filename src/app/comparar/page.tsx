import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CompareForms } from '@/components/CompareForms';
import { SiteHeader } from '@/components/SiteHeader';
import { Section } from '@/components/result/Section';
import { compareVectors, nomeSeguro, resumoComparacao } from '@/lib/compare';
import { whatsappComparacao } from '@/lib/share';
import { resolverAlvo } from '@/lib/alvos';
import { getAxes } from '@/lib/data';
import { matchScore } from '@/lib/matching';
import type { Vector } from '@/lib/types';
import { paramsToVector, parseResultLink, vectorToParams } from '@/lib/url';

export const metadata: Metadata = { title: 'Comparar resultados', robots: { index: false } };

function resolveOutro(outro: string | undefined): { nome: string; vector: Vector } | null {
  if (!outro) return null;
  if (/^(pensador|escola):/.test(outro)) return resolverAlvo(outro);
  const v = parseResultLink(outro);
  return v ? { nome: 'A outra pessoa', vector: v } : null;
}

async function Comparacao({ searchParams }: { searchParams: PageProps<'/comparar'>['searchParams'] }) {
  const sp = await searchParams;
  const eu = paramsToVector(sp);
  if (!eu) {
    return <p className="text-center text-mute">Não conseguimos ler o seu resultado. <Link href="/" className="text-brand underline">Fazer o quiz</Link></p>;
  }
  const um = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;
  const outroRaw = um('outro');
  const outro = resolveOutro(outroRaw);
  const axes = new Map(getAxes().map(a => [a.id, a]));
  const euNome = nomeSeguro(um('eu'), 'Você');
  const outroNome = outro ? nomeSeguro(um('nome'), outro.nome === 'A outra pessoa' ? 'a outra pessoa' : outro.nome) : '';
  const resumo = outro ? resumoComparacao(eu, outro.vector) : null;
  const polo = (axis: keyof typeof eu, v: number) => { const x = axes.get(axis)!; return (v < 50 ? x.poleA : x.poleB).toLowerCase(); };
  const cardUrl = outro ? `/api/comparar-card?a=${encodeURIComponent(vectorToParams(eu))}&b=${encodeURIComponent(vectorToParams(outro.vector))}&na=${encodeURIComponent(euNome)}&nb=${encodeURIComponent(outroNome)}` : '';
  return (
    <div className="space-y-5">
      <Link href={`/resultado?${vectorToParams(eu)}`} className="text-sm text-brand">← Voltar ao meu resultado</Link>
      {!outro ? (
        <Section id="comparar" title="Comparar">
          <p className="mb-4 rounded-xl bg-amber-faint px-4 py-3 text-sm text-amber">Esse link não é de um resultado. Confira se copiou o endereço inteiro.</p>
          <CompareForms vector={eu} />
        </Section>
      ) : (
        <Section id="comparar" title={`${euNome} e ${outroNome}`}>
          <p className="mb-5 font-display text-4xl font-bold text-brand">{Math.round(matchScore(eu, outro.vector))}% de compatibilidade</p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-soft p-4">
              <p className="font-semibold text-brand">Onde vocês concordam</p>
              <ul className="mt-2 space-y-1 text-sm">
                {resumo!.concordam.length ? resumo!.concordam.map(c => <li key={c.axis}><strong>{axes.get(c.axis)!.name}:</strong> os dois {polo(c.axis, c.a)}</li>) : <li>Em quase nada, e tudo bem.</li>}
              </ul>
            </div>
            <div className="rounded-2xl bg-amber-faint p-4">
              <p className="font-semibold text-amber">Onde vocês divergem</p>
              <ul className="mt-2 space-y-1 text-sm">
                {resumo!.divergem.length ? resumo!.divergem.map(c => <li key={c.axis}><strong>{axes.get(c.axis)!.name}:</strong> {euNome} {polo(c.axis, c.a)}, {outroNome} {polo(c.axis, c.b)}</li>) : <li>Em quase nada.</li>}
              </ul>
            </div>
          </div>
          <div className="mb-6 flex flex-wrap gap-3">
            <a href={cardUrl} download="nossa-comparacao.png" data-track="baixar_card_comparacao" className="press rounded-xl brilho px-4 py-2.5 text-sm font-semibold">Baixar card da comparação</a>
            <a href={whatsappComparacao(euNome, outroNome, Math.round(matchScore(eu, outro.vector)))} target="_blank" rel="noopener noreferrer" data-track="whatsapp_comparacao" className="press rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand">Mandar no WhatsApp</a>
          </div>
          <ul className="space-y-4">
            {compareVectors(eu, outro.vector).map(c => {
              const ax = axes.get(c.axis)!;
              return (
                <li key={c.axis}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{ax.name}</span>
                    <span className={c.sameSide ? 'text-brand' : 'text-amber'}>{c.sameSide ? 'Do mesmo lado' : 'Em lados opostos'} · {Math.round(c.diff)} pts</span>
                  </div>
                  <div className="relative my-2 h-2 rounded-full bg-track">
                    <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-brand bg-white" style={{ left: `${c.a}%` }} title="Você" />
                    <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-amber bg-white" style={{ left: `${c.b}%` }} title={outro.nome} />
                  </div>
                  <div className="flex justify-between text-xs text-mute"><span>{ax.poleA}</span><span>{ax.poleB}</span></div>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-xs text-mute"><span className="text-brand">●</span> Você <span className="ml-3 text-amber">●</span> {outro.nome}</p>
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
