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
