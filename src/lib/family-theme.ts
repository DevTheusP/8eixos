import type { CSSProperties } from 'react';
import type { Family } from './types';

// Cada família de escolas tem a sua cor: aplicada num bloco, troca a cor da marca de tudo que está dentro.
// No céu escuro, a cor pura vai nos blocos cheios (--brand-strong) e uma versão clareada vai em texto e destaques.
export function familyStyle(f: Family): CSSProperties & Record<'--brand' | '--brand-soft' | '--brand-strong', string> {
  return {
    '--brand-strong': f.color,
    '--brand': `color-mix(in srgb, ${f.color} 62%, white)`,
    '--brand-soft': `color-mix(in srgb, ${f.color} 30%, transparent)`,
  };
}
