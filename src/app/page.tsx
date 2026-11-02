import { Target, Telescope, Timer, Zap } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { FORMATOS, type Formato } from '@/lib/selection';

const ORDEM: Formato[] = ['curta', 'completa', 'profunda'];
const ICONES = { curta: Zap, completa: Target, profunda: Telescope };

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="arrive mb-3 text-xs font-semibold text-amber">— Escolha o formato</p>
        <h1 className="arrive font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ '--d': '60ms' } as CSSProperties}>
          Qual é a sua <span className="text-brand">filosofia de vida?</span>
        </h1>
        <p className="arrive mt-4 max-w-2xl text-lg text-mute" style={{ '--d': '120ms' } as CSSProperties}>
          Responda o que você pensa sobre controle, sentido, prazer, dúvida e outras grandes perguntas. No fim, você
          descobre a escola filosófica e os pensadores mais parecidos com você.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
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

        <ul className="arrive mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute [&>li]:before:mr-2 [&>li]:before:content-['•']">
          <li>Os três formatos medem os mesmos 8 eixos</li>
          <li>Anônimo, sem cadastro</li>
          <li>Resultado imediato</li>
        </ul>
      </main>
    </>
  );
}
