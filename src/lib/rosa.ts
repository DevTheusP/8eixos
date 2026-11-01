import { AXIS_IDS, type AxisId, type Vector } from './types';

export type Ponto = { x: number; y: number };

// Cada eixo é um diâmetro da rosa: 8 eixos espalhados em 180°, polo A de um lado e polo B do lado oposto.
// Ângulo 0 aponta pro topo e cresce no sentido horário.
function direcao(i: number): Ponto {
  const ang = (i * Math.PI) / AXIS_IDS.length;
  return { x: Math.sin(ang), y: -Math.cos(ang) };
}

export function rosaRaios(R: number): { axis: AxisId; a: Ponto; b: Ponto }[] {
  return AXIS_IDS.map((axis, i) => {
    const d = direcao(i);
    return { axis, a: { x: d.x * R, y: d.y * R }, b: { x: -d.x * R, y: -d.y * R } };
  });
}

const MIN = 0.12; // fração do raio pra forma nunca sumir no centro, mesmo com tudo equilibrado

export function rosaPontos(v: Vector, R: number): (Ponto & { axis: AxisId })[] {
  return AXIS_IDS.map((axis, i) => {
    const t = (v[axis] - 50) / 50; // -1 = polo A, +1 = polo B
    const r = (MIN + Math.abs(t) * (1 - MIN)) * R;
    const sinal = t > 0 ? -1 : 1;
    const d = direcao(i);
    return { axis, x: d.x * r * sinal, y: d.y * r * sinal };
  }).sort((p, q) => angulo(p) - angulo(q));
}

function angulo(p: Ponto): number {
  return (Math.atan2(p.x, -p.y) + 2 * Math.PI) % (2 * Math.PI);
}
