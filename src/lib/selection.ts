import { AXIS_IDS, type AxisId, type Question } from './types';

export type Formato = 'curta' | 'completa' | 'profunda';

export const FORMATOS: Record<Formato, {
  perguntas: number; porEixo: number; minutos: number; titulo: string; descricao: string; recomendado: boolean;
}> = {
  curta: {
    perguntas: 32, porEixo: 4, minutos: 5, titulo: 'Rápida',
    descricao: 'Uma primeira leitura rápida da sua filosofia de vida.', recomendado: false,
  },
  completa: {
    perguntas: 64, porEixo: 8, minutos: 10, titulo: 'Equilibrada',
    descricao: 'O equilíbrio entre tempo e detalhe. Aproxima melhor você das escolas e dos pensadores.', recomendado: true,
  },
  profunda: {
    perguntas: 120, porEixo: 15, minutos: 20, titulo: 'Profunda',
    descricao: 'A leitura mais detalhada: todas as perguntas, em todos os eixos.', recomendado: false,
  },
};

export function seededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// `vistas` conta quantas vezes cada pergunta já apareceu pra esta pessoa: quem refaz o quiz recebe primeiro as que ainda não viu.
export function selectQuestions(
  pool: Question[], formato: Formato, rng: () => number = Math.random, vistas: Record<string, number> = {},
): Question[] {
  const menosVistas = (qs: Question[]) => shuffle(qs, rng).sort((a, b) => (vistas[a.id] ?? 0) - (vistas[b.id] ?? 0));
  const { porEixo } = FORMATOS[formato];
  const perAxis = new Map<AxisId, Question[]>();
  for (const axis of AXIS_IDS) {
    const doEixo = pool.filter(q => q.axis === axis);
    const chosen = formato === 'profunda'
      ? doEixo
      : (['A', 'B'] as const).flatMap(p => menosVistas(doEixo.filter(q => q.polarity === p)).slice(0, porEixo / 2));
    perAxis.set(axis, shuffle(chosen, rng));
  }

  // Rodadas: uma pergunta de cada eixo por rodada, em ordem sorteada, sem repetir eixo na virada.
  const out: Question[] = [];
  while ([...perAxis.values()].some(l => l.length > 0)) {
    const order = shuffle(AXIS_IDS.filter(a => perAxis.get(a)!.length > 0), rng);
    const last = out.at(-1)?.axis;
    if (order.length > 1 && order[0] === last) [order[0], order[1]] = [order[1], order[0]];
    for (const a of order) out.push(perAxis.get(a)!.shift()!);
  }
  return out;
}
