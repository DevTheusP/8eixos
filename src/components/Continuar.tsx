'use client';

import { Play, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { loadLastResult, loadState, type QuizState, type ResumoResultado } from '@/lib/quiz-state';
import { FORMATOS, type Formato } from '@/lib/selection';

// Oito estrelas, uma por eixo: a "sua constelação" no cartão do último resultado.
const ESTRELAS: [number, number, number][] = [[14, 52, 2.4], [34, 30, 3], [56, 44, 2.2], [72, 18, 3.4], [92, 34, 2.6], [108, 12, 2], [102, 58, 2.4], [70, 66, 2]];
const LINHAS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [2, 7]];

function Constelacao({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 122 78" aria-hidden className="h-16 w-24 flex-none sm:h-20 sm:w-32">
      {LINHAS.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={ESTRELAS[a][0]} y1={ESTRELAS[a][1]} x2={ESTRELAS[b][0]} y2={ESTRELAS[b][1]} stroke={cor} strokeOpacity={0.55} strokeWidth={1.2} />
      ))}
      {ESTRELAS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" className="[animation:pisca_3s_ease-in-out_infinite]" style={{ animationDelay: `${-i * 0.6}s` }} />
      ))}
    </svg>
  );
}

// Quem volta pro site vê o último resultado (com a escola na cor da família) e o quiz que deixou pela metade.
export function Continuar() {
  const [andamento, setAndamento] = useState<QuizState | null>(null);
  const [ultimo, setUltimo] = useState<{ params: string; resumo?: ResumoResultado } | null>(null);

  useEffect(() => {
    const emCurso = (Object.keys(FORMATOS) as Formato[]).map(f => loadState(f)).find(s => s && s.index > 0) ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dados só existem no navegador (localStorage)
    setAndamento(emCurso);
    setUltimo(loadLastResult());
  }, []);

  if (!andamento && !ultimo) return null;
  const cor = ultimo?.resumo?.cor ?? '#5b46d6';
  const pct = andamento ? Math.round((andamento.index / andamento.questionIds.length) * 100) : 0;

  return (
    <div className="arrive mb-10 space-y-3">
      {ultimo && (
        <section
          className="relative overflow-hidden rounded-3xl border p-5 sm:p-6"
          style={{ borderColor: `color-mix(in srgb, ${cor} 55%, transparent)`, background: `linear-gradient(120deg, color-mix(in srgb, ${cor} 38%, transparent), rgb(18 22 58 / 0.6) 70%)` } as CSSProperties}
        >
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full blur-3xl" style={{ background: `color-mix(in srgb, ${cor} 45%, transparent)` }} />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <Constelacao cor="#ffd98a" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber">Seu último resultado</p>
              {ultimo.resumo ? (
                <>
                  <p className="font-display text-2xl font-bold sm:text-3xl">{ultimo.resumo.escola}</p>
                  <p className="mt-1 text-sm text-ink/80">{ultimo.resumo.score}% compatível · {ultimo.resumo.familia}</p>
                </>
              ) : (
                <p className="font-display text-2xl font-bold">Você já fez o quiz</p>
              )}
              <p className="mt-1 text-xs text-mute">Guardado só neste navegador.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/resultado?${ultimo.params}`} className="press group brilho rounded-full px-5 py-2.5 font-bold">
                Ver meu resultado <span className="nudge">→</span>
              </Link>
              <Link href="/quiz" className="press inline-flex items-center gap-2 rounded-full border border-line bg-tile px-5 py-2.5 font-semibold hover:bg-tile-strong">
                <RotateCcw aria-hidden size={16} /> Refazer o quiz
              </Link>
            </div>
          </div>
        </section>
      )}
      {andamento && (
        <Link href={`/quiz/${andamento.formato}`} className="press group vidro lift flex items-center gap-4 rounded-2xl p-4">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full brilho">
            <Play aria-hidden size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block">Continuar de onde parou</strong>
            <span className="text-sm text-mute">Versão {FORMATOS[andamento.formato].titulo.toLowerCase()}, pergunta {andamento.index + 1} de {andamento.questionIds.length}</span>
            <span role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do quiz" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-track">
              <span className="block h-full rounded-full bg-gradient-to-r from-[#ffd98a] via-[#ffb4d9] to-[#c3b2ff]" style={{ width: `${pct}%` }} />
            </span>
          </span>
          <span className="nudge font-bold text-brand">→</span>
        </Link>
      )}
    </div>
  );
}
