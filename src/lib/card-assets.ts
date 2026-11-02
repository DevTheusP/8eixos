import * as lucide from 'lucide';
import type { LucideIcon } from 'lucide-react';
import { createElement, type ReactElement } from 'react';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { AxisId, Thinker } from './types';

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

// Fontes do site em TTF estático (o gerador não lê woff2). Lidas uma vez por instância.
type Fonte = { name: string; data: Buffer; weight: 400 | 600 | 700 | 800; style: 'normal' };
let fontes: Fonte[] | null = null;
export function cardFonts(): Fonte[] {
  if (fontes) return fontes;
  const ler = (arq: string) => readFileSync(path.join(process.cwd(), 'assets', 'fonts', arq));
  fontes = [
    { name: 'Inter', data: ler('Inter-Regular.ttf'), weight: 400, style: 'normal' },
    { name: 'Inter', data: ler('Inter-SemiBold.ttf'), weight: 600, style: 'normal' },
    { name: 'Inter', data: ler('Inter-Bold.ttf'), weight: 700, style: 'normal' },
    { name: 'Bricolage', data: ler('BricolageGrotesque-Bold.ttf'), weight: 700, style: 'normal' },
    { name: 'Bricolage', data: ler('BricolageGrotesque-ExtraBold.ttf'), weight: 800, style: 'normal' },
  ];
  return fontes;
}

// Uma cor por eixo, clara o bastante pra ler sobre o fundo escuro do card.
export const CORES_EIXO: Record<AxisId, string> = {
  controle: '#8fb3ff',
  bemviver: '#f6c76e',
  sentido: '#ff9f6b',
  mundo: '#7fdba6',
  eu: '#c9a8ff',
  rotina: '#6fd3f0',
  guia: '#ff8fb1',
  verdade: '#e6e1c8',
};

// Mistura a cor com preto: t = 0 mantém, t = 1 vira preto.
export function escurecer(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const canal = (s: number) => Math.round(((n >> s) & 255) * (1 - t)).toString(16).padStart(2, '0');
  return `#${canal(16)}${canal(8)}${canal(0)}`;
}
