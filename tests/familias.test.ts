import { getFamilies, getSchools } from '@/lib/data';
import { familyStyle } from '@/lib/family-theme';
import { buildResult } from '@/lib/result';
import { getVectors } from '@/lib/data';

test('toda família tem cor-base e versão pastel', () => {
  for (const f of getFamilies()) {
    expect(f.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(f.soft).toMatch(/^#[0-9a-f]{6}$/i);
  }
  expect(new Set(getFamilies().map(f => f.color)).size).toBe(getFamilies().length);
});

test('o estilo da família troca as cores da marca na página', () => {
  const virtude = getFamilies().find(f => f.id === 'virtude')!;
  expect(familyStyle(virtude)).toEqual({ '--brand': virtude.color, '--brand-soft': virtude.soft });
});

test('resultado estoico vem com a cor da família da virtude', () => {
  const r = buildResult(getVectors().schools['estoicismo']);
  expect(r.school.family.color).toBe(getFamilies().find(f => f.id === 'virtude')!.color);
  expect(getSchools().every(s => getFamilies().some(f => f.id === s.familyId))).toBe(true);
});
