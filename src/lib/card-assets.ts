import * as lucide from 'lucide';
import type { LucideIcon } from 'lucide-react';
import { createElement, type ReactElement } from 'react';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Thinker } from './types';

// O gerador de imagem não lê webp: os cards usam a cópia JPG pequena de cada retrato (public/retratos/jpg).
export function retratoDataUri(t: Thinker): string | null {
  if (!t.portrait) return null;
  const arq = path.join(process.cwd(), 'public', 'retratos', 'jpg', t.portrait.file.replace(/\.webp$/, '.jpg'));
  if (!existsSync(arq)) return null;
  return `data:image/jpeg;base64,${readFileSync(arq).toString('base64')}`;
}

// Ícones no card: o gerador de imagem não roda componentes com hooks, então desenho os traços do ícone (pacote `lucide`).

type No = [string, Record<string, string>];

export function iconeSvg(Comp: LucideIcon, cor: string, tamanho: number): ReactElement | null {
  const nome = (Comp as { displayName?: string }).displayName ?? '';
  const nos = (lucide as unknown as Record<string, No[] | undefined>)[nome];
  if (!nos) return null;
  return createElement(
    'svg',
    { width: tamanho, height: tamanho, viewBox: '0 0 24 24', fill: 'none', stroke: cor, strokeWidth: 2.3, strokeLinecap: 'round', strokeLinejoin: 'round' },
    ...nos.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })),
  );
}
