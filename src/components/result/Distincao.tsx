import type { CSSProperties } from 'react';
import { Sparkles, Users, Zap } from 'lucide-react';
import { CORES_EIXO } from '@/lib/card-assets';
import { getAxes } from '@/lib/data';
import { POLE_ICONS } from '@/lib/icons';
import type { Result } from '@/lib/result';
import type { AxisId } from '@/lib/types';

const eixo = (id: AxisId) => getAxes().find(a => a.id === id)!;
const polo = (id: AxisId, lado: 'A' | 'B') => (lado === 'A' ? eixo(id).poleA : eixo(id).poleB);
const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export function textoIncomum(id: AxisId, lado: 'A' | 'B', pct: number) {
  return `No eixo ${eixo(id).name}, você puxa mais para ${polo(id, lado).toLowerCase()} do que ${pct}% das escolas.`;
}

export function textoComum(id: AxisId, centrado: boolean, lado: 'A' | 'B' = 'A') {
  const a = eixo(id);
  return centrado
    ? `No eixo ${a.name}, você fica no meio, entre ${a.poleA.toLowerCase()} e ${a.poleB.toLowerCase()}, como a maioria das escolas.`
    : `No eixo ${a.name}, você puxa para ${polo(id, lado).toLowerCase()} na mesma medida que a maioria das escolas.`;
}

// Um lado de um eixo, com ícone, nome e a frase do que ele quer dizer.
function Lado({ id, lado }: { id: AxisId; lado: 'A' | 'B' }) {
  const Icone = POLE_ICONS[id][lado];
  const cor = CORES_EIXO[id];
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-tile p-4">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-bg" style={{ background: cor }}>
        <Icone aria-hidden size={20} strokeWidth={2.4} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-mute">{eixo(id).name}</p>
        <p className="font-bold" style={{ color: cor }}>{polo(id, lado)}</p>
        <p className="mt-0.5 text-sm text-ink/80">{maiuscula(lado === 'A' ? eixo(id).descA : eixo(id).descB)}</p>
      </div>
    </div>
  );
}

export function Distincao({ result }: { result: Result }) {
  const { unusual, common, vector, tension } = result;
  const ladoDe = (id: AxisId) => (vector[id] < 50 ? 'A' : 'B') as 'A' | 'B';
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tension && (
        <div className="rounded-2xl border border-amber/30 bg-amber-faint p-5 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-amber"><Zap aria-hidden size={15} /> Sua combinação rara</p>
          <p className="mt-1 font-display text-xl font-bold sm:text-2xl">Pouca gente junta essas duas ideias</p>
          <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <Lado id={tension.a.axis} lado={tension.a.pole} />
            <span aria-hidden className="text-center font-display text-2xl font-bold text-amber">+</span>
            <Lado id={tension.b.axis} lado={tension.b.pole} />
          </div>
          <p className="mt-3 text-sm text-mute">
            {tension.count === 0
              ? `Nenhum dos ${tension.total} perfis do catálogo (escolas e pensadores) pensa assim.`
              : `Só ${tension.count} dos ${tension.total} perfis do catálogo (escolas e pensadores) ${tension.count === 1 ? 'pensa' : 'pensam'} assim.`}
          </p>
        </div>
      )}
      {unusual && (
        <div className="rounded-2xl bg-brand-soft p-5">
          <p className="flex items-center gap-1.5 text-sm font-semibold"><Sparkles aria-hidden size={15} className="text-brand" /> Onde você é mais radical</p>
          <p className="mt-1 text-sm leading-relaxed">{textoIncomum(unusual.axis, ladoDe(unusual.axis), unusual.pct)}</p>
          {/* Régua de 0 a 100% das escolas: o marcador mostra quantas ficam atrás de você. */}
          <div className="mt-4">
            <div className="relative h-2 rounded-full bg-track">
              <div className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: `${unusual.pct}%` }} />
              <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-brand bg-white" style={{ left: `${unusual.pct}%` } as CSSProperties} />
            </div>
            <p className="mt-2 flex items-baseline justify-between text-xs text-mute"><span>escolas que puxam menos que você</span><span className="font-display text-2xl font-bold text-brand">{unusual.pct}%</span></p>
          </div>
        </div>
      )}
      <div className="rounded-2xl bg-tile p-5">
        <p className="flex items-center gap-1.5 text-sm font-semibold"><Users aria-hidden size={15} className="text-mute" /> Onde você pensa como a maioria</p>
        <p className="mt-1 text-sm leading-relaxed">{textoComum(common.axis, common.centered, ladoDe(common.axis))}</p>
        <p className="mt-3 text-sm text-mute">É o ponto em que o seu perfil menos se diferencia.</p>
      </div>
    </div>
  );
}
