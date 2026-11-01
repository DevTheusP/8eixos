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
