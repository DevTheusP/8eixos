import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Formatos } from '@/components/Formatos';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Escolha o formato do quiz',
  description: 'Três versões do quiz de filosofia de vida: rápida, equilibrada ou profunda. Todas medem os mesmos 8 eixos.',
  alternates: { canonical: '/quiz' },
};

export default function EscolherFormato() {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Voltar ao início' }} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="arrive max-w-4xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Quanto tempo você quer <span className="text-brand">pensar sobre a vida?</span>
        </h1>
        <p className="arrive mt-3 max-w-3xl text-mute" style={{ '--d': '80ms' } as CSSProperties}>
          A versão rápida já mostra sua escola em poucos minutos. As mais longas fazem mais perguntas sobre cada eixo e
          deixam o resultado mais preciso. Você pode parar e continuar depois.
        </p>
        <Formatos />
      </main>
    </>
  );
}
