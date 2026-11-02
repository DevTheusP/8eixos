import { GET } from '@/app/api/card/route';
import { getVectors } from '@/lib/data';
import { vectorToParams } from '@/lib/url';

test('gera PNG para resultado válido', async () => {
  const v = getVectors().schools['estoicismo'];
  const res = await GET(new Request(`http://x/api/card?${vectorToParams(v)}`));
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toBe('image/png');
  const buf = new Uint8Array(await res.arrayBuffer());
  expect([...buf.slice(1, 4)].map(c => String.fromCharCode(c)).join('')).toBe('PNG');
}, 30000);

test('parâmetros inválidos → 400', async () => {
  const res = await GET(new Request('http://x/api/card?c=abc'));
  expect(res.status).toBe(400);
});

test('card traz QR code apontando pro resultado', async () => {
  const { qrDataUri } = await import('@/lib/share');
  const uri = await qrDataUri('https://8eixos.vercel.app/resultado?c=1');
  expect(uri.startsWith('data:image/svg+xml')).toBe(true);
});

test('retrato do pensador embutido no card (ou nada, se não houver foto)', async () => {
  const { retratoDataUri } = await import('@/lib/card-assets');
  const { getThinkers } = await import('@/lib/data');
  const com = getThinkers().find(t => t.id === 'marco-aurelio')!;
  const sem = getThinkers().find(t => !t.portrait)!;
  expect(retratoDataUri(com)?.startsWith('data:image/jpeg;base64,')).toBe(true);
  expect(retratoDataUri(sem)).toBeNull();
});

test('ícones do card viram SVG puro (sem componente React)', async () => {
  const { iconeSvg } = await import('@/lib/card-assets');
  const { POLE_ICONS } = await import('@/lib/icons');
  for (const par of Object.values(POLE_ICONS)) {
    expect(iconeSvg(par.A, '#000', 24)?.type).toBe('svg');
    expect(iconeSvg(par.B, '#000', 24)?.type).toBe('svg');
  }
});
