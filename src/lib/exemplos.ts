import { getVectors } from './data';
import type { Vector } from './types';

// Cards de exemplo da home. São imagens fixas e leves em public/exemplos, geradas por `npm run exemplos`:
// assim a home não espera o gerador de imagem. Rode o script de novo quando o card mudar.
export const EXEMPLOS_LEQUE = ['budismo', 'estoicismo', 'absurdismo'] as const;

// Alguém parecido com um estoico, mas não idêntico: a prévia da home mostra um resultado realista.
export function vetorPrevia(): Vector {
  const e = getVectors().schools['estoicismo'];
  return { ...e, eu: e.eu - 14, mundo: e.mundo + 10, verdade: e.verdade + 12 };
}

export const exemploSrc = (id: string) => `/exemplos/${id}.webp`;
