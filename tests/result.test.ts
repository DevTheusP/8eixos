import { getVectors } from '@/lib/data';
import { buildResult } from '@/lib/result';
import { AXIS_IDS, type Vector } from '@/lib/types';

test('buildResult com catálogo real', () => {
  const r = buildResult(getVectors().schools['estoicismo']);
  expect(r.school.school.id).toBe('estoicismo');
  expect(r.school.family.id).toBe('virtude');
  expect(r.otherSchools).toHaveLength(3);
  expect(r.otherSchools.map(s => s.school.id)).not.toContain('estoicismo');
  expect(r.opposite.id).not.toBe('estoicismo');
  expect(r.byDimension).toHaveLength(3);
  expect(r.byDimension.map(d => d.thinker.id)).not.toContain(r.thinker.thinker.id);
  expect(r.farthestThinkers).toHaveLength(3);
});
test('buildResult com tudo neutro não quebra', () => {
  const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;
  const r = buildResult(neutro);
  expect(Number.isFinite(r.school.score)).toBe(true);
  expect(r.unusual).toBeNull();
});
