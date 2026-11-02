'use client';

import { useEffect } from 'react';
import { saveLastResult } from '@/lib/quiz-state';

// Guarda este resultado como o último da pessoa, pra home oferecer "Ver meu último resultado".
export function LembrarResultado({ params }: { params: string }) {
  useEffect(() => saveLastResult(params), [params]);
  return null;
}
