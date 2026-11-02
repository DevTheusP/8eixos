import { Sparkles, Users, Zap } from 'lucide-react';
import { getAxes } from '@/lib/data';
import type { Result } from '@/lib/result';

export function Distincao({ result }: { result: Result }) {
  const axes = new Map(getAxes().map(a => [a.id, a]));
  const { unusual, common, vector, tension } = result;
  const polo = (l: { axis: keyof typeof vector; pole: 'A' | 'B' }) => { const a = axes.get(l.axis)!; return l.pole === 'A' ? a.poleA : a.poleB; };
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tension && (
        <div className="rounded-2xl border border-brand/30 bg-card p-5 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brand"><Zap aria-hidden size={15} /> Sua combinação rara</p>
          <p className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            Você junta {polo(tension.a).toLowerCase()} e {polo(tension.b).toLowerCase()}.
          </p>
          <p className="mt-1 text-sm text-mute">
            {tension.count === 0
              ? `Nenhum dos ${tension.total} perfis do catálogo faz essa combinação.`
              : `Só ${tension.count} dos ${tension.total} perfis do catálogo fazem essa combinação.`}
          </p>
        </div>
      )}
      {unusual && (
        <div className="rounded-2xl bg-brand-soft p-5">
          <p className="flex items-center gap-1.5 text-sm font-semibold"><Sparkles aria-hidden size={15} className="text-brand" /> Sua posição mais incomum · {axes.get(unusual.axis)!.name}</p>
          <p className="font-display text-5xl font-bold text-brand">{unusual.pct}%</p>
          <p className="text-sm">
            das escolas puxam menos que você para{' '}
            <strong>{(vector[unusual.axis] < 50 ? axes.get(unusual.axis)!.poleA : axes.get(unusual.axis)!.poleB).toLowerCase()}</strong>.
          </p>
        </div>
      )}
      <div className="rounded-2xl bg-tile p-5">
        <p className="flex items-center gap-1.5 text-sm font-semibold"><Users aria-hidden size={15} className="text-mute" /> Sua posição mais comum · {axes.get(common.axis)!.name}</p>
        <p className="font-display text-4xl font-bold">{common.centered ? 'No centro' : 'Na média'}</p>
        <p className="text-sm text-mute">Aqui você se parece com a maioria das escolas. É onde seu perfil menos se distingue.</p>
      </div>
    </div>
  );
}
