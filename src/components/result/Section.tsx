import type { LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { InView } from '@/components/InView';

export function Section({ id, title, icon: Icone, children, className = '' }: {
  id: string; title?: string; icon?: LucideIcon; children: ReactNode; className?: string;
}) {
  return (
    <section id={id} className={`reveal scroll-mt-6 rounded-3xl border border-line bg-card p-5 sm:p-7 ${className}`}>
      {title && (
        <h2 className="mb-5 flex items-center gap-3 font-display text-2xl font-bold sm:text-3xl">
          {Icone && (
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Icone aria-hidden size={18} strokeWidth={2.2} />
            </span>
          )}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

// Compatibilidade como barra: número grande + trilho preenchido até o valor.
export function Ring({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const pct = Math.max(0, Math.min(100, score));
  return (
    <InView className={`flex-none ${size === 'md' ? 'min-w-32' : 'min-w-24'}`}>
      <p className="flex items-baseline gap-1 whitespace-nowrap text-brand sm:justify-end">
        <span className={`font-display font-bold ${size === 'md' ? 'text-3xl' : 'text-xl'}`}>{Math.round(score)}%</span>
        <span className="text-xs font-semibold">compatível</span>
      </p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-track">
        <div className="axis-fill h-full rounded-full bg-brand" style={{ width: `${pct}%`, '--origin': 'left' } as CSSProperties} />
      </div>
    </InView>
  );
}
