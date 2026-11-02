import type { ReactNode } from 'react';
import { CloudRain, Heart, Hourglass, Sun, type LucideIcon } from 'lucide-react';
import { PAYWALL_ENABLED } from '@/lib/site';
import type { School } from '@/lib/types';

const TEMAS: { key: 'morte' | 'felicidade' | 'relacoes'; label: string; Icone: LucideIcon }[] = [
  { key: 'morte', label: 'Morte', Icone: Hourglass },
  { key: 'felicidade', label: 'Felicidade', Icone: Sun },
  { key: 'relacoes', label: 'Relações', Icone: Heart },
];

function Tema({ Icone, label, children }: { Icone: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl bg-tile p-5">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icone aria-hidden size={19} strokeWidth={2.2} />
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        {children}
      </div>
    </div>
  );
}

export function Lida({ school }: { school: School }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Tema Icone={CloudRain} label="Sofrimento">
        <p className="mt-1 text-sm leading-relaxed">{school.lida.sofrimento}</p>
      </Tema>
      {PAYWALL_ENABLED && TEMAS.map(t => (
        <Tema key={t.key} Icone={t.Icone} label={t.label}>
          <p className="text-xs text-amber">no relatório</p>
          <p className="mt-1 select-none text-sm blur-sm" aria-hidden>Disponível no relatório completo da sua escola.</p>
        </Tema>
      ))}
    </div>
  );
}
