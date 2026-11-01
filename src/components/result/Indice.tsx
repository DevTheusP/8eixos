'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; label: string; locked?: boolean };

export function secaoAtiva(itens: Item[], visivel: Map<string, boolean>): string | undefined {
  return itens.find(it => visivel.get(it.id))?.id;
}

export function Indice({ itens }: { itens: Item[] }) {
  const [ativo, setAtivo] = useState(itens[0]?.id);

  // Marca a seção que está mais perto do topo da tela.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    // O observer só avisa o que mudou; guardo o estado de todas pra escolher a primeira visível na ordem da página.
    const visivel = new Map<string, boolean>();
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) visivel.set(e.target.id, e.isIntersecting);
        const id = secaoAtiva(itens, visivel);
        if (id) setAtivo(id);
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );
    for (const it of itens) {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [itens]);

  return (
    <nav className="sticky top-6 hidden rounded-3xl border border-line bg-card p-4 lg:block" aria-label="Nesta página">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-mute">Nesta página</p>
      <ol>
        {itens.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={ativo === it.id ? 'true' : undefined}
              className={`press flex gap-3 rounded-lg px-3 py-2 text-sm ${ativo === it.id ? 'bg-brand-soft font-semibold text-brand' : 'hover:bg-tile'} ${it.locked ? 'text-mute' : ''}`}
            >
              <span className="w-4 text-xs text-mute">{String(i + 1).padStart(2, '0')}</span>
              {it.label}{it.locked ? ' 🔒' : ''}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
