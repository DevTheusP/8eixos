// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { Eixos } from '@/components/result/Eixos';
import { POLE_ICONS } from '@/lib/icons';
import { AXIS_IDS, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;

test('todo polo dos 8 eixos tem ícone', () => {
  for (const a of AXIS_IDS) {
    expect(POLE_ICONS[a].A).toBeTruthy();
    expect(POLE_ICONS[a].B).toBeTruthy();
  }
});

test('polo dominante vira etiqueta destacada; equilibrado não destaca nada', () => {
  const { container } = render(<Eixos vector={{ ...neutro, controle: 20, guia: 85 }} />);
  const dominantes = [...container.querySelectorAll('[data-dominant="true"]')].map(e => e.textContent);
  expect(dominantes).toEqual(['Aceitar', 'Emoção']);
  expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(16);
});

test('trilho animado começa no centro e vai até o valor', () => {
  const { container } = render(<Eixos vector={{ ...neutro, controle: 20 }} />);
  const slider = container.querySelector('[data-axis="controle"] [data-knob-track]') as HTMLElement;
  expect(slider.style.getPropertyValue('--to')).toBe('20%');
});

test('índice marca a primeira seção visível na ordem da página', async () => {
  const { secaoAtiva } = await import('@/components/result/Atalhos');
  const itens = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }];
  expect(secaoAtiva(itens, new Map([['c', true], ['b', true], ['a', false]]))).toBe('b');
  expect(secaoAtiva(itens, new Map([['a', false]]))).toBeUndefined();
});
