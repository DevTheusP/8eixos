export type IntensityLabel = 'Equilibrado' | 'Tende' | 'Forte' | 'Muito forte';

export function intensity(v: number): { label: IntensityLabel; pole: 'A' | 'B' | null; percent: number } {
  const d = Math.abs(v - 50);
  const percent = Math.round(Math.max(v, 100 - v));
  if (d < 10) return { label: 'Equilibrado', pole: null, percent };
  const pole = v < 50 ? 'A' : 'B';
  if (d < 20) return { label: 'Tende', pole, percent };
  if (d < 35) return { label: 'Forte', pole, percent };
  return { label: 'Muito forte', pole, percent };
}
