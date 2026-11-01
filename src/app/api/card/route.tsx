import { ImageResponse } from 'next/og';
import { getAxes } from '@/lib/data';
import { intensity } from '@/lib/labels';
import { buildResult } from '@/lib/result';
import { SITE_URL } from '@/lib/site';
import { paramsToVector } from '@/lib/url';

const C = { bg: '#f2efe7', navy: '#2c3f7c', soft: '#d6deef', ink: '#16181d', mute: '#6b6a64', tile: '#efebe1' };

export async function GET(req: Request) {
  const v = paramsToVector(Object.fromEntries(new URL(req.url).searchParams));
  if (!v) return new Response('Resultado inválido', { status: 400 });
  const r = buildResult(v);
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, padding: 80, color: C.ink }}>
        <div style={{ display: 'flex', fontSize: 34, color: C.mute, letterSpacing: 4 }}>MINHA FILOSOFIA DE VIDA</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40, background: C.soft, borderRadius: 48, padding: 56 }}>
          <div style={{ display: 'flex', alignSelf: 'flex-start', background: C.navy, color: 'white', borderRadius: 999, padding: '10px 24px', fontSize: 30 }}>
            {r.school.family.name}
          </div>
          <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, color: C.navy, marginTop: 24, lineHeight: 1.05 }}>{r.school.school.name}</div>
          <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, color: C.navy, marginTop: 12 }}>{`${Math.round(r.school.score)}% match`}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 36, background: C.tile, borderRadius: 40, padding: 44 }}>
          <div style={{ display: 'flex', fontSize: 30, color: C.mute }}>PENSADOR MAIS PRÓXIMO</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 56, fontWeight: 700 }}>
            <span>{r.thinker.thinker.name}</span>
            <span style={{ color: C.navy }}>{`${Math.round(r.thinker.score)}%`}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 36, justifyContent: 'space-between' }}>
          {getAxes().map(axis => {
            const info = intensity(v[axis.id]);
            const polo = info.pole === null ? 'Equilibrado' : `${info.percent}% ${info.pole === 'A' ? axis.poleA : axis.poleB}`;
            return (
              <div key={axis.id} style={{ display: 'flex', flexDirection: 'column', width: '48.5%', background: 'white', borderRadius: 28, padding: '24px 30px', marginBottom: 20 }}>
                <span style={{ fontSize: 28, color: C.mute }}>{axis.name}</span>
                <span style={{ fontSize: 38, fontWeight: 700, color: C.navy }}>{polo}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 34, color: C.mute }}>
          <span>E a sua, qual é?</span>
          <span style={{ color: C.navy, fontWeight: 700 }}>{host}</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 },
  );
}
