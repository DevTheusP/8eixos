'use client';

import { Search } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { OpcaoComparacao } from '@/lib/alvos';

const semAcento = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const MAX = 8;

// Campo de busca com sugestões (padrão combobox da WAI-ARIA): digitar filtra, setas navegam, Enter escolhe.
export function BuscaPensador({ opcoes }: { opcoes: OpcaoComparacao[] }) {
  const id = useId();
  const [texto, setTexto] = useState('');
  const [escolhida, setEscolhida] = useState<OpcaoComparacao | null>(null);
  const [aberta, setAberta] = useState(false);
  const [ativo, setAtivo] = useState(0);

  const achadas = useMemo(() => {
    const q = semAcento(texto.trim());
    if (!q) return opcoes.slice(0, MAX);
    // Quem começa com o que foi digitado vem antes de quem só contém.
    const comeca = opcoes.filter(o => semAcento(o.nome).startsWith(q) || o.busca.split(' ').some(p => p.startsWith(q)));
    const contem = opcoes.filter(o => !comeca.includes(o) && o.busca.includes(q));
    return [...comeca, ...contem].slice(0, MAX);
  }, [texto, opcoes]);

  function escolher(o: OpcaoComparacao) {
    setEscolhida(o);
    setTexto(o.nome);
    setAberta(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setAberta(true); setAtivo(i => Math.min(i + 1, achadas.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAtivo(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && aberta && achadas[ativo]) { e.preventDefault(); escolher(achadas[ativo]); }
    else if (e.key === 'Escape') setAberta(false);
  }

  const lista = `${id}-lista`;
  const mostrar = aberta && texto.trim() !== '';

  return (
    <>
      <div className="relative mt-3">
        <Search aria-hidden size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input
          role="combobox"
          aria-label="Buscar pensador ou escola"
          aria-expanded={mostrar}
          aria-controls={lista}
          aria-autocomplete="list"
          aria-activedescendant={mostrar && achadas[ativo] ? `${id}-${ativo}` : undefined}
          value={texto}
          placeholder="Digite um nome: Nietzsche, estoicismo…"
          autoComplete="off"
          onChange={e => { setTexto(e.target.value); setEscolhida(null); setAberta(true); setAtivo(0); }}
          onFocus={() => setAberta(true)}
          onBlur={() => setTimeout(() => setAberta(false), 120)}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-line bg-card py-2.5 pl-9 pr-3 text-sm"
        />
        {mostrar && (
          <ul id={lista} role="listbox" className="absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl border border-line bg-[rgb(14_17_45_/_0.98)] p-1 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]">
            {achadas.length === 0 && <li className="px-3 py-2.5 text-sm text-mute">Nenhum pensador ou escola com esse nome.</li>}
            {achadas.map((o, i) => (
              <li
                key={o.valor}
                id={`${id}-${i}`}
                role="option"
                aria-selected={i === ativo}
                onMouseDown={e => { e.preventDefault(); escolher(o); }}
                onMouseEnter={() => setAtivo(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 ${i === ativo ? 'bg-tile-strong' : ''}`}
              >
                {o.retrato
                  // eslint-disable-next-line @next/next/no-img-element -- miniatura pequena já otimizada (webp)
                  ? <img src={o.retrato} alt="" width={32} height={32} className="h-8 w-8 flex-none rounded-full object-cover" />
                  : <span aria-hidden className="h-8 w-8 flex-none rounded-full" style={{ background: o.cor }} />}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{o.nome}</span>
                  <span className="block truncate text-xs text-mute">{o.tipo === 'Escola' ? 'Escola' : o.descricao}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input type="hidden" name="outro" value={escolhida?.valor ?? ''} />
      <button
        disabled={!escolhida}
        data-track="comparar"
        data-track-tipo={escolhida?.tipo === 'Escola' ? 'escola' : 'pensador'}
        className="press group mt-3 rounded-full bg-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        Comparar <span className="nudge">→</span>
      </button>
    </>
  );
}
