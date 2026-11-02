import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';
import { cardFonts, CORES_EIXO, escurecer, iconeSvg, retratoDataUri } from '@/lib/card-assets';
import { getAxes, getFamilies } from '@/lib/data';
import { POLE_ICONS } from '@/lib/icons';
import { intensity } from '@/lib/labels';
import { buildResult } from '@/lib/result';
import { qrDataUri } from '@/lib/share';
import { SITE_URL } from '@/lib/site';
import type { Thinker } from '@/lib/types';
import { paramsToVector, vectorToParams } from '@/lib/url';

const TEXTO = 'rgba(255,255,255,0.72)';
const PAINEL = 'rgba(255,255,255,0.075)';

function iniciais(nome: string) {
  return nome.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(p => p.length > 2).map(p => p[0]).slice(0, 2).join('');
}

/* eslint-disable @next/next/no-img-element -- imagens dentro do ImageResponse (Satori), não é página */
function Foto({ t, tamanho, raio, cor }: { t: Thinker; tamanho: number; raio: number; cor: string }) {
  const foto = retratoDataUri(t);
  if (foto) return <img src={foto} width={tamanho} height={tamanho} style={{ borderRadius: raio, objectFit: 'cover' }} alt="" />;
  return (
    <div style={{ display: 'flex', width: tamanho, height: tamanho, borderRadius: raio, background: cor, color: 'white', fontFamily: 'Bricolage', fontWeight: 800, fontSize: tamanho * 0.34, alignItems: 'center', justifyContent: 'center' }}>
      {iniciais(t.name)}
    </div>
  );
}

function Painel({ titulo, children, flex = 1 }: { titulo: string; children: ReactNode; flex?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex, background: PAINEL, borderRadius: 40, padding: '30px 32px' }}>
      <span style={{ fontSize: 26, fontWeight: 600, color: TEXTO, marginBottom: 14 }}>{titulo}</span>
      {children}
    </div>
  );
}

// Rosa de 8 raios: o motivo dos 8 eixos, bem apagado no canto.
function Rosa() {
  const raios = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return <line key={i} x1="300" y1="300" x2={300 + 290 * Math.cos(a)} y2={300 + 290 * Math.sin(a)} />;
  });
  return (
    <svg width="600" height="600" viewBox="0 0 600 600" style={{ position: 'absolute', top: -170, right: -170 }}>
      <g stroke="rgba(255,255,255,0.09)" strokeWidth="3" fill="none">
        <circle cx="300" cy="300" r="290" />
        <circle cx="300" cy="300" r="190" />
        <circle cx="300" cy="300" r="90" />
        {raios}
      </g>
    </svg>
  );
}

export async function GET(req: Request) {
  const v = paramsToVector(Object.fromEntries(new URL(req.url).searchParams));
  if (!v) return new Response('Resultado inválido', { status: 400 });
  const r = buildResult(v);
  const cor = r.school.family.color;
  const fundo = escurecer(cor, 0.42);
  const familias = new Map(getFamilies().map(f => [f.id, f]));
  const host = new URL(SITE_URL).host;
  const qr = await qrDataUri(`${SITE_URL}/resultado?${vectorToParams(v)}`, fundo);
  const nome = r.school.school.name;
  const pensador = r.thinker.thinker;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: `linear-gradient(170deg, ${escurecer(cor, 0.25)} 0%, ${fundo} 55%, ${escurecer(cor, 0.55)} 100%)`, padding: 64, color: 'white', fontFamily: 'Inter' }}>
        <Rosa />

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 54, letterSpacing: -1 }}>8eixos</span>
          <div style={{ display: 'flex', flex: 1, height: 2, background: 'rgba(255,255,255,0.2)', margin: '0 28px' }} />
          <span style={{ fontSize: 28, fontWeight: 600, color: TEXTO }}>minha filosofia de vida</span>
        </div>

        {/* Escola */}
        <div style={{ display: 'flex', marginTop: 64, fontSize: 32, fontWeight: 600, color: TEXTO }}>{r.school.family.name}</div>
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: nome.length > 20 ? 72 : nome.length > 12 ? 100 : 124, lineHeight: 1.05, letterSpacing: -2, marginTop: 6 }}>{nome}</div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 34 }}>
          <span style={{ display: 'flex', background: 'white', color: fundo, borderRadius: 999, padding: '10px 26px', fontFamily: 'Bricolage', fontWeight: 800, fontSize: 36 }}>
            {`${Math.round(r.school.score)}% compatível`}
          </span>
        </div>
        <div style={{ display: 'flex', marginTop: 26, fontSize: 34, lineHeight: 1.35, color: 'rgba(255,255,255,0.9)' }}>{`“${r.school.school.quote}”`}</div>

        {/* Pensador + 8 eixos */}
        <div style={{ display: 'flex', marginTop: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 380, background: PAINEL, borderRadius: 40, overflow: 'hidden', marginRight: 24 }}>
            <div style={{ display: 'flex', position: 'relative' }}>
              <Foto t={pensador} tamanho={380} raio={0} cor={cor} />
              <div style={{ display: 'flex', position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${escurecer(cor, 0.5)} 100%)` }} />
              <span style={{ position: 'absolute', left: 28, bottom: 8, fontFamily: 'Bricolage', fontWeight: 800, fontSize: 104, lineHeight: 1 }}>{`${Math.round(r.thinker.score)}%`}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '22px 28px 28px' }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: TEXTO }}>Penso como</span>
              <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: pensador.name.length > 16 ? 42 : 50, lineHeight: 1.05, marginTop: 4 }}>{pensador.name}</span>
              <span style={{ fontSize: 25, lineHeight: 1.3, color: TEXTO, marginTop: 10 }}>{pensador.descriptor}</span>
            </div>
            <div style={{ display: 'flex', flexGrow: 1 }} />
            <div style={{ display: 'flex', flexDirection: 'column', margin: '0 20px 20px', padding: '18px 22px', borderRadius: 28, border: '2px dashed rgba(255,255,255,0.25)' }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: TEXTO }}>Meu oposto</span>
              <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: familias.get(r.opposite.familyId)!.soft }}>{r.opposite.name}</span>
            </div>
          </div>

          <Painel titulo="Meus 8 eixos">
            {getAxes().map(axis => {
              const info = intensity(v[axis.id]);
              const corEixo = info.pole === null ? 'rgba(255,255,255,0.75)' : CORES_EIXO[axis.id];
              const Icone = POLE_ICONS[axis.id][info.pole ?? (v[axis.id] < 50 ? 'A' : 'B')];
              const polo = info.pole === null ? 'Equilibrado' : info.pole === 'A' ? axis.poleA : axis.poleB;
              const forca = info.pole === null ? 0.06 : (info.percent - 50) / 50;
              return (
                <div key={axis.id} style={{ display: 'flex', alignItems: 'center', padding: '9px 0' }}>
                  <div style={{ display: 'flex', width: 54, height: 54, borderRadius: 16, background: info.pole === null ? 'rgba(255,255,255,0.14)' : corEixo, alignItems: 'center', justifyContent: 'center' }}>
                    {iconeSvg(Icone, info.pole === null ? 'white' : fundo, 28)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 18 }}>
                    <span style={{ fontSize: 24, color: TEXTO }}>{axis.name}</span>
                    <span style={{ fontSize: 30, fontWeight: 700, color: corEixo, lineHeight: 1.1 }}>{polo}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 36, color: corEixo }}>{`${info.percent}%`}</span>
                    <div style={{ display: 'flex', width: 96, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.14)', marginTop: 4 }}>
                      <div style={{ display: 'flex', width: `${Math.max(6, forca * 100)}%`, height: 8, borderRadius: 999, background: corEixo }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </Painel>
        </div>

        {/* Pensadores por área + escolas próximas */}
        <div style={{ display: 'flex', marginTop: 24 }}>
          <div style={{ display: 'flex', flex: 1, marginRight: 24 }}>
            <Painel titulo="Também penso como">
              {r.byDimension.map(d => (
                <div key={d.dim} style={{ display: 'flex', alignItems: 'center', padding: '9px 0' }}>
                  <Foto t={d.thinker} tamanho={64} raio={999} cor={cor} />
                  <span style={{ display: 'flex', flex: 1, margin: '0 14px 0 18px', fontSize: 28, fontWeight: 600, lineHeight: 1.15 }}>{d.thinker.name}</span>
                  <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 32 }}>{`${Math.round(d.score)}%`}</span>
                </div>
              ))}
            </Painel>
          </div>
          <Painel titulo="Escolas próximas">
            {r.otherSchools.map(({ school, score }) => (
              <div key={school.id} style={{ display: 'flex', alignItems: 'center', padding: '9px 0' }}>
                <div style={{ display: 'flex', width: 64, height: 64, borderRadius: 20, background: familias.get(school.familyId)!.soft, alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', width: 26, height: 26, borderRadius: 999, background: familias.get(school.familyId)!.color }} />
                </div>
                <span style={{ display: 'flex', flex: 1, margin: '0 14px 0 18px', fontSize: 28, fontWeight: 600, lineHeight: 1.15 }}>{school.name}</span>
                <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 32 }}>{`${Math.round(score)}%`}</span>
              </div>
            ))}
          </Painel>
        </div>

        {/* Rodapé */}
        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid rgba(255,255,255,0.18)', paddingTop: 30 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 46 }}>E a sua, qual é?</span>
            <span style={{ fontSize: 30, fontWeight: 600, color: TEXTO, marginTop: 6 }}>{`Descubra em ${host}`}</span>
          </div>
          <div style={{ display: 'flex', background: 'white', borderRadius: 24, padding: 14 }}>
            <img src={qr} width={148} height={148} alt="" />
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, fonts: cardFonts(), headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  );
}
