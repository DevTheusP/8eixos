'use client';

import { Lightbulb, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { POLE_ICONS } from '@/lib/icons';
import type { Axis, Question } from '@/lib/types';

const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

// Janela por cima do quiz explicando pra onde cada resposta puxa, com escolas do catálogo como exemplo de cada lado.
export function SobrePergunta({ q, eixo, exemplos, onClose }: {
  q: Question; eixo: Axis; exemplos?: { A: string[]; B: string[] }; onClose: () => void;
}) {
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fechar.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = antes; };
  }, [onClose]);

  const forcada = q.kind === 'forced';
  const ladoDe = (l: 'A' | 'B') => ({ lado: l, nome: l === 'A' ? eixo.poleA : eixo.poleB, desc: l === 'A' ? eixo.descA : eixo.descB });
  const [primeiro, segundo] = q.polarity === 'A' ? [ladoDe('A'), ladoDe('B')] : [ladoDe('B'), ladoDe('A')];
  const cartoes = [
    { ...primeiro, quando: forcada ? 'Se você escolhe a da esquerda' : 'Se você concorda', cor: forcada ? '#8fb3ff' : '#5ef2c0' },
    { ...segundo, quando: forcada ? 'Se você escolhe a da direita' : 'Se você discorda', cor: forcada ? '#ffd98a' : '#ff8fb1' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sobre-titulo"
        onClick={e => e.stopPropagation()}
        className="fim-sobe relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-[rgb(14_17_45_/_0.98)] p-5 shadow-[0_30px_80px_-20px_rgb(140_110_255_/_0.6)] sm:p-6"
      >
        <button ref={fechar} type="button" onClick={onClose} aria-label="Fechar" className="press absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line text-mute hover:bg-tile hover:text-ink">
          <X aria-hidden size={18} />
        </button>
        <p className="text-xs font-semibold text-mute">Eixo {eixo.name}</p>
        <h2 id="sobre-titulo" className="pr-12 font-display text-2xl font-bold">Sobre esta pergunta</h2>

        <div className="mt-5 space-y-3">
          {cartoes.map(c => {
            const Icone = POLE_ICONS[eixo.id][c.lado];
            const nomes = exemplos?.[c.lado] ?? [];
            return (
              <div key={c.quando} className="rounded-2xl border border-line bg-tile p-4" style={{ borderLeft: `4px solid ${c.cor}` }}>
                <p className="text-xs font-bold" style={{ color: c.cor }}>{c.quando}</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: c.cor, color: '#0b0d26' }}>
                    <Icone aria-hidden size={16} strokeWidth={2.6} />
                  </span>
                  Puxa pra {c.nome}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/85">{maiuscula(c.desc)}</p>
                {nomes.length > 0 && (
                  <p className="mt-2 text-sm text-mute"><span className="font-semibold text-ink">Quem pensa assim:</span> {nomes.join(', ')}.</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-3 rounded-2xl bg-amber-faint p-4 text-sm">
          <Lightbulb aria-hidden size={18} className="mt-0.5 flex-none text-amber" />
          <p><span className="font-bold text-amber">Vale lembrar:</span> não existe resposta certa. Responda pelo que você pensa de verdade, não pelo que acha que deveria pensar.</p>
        </div>
      </div>
    </div>
  );
}
