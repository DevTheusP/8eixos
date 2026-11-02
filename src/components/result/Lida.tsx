import { PAYWALL_ENABLED } from '@/lib/site';
import type { School } from '@/lib/types';

const TEMAS = [
  { key: 'morte', label: 'Morte' },
  { key: 'felicidade', label: 'Felicidade' },
  { key: 'relacoes', label: 'Relações' },
] as const;

export function Lida({ school }: { school: School }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl bg-tile p-5">
        <p className="font-semibold">Sofrimento</p>
        <p className="mt-1 text-sm">{school.lida.sofrimento}</p>
      </div>
      {PAYWALL_ENABLED && TEMAS.map(t => (
        <div key={t.key} className="rounded-2xl bg-tile p-5">
          <p className="font-semibold">{t.label} <span className="text-xs text-amber">no relatório</span></p>
          <p className="mt-1 select-none text-sm blur-sm" aria-hidden>Disponível no relatório completo da sua escola.</p>
        </div>
      ))}
    </div>
  );
}
