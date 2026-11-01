'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { answer, back, clearState, isDone, loadState, saveState, type QuizState } from '@/lib/quiz-state';
import { computeVector } from '@/lib/scoring';
import { selectQuestions, type Formato } from '@/lib/selection';
import type { AnswerIndex, Question } from '@/lib/types';
import { vectorToParams } from '@/lib/url';

const LIKERT = ['Concordo totalmente', 'Concordo', 'Neutro', 'Discordo', 'Discordo totalmente'];
const FORCADA = ['Muito mais a da esquerda', 'Mais a da esquerda', 'Igual', 'Mais a da direita', 'Muito mais a da direita'];

function freshState(formato: Formato, pool: Question[]): QuizState {
  return { formato, questionIds: selectQuestions(pool, formato).map(q => q.id), answers: {}, index: 0 };
}

export function QuizRunner({ formato, pool }: { formato: Formato; pool: Question[] }) {
  const router = useRouter();
  const byId = useMemo(() => new Map(pool.map(q => [q.id, q])), [pool]);
  const [state, setState] = useState<QuizState | null>(null);

  // Sorteio e leitura do progresso só no navegador: a página é estática e não pode depender de Math.random no servidor.
  useEffect(() => {
    const saved = loadState(formato);
    const usable = saved && saved.questionIds.every(id => byId.has(id)) ? saved : null;
    const s = usable ?? freshState(formato, pool);
    saveState(s);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- estado só existe no navegador (sessionStorage + sorteio); inicializar na renderização quebraria a hidratação
    setState(s);
  }, [formato, pool, byId]);

  if (!state) return <p className="py-20 text-center text-mute">Preparando as perguntas…</p>;

  const total = state.questionIds.length;
  const q = byId.get(state.questionIds[Math.min(state.index, total - 1)])!;

  function choose(i: AnswerIndex) {
    const next = answer(state!, i);
    if (isDone(next)) {
      const v = computeVector(next.questionIds.map(id => byId.get(id)!), next.answers);
      clearState(formato);
      router.push(`/resultado?${vectorToParams(v)}`);
      return;
    }
    saveState(next);
    setState(next);
  }

  function goBack() {
    const prev = back(state!);
    saveState(prev);
    setState(prev);
  }

  const labels = q.kind === 'forced' ? FORCADA : LIKERT;
  const atual = state.answers[q.id];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-mute">
          <span>{Math.min(state.index + 1, total)} de {total}</span>
          <button type="button" onClick={goBack} disabled={state.index === 0} className="disabled:opacity-30">← Voltar</button>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-line">
          <div className="h-1.5 rounded-full bg-navy transition-all" style={{ width: `${(state.index / total) * 100}%` }} />
        </div>
      </div>

      {q.kind === 'forced' ? (
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-mute">Qual frase combina mais com você?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <p className="rounded-2xl border border-line bg-card p-5 font-display text-xl font-semibold">{q.textLeft}</p>
            <p className="rounded-2xl border border-line bg-card p-5 font-display text-xl font-semibold">{q.textRight}</p>
          </div>
        </div>
      ) : (
        <p className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{q.text}</p>
      )}

      <div className="mt-8 grid gap-2">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => choose(i as AnswerIndex)}
            className={`rounded-xl border px-4 py-3 text-left font-medium transition hover:border-navy ${atual === i ? 'border-navy bg-soft' : 'border-line bg-card'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
