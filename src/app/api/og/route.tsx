import { ImageResponse } from 'next/og';
import { getAxes } from '@/lib/data';
import { intensity } from '@/lib/labels';
import { buildResult } from '@/lib/result';
import { paramsToVector } from '@/lib/url';

// Prévia horizontal (1200×630) do link do resultado em WhatsApp, Instagram e redes.
export async function GET(req: Request) {
  const v = paramsToVector(Object.fromEntries(new URL(req.url).searchParams));
  if (!v) return new Response('Resultado inválido', { status: 400 });
  const r = buildResult(v);
  const { color, soft } = r.school.family;
  const polos = getAxes()
    .map(a => ({ a, i: intensity(v[a.id]) }))
    .filter(x => x.i.pole !== null)
    .sort((x, y) => y.i.percent - x.i.percent)
    .slice(0, 4);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f2f3f8', padding: 56, color: '#171a2e' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: soft, borderRadius: 40, padding: 52 }}>
          <div style={{ display: 'flex', fontSize: 28, color }}>{`Minha filosofia de vida, entre as ${r.school.family.name.toLowerCase()}`}</div>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 700, color, marginTop: 10, lineHeight: 1 }}>{r.school.school.name}</div>
          <div style={{ display: 'flex', fontSize: 38, marginTop: 14 }}>{`${Math.round(r.school.score)}% compatível. Penso como ${r.thinker.thinker.name}.`}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 34 }}>
            {polos.map(({ a, i }) => (
              <div key={a.id} style={{ display: 'flex', marginRight: 14, marginBottom: 14, padding: '10px 22px', borderRadius: 999, background: 'white', color, fontSize: 28 }}>
                {`${i.percent}% ${i.pole === 'A' ? a.poleA : a.poleB}`}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexGrow: 1 }} />
          <div style={{ display: 'flex', fontSize: 30, color: '#636780' }}>E a sua, qual é? Faça o quiz no 8eixos</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  );
}
