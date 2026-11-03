'use client';

import { Link2, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { OpcaoComparacao } from '@/lib/alvos';
import { nomeSeguro } from '@/lib/compare';
import { track } from '@/lib/track';
import { AXIS_IDS, type Axis, type Vector } from '@/lib/types';
import { AXIS_PARAMS, parseResultLink } from '@/lib/url';
import { BuscaPensador } from './BuscaPensador';
import { ComparacaoResultado } from './ComparacaoResultado';

type Alvo = { vector: Vector; euNome: string; outroNome: string };

function Hidden({ vector }: { vector: Vector }) {
  return AXIS_IDS.map(a => <input key={a} type="hidden" name={AXIS_PARAMS[a]} value={vector[a]} />);
}

// Compara ali mesmo no resultado, sem trocar de página. Sem JavaScript, os formulários ainda levam a /comparar.
export function CompararNaPagina({ vector, opcoes, axes }: { vector: Vector; opcoes: OpcaoComparacao[]; axes: Axis[] }) {
  const [alvo, setAlvo] = useState<Alvo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const resultado = useRef<HTMLDivElement>(null);

  useEffect(() => { if (alvo) resultado.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [alvo]);

  function comAmigo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = parseResultLink(String(f.get('outro') ?? ''));
    if (!v) { setErro('Esse link não é de um resultado. Confira se copiou o endereço inteiro.'); setAlvo(null); return; }
    setErro(null);
    track('comparar', { tipo: 'amigo' });
    setAlvo({ vector: v, euNome: nomeSeguro(String(f.get('eu') ?? ''), 'Você'), outroNome: nomeSeguro(String(f.get('nome') ?? ''), 'a outra pessoa') });
  }

  function comPensador(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const o = opcoes.find(x => x.valor === new FormData(e.currentTarget).get('outro'));
    if (!o) return;
    track('comparar', { tipo: o.tipo === 'Escola' ? 'escola' : 'pensador' });
    setErro(null);
    setAlvo({ vector: o.vector, euNome: 'Você', outroNome: o.nome });
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <form action="/comparar" method="get" onSubmit={comAmigo} className="rounded-2xl bg-tile p-5">
          <Hidden vector={vector} />
          <label className="flex items-center gap-2 font-semibold" htmlFor="outro-link"><Link2 aria-hidden size={16} className="text-brand" /> Com um amigo</label>
          <p className="text-sm text-mute">Cole o link do resultado de outra pessoa.</p>
          <input id="outro-link" name="outro" required placeholder="https://…/resultado?c=…" className="mt-3 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input name="eu" maxLength={24} placeholder="Seu nome" aria-label="Seu nome" className="rounded-lg border border-line bg-card px-3 py-2 text-sm" />
            <input name="nome" maxLength={24} placeholder="Nome da pessoa" aria-label="Nome da pessoa" className="rounded-lg border border-line bg-card px-3 py-2 text-sm" />
          </div>
          {erro && <p role="alert" className="mt-2 rounded-lg bg-amber-faint px-3 py-2 text-sm text-amber">{erro}</p>}
          <button className="press group mt-3 rounded-full bg-deep px-4 py-2 text-sm font-semibold text-white">Comparar <span className="nudge">→</span></button>
        </form>
        <form action="/comparar" method="get" onSubmit={comPensador} className="rounded-2xl bg-tile p-5">
          <Hidden vector={vector} />
          <p className="flex items-center gap-2 font-semibold"><UserRound aria-hidden size={16} className="text-brand" /> Com um pensador ou escola</p>
          <p className="text-sm text-mute">Veja eixo por eixo onde vocês concordam e onde brigariam.</p>
          <BuscaPensador opcoes={opcoes} />
        </form>
      </div>

      {alvo && (
        <div ref={resultado} className="fim-sobe relative mt-5 scroll-mt-24 rounded-2xl border border-line bg-tile p-5 sm:p-6">
          <button type="button" onClick={() => setAlvo(null)} aria-label="Fechar comparação" className="press absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-mute hover:bg-tile-strong hover:text-ink">
            <X aria-hidden size={18} />
          </button>
          <ComparacaoResultado eu={vector} outro={alvo.vector} euNome={alvo.euNome} outroNome={alvo.outroNome} axes={axes} />
        </div>
      )}
    </div>
  );
}
