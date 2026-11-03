'use client';

import { Coffee, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Compartilhar } from './Compartilhar';

type Props = { params: string; escola: string; score: number; pensador: string };

const chave = (params: string) => `quiz:fim-visto:${params}`;

function jaViu(params: string) {
  try { return localStorage.getItem(chave(params)) === '1'; } catch { return false; }
}
function marcarVisto(params: string) {
  try { localStorage.setItem(chave(params), '1'); } catch { /* sem storage: pode aparecer de novo, sem problema */ }
}

// Quando a pessoa chega ao fim do resultado, sobe um cartão discreto convidando a compartilhar o card (e, em segundo plano, a apoiar).
// Não bloqueia a página, fecha no × ou no Esc, e aparece uma vez por resultado.
export function FimDoResultado({ params, escola, score, pensador }: Props) {
  const marcador = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const el = marcador.current;
    if (!el || typeof IntersectionObserver === 'undefined' || jaViu(params)) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || jaViu(params)) return;
      marcarVisto(params);
      setAberto(true);
      io.disconnect();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [params]);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [aberto]);

  return (
    <>
      <div ref={marcador} aria-hidden className="h-px" />
      {aberto && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="fim-titulo"
          className="fim-sobe fixed inset-x-4 border border-line bg-[rgb(14_17_45_/_0.97)] backdrop-blur-md bottom-4 z-50 mx-auto max-w-lg rounded-3xl border-[#ffd98a]/30 p-5 shadow-[0_30px_80px_-20px_rgb(140_110_255_/_0.7)] sm:bottom-6"
        >
          <button type="button" onClick={() => setAberto(false)} aria-label="Fechar" className="press absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-mute hover:bg-tile hover:text-ink">
            <X aria-hidden size={18} />
          </button>
          <p id="fim-titulo" className="pr-8 font-display text-xl font-bold">Gostou do seu resultado?</p>
          <p className="mt-1 text-sm text-mute">Mostra pros amigos que você é {escola} e descobre qual é a filosofia deles.</p>
          <div className="mt-4">
            <Compartilhar params={params} escola={escola} score={score} pensador={pensador} />
          </div>
          <a href="#apoie" onClick={() => setAberto(false)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
            <Coffee aria-hidden size={15} /> ou me paga um café com Pix
          </a>
        </div>
      )}
    </>
  );
}
