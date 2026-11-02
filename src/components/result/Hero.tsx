import type { CSSProperties, ReactNode } from 'react';
import { InView } from '@/components/InView';
import type { Result } from '@/lib/result';
import { Retrato } from '../Retrato';

// Topo do resultado: bloco cheio na cor da família (o mesmo do card de story) e, ao lado, a prévia do card pronto.
export function Hero({ result, params, share }: { result: Result; params: string; share?: ReactNode }) {
  const { school, family, score } = result.school;
  const { thinker, score: tScore } = result.thinker;
  const pct = Math.max(0, Math.min(100, score));
  return (
    <section id="escola" className="grid scroll-mt-20 gap-4 lg:grid-cols-[1fr_15rem]">
      <div className="arrive relative overflow-hidden rounded-3xl bg-brand-strong p-6 text-white sm:p-8" style={{ '--d': '80ms' } as CSSProperties}>
        <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <span aria-hidden className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-white/5" />
        <span className="relative inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{family.name}</span>
        <p className="relative mt-4 font-display text-5xl font-bold leading-none tracking-tight sm:text-6xl">{school.name}</p>
        <InView className="relative mt-5 max-w-sm">
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-bold">{Math.round(score)}%</span>
            <span className="text-sm font-semibold text-white/80">compatível</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="axis-fill h-full rounded-full bg-white" style={{ width: `${pct}%`, '--origin': 'left' } as CSSProperties} />
          </div>
        </InView>
        <blockquote className="relative mt-6 text-xl leading-snug sm:text-2xl">“{school.quote}”</blockquote>
        <p className="relative mt-4 max-w-prose text-sm leading-relaxed text-white/85">{school.summary}</p>
        <div className="relative mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-3 pr-4">
          <Retrato thinker={thinker} size={52} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white/75">Você pensa como</p>
            <p className="truncate font-display text-lg font-bold">{thinker.name}</p>
          </div>
          <span className="font-display text-lg font-bold">{Math.round(tScore)}%</span>
        </div>
      </div>
      <div className="arrive flex items-center gap-4 rounded-3xl bg-brand-soft p-4 lg:flex-col lg:items-stretch" style={{ '--d': '200ms' } as CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element -- imagem gerada na hora pela rota do card */}
        <img
          data-card-previa
          src={`/api/card?${params}`}
          alt={`Card de story: ${school.name}, ${Math.round(score)}% compatível`}
          width={1080}
          height={1920}
          className="aspect-[9/16] h-auto w-28 flex-none rounded-xl bg-brand/20 object-cover shadow-[0_18px_40px_-20px_rgb(23_26_46_/_0.5)] sm:w-36 lg:w-full"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-sm font-semibold text-brand">Seu card já está pronto pro story</p>
          {share}
        </div>
      </div>
    </section>
  );
}
