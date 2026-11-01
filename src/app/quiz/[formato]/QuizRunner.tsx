'use client';

import { ArrowLeft, CircleHelp, RotateCcw, Shuffle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { rosaRaios } from '@/lib/rosa';
import {
  advance, back, canSwap, clearState, isDone, loadState, saveState, select, swap, type QuizState,
} from '@/lib/quiz-state';
import { computeVector } from '@/lib/scoring';
import { selectQuestions, type Formato } from '@/lib/selection';
import { type AnswerIndex, type Axis, type AxisId, type Question } from '@/lib/types';
import { vectorToParams } from '@/lib/url';

// Escala de 5 pontos: círculos maiores nas pontas. Violeta = concordar / frase da esquerda, rosa = discordar / frase da direita.
const TAMANHOS = [52, 40, 28, 40, 52];
const CORES = ['var(--brand)', 'var(--brand)', 'var(--mute)', 'var(--rose)', 'var(--rose)'];
const LIKERT = ['Concordo totalmente', 'Concordo', 'Neutro', 'Discordo', 'Discordo totalmente'];
const FORCADA = ['Muito mais a da esquerda', 'Mais a da esquerda', 'Igual', 'Mais a da direita', 'Muito mais a da direita'];
const PREF_AUTO = 'quiz:avancar-ao-responder';

function freshState(formato: Formato, pool: Question[]): QuizState {
  return { formato, questionIds: selectQuestions(pool, formato).map(q => q.id), answers: {}, index: 0 };
}

function lerPreferencia(): boolean {
  try {
    return localStorage.getItem(PREF_AUTO) !== 'false';
  } catch {
    return true;
  }
}

export function QuizRunner({ formato, pool, axes = [] }: { formato: Formato; pool: Question[]; axes?: Axis[] }) {
  const router = useRouter();
  const byId = useMemo(() => new Map(pool.map(q => [q.id, q])), [pool]);
  const axisById = useMemo(() => new Map(axes.map(a => [a.id, a])), [axes]);
  const [state, setState] = useState<QuizState | null>(null);
  const [auto, setAuto] = useState(true);
  const [entenda, setEntenda] = useState(false);
  // Troca por teclado não anima: ação repetida muitas vezes fica mais rápida sem movimento.
  const [viaTeclado, setViaTeclado] = useState(false);

  // Sorteio, progresso salvo e preferência só existem no navegador: a página é estática.
  useEffect(() => {
    const saved = loadState(formato);
    const usable = saved && saved.questionIds.every(id => byId.has(id)) ? saved : null;
    const s = usable ?? freshState(formato, pool);
    saveState(s);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- estado só existe no navegador (sessionStorage + sorteio); inicializar na renderização quebraria a hidratação
    setState(s);
    setAuto(lerPreferencia());
  }, [formato, pool, byId]);

  const commit = useCallback((next: QuizState) => {
    if (isDone(next)) {
      const v = computeVector(next.questionIds.map(id => byId.get(id)!), next.answers);
      clearState(formato);
      router.push(`/resultado?${vectorToParams(v)}`);
      return;
    }
    saveState(next);
    setState(next);
    setEntenda(false);
  }, [byId, formato, router]);

  const choose = useCallback((i: AnswerIndex, teclado = false) => {
    if (!state) return;
    setViaTeclado(teclado);
    const marcado = select(state, i);
    commit(auto ? advance(marcado) : marcado);
  }, [state, auto, commit]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!state || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 5) choose((n - 1) as AnswerIndex, true);
      else if (e.key === 'Enter') { setViaTeclado(true); commit(advance(state)); }
      else if (e.key === 'Backspace' && state.index > 0) { setViaTeclado(true); commit(back(state)); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, choose, commit]);

  if (!state) return <p className="py-20 text-center text-mute">Preparando as perguntas…</p>;

  const total = state.questionIds.length;
  const q = byId.get(state.questionIds[Math.min(state.index, total - 1)])!;
  const eixo = axisById.get(q.axis);
  const labels = q.kind === 'forced' ? FORCADA : LIKERT;
  const atual = state.answers[q.id];
  const respondidas = Object.keys(state.answers).filter(id => state.questionIds.includes(id)).length;
  const pct = Math.round((respondidas / total) * 100);

  function alternarAuto() {
    const novo = !auto;
    setAuto(novo);
    try { localStorage.setItem(PREF_AUTO, String(novo)); } catch { /* sem storage: vale só nesta visita */ }
  }

  function reiniciar() {
    clearState(formato);
    setViaTeclado(false);
    commit(freshState(formato, pool));
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between text-sm text-mute">
        <span>Pergunta <strong className="text-ink">{Math.min(state.index + 1, total)} de {total}</strong></span>
        <span className="flex items-center gap-4">
          <span>{pct}% concluído</span>
          <button type="button" onClick={reiniciar} className="press inline-flex items-center gap-1 hover:text-ink">
            <RotateCcw aria-hidden size={13} /> Reiniciar
          </button>
        </span>
      </div>
      <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-track" aria-hidden>
        <div className="h-full origin-left bg-gradient-to-r from-brand to-rose transition-transform duration-300 ease-[var(--ease-out)]" style={{ transform: `scaleX(${respondidas / total})` }} />
      </div>

      <div className="mt-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 text-sm">
          <MiniRosa axis={q.axis} />
          <span className="font-semibold text-brand">{eixo?.name ?? q.axis}</span>
          <button
            type="button"
            onClick={() => setEntenda(v => !v)}
            aria-expanded={entenda}
            className="press inline-flex items-center gap-1 text-mute underline decoration-line underline-offset-4 hover:text-ink"
          >
            <CircleHelp aria-hidden size={14} /> Entenda
          </button>
        </div>
        {entenda && eixo && (
          <p className="question-in mt-3 max-w-lg text-sm text-mute">
            Esta pergunta mede onde você fica entre <strong className="text-brand">{eixo.poleA}</strong> e{' '}
            <strong className="text-rose">{eixo.poleB}</strong>. Não existe resposta certa: responda pelo que você pensa de verdade.
          </p>
        )}

        <div key={q.id} className={`mt-6 w-full ${viaTeclado ? '' : 'question-in'}`}>
          {q.kind === 'forced' ? (
            <div>
              <p className="mb-4 text-mute">Qual frase combina mais com você?</p>
              <div className="grid gap-3 text-left sm:grid-cols-2">
                <p className="rounded-xl border-t-4 border-t-brand bg-card p-5 font-display text-2xl">{q.textLeft}</p>
                <p className="rounded-xl border-t-4 border-t-rose bg-card p-5 font-display text-2xl">{q.textRight}</p>
              </div>
            </div>
          ) : (
            <p className="mx-auto max-w-2xl font-display text-4xl leading-tight sm:text-5xl">{q.text}</p>
          )}

          <div className="mt-10 flex items-center justify-center gap-3 sm:gap-6">
            <span className="hidden w-24 text-right text-sm font-semibold text-brand sm:block">{q.kind === 'forced' ? 'Esquerda' : 'Concordo'}</span>
            {labels.map((label, i) => {
              const marcada = atual === i;
              const cor = CORES[i];
              return (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  aria-pressed={marcada}
                  title={label}
                  onClick={() => choose(i as AnswerIndex)}
                  className="press flex flex-none items-center justify-center rounded-full border-[3px] hover:scale-105"
                  style={{
                    width: TAMANHOS[i], height: TAMANHOS[i], borderColor: cor,
                    background: marcada ? cor : `color-mix(in srgb, ${cor} 8%, transparent)`,
                  }}
                >
                  <span className="sr-only">{i + 1}</span>
                </button>
              );
            })}
            <span className="hidden w-24 text-left text-sm font-semibold text-rose sm:block">{q.kind === 'forced' ? 'Direita' : 'Discordo'}</span>
          </div>
          <div className="mt-3 flex justify-between px-2 text-xs font-semibold sm:hidden">
            <span className="text-brand">{q.kind === 'forced' ? 'Esquerda' : 'Concordo'}</span>
            <span className="text-rose">{q.kind === 'forced' ? 'Direita' : 'Discordo'}</span>
          </div>
          <p className="mt-4 h-5 text-sm text-mute" aria-live="polite">{atual !== undefined ? labels[atual] : ''}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-sm">
        <button
          type="button"
          onClick={() => { setViaTeclado(false); commit(back(state)); }}
          disabled={state.index === 0}
          className="press inline-flex items-center gap-1.5 font-semibold text-mute hover:text-ink disabled:opacity-40"
        >
          <ArrowLeft aria-hidden size={16} /> Voltar
        </button>
        <span className="flex items-center gap-2 text-mute">
          <button
            type="button"
            role="switch"
            aria-checked={auto}
            aria-label="Avançar ao responder"
            onClick={alternarAuto}
            className={`relative h-6 w-11 flex-none rounded-full transition-colors duration-200 ${auto ? 'bg-brand' : 'bg-track'}`}
          >
            <span className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-[var(--ease-out)] ${auto ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
          <span aria-hidden>Avançar ao responder</span>
        </span>
        <span className="flex items-center gap-4">
          {canSwap(state, pool) && (
            <button
              type="button"
              onClick={() => { setViaTeclado(false); commit(swap(state, pool)); }}
              className="press inline-flex items-center gap-1.5 font-semibold text-mute hover:text-ink"
            >
              <Shuffle aria-hidden size={15} /> Trocar
            </button>
          )}
          <button
            type="button"
            onClick={() => { setViaTeclado(false); commit(advance(state)); }}
            disabled={atual === undefined}
            className="press rounded-full bg-brand px-5 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            Avançar
          </button>
        </span>
      </div>
      <p className="mt-4 hidden text-center text-xs text-mute sm:block">Atalhos: teclas 1 a 5 respondem, Enter avança, Backspace volta.</p>
    </div>
  );
}

// A rosa em miniatura com o eixo da pergunta em destaque: mostra em que parte do mapa a pergunta está.
function MiniRosa({ axis }: { axis: AxisId }) {
  return (
    <svg viewBox="-12 -12 24 24" width="28" height="28" aria-hidden>
      <circle r="11" fill="none" stroke="var(--gold)" strokeOpacity="0.6" strokeWidth="0.8" />
      {rosaRaios(10).map(r => {
        const ativo = r.axis === axis;
        return (
          <g key={r.axis}>
            <line x1={r.a.x} y1={r.a.y} x2={0} y2={0} stroke={ativo ? 'var(--brand)' : 'var(--gold)'} strokeOpacity={ativo ? 1 : 0.35} strokeWidth={ativo ? 2 : 0.7} strokeLinecap="round" />
            <line x1={0} y1={0} x2={r.b.x} y2={r.b.y} stroke={ativo ? 'var(--rose)' : 'var(--gold)'} strokeOpacity={ativo ? 1 : 0.35} strokeWidth={ativo ? 2 : 0.7} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}
