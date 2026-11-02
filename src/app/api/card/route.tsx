import { ImageResponse } from 'next/og';
import { iconeSvg, retratoDataUri } from '@/lib/card-assets';
import { getAxes } from '@/lib/data';
import { POLE_ICONS } from '@/lib/icons';
import { intensity } from '@/lib/labels';
import { buildResult } from '@/lib/result';
import { qrDataUri } from '@/lib/share';
import { SITE_URL } from '@/lib/site';
import { paramsToVector, vectorToParams } from '@/lib/url';

const C = { bg: '#f2f3f8', ink: '#171a2e', mute: '#636780', track: '#e3e5f0' };

/* eslint-disable @next/next/no-img-element -- imagens dentro do ImageResponse (Satori), não é página */
export async function GET(req: Request) {
  const v = paramsToVector(Object.fromEntries(new URL(req.url).searchParams));
  if (!v) return new Response('Resultado inválido', { status: 400 });
  const r = buildResult(v);
  const cor = r.school.family.color;
  const host = new URL(SITE_URL).host;
  const qr = await qrDataUri(`${SITE_URL}/resultado?${vectorToParams(v)}`, cor);
  const foto = retratoDataUri(r.thinker.thinker);
  const iniciais = r.thinker.thinker.name.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(p => p.length > 2).map(p => p[0]).slice(0, 2).join('');

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, padding: 60, color: C.ink }}>
        {/* Topo na cor da família */}
        <div style={{ display: 'flex', flexDirection: 'column', background: cor, borderRadius: 56, padding: '52px 56px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, opacity: 0.85 }}>
            <span style={{ fontWeight: 700 }}>8eixos</span>
            <span>minha filosofia de vida</span>
          </div>
          <div style={{ display: 'flex', alignSelf: 'flex-start', marginTop: 36, background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '10px 24px', fontSize: 28 }}>
            {r.school.family.name}
          </div>
          <div style={{ display: 'flex', fontSize: 112, fontWeight: 700, marginTop: 18, lineHeight: 1 }}>{r.school.school.name}</div>
          <div style={{ display: 'flex', fontSize: 44, marginTop: 16, opacity: 0.95 }}>{`${Math.round(r.school.score)}% compatível`}</div>
          <div style={{ display: 'flex', fontSize: 32, marginTop: 28, lineHeight: 1.35, opacity: 0.9 }}>{`“${r.school.school.quote}”`}</div>
        </div>

        {/* Pensador mais parecido */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 28, background: 'white', borderRadius: 40, padding: 28 }}>
          {foto ? (
            <img src={foto} width={128} height={128} style={{ borderRadius: 999, objectFit: 'cover' }} alt="" />
          ) : (
            <div style={{ display: 'flex', width: 128, height: 128, borderRadius: 999, background: cor, color: 'white', fontSize: 48, fontWeight: 700, alignItems: 'center', justifyContent: 'center' }}>{iniciais}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 28, flex: 1 }}>
            <span style={{ fontSize: 28, color: C.mute }}>Penso como</span>
            <span style={{ fontSize: 46, fontWeight: 700 }}>{r.thinker.thinker.name}</span>
          </div>
          <span style={{ fontSize: 52, fontWeight: 700, color: cor }}>{`${Math.round(r.thinker.score)}%`}</span>
        </div>

        {/* Os 8 eixos com ícone e minibarra */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 28, background: 'white', borderRadius: 40, padding: '30px 36px' }}>
          {getAxes().map(axis => {
            const val = v[axis.id];
            const info = intensity(val);
            const Icone = info.pole === 'B' ? POLE_ICONS[axis.id].B : POLE_ICONS[axis.id].A;
            const rotulo = info.pole === null ? 'Equilibrado' : `${info.percent}% ${info.pole === 'A' ? axis.poleA : axis.poleB}`;
            const ativa = info.pole === null ? C.mute : cor;
            return (
              <div key={axis.id} style={{ display: 'flex', alignItems: 'center', padding: '13px 0' }}>
                <div style={{ display: 'flex', width: 52, height: 52, borderRadius: 16, background: C.bg, alignItems: 'center', justifyContent: 'center' }}>
                  {iconeSvg(Icone, ativa, 28)}
                </div>
                <span style={{ display: 'flex', width: 190, marginLeft: 20, fontSize: 30, color: C.mute }}>{axis.name}</span>
                <div style={{ display: 'flex', position: 'relative', flex: 1, height: 12, borderRadius: 999, background: C.track, marginRight: 26 }}>
                  <div style={{ display: 'flex', position: 'absolute', top: 0, height: 12, borderRadius: 999, background: ativa, left: `${Math.min(val, 50)}%`, width: `${Math.max(Math.abs(val - 50), 1.5)}%` }} />
                </div>
                <span style={{ display: 'flex', width: 300, justifyContent: 'flex-end', fontSize: 30, fontWeight: 700, color: ativa }}>{rotulo}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderRadius: 32, padding: 26 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: cor }}>E a sua, qual é?</span>
            <span style={{ fontSize: 28, color: C.mute, marginTop: 8 }}>{`Aponte a câmera ou acesse ${host}`}</span>
          </div>
          <img src={qr} width={170} height={170} alt="" />
        </div>
      </div>
    ),
    { width: 1080, height: 1920, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  );
}
