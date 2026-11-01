import { rosaPontos, rosaRaios } from '@/lib/rosa';
import { AXIS_IDS, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;
const R = 100;
const perto = (a: number, b: number) => Math.abs(a - b) < 1e-6;

test('16 pontas: cada eixo é um diâmetro, polo A e polo B opostos', () => {
  const raios = rosaRaios(R);
  expect(raios).toHaveLength(8);
  expect(perto(raios[0].a.x, 0) && perto(raios[0].a.y, -R)).toBe(true); // primeiro eixo, polo A no topo
  expect(perto(raios[0].b.x, 0) && perto(raios[0].b.y, R)).toBe(true);
});

test('valor 0 vai até a ponta do polo A; 100 até a ponta do polo B', () => {
  const pa = rosaPontos({ ...neutro, controle: 0 }, R).find(p => p.axis === 'controle')!;
  expect(perto(pa.x, 0) && perto(pa.y, -R)).toBe(true);
  const pb = rosaPontos({ ...neutro, controle: 100 }, R).find(p => p.axis === 'controle')!;
  expect(perto(pb.x, 0) && perto(pb.y, R)).toBe(true);
});

test('8 pontos em ordem de ângulo, nunca colados no centro', () => {
  const pts = rosaPontos(neutro, R);
  expect(pts).toHaveLength(8);
  for (const p of pts) expect(Math.hypot(p.x, p.y)).toBeGreaterThan(0.1 * R);
  const ang = pts.map(p => (Math.atan2(p.x, -p.y) + 2 * Math.PI) % (2 * Math.PI));
  expect([...ang].sort((a, b) => a - b)).toEqual(ang);
});
