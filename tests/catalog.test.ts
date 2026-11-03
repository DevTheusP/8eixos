import { existsSync } from 'node:fs';
import { axisCorrelations } from '@/lib/catalog-checks';
import { getBooks, getFamilies, getSchools, getThinkers, getVectors } from '@/lib/data';
import { rank } from '@/lib/matching';
import { seededRng } from '@/lib/selection';
import { AXIS_IDS, type Vector } from '@/lib/types';

test('catálogo completo e consistente', () => {
  const schools = getSchools();
  const thinkers = getThinkers();
  expect(schools).toHaveLength(24);
  expect(thinkers.length).toBeGreaterThanOrEqual(60);
  const vs = getVectors();
  const familias = new Set(getFamilies().map(f => f.id));
  const ids = new Set(thinkers.map(t => t.id));
  for (const s of schools) {
    expect(vs.schools[s.id]).toBeDefined();
    expect(familias.has(s.familyId)).toBe(true);
    for (const t of s.thinkerIds) expect(ids.has(t)).toBe(true);
  }
  for (const t of thinkers) {
    expect(vs.thinkers[t.id]).toBeDefined();
    if (t.schoolId) expect(schools.some(s => s.id === t.schoolId)).toBe(true);
    if (t.portrait) expect(existsSync(`public/retratos/${t.portrait.file}`)).toBe(true);
  }
  for (const b of getBooks()) expect(ids.has(b.thinkerId)).toBe(true);
});

test('eixos não redundantes no catálogo real', () => {
  const todos = [...Object.values(getVectors().schools), ...Object.values(getVectors().thinkers)];
  expect(axisCorrelations(todos).filter(c => Math.abs(c.r) > 0.7)).toEqual([]);
});

test('calibração no catálogo real de escolas', () => {
  const rng = seededRng(42);
  const catalogo = getVectors().schools;
  let acertos = 0;
  let total = 0;
  for (const [id, v] of Object.entries(catalogo)) for (let t = 0; t < 20; t++) {
    const ruidoso = Object.fromEntries(AXIS_IDS.map(a => [a, Math.min(100, Math.max(0, v[a] + (rng() - 0.5) * 30))])) as Vector;
    if (rank(ruidoso, catalogo).slice(0, 3).some(r => r.id === id)) acertos++;
    total++;
  }
  expect(acertos / total).toBeGreaterThanOrEqual(0.9);
});
