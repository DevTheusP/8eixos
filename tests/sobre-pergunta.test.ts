import { escolasPorPolo } from '@/lib/exemplos-eixo';
import { getSchools, getVectors } from '@/lib/data';

test('exemplos de cada lado do eixo: as escolas que mais puxam pra lá', () => {
  const ex = escolasPorPolo(2);
  const vs = getVectors().schools;
  const nome = new Map(getSchools().map(s => [s.name, s.id]));
  expect(ex.controle.A).toHaveLength(2);
  for (const n of ex.controle.A) expect(vs[nome.get(n)!].controle).toBeLessThan(40);
  for (const n of ex.controle.B) expect(vs[nome.get(n)!].controle).toBeGreaterThan(60);
  // A primeira é a mais extrema do lado.
  const maisA = Object.entries(vs).sort((a, b) => a[1].controle - b[1].controle)[0][0];
  expect(nome.get(ex.controle.A[0])).toBe(maisA);
});
