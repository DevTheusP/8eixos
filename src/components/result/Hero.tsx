import type { CSSProperties, ReactNode } from 'react';
import type { Result } from '@/lib/result';
import { Ring } from './Section';

export function Hero({ result, share }: { result: Result; share?: ReactNode }) {
  const { school, family, score } = result.school;
  return (
    <section id="escola" className="arrive scroll-mt-6 rounded-3xl bg-brand-soft p-5 sm:p-7" style={{ '--d': '80ms' } as CSSProperties}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">{family.name}</span>
          <p className="mt-3 font-display text-4xl font-bold text-brand sm:text-5xl">{school.name}</p>
        </div>
        <Ring score={score} />
      </div>
      <blockquote className="mt-5 border-t border-brand/20 pt-5 text-lg leading-snug text-brand sm:text-xl">
        “{school.quote}”
      </blockquote>
      <p className="mt-4 text-sm text-ink/80">{school.summary}</p>
      {share && <div className="mt-5">{share}</div>}
    </section>
  );
}
