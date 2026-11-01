import { Target, Telescope, Zap } from 'lucide-react';
import Link from 'next/link';
import { Rosa } from '@/components/Rosa';
import { SiteHeader } from '@/components/SiteHeader';
import { getAxes } from '@/lib/data';
import { FORMATOS, type Formato } from '@/lib/selection';

const ORDEM: Formato[] = ['completa', 'curta', 'profunda'];
const ICONES = { curta: Zap, completa: Target, profunda: Telescope };

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="font-display text-5xl text-ink sm:text-7xl">Qual é a sua filosofia de vida?</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">
              Oito perguntas grandes, de aceitar ou transformar até certeza ou dúvida. Responda o que você pensa e veja a
              forma do seu pensamento, a escola filosófica mais parecida com ele e os pensadores que pensariam como você.
            </p>
          </div>
          <Rosa axes={getAxes()} size={420} className="mx-auto h-auto w-full max-w-[420px]" />
        </div>

        <h2 className="mt-14 font-display text-3xl">Escolha quanto tempo você tem</h2>
        <div className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {ORDEM.map(f => {
            const info = FORMATOS[f];
            const Icone = ICONES[f];
            return (
              <article key={f} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6 ${info.recomendado ? 'bg-brand-soft/60' : ''}`}>
                <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-full ${info.recomendado ? 'bg-brand text-white' : 'bg-tile-strong text-brand'}`}>
                  <Icone aria-hidden size={22} />
                </span>
                <div className="flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-2xl">{info.titulo}</span>
                    <span className="text-sm text-mute"><span className="font-semibold text-ink">{info.perguntas}</span> perguntas, cerca de {info.minutos} min</span>
                    {info.recomendado && <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white">Recomendada</span>}
                  </p>
                  <p className="mt-1 text-mute">{info.descricao}</p>
                </div>
                <Link
                  href={`/quiz/${f}`}
                  className={`press rounded-full px-6 py-3 text-center font-semibold ${info.recomendado ? 'bg-brand text-white' : 'border border-brand text-brand hover:bg-brand-soft'}`}
                >
                  Começar versão {info.titulo.toLowerCase()}
                </Link>
              </article>
            );
          })}
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute">
          <li>Todos os formatos usam os mesmos 8 eixos</li>
          <li>Anônimo, sem cadastro</li>
          <li>Resultado imediato</li>
        </ul>
      </main>
    </>
  );
}
