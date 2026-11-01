import { ImageResponse } from 'next/og';
import { getAxes } from '@/lib/data';
import { intensity } from '@/lib/labels';
import { buildResult } from '@/lib/result';
import { rosaPontos, rosaRaios } from '@/lib/rosa';
import { SITE_URL } from '@/lib/site';
import { paramsToVector } from '@/lib/url';

const C = { bg: '#f1eff8', brand: '#3d2b80', gold: '#b8872a', rose: '#c94f6d', ink: '#1a1530', mute: '#6b6584' };

export async function GET(req: Request) {
  const v = paramsToVector(Object.fromEntries(new URL(req.url).searchParams));
  if (!v) return new Response('Resultado inválido', { status: 400 });
  const r = buildResult(v);
  const host = new URL(SITE_URL).host;
  const R = 100;
  const raios = rosaRaios(R);
  const pts = rosaPontos(v, R);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: C.bg, padding: '90px 80px', color: C.ink }}>
        <div style={{ display: 'flex', fontSize: 34, color: C.mute }}>Minha filosofia de vida</div>
        <div style={{ display: 'flex', fontSize: 120, color: C.brand, marginTop: 18, lineHeight: 1 }}>{r.school.school.name}</div>
        <div style={{ display: 'flex', fontSize: 40, color: C.ink, marginTop: 18 }}>{`${Math.round(r.school.score)}% compatível`}</div>
        <svg width="760" height="760" viewBox="-115 -115 230 230" style={{ marginTop: 40 }}>
          <circle cx="0" cy="0" r={R} fill="none" stroke={C.gold} strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="0" cy="0" r={R * 0.5} fill="none" stroke={C.gold} strokeOpacity="0.3" strokeWidth="0.8" />
          {raios.map(l => <line key={l.axis} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} stroke={C.gold} strokeOpacity="0.6" strokeWidth="0.8" />)}
          {raios.map(l => <circle key={`a-${l.axis}`} cx={l.a.x} cy={l.a.y} r="2.6" fill={C.brand} />)}
          {raios.map(l => <circle key={`b-${l.axis}`} cx={l.b.x} cy={l.b.y} r="2.6" fill={C.rose} />)}
          <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill={C.brand} fillOpacity="0.18" stroke={C.brand} strokeWidth="2" strokeLinejoin="round" />
          {pts.map(p => <circle key={`p-${p.axis}`} cx={p.x} cy={p.y} r="4" fill={v[p.axis] > 50 ? C.rose : C.brand} stroke="#fff" strokeWidth="1.2" />)}
        </svg>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 30, width: '100%' }}>
          {getAxes().map(axis => {
            const info = intensity(v[axis.id]);
            const texto = info.pole === null ? `${axis.name}: equilibrado` : info.pole === 'A' ? axis.poleA : axis.poleB;
            const cor = info.pole === 'A' ? C.brand : info.pole === 'B' ? C.rose : C.mute;
            return (
              <div key={axis.id} style={{ display: 'flex', margin: 8, padding: '10px 22px', borderRadius: 999, border: `2px solid ${cor}`, color: cor, fontSize: 30 }}>
                {texto}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div style={{ display: 'flex', fontSize: 36, color: C.ink }}>{`Penso como ${r.thinker.thinker.name} (${Math.round(r.thinker.score)}%)`}</div>
        <div style={{ display: 'flex', fontSize: 32, color: C.brand, marginTop: 24 }}>{`E a sua, qual é? ${host}`}</div>
      </div>
    ),
    { width: 1080, height: 1920 },
  );
}
