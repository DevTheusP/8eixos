import { compareVectors, resumoComparacao } from '@/lib/compare';
import { matchScore } from '@/lib/matching';
import { whatsappComparacao } from '@/lib/share';
import type { Axis, AxisId, Vector } from '@/lib/types';
import { vectorToParams } from '@/lib/url';

// A comparação eixo a eixo entre duas pessoas (ou uma pessoa e um pensador/escola). Usada no resultado e em /comparar.
export function ComparacaoResultado({ eu, outro, euNome, outroNome, axes }: {
  eu: Vector; outro: Vector; euNome: string; outroNome: string; axes: Axis[];
}) {
  const porId = new Map(axes.map(a => [a.id, a]));
  const resumo = resumoComparacao(eu, outro);
  const score = Math.round(matchScore(eu, outro));
  const polo = (axis: AxisId, v: number) => { const x = porId.get(axis)!; return (v < 50 ? x.poleA : x.poleB).toLowerCase(); };
  const cardUrl = `/api/comparar-card?a=${encodeURIComponent(vectorToParams(eu))}&b=${encodeURIComponent(vectorToParams(outro))}&na=${encodeURIComponent(euNome)}&nb=${encodeURIComponent(outroNome)}`;
  const titulo = `${euNome} e ${outroNome}`;

  return (
    <section aria-label={titulo}>
      <h3 className="pr-10 font-display text-2xl font-bold">{titulo}</h3>
      <p className="mb-5 mt-1 font-display font-bold text-brand">
        <span className="text-4xl">{score}%</span> <span className="text-lg">de compatibilidade</span>
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-soft p-4">
          <p className="font-semibold text-brand">Onde vocês concordam</p>
          <ul className="mt-2 space-y-1 text-sm">
            {resumo.concordam.length ? resumo.concordam.map(c => <li key={c.axis}><strong>{porId.get(c.axis)!.name}:</strong> os dois {polo(c.axis, c.a)}</li>) : <li>Em quase nada, e tudo bem.</li>}
          </ul>
        </div>
        <div className="rounded-2xl bg-amber-faint p-4">
          <p className="font-semibold text-amber">Onde vocês divergem</p>
          <ul className="mt-2 space-y-1 text-sm">
            {resumo.divergem.length ? resumo.divergem.map(c => <li key={c.axis}><strong>{porId.get(c.axis)!.name}:</strong> {euNome} {polo(c.axis, c.a)}, {outroNome} {polo(c.axis, c.b)}</li>) : <li>Em quase nada.</li>}
          </ul>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <a href={cardUrl} download="nossa-comparacao.png" data-track="baixar_card_comparacao" className="press rounded-xl brilho px-4 py-2.5 text-sm font-semibold">Baixar card da comparação</a>
        <a href={whatsappComparacao(euNome, outroNome, score)} target="_blank" rel="noopener noreferrer" data-track="whatsapp_comparacao" className="press rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand">Mandar no WhatsApp</a>
      </div>
      <ul className="space-y-4">
        {compareVectors(eu, outro).map(c => {
          const ax = porId.get(c.axis)!;
          return (
            <li key={c.axis}>
              <div className="flex justify-between text-sm font-semibold">
                <span>{ax.name}</span>
                <span className={c.sameSide ? 'text-brand' : 'text-amber'}>{c.sameSide ? 'Do mesmo lado' : 'Em lados opostos'} · {Math.round(c.diff)} pts</span>
              </div>
              <div className="relative my-2 h-2 rounded-full bg-track">
                <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-brand bg-white" style={{ left: `${c.a}%` }} title={euNome} />
                <span className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-amber bg-white" style={{ left: `${c.b}%` }} title={outroNome} />
              </div>
              <div className="flex justify-between text-xs text-mute"><span>{ax.poleA}</span><span>{ax.poleB}</span></div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-xs text-mute"><span className="text-brand">●</span> {euNome} <span className="ml-3 text-amber">●</span> {outroNome}</p>
    </section>
  );
}
