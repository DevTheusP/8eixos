'use client';

import { History, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadLastResult, loadState, type QuizState } from '@/lib/quiz-state';
import { FORMATOS, type Formato } from '@/lib/selection';

// Quem volta pro site vê o quiz que deixou pela metade e o último resultado.
export function Continuar() {
  const [andamento, setAndamento] = useState<QuizState | null>(null);
  const [ultimo, setUltimo] = useState<string | null>(null);

  useEffect(() => {
    const emCurso = (Object.keys(FORMATOS) as Formato[]).map(f => loadState(f)).find(s => s && s.index > 0) ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dados só existem no navegador (localStorage)
    setAndamento(emCurso);
    setUltimo(loadLastResult());
  }, []);

  if (!andamento && !ultimo) return null;
  return (
    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 sm:flex-row sm:items-center">
      {andamento && (
        <Link href={`/quiz/${andamento.formato}`} className="press flex flex-1 items-center gap-3 rounded-xl bg-brand-soft px-4 py-3 text-brand">
          <Play aria-hidden size={18} />
          <span>
            <strong className="block">Continuar de onde parou</strong>
            <span className="text-sm">Versão {FORMATOS[andamento.formato].titulo.toLowerCase()}, pergunta {andamento.index + 1} de {andamento.questionIds.length}</span>
          </span>
        </Link>
      )}
      {ultimo && (
        <Link href={`/resultado?${ultimo}`} className="press flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-brand hover:bg-tile">
          <History aria-hidden size={18} /> Ver meu último resultado
        </Link>
      )}
    </div>
  );
}
