import { ImageResponse } from 'next/og';
import { cardFonts, CORES_EIXO, escurecer, iconeSvg } from '@/lib/card-assets';
import { nomeSeguro, resumoComparacao } from '@/lib/compare';
import { getAxes } from '@/lib/data';
import { POLE_ICONS } from '@/lib/icons';
import { matchScore } from '@/lib/matching';
import { buildResult } from '@/lib/result';
import { parseResultLink } from '@/lib/url';

const TEXTO = 'rgba(255,255,255,0.72)';
const PAINEL = 'rgba(255,255,255,0.075)';
// Cores fixas de cada pessoa nas réguas: a primeira em branco, a segunda em âmbar.
const COR_A = '#ffffff';
const COR_B = '#ffb36b';

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const a = parseResultLink(sp.get('a') ?? '');
  const b = parseResultLink(sp.get('b') ?? '');
  if (!a || !b) return new Response('Comparação inválida', { status: 400 });
  const na = nomeSeguro(sp.get('na') ?? undefined, 'Eu');
  const nb = nomeSeguro(sp.get('nb') ?? undefined, 'Você');
  const ra = buildResult(a);
  const rb = buildResult(b);
  const axes = new Map(getAxes().map(x => [x.id, x]));
  const { concordam, divergem } = resumoComparacao(a, b);
  const polo = (axis: string, v: number) => { const x = axes.get(axis as never)!; return v < 50 ? x.poleA : x.poleB; };
  const fundoA = escurecer(ra.school.family.color, 0.4);
  const fundoB = escurecer(rb.school.family.color, 0.5);

  const Pessoa = ({ nome, r, cor }: { nome: string; r: typeof ra; cor: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: PAINEL, borderRadius: 36, padding: '26px 28px', borderTop: `6px solid ${cor}` }}>
      <span style={{ fontSize: 30, fontWeight: 700, color: cor }}>{nome}</span>
      <span style={{ fontSize: 24, color: TEXTO, marginTop: 10 }}>{r.school.family.name}</span>
      <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: r.school.school.name.length > 14 ? 40 : 52, lineHeight: 1.05 }}>{r.school.school.name}</div>
      <span style={{ fontSize: 24, color: TEXTO, marginTop: 10 }}>{`Pensa como ${r.thinker.thinker.name}`}</span>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: `linear-gradient(160deg, ${fundoA} 0%, ${fundoB} 100%)`, padding: 64, color: 'white', fontFamily: 'Inter' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 54 }}>8eixos</span>
          <div style={{ display: 'flex', flex: 1, height: 2, background: 'rgba(255,255,255,0.2)', margin: '0 28px' }} />
          <span style={{ fontSize: 28, fontWeight: 600, color: TEXTO }}>nossas filosofias de vida</span>
        </div>

        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: 88, lineHeight: 1.05, marginTop: 56, letterSpacing: -2 }}>{`${na} e ${nb}`}</div>
        <div style={{ display: 'flex', marginTop: 22 }}>
          <span style={{ display: 'flex', background: 'white', color: fundoA, borderRadius: 999, padding: '10px 28px', fontFamily: 'Bricolage', fontWeight: 800, fontSize: 40 }}>
            {`${Math.round(matchScore(a, b))}% compatíveis`}
          </span>
        </div>

        <div style={{ display: 'flex', marginTop: 40 }}>
          <Pessoa nome={na} r={ra} cor={COR_A} />
          <div style={{ display: 'flex', width: 24 }} />
          <Pessoa nome={nb} r={rb} cor={COR_B} />
        </div>

        {/* Os 8 eixos: uma régua por eixo com a posição de cada pessoa */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24, background: PAINEL, borderRadius: 36, padding: '26px 32px' }}>
          {getAxes().map(axis => (
            <div key={axis.id} style={{ display: 'flex', alignItems: 'center', padding: '11px 0' }}>
              <div style={{ display: 'flex', width: 48, height: 48, borderRadius: 14, background: CORES_EIXO[axis.id], alignItems: 'center', justifyContent: 'center' }}>
                {iconeSvg(POLE_ICONS[axis.id].A, fundoA, 24)}
              </div>
              <span style={{ display: 'flex', width: 190, justifyContent: 'flex-end', marginLeft: 14, fontSize: 25, fontWeight: 600 }}>{axis.poleA}</span>
              <div style={{ display: 'flex', position: 'relative', flex: 1, height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.16)', margin: '0 22px' }}>
                <div style={{ display: 'flex', position: 'absolute', left: '50%', top: -6, width: 2, height: 22, background: 'rgba(255,255,255,0.25)' }} />
                <div style={{ display: 'flex', position: 'absolute', top: -9, left: `${a[axis.id]}%`, width: 28, height: 28, marginLeft: -14, borderRadius: 999, background: COR_A, border: `4px solid ${fundoA}` }} />
                <div style={{ display: 'flex', position: 'absolute', top: -9, left: `${b[axis.id]}%`, width: 28, height: 28, marginLeft: -14, borderRadius: 999, background: COR_B, border: `4px solid ${fundoA}` }} />
              </div>
              <span style={{ display: 'flex', width: 190, fontSize: 25, fontWeight: 600 }}>{axis.poleB}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginTop: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: PAINEL, borderRadius: 36, padding: '26px 28px', marginRight: 24 }}>
            <span style={{ fontSize: 26, fontWeight: 600, color: TEXTO }}>Onde a gente concorda</span>
            {(concordam.length ? concordam : [null]).map((l, i) => (
              <span key={i} style={{ display: 'flex', fontSize: 30, fontWeight: 700, marginTop: 12 }}>{l ? `Os dois: ${polo(l.axis, l.a).toLowerCase()}` : 'Em quase nada, e tudo bem'}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: PAINEL, borderRadius: 36, padding: '26px 28px' }}>
            <span style={{ fontSize: 26, fontWeight: 600, color: TEXTO }}>Onde a gente diverge</span>
            {(divergem.length ? divergem : [null]).map((l, i) => (
              <span key={i} style={{ display: 'flex', fontSize: 30, fontWeight: 700, marginTop: 12, color: COR_B }}>{l ? `${polo(l.axis, l.a)} × ${polo(l.axis, l.b).toLowerCase()}` : 'Em quase nada'}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid rgba(255,255,255,0.18)', paddingTop: 28 }}>
          <span style={{ fontFamily: 'Bricolage', fontWeight: 800, fontSize: 42 }}>Compare com quem você quiser</span>
          <span style={{ fontSize: 28, fontWeight: 600, color: TEXTO }}>8eixos</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, fonts: cardFonts() },
  );
}
