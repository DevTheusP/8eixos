import { ImageResponse } from 'next/og';
import { nomeSeguro, resumoComparacao } from '@/lib/compare';
import { getAxes } from '@/lib/data';
import { matchScore } from '@/lib/matching';
import { parseResultLink } from '@/lib/url';

const C = { bg: '#f2f3f8', brand: '#3f48a8', soft: '#e0e3f8', amber: '#e0853a', ink: '#171a2e', mute: '#636780' };

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const a = parseResultLink(sp.get('a') ?? '');
  const b = parseResultLink(sp.get('b') ?? '');
  if (!a || !b) return new Response('Comparação inválida', { status: 400 });
  const na = nomeSeguro(sp.get('na') ?? undefined, 'Eu');
  const nb = nomeSeguro(sp.get('nb') ?? undefined, 'Você');
  const axes = new Map(getAxes().map(x => [x.id, x]));
  const { concordam, divergem } = resumoComparacao(a, b);
  const polo = (axis: string, v: number) => { const x = axes.get(axis as never)!; return v < 50 ? x.poleA : x.poleB; };

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, padding: 80, color: C.ink }}>
        <div style={{ display: 'flex', fontSize: 34, color: C.mute }}>Nossas filosofias de vida</div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, color: C.brand, marginTop: 16, lineHeight: 1.05 }}>{`${na} e ${nb}`}</div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, marginTop: 20 }}>{`${Math.round(matchScore(a, b))}% compatíveis`}</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60, background: C.soft, borderRadius: 40, padding: 48 }}>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: C.brand }}>Onde a gente concorda</div>
          {(concordam.length ? concordam : [null]).map((l, i) => (
            <div key={i} style={{ display: 'flex', fontSize: 40, marginTop: 18 }}>{l ? `${axes.get(l.axis)!.name}: os dois ${polo(l.axis, l.a).toLowerCase()}` : 'Em quase nada, e tudo bem'}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 32, background: 'white', borderRadius: 40, padding: 48 }}>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, color: C.amber }}>Onde a gente diverge</div>
          {(divergem.length ? divergem : [null]).map((l, i) => (
            <div key={i} style={{ display: 'flex', fontSize: 40, marginTop: 18 }}>{l ? `${axes.get(l.axis)!.name}: ${na} ${polo(l.axis, l.a).toLowerCase()}, ${nb} ${polo(l.axis, l.b).toLowerCase()}` : 'Em quase nada'}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexGrow: 1 }} />
        <div style={{ display: 'flex', fontSize: 36, color: C.brand, fontWeight: 700 }}>Compare com quem você quiser no 8eixos</div>
      </div>
    ),
    { width: 1080, height: 1920 },
  );
}
