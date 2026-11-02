import type { CSSProperties } from 'react';
import type { Family } from './types';

// Cada família de escolas tem a sua cor: aplicada num bloco, troca a cor da marca de tudo que está dentro.
export function familyStyle(f: Family): CSSProperties & Record<'--brand' | '--brand-soft', string> {
  return { '--brand': f.color, '--brand-soft': f.soft };
}
