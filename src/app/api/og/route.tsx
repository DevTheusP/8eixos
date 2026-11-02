import { ImageResponse } from 'next/og';
import { cardFonts, CORES_EIXO, escurecer, iconeSvg, retratoDataUri } from '@/lib/card-assets';
import { getAxes } from '@/lib/data';
import { POLE_ICONS } from '@/lib/icons';
import { poloDoCard } from '@/lib/labels';
import { buildResult } from '@/lib/result';
import { paramsToVector } from '@/lib/url';

const TEXTO = 'rgba(255,255,255,0.72)';

// Prévia horizontal (1200×630) do link do resultado em WhatsApp, Instagram e redes. Mesmo visual do card de story.
/* eslint-disable @next/next/no-img-element -- imagens dentro do ImageResponse (Satori), não é página */
export async function GET(req: Request) {
  const v = paramsToVector(Object.fromEntries(new URL(req.url).searchParams));
  if (!v) return new Response('Resultado inválido', { status: 400 });
  const r = buildResult(v);
  const cor = r.school.family.color;
  const fundo = escurecer(cor, 0.42);
  const nome = r.school.school.name;
  const pensador = r.thinker.thinker;
  const foto = retratoDataUri(pensador);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: `linear-gradient(160deg, ${escurecer(cor, 0.25)} 0%, ${fundo} 60%, ${escurecer(cor, 0.55)} 100%)`, padding: 52, color: 'white', fontFamily: 'Inter' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 36 }}>
          <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 36 }}>8eixos</span>
          <span style={{ marginTop: 40, fontSize: 26, fontWeight: 600, color: TEXTO }}>{`Minha filosofia de vida · ${r.school.family.name}`}</span>
          <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: nome.length > 20 ? 64 : nome.length > 12 ? 80 : 100, lineHeight: 1.05, letterSpacing: -2, marginTop: 6 }}>{nome}</div>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <span style={{ display: 'flex', background: 'white', color: fundo, borderRadius: 999, padding: '8px 22px', fontFamily: 'Bricolage', fontWeight: 800, fontSize: 30 }}>
              {`${Math.round(r.school.score)}% compatível`}
            </span>
          </div>
          <div style={{ display: 'flex', flexGrow: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: 28, padding: 16 }}>
            {foto
              ? <img src={foto} width={84} height={84} style={{ borderRadius: 20, objectFit: 'cover' }} alt="" />
              : <div style={{ display: 'flex', width: 84, height: 84, borderRadius: 20, background: cor }} />}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, flex: 1 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: TEXTO }}>Penso como</span>
              <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 36 }}>{pensador.name}</span>
            </div>
            <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 44, marginRight: 8 }}>{`${Math.round(r.thinker.score)}%`}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: 420, background: 'rgba(255,255,255,0.075)', borderRadius: 32, padding: '22px 26px' }}>
          {getAxes().map(axis => {
            const p = poloDoCard(axis, v[axis.id]);
            const destaque = p.decidido ? CORES_EIXO[axis.id] : 'white';
            return (
              <div key={axis.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}>
                <div style={{ display: 'flex', width: 46, height: 46, borderRadius: 14, background: CORES_EIXO[axis.id], alignItems: 'center', justifyContent: 'center' }}>
                  {iconeSvg(POLE_ICONS[axis.id][p.lado], fundo, 24)}
                </div>
                <span style={{ display: 'flex', flex: 1, marginLeft: 16, fontSize: p.nome.length > 11 ? 22 : 26, fontWeight: 600 }}>{p.nome}</span>
                <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 32, color: destaque }}>{`${p.percent}%`}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: cardFonts(), headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  );
}
