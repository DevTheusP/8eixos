'use client';

import {
  ArrowLeft, ArrowRight, Check, CircleHelp, Equal, Minus, RotateCcw, Shuffle, X, type LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { AXIS_ICONS } from '@/lib/icons';
import {
  advance, back, canSwap, clearState, isDone, loadState, loadVistas, registrarVistas, saveState, select, swap, type QuizState,
} from '@/lib/quiz-state';
import { computeVector } from '@/lib/scoring';
import { selectQuestions, type Formato } from '@/lib/selection';
import type { AnswerIndex, Axis, AxisId, Question } from '@/lib/types';
import { SobrePergunta } from './SobrePergunta';
import { track } from '@/lib/track';
import { vectorToParams } from '@/lib/url';

type Opcao = { label: string; Icone: LucideIcon; cor: string; forca: 0 | 1 | 2 };

// Concordar em verde-água, discordar em rosa, neutro em lilás; nas de "esquerda × direita", azul e dourado.
const LIKERT: Opcao[] = [
  { label: 'Concordo totalmente', Icone: Check, cor: '#5ef2c0', forca: 2 },
  { label: 'Concordo', Icone: Check, cor: '#5ef2c0', forca: 1 },
  { label: 'Neutro', Icone: Minus, cor: '#b9b2e6', forca: 0 },
  { label: 'Discordo', Icone: X, cor: '#ff8fb1', forca: 1 },
  { label: 'Discordo totalmente', Icone: X, cor: '#ff8fb1', forca: 2 },
];
const FORCADA: Opcao[] = [
  { label: 'Muito mais a da esquerda', Icone: ArrowLeft, cor: '#8fb3ff', forca: 2 },
  { label: 'Mais a da esquerda', Icone: ArrowLeft, cor: '#8fb3ff', forca: 1 },
  { label: 'Igual', Icone: Equal, cor: '#b9b2e6', forca: 0 },
  { label: 'Mais a da direita', Icone: ArrowRight, cor: '#ffd98a', forca: 1 },
  { label: 'Muito mais a da direita', Icone: ArrowRight, cor: '#ffd98a', forca: 2 },
];
const PREF_AUTO = 'quiz:avancar-ao-responder';

function freshState(formato: Formato, pool: Question[]): QuizState {
  return { formato, questionIds: selectQuestions(pool, formato, Math.random, loadVistas()).map(q => q.id), answers: {}, index: 0 };
}

function lerPreferencia(): boolean {
  try {
    return localStorage.getItem(PREF_AUTO) !== 'false';
  } catch {
    return true;
  }
}

export function QuizRunner({ formato, pool, axes = [], exemplos }: {
  formato: Formato; pool: Question[]; axes?: Axis[]; exemplos?: Partial<Record<AxisId, { A: string[]; B: string[] }>>;
}) {
  const router = useRouter();
  const byId = useMemo(() => new Map(pool.map(q => [q.id, q])), [pool]);
  const axisById = useMemo(() => new Map(axes.map(a => [a.id, a])), [axes]);
  const [state, setState] = useState<QuizState | null>(null);
  const [auto, setAuto] = useState(true);
  const [entenda, setEntenda] = useState(false);
  const fecharEntenda = useCallback(() => setEntenda(false), []);
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
      registrarVistas([...next.questionIds, ...(next.skipped ?? [])]);
      clearState(formato);
      track('quiz_fim', { formato });
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
    if (Object.keys(state.answers).length === 0) track('quiz_inicio', { formato });
    const marcado = select(state, i);
    commit(auto ? advance(marcado) : marcado);
  }, [state, auto, commit, formato]);

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
  const IconeEixo = AXIS_ICONS[q.axis];
  const opcoes = q.kind === 'forced' ? FORCADA : LIKERT;
  const atual = state.answers[q.id];
  const respondidas = Object.keys(state.answers).filter(id => state.questionIds.includes(id)).length;
  const pct = Math.round((respondidas / total) * 100);
  const segmentos = Math.max(8, Math.min(30, Math.ceil(total / 4)));
  const porSegmento = total / segmentos;

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
      <div className="mb-3 flex items-center justify-between text-sm text-mute">
        <span>Pergunta <strong className="text-ink">{Math.min(state.index + 1, total)} de {total}</strong></span>
        <span className="flex items-center gap-3">
          <span>{pct}% concluído</span>
          <button type="button" onClick={reiniciar} className="press inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-tile">
            <RotateCcw aria-hidden size={13} /> Recomeçar
          </button>
        </span>
      </div>
      <div className="mb-6 flex gap-1" aria-hidden>
        {Array.from({ length: segmentos }, (_, k) => {
          const cheio = Math.max(0, Math.min(1, respondidas / porSegmento - k));
          return (
            <span key={k} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <span className="block h-full origin-left rounded-full bg-brand transition-transform duration-300 ease-[var(--ease-out)]" style={{ transform: `scaleX(${cheio})` }} />
            </span>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-line border-t-4 border-t-brand bg-card p-5 shadow-[0_18px_40px_-28px_rgb(34_24_15/0.45)] sm:p-7">

        <div className="relative mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft py-1 pl-1 pr-3 text-sm font-semibold text-brand">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-strong text-white"><IconeEixo aria-hidden size={13} /></span>
            {eixo?.name ?? q.axis}
          </span>
          <button
            type="button"
            onClick={() => setEntenda(true)}
            aria-haspopup="dialog"
            className="press inline-flex items-center gap-1.5 rounded-full bg-tile px-3 py-1 text-xs font-semibold text-mute hover:text-ink"
          >
            <CircleHelp aria-hidden size={14} /> O que isso mede?
          </button>
        </div>
        {entenda && eixo && <SobrePergunta q={q} eixo={eixo} exemplos={exemplos?.[eixo.id]} onClose={fecharEntenda} />}

        <div key={q.id} className={`relative ${viaTeclado ? '' : 'question-in'}`}>
          {q.kind === 'forced' ? (
            <div>
              <p className="mb-3 text-sm font-semibold text-mute">Qual frase combina mais com você?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <p className="rounded-2xl border-l-4 border-l-brand bg-tile p-4 font-display text-lg font-semibold">{q.textLeft}</p>
                <p className="rounded-2xl border-l-4 border-l-mint bg-tile p-4 font-display text-lg font-semibold">{q.textRight}</p>
              </div>
            </div>
          ) : (
            <p className="max-w-[85%] font-display text-2xl font-semibold leading-snug sm:text-3xl">{q.text}</p>
          )}

          <div className="mt-6 grid gap-2">
            {opcoes.map(({ label, Icone, cor, forca }, i) => {
              const marcada = atual === i;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={marcada}
                  aria-label={label}
                  onClick={() => choose(i as AnswerIndex)}
                  className="opcao press group flex items-center gap-4 rounded-2xl border px-4 py-3.5 text-left"
                  style={{
                    '--cor': cor,
                    borderColor: marcada ? cor : 'var(--line)',
                    background: marcada ? `color-mix(in srgb, ${cor} 16%, rgb(18 22 58 / 0.7))` : 'rgb(18 22 58 / 0.55)',
                    boxShadow: marcada ? `0 0 0 1px ${cor}, 0 12px 30px -16px ${cor}` : undefined,
                  } as CSSProperties}
                >
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-colors"
                    style={forca === 2 || marcada ? { background: cor, color: '#0b0d26' } : { background: `color-mix(in srgb, ${cor} 18%, transparent)`, color: cor }}
                  >
                    <Icone aria-hidden size={17} strokeWidth={2.8} />
                  </span>
                  <span className="flex-1 font-display text-sm font-medium tracking-tight sm:text-base" style={marcada ? { color: cor } : undefined}>{label}</span>
                  <span aria-hidden className="flex gap-1">
                    {[1, 2].map(n => (
                      <span key={n} className="h-1.5 w-3 rounded-full" style={{ background: n <= forca ? cor : 'var(--track)', opacity: n <= forca ? 1 : 0.6 }} />
                    ))}
                  </span>
                  <kbd aria-hidden className="hidden h-6 min-w-6 items-center justify-center rounded-md border border-line bg-tile px-1.5 text-xs text-mute sm:flex">{i + 1}</kbd>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => { setViaTeclado(false); commit(back(state)); }}
          disabled={state.index === 0}
          className="press inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          <ArrowLeft aria-hidden size={16} /> Voltar
        </button>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-mute">
          <button
            type="button"
            role="switch"
            aria-checked={auto}
            aria-label="Passar sozinho ao responder"
            onClick={alternarAuto}
            className={`relative h-6 w-11 flex-none rounded-full transition-colors duration-200 ${auto ? 'bg-deep' : 'bg-track'}`}
          >
            <span className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-[var(--ease-out)] ${auto ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
          <span aria-hidden>Passar sozinho ao responder</span>
        </label>
        <div className="flex gap-2">
          {canSwap(state, pool) && (
            <button
              type="button"
              onClick={() => { setViaTeclado(false); commit(swap(state, pool)); }}
              className="press inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold"
            >
              <Shuffle aria-hidden size={16} /> Outra pergunta
            </button>
          )}
          <button
            type="button"
            onClick={() => { setViaTeclado(false); commit(advance(state)); }}
            disabled={atual === undefined}
            className="press group inline-flex items-center gap-2 rounded-xl bg-deep px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Avançar <ArrowRight aria-hidden size={16} className="nudge" />
          </button>
        </div>
      </div>
      <p className="mt-4 hidden text-center text-xs text-mute sm:block">Atalhos: teclas 1 a 5 respondem, Enter avança, Backspace volta.</p>
    </div>
  );
}

