import { getAxes, getFamilies } from '@/lib/data';

test('8 eixos na ordem e com params únicos', () => {
  const axes = getAxes();
  expect(axes.map(a => a.id)).toEqual(['controle', 'bemviver', 'sentido', 'mundo', 'eu', 'rotina', 'guia', 'verdade']);
  expect(new Set(axes.map(a => a.param)).size).toBe(8);
  expect(axes.find(a => a.id === 'mundo')).toMatchObject({ poleA: 'Bom', poleB: 'Hostil' });
});

test('famílias da v1', () => {
  expect(getFamilies().map(f => f.id)).toEqual(['virtude', 'oriente', 'sentido', 'prazer', 'duvida', 'cristas']);
});

test('cada polo tem uma descrição curta', () => {
  for (const a of getAxes()) {
    expect(a.descA.length).toBeGreaterThan(20);
    expect(a.descB.length).toBeGreaterThan(20);
  }
});
