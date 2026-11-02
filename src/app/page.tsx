import { Target, Telescope, Timer, Zap } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Continuar } from '@/components/Continuar';
import { ComoFunciona, Descobre, Familias, Faq, LequeCards, OitoEixos, PreviaResultado } from '@/components/HomeExtras';
import { SiteHeader } from '@/components/SiteHeader';
import { FORMATOS, type Formato } from '@/lib/selection';

const ORDEM: Formato[] = ['curta', 'completa', 'profunda'];
const ICONES = { curta: Zap, completa: Target, profunda: Telescope };

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
              <Link href="/quiz/completa" className="press group rounded-full bg-deep px-6 py-3.5 font-semibold text-white">
                Descobrir minha filosofia <span className="nudge">→</span>
              </Link>
              <a href="#eixos" className="press rounded-full border-2 border-deep px-6 py-3 font-semibold text-deep hover:bg-tile">Ver os 8 eixos</a>
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
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ORDEM.map((f, i) => {
            const info = FORMATOS[f];
            const Icone = ICONES[f];
            const destaque = info.recomendado;
            return (
              <article
                key={f}
                style={{ '--d': `${180 + i * 80}ms` } as CSSProperties}
                className={`arrive lift flex flex-col rounded-3xl border p-6 ${destaque ? 'sheen border-transparent bg-deep text-white shadow-xl' : 'border-line bg-card'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-2 text-xs font-semibold ${destaque ? 'text-amber-soft' : 'text-amber'}`}>
                    <Icone aria-hidden size={16} strokeWidth={2.4} />
                    {info.titulo}
                  </span>
                  {destaque && <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-ink">Recomendada</span>}
                </div>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-6xl font-bold">{info.perguntas}</span>
                  <span className="text-lg">perguntas</span>
                </p>
                <p className={`mt-3 flex-1 ${destaque ? 'text-white/80' : 'text-mute'}`}>{info.descricao}</p>
                <p className={`mt-4 flex items-center gap-1.5 border-t pt-4 text-sm ${destaque ? 'border-white/20 text-white/80' : 'border-line text-mute'}`}>
                  <Timer aria-hidden size={14} /> Aprox. {info.minutos} min
                </p>
                <Link
                  href={`/quiz/${f}`}
                  className={`press group mt-5 rounded-full px-5 py-3 text-center font-semibold ${destaque ? 'bg-card text-ink' : 'bg-deep text-white'}`}
                >
                  Começar versão {info.titulo.toLowerCase()} <span className="nudge">→</span>
                </Link>
              </article>
            );
          })}
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute [&>li]:before:mr-2 [&>li]:before:content-['•']">
          <li>Os três formatos medem os mesmos 8 eixos</li>
          <li>Anônimo, sem cadastro</li>
          <li>Resultado imediato</li>
        </ul>
        </section>
        <Faq />
      </main>
    </>
  );
}
