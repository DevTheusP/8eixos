import { AXIS_IDS, type AxisId, type Vector } from './types';

export function compareVectors(a: Vector, b: Vector): { axis: AxisId; a: number; b: number; diff: number; sameSide: boolean }[] {
  return AXIS_IDS.map(axis => ({
    axis,
    a: a[axis],
    b: b[axis],
    diff: Math.round(Math.abs(a[axis] - b[axis]) * 10) / 10,
    sameSide: (a[axis] - 50) * (b[axis] - 50) >= 0,
  })).sort((x, y) => y.diff - x.diff);
}

type Linha = ReturnType<typeof compareVectors>[number];

// Até 3 eixos em que as duas pessoas estão do mesmo lado (mais parecidas primeiro) e até 3 em que estão em lados opostos.
export function resumoComparacao(a: Vector, b: Vector): { concordam: Linha[]; divergem: Linha[] } {
  const linhas = compareVectors(a, b);
  const decidido = (x: number) => Math.abs(x - 50) >= 10;
  return {
    concordam: linhas.filter(l => l.sameSide && decidido(l.a) && decidido(l.b)).sort((x, y) => x.diff - y.diff).slice(0, 3),
    divergem: linhas.filter(l => !l.sameSide).slice(0, 3),
  };
}

export function nomeSeguro(n: string | undefined, padrao: string): string {
  const limpo = (n ?? '').replace(/[<>]/g, '').trim().slice(0, 24);
  return limpo || padrao;
}
