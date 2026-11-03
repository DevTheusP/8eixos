'use client';

import { ArrowLeft, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { RetratoPergunta } from '@/lib/types';

// Etapa depois das perguntas normais: múltipla escolha que afina o resultado. Pode pular a qualquer momento.
export function RetratoFinal({ perguntas, escolhas, onEscolher, onPular, onVoltar }: {
  perguntas: RetratoPergunta[];
  escolhas: Record<string, string>;
  onEscolher: (pergunta: string, opcao: string) => void;
  onPular: () => void;
  onVoltar: () => void;
}) {
  const i = Math.max(0, perguntas.findIndex(p => escolhas[p.id] === undefined));
  const p = perguntas[i];
  const topo = useRef<HTMLDivElement>(null);

  // As alternativas são longas: a cada pergunta, volta ao topo se o começo da etapa ficou fora da tela.
  useEffect(() => {
    const el = topo.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
  }, [i]);

  return (
    <div ref={topo} className="mx-auto w-full max-w-3xl scroll-mt-20">
      <div className="mb-3 flex items-center justify-between text-sm text-mute">
        <span className="inline-flex items-center gap-1.5 font-semibold text-amber"><Sparkles aria-hidden size={15} /> Seu retrato final</span>
        <span><strong className="text-ink">{i + 1} de {perguntas.length}</strong></span>
      </div>
      <div className="mb-6 flex gap-1" aria-hidden>
        {perguntas.map((x, k) => (
          <span key={x.id} className={`h-1.5 flex-1 rounded-full ${k < i ? 'bg-amber' : 'bg-line'}`} />
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-line border-t-4 border-t-amber bg-card p-5 sm:p-7">
        {i === 0 && (
          <p className="mb-4 text-sm text-mute">Mais {perguntas.length} perguntas de múltipla escolha para afinar o seu resultado. Escolha a que mais combina com você.</p>
        )}
        <div key={p.id} className="question-in">
          <p className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{p.pergunta}</p>
          <div className="mt-6 grid gap-2">
            {p.opcoes.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => onEscolher(p.id, o.id)}
                className="opcao press rounded-2xl border border-line px-4 py-3.5 text-left font-display text-sm font-medium tracking-tight sm:text-base"
                style={{ '--cor': '#ffd98a', background: 'rgb(18 22 58 / 0.55)' } as React.CSSProperties}
              >
                {o.texto}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onVoltar} className="press inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold">
          <ArrowLeft aria-hidden size={16} /> Voltar
        </button>
        <button type="button" onClick={onPular} className="press rounded-xl px-4 py-2.5 text-sm font-semibold text-mute hover:bg-tile hover:text-ink">
          Pular e ver meu resultado
        </button>
      </div>
    </div>
  );
}
