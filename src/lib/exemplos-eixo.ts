import { getSchools, getVectors } from './data';
import { AXIS_IDS, type AxisId } from './types';

// Para explicar uma pergunta: as escolas que mais puxam para cada lado de cada eixo (só as que pendem de verdade).
export function escolasPorPolo(n = 2): Record<AxisId, { A: string[]; B: string[] }> {
  const vs = getVectors().schools;
  const escolas = getSchools().filter(s => vs[s.id]);
  return Object.fromEntries(AXIS_IDS.map(ax => {
    const ordenadas = [...escolas].sort((a, b) => vs[a.id][ax] - vs[b.id][ax]);
    return [ax, {
      A: ordenadas.filter(s => vs[s.id][ax] < 40).slice(0, n).map(s => s.name),
      B: ordenadas.reverse().filter(s => vs[s.id][ax] > 60).slice(0, n).map(s => s.name),
    }];
  })) as Record<AxisId, { A: string[]; B: string[] }>;
}
