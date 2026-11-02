import { CloudRain, Heart, Hourglass, Sun, type LucideIcon } from 'lucide-react';
import type { School } from '@/lib/types';

const TEMAS: { key: keyof School['lida']; label: string; Icone: LucideIcon; cor: string }[] = [
  { key: 'sofrimento', label: 'Sofrimento', Icone: CloudRain, cor: '#8fb3ff' },
  { key: 'morte', label: 'Morte', Icone: Hourglass, cor: '#c9a8ff' },
  { key: 'felicidade', label: 'Felicidade', Icone: Sun, cor: '#ffd98a' },
  { key: 'relacoes', label: 'Relações', Icone: Heart, cor: '#ff8fb1' },
];

// Como a escola da pessoa encara as quatro grandes questões da vida.
export function Lida({ school }: { school: School }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {TEMAS.map(({ key, label, Icone, cor }) => (
        <div key={key} className="lift flex gap-4 rounded-2xl border border-line bg-tile p-5">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-bg" style={{ background: cor }}>
            <Icone aria-hidden size={20} strokeWidth={2.3} />
          </span>
          <div className="min-w-0">
            <p className="font-bold" style={{ color: cor }}>{label}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/85">{school.lida[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
