import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Apoie } from '@/components/Apoie';
import { Continuar } from '@/components/Continuar';
import { ComoFunciona, Descobre, Familias, Faq, LequeCards, OitoEixos, PreviaResultado } from '@/components/HomeExtras';
import { SiteHeader } from '@/components/SiteHeader';
import { Transparencia } from '@/components/Transparencia';
import { Formatos } from '@/components/Formatos';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <Continuar />
        <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="arrive font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ '--d': '40ms' } as CSSProperties}>
              Qual é a sua <span className="text-brand">filosofia de vida?</span>
            </h1>
            <p className="arrive mt-4 max-w-xl text-lg text-mute" style={{ '--d': '100ms' } as CSSProperties}>
              Responda o que você pensa sobre controle, sentido, prazer, dúvida e outras grandes perguntas. No fim, você
              descobre a escola filosófica e os pensadores mais parecidos com você, e ganha um card pronto pro story.
            </p>
            <div className="arrive mt-7 flex flex-wrap gap-3" style={{ '--d': '160ms' } as CSSProperties}>
              <Link href="/quiz" className="press group brilho rounded-full px-6 py-3.5 font-semibold">
                Descobrir minha filosofia <span className="nudge">→</span>
              </Link>
              <a href="#eixos" className="press rounded-full border-2 border-line px-6 py-3 font-semibold text-ink hover:bg-tile">Ver os 8 eixos</a>
            </div>
            <ul className="arrive mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mute [&>li]:before:mr-2 [&>li]:before:content-['•']" style={{ '--d': '220ms' } as CSSProperties}>
              <li>Grátis</li>
              <li>De 5 a 20 minutos</li>
              <li>Card pronto pro story</li>
            </ul>
          </div>
          <div className="arrive" style={{ '--d': '200ms' } as CSSProperties}><LequeCards /></div>
        </section>

        <Descobre />
        <PreviaResultado />
        <ComoFunciona />
        <OitoEixos />
        <Familias />

        <section id="formatos" className="reveal mt-20 scroll-mt-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Escolha quanto tempo você tem</h2>
          <p className="mt-2 text-mute">Quanto mais perguntas, mais detalhado o resultado.</p>
          <Formatos />
        </section>
        <Transparencia />
        <Apoie />
        <Faq />
      </main>
    </>
  );
}
