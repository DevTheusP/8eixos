'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; label: string };

export function secaoAtiva(itens: Item[], visivel: Map<string, boolean>): string | undefined {
  return itens.find(it => visivel.get(it.id))?.id;
}

// Atalhos das seções numa faixa fixa no topo; a seção visível fica destacada.
export function Atalhos({ itens }: { itens: Item[] }) {
  const [ativo, setAtivo] = useState(itens[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const visivel = new Map<string, boolean>();
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) visivel.set(e.target.id, e.isIntersecting);
        const id = secaoAtiva(itens, visivel);
        if (id) setAtivo(id);
      },
      { rootMargin: '-25% 0px -60% 0px' },
    );
    for (const it of itens) {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [itens]);

  return (
    <nav aria-label="Seções do resultado" className="sticky top-0 z-10 -mx-4 border-b border-line bg-bg/90 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
      <ol className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {itens.map(it => (
          <li key={it.id} className="flex-none">
            <a
              href={`#${it.id}`}
              aria-current={ativo === it.id ? 'true' : undefined}
              className={`press block rounded-full px-3 py-1.5 text-sm ${ativo === it.id ? 'bg-brand font-semibold text-white' : 'text-mute hover:bg-tile hover:text-ink'}`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
