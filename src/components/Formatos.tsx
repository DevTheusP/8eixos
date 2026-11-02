import Link from 'next/link';
import type { CSSProperties } from 'react';
import { FORMATOS, type Formato } from '@/lib/selection';

const ORDEM: Formato[] = ['curta', 'completa', 'profunda'];
const NIVEL = { curta: 1, completa: 2, profunda: 3 };

// Cada formato é uma constelação: quanto mais perguntas, mais estrelas. [x, y, raio] e ligações por índice.
const CEU: Record<Formato, { estrelas: [number, number, number][]; linhas: [number, number][] }> = {
  curta: {
    estrelas: [[60, 100, 3], [120, 60, 2.5], [190, 80, 3.2], [240, 40, 2.4]],
    linhas: [[0, 1], [1, 2], [2, 3]],
  },
  completa: {
    estrelas: [[40, 110, 2.6], [85, 75, 3], [130, 95, 2.4], [160, 45, 3.6], [210, 60, 2.8], [250, 25, 2.2], [235, 110, 2.6], [175, 125, 2.2]],
    linhas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [2, 7]],
  },
  profunda: {
    estrelas: [[30, 60, 2.2], [70, 40, 3], [100, 80, 2.6], [60, 115, 2], [150, 70, 3.6], [175, 30, 2.4], [225, 22, 2], [190, 105, 2.6], [240, 90, 3], [270, 50, 2.2], [255, 130, 2.4]],
    linhas: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [4, 7], [7, 8], [8, 9], [8, 10]],
  },
};

function Constelacao({ f, acesa }: { f: Formato; acesa: boolean }) {
  const { estrelas, linhas } = CEU[f];
  return (
    <svg viewBox="0 0 300 150" aria-hidden className="constelacao -mx-1 -mt-2 h-20 w-full" data-acesa={acesa}>
      {linhas.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={estrelas[a][0]} y1={estrelas[a][1]} x2={estrelas[b][0]} y2={estrelas[b][1]} />
      ))}
      {estrelas.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={{ animationDelay: `${-(i * 0.7) % 3}s` }} />
      ))}
    </svg>
  );
}

// Os três formatos do quiz lado a lado. Usado na home e na página /quiz.
export function Formatos() {
  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {ORDEM.map((f, i) => {
          const info = FORMATOS[f];
          const destaque = info.recomendado;
          return (
            <article
              key={f}
              style={{ '--d': `${180 + i * 80}ms` } as CSSProperties}
              className={`arrive lift press group vidro relative flex flex-col rounded-[28px] p-5 ${destaque ? 'border-brand/60 shadow-[0_30px_80px_-30px_rgb(140_110_255_/_0.7)]' : ''}`}
            >
              <Constelacao f={f} acesa={destaque} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber">{info.titulo}</span>
                {destaque && <span className="brilho rounded-full px-3 py-1 text-xs font-extrabold">Recomendada</span>}
              </div>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{info.perguntas}</span>
                <span className="text-mute">perguntas</span>
              </p>
              <p className="mt-2 flex-1 text-sm text-mute">{info.descricao}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm text-mute">
                <span>Aprox. {info.minutos} min</span>
                <span aria-label={`Profundidade ${NIVEL[f]} de 3`} className="tracking-[3px] text-amber">
                  {'✦'.repeat(NIVEL[f])}<span className="opacity-25">{'✦'.repeat(3 - NIVEL[f])}</span>
                </span>
              </div>
              {/* O link cobre o cartão inteiro (after:inset-0), mas o texto dele fica no botão. */}
              <Link
                href={`/quiz/${f}`}
                className={`mt-4 rounded-full px-5 py-2.5 text-center font-bold transition-colors after:absolute after:inset-0 after:rounded-[28px] ${destaque ? 'brilho' : 'border border-line bg-tile group-hover:bg-tile-strong'}`}
              >
                Começar versão {info.titulo.toLowerCase()}
              </Link>
            </article>
          );
        })}
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-mute [&>li]:before:mr-2 [&>li]:before:text-amber [&>li]:before:content-['✦']">
        <li>Os três formatos medem os mesmos 8 eixos</li>
        <li>Anônimo, sem cadastro</li>
        <li>Resultado imediato</li>
      </ul>
    </>
  );
}
