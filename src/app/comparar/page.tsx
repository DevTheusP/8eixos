import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CompareForms } from '@/components/CompareForms';
import { ComparacaoResultado } from '@/components/ComparacaoResultado';
import { SiteHeader } from '@/components/SiteHeader';
import { Section } from '@/components/result/Section';
import { nomeSeguro } from '@/lib/compare';
import { resolverAlvo } from '@/lib/alvos';
import { getAxes } from '@/lib/data';
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
  const euNome = nomeSeguro(um('eu'), 'Você');
  const outroNome = outro ? nomeSeguro(um('nome'), outro.nome === 'A outra pessoa' ? 'a outra pessoa' : outro.nome) : '';
  return (
    <div className="space-y-5">
      <Link href={`/resultado?${vectorToParams(eu)}`} className="text-sm text-brand">← Voltar ao meu resultado</Link>
      {!outro ? (
        <Section id="comparar" title="Comparar">
          <p className="mb-4 rounded-xl bg-amber-faint px-4 py-3 text-sm text-amber">Esse link não é de um resultado. Confira se copiou o endereço inteiro.</p>
          <CompareForms vector={eu} />
        </Section>
      ) : (
        <Section id="comparar" title="Comparação">
          <ComparacaoResultado eu={eu} outro={outro.vector} euNome={euNome} outroNome={outroNome} axes={getAxes()} />
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
