// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { Escolas } from '@/components/result/Escolas';
import { Hero } from '@/components/result/Hero';
import { Tracos } from '@/components/result/Tracos';
import { getFamilies, getSchools, getVectors } from '@/lib/data';
import { tracosFortes } from '@/lib/labels';
import { buildResult } from '@/lib/result';
import { AXIS_IDS, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;

test('traços fortes: os eixos mais decididos primeiro, sem os equilibrados', () => {
  const t = tracosFortes({ ...neutro, controle: 20, guia: 95, eu: 58, verdade: 70 }, 3);
  expect(t.map(x => x.axis.id)).toEqual(['guia', 'controle', 'verdade']);
  expect(t[0]).toMatchObject({ pole: 'B', nome: 'Emoção', percent: 95, label: 'Muito forte' });
  expect(t[0].desc).toBe(t[0].axis.descB);
  expect(t[1].desc).toBe(t[1].axis.descA);
  expect(tracosFortes(neutro, 3)).toEqual([]);
});

test('seção de traços mostra a frase de cada polo forte', () => {
  const v = { ...neutro, controle: 15 };
  render(<Tracos vector={v} />);
  const [t] = tracosFortes(v, 3);
  expect(screen.getByText(t.desc.charAt(0).toUpperCase() + t.desc.slice(1))).toBeTruthy();
  expect(screen.getByText('Aceitar')).toBeTruthy();
});

test('topo do resultado mostra a prévia do card de story com os parâmetros do resultado', () => {
  const r = buildResult(getVectors().schools['estoicismo']);
  const { container } = render(<Hero result={r} params="c=10&b=20" />);
  const img = container.querySelector('img[data-card-previa]') as HTMLImageElement;
  expect(img.getAttribute('src')).toBe('/api/card?c=10&b=20');
  expect(screen.getAllByText(r.thinker.thinker.name, { exact: false }).length).toBeGreaterThan(0);
});

test('escolas próximas mostram a família de cada uma na cor dela', () => {
  const r = buildResult(getVectors().schools['estoicismo']);
  const { container } = render(<Escolas result={r} />);
  const familias = new Map(getFamilies().map(f => [f.id, f]));
  const escolas = new Map(getSchools().map(s => [s.id, s]));
  for (const { school } of r.otherSchools) {
    const card = container.querySelector(`[data-escola="${school.id}"]`) as HTMLElement;
    const familia = familias.get(escolas.get(school.id)!.familyId)!;
    expect(card.textContent).toContain(familia.name);
    expect(card.style.getPropertyValue('--brand-strong')).toBe(familia.color);
  }
});

test('cartões das famílias na home usam a cor da família no escuro, sem o fundo claro antigo', async () => {
  const { Familias } = await import('@/components/HomeExtras');
  const { container } = render(<Familias />);
  for (const f of getFamilies()) {
    const card = container.querySelector(`[data-familia="${f.id}"]`) as HTMLElement;
    expect(card.style.getPropertyValue('--brand-strong')).toBe(f.color);
    expect(card.style.background).not.toContain(f.soft);
  }
});

test('distinção explica em frase completa o que é incomum e o que é comum', async () => {
  const { textoIncomum, textoComum } = await import('@/components/result/Distincao');
  expect(textoIncomum('mundo', 'B', 94)).toBe('No eixo Mundo, você puxa mais para hostil do que 94% das escolas.');
  expect(textoComum('guia', true)).toBe('No eixo Guia, você fica no meio, entre razão e emoção, como a maioria das escolas.');
  expect(textoComum('guia', false, 'A')).toBe('No eixo Guia, você puxa para razão na mesma medida que a maioria das escolas.');
});

test('como você lida mostra os quatro temas da escola', async () => {
  const { Lida } = await import('@/components/result/Lida');
  const s = getSchools()[0];
  render(<Lida school={s} />);
  for (const t of ['Sofrimento', 'Morte', 'Felicidade', 'Relações']) expect(screen.getByText(t)).toBeTruthy();
  expect(screen.getByText(s.lida.relacoes)).toBeTruthy();
});

test('cada eixo diz o que a posição significa', async () => {
  const { Eixos } = await import('@/components/result/Eixos');
  const { getAxes } = await import('@/lib/data');
  const controle = getAxes().find(a => a.id === 'controle')!;
  const { container } = render(<Eixos vector={{ ...neutro, controle: 15 }} />);
  const desc = controle.descA.charAt(0).toUpperCase() + controle.descA.slice(1);
  expect(container.querySelector('[data-axis="controle"]')!.textContent).toContain(desc);
  expect(container.querySelector('[data-axis="guia"]')!.textContent).toContain('Você fica no meio');
});
