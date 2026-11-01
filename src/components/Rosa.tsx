import type { CSSProperties } from 'react';
import { rosaPontos, rosaRaios } from '@/lib/rosa';
import type { Axis, Vector } from '@/lib/types';

/**
 * Rosa dos ventos de 8 eixos. Cada eixo é um diâmetro (polo A de um lado, polo B do outro).
 * Com `vector`, desenha a forma da pessoa: vértices violeta puxando pro polo A, rosa pro polo B.
 */
export function Rosa({ vector, axes, size = 320, animar = true, className = '' }: {
  vector?: Vector; axes?: Axis[]; size?: number; animar?: boolean; className?: string;
}) {
  const R = 100;
  const pad = axes ? 78 : 8;
  const raios = rosaRaios(R);
  const pts = vector ? rosaPontos(vector, R) : [];
  const len = 2 * R;
  return (
    <svg
      viewBox={`${-R - pad} ${-R - pad} ${2 * (R + pad)} ${2 * (R + pad)}`}
      width={size}
      height={size}
      className={className}
      role={vector ? 'img' : undefined}
      aria-hidden={vector ? undefined : true}
      aria-label={vector ? 'Sua forma nos 8 eixos' : undefined}
    >
      <circle r={R} fill="none" stroke="var(--gold)" strokeOpacity="0.55" strokeWidth="0.8" />
      <circle r={R * 0.66} fill="none" stroke="var(--gold)" strokeOpacity="0.25" strokeWidth="0.6" />
      <circle r={R * 0.33} fill="none" stroke="var(--gold)" strokeOpacity="0.25" strokeWidth="0.6" />
      {raios.map((r, i) => (
        <line
          key={r.axis}
          x1={r.a.x} y1={r.a.y} x2={r.b.x} y2={r.b.y}
          stroke="var(--gold)" strokeOpacity="0.6" strokeWidth={i % 2 === 0 ? 0.9 : 0.6}
          className={animar ? 'rosa-raio' : undefined}
          style={{ '--len': `${len}`, '--d': `${i * 60}ms` } as CSSProperties}
        />
      ))}
      {raios.map(r => (
        <g key={`p-${r.axis}`}>
          <circle cx={r.a.x} cy={r.a.y} r="2.4" fill="var(--brand)" />
          <circle cx={r.b.x} cy={r.b.y} r="2.4" fill="var(--rose)" />
        </g>
      ))}
      {axes && raios.map(r => {
        const ax = axes.find(a => a.id === r.axis);
        if (!ax) return null;
        const rotulo = (p: { x: number; y: number }, texto: string, cor: string) => {
          const k = (R + 16) / R;
          return (
            <text
              x={p.x * k} y={p.y * k + 3} textAnchor={Math.abs(p.x) < 8 ? 'middle' : p.x > 0 ? 'start' : 'end'}
              fontSize="8.5" fill={cor} fontWeight="600"
            >
              {texto}
            </text>
          );
        };
        return (
          <g key={`t-${r.axis}`}>
            {rotulo(r.a, ax.poleA, 'var(--brand)')}
            {rotulo(r.b, ax.poleB, 'var(--rose)')}
          </g>
        );
      })}
      {vector && (
        <g className={animar ? 'rosa-forma' : undefined}>
          <polygon
            points={pts.map(p => `${p.x},${p.y}`).join(' ')}
            fill="var(--brand)" fillOpacity="0.16" stroke="var(--brand)" strokeWidth="1.6" strokeLinejoin="round"
          />
          {pts.map(p => (
            <circle key={p.axis} cx={p.x} cy={p.y} r="3.2" fill={vector[p.axis] > 50 ? 'var(--rose)' : 'var(--brand)'} stroke="#fff" strokeWidth="1" />
          ))}
        </g>
      )}
      <circle r="3" fill="var(--gold)" />
    </svg>
  );
}

// Marca do site: a rosa reduzida a um selo violeta, legível em tamanho pequeno.
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="-12 -12 24 24" width={size} height={size} aria-hidden>
      <circle r="12" fill="var(--brand)" />
      {rosaRaios(8.5).map((r, i) => (
        <line key={r.axis} x1={r.a.x} y1={r.a.y} x2={r.b.x} y2={r.b.y} stroke={i === 0 ? 'var(--gold)' : '#fff'} strokeOpacity={i === 0 ? 1 : 0.75} strokeWidth="1.1" strokeLinecap="round" />
      ))}
      <circle r="1.8" fill="var(--gold)" />
    </svg>
  );
}
