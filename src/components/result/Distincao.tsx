import { getAxes } from '@/lib/data';
import type { Result } from '@/lib/result';

export function Distincao({ result }: { result: Result }) {
  const axes = new Map(getAxes().map(a => [a.id, a]));
  const { unusual, common, vector } = result;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {unusual && (
        <div className="rounded-2xl bg-soft p-5">
          <p className="text-sm font-semibold">Sua posição mais incomum · {axes.get(unusual.axis)!.name}</p>
          <p className="font-display text-5xl font-bold text-navy">{unusual.pct}%</p>
          <p className="text-sm">
            das escolas puxam menos que você para{' '}
            <strong>{(vector[unusual.axis] < 50 ? axes.get(unusual.axis)!.poleA : axes.get(unusual.axis)!.poleB).toLowerCase()}</strong>.
          </p>
        </div>
      )}
      <div className="rounded-2xl bg-tile p-5">
        <p className="text-sm font-semibold">Sua posição mais comum · {axes.get(common.axis)!.name}</p>
        <p className="font-display text-4xl font-bold">{common.centered ? 'No centro' : 'Na média'}</p>
        <p className="text-sm text-mute">Aqui você se parece com a maioria das escolas. É onde seu perfil menos se distingue.</p>
      </div>
    </div>
  );
}
