'use client';

import { useEffect } from 'react';
import { saveLastResult, type ResumoResultado } from '@/lib/quiz-state';

// Guarda este resultado como o último da pessoa, pra home oferecer "Ver meu último resultado".
export function LembrarResultado({ params, resumo }: { params: string; resumo?: ResumoResultado }) {
  const chave = JSON.stringify(resumo);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- o resumo é comparado pelo conteúdo (chave)
  useEffect(() => saveLastResult(params, resumo), [params, chave]);
  return null;
}
