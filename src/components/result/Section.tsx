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

const R = 34;
const LEN = 2 * Math.PI * R;

export function Ring({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const px = size === 'md' ? 84 : 60;
  const pct = Math.max(0, Math.min(100, score));
  return (
    <InView className="relative flex-none" >
      <svg width={px} height={px} viewBox="0 0 80 80" aria-hidden className="-rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="var(--track)" strokeWidth="5" />
        <circle
          className="ring-arc"
          cx="40" cy="40" r={R} fill="none" stroke="var(--brand)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={LEN} strokeDashoffset={LEN * (1 - pct / 100)}
          style={{ '--len': `${LEN}` } as CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-brand">
        <span className={`font-display font-bold ${size === 'md' ? 'text-xl' : 'text-sm'}`}>{Math.round(score)}%</span>
        <span className="text-[9px] font-semibold tracking-[0.1em]">MATCH</span>
      </div>
    </InView>
  );
}
