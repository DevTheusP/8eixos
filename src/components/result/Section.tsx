import type { ReactNode } from 'react';

export function Section({ id, title, children, className = '' }: { id: string; title?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-6 rounded-3xl border border-line bg-card p-5 sm:p-7 ${className}`}>
      {title && <h2 className="mb-5 font-display text-2xl font-bold sm:text-3xl">{title}</h2>}
      {children}
    </section>
  );
}

export function Ring({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'h-20 w-20 text-xl' : 'h-14 w-14 text-sm';
  return (
    <div className={`flex flex-none flex-col items-center justify-center rounded-full border-4 border-navy font-bold text-navy ${s}`}>
      {Math.round(score)}%
      <span className="text-[9px] font-semibold tracking-[0.1em]">MATCH</span>
    </div>
  );
}
