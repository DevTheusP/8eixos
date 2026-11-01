import type { ReactNode } from 'react';
import { Rosa } from '@/components/Rosa';
import { getAxes } from '@/lib/data';
import type { Result } from '@/lib/result';

export function Hero({ result, share }: { result: Result; share?: ReactNode }) {
  const { school, family, score } = result.school;
  return (
    <section id="escola" className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="text-sm font-semibold text-mute">Sua escola filosófica, entre as {family.name.toLowerCase()}</p>
        <h1 className="mt-2 font-display text-6xl text-brand sm:text-7xl">{school.name}</h1>
        <p className="mt-3 text-lg"><strong className="text-brand">{Math.round(score)}%</strong> de compatibilidade com as suas respostas</p>
        <blockquote className="mt-6 border-l-2 border-gold pl-4 font-display text-2xl italic leading-snug text-ink">
          {school.quote}
        </blockquote>
        <p className="mt-5 max-w-xl leading-relaxed text-mute">{school.summary}</p>
        {share && <div className="mt-6">{share}</div>}
      </div>
      <Rosa vector={result.vector} axes={getAxes()} size={460} className="mx-auto h-auto w-full max-w-[460px]" />
    </section>
  );
}
