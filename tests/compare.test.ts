import { compareVectors } from '@/lib/compare';
import { AXIS_IDS, type Vector } from '@/lib/types';

const neutro = Object.fromEntries(AXIS_IDS.map(a => [a, 50])) as Vector;

test('comparação ordena pela maior diferença', () => {
  const r = compareVectors({ ...neutro, guia: 10 }, { ...neutro, guia: 90, verdade: 60 });
  expect(r).toHaveLength(8);
  expect(r[0]).toMatchObject({ axis: 'guia', a: 10, b: 90, diff: 80, sameSide: false });
  expect(r[1]).toMatchObject({ axis: 'verdade', diff: 10, sameSide: true });
});

test('resumo: onde concordam (mesmo lado, mais perto) e onde divergem (lados opostos, mais longe)', async () => {
  const { resumoComparacao } = await import('@/lib/compare');
  const a = { ...neutro, controle: 20, guia: 10, verdade: 80, eu: 70 };
  const b = { ...neutro, controle: 25, guia: 90, verdade: 30, eu: 72 };
  const r = resumoComparacao(a, b);
  expect(r.concordam.map(c => c.axis)).toEqual(['eu', 'controle']);
  expect(r.divergem.map(c => c.axis)).toEqual(['guia', 'verdade']);
});

test('card da comparação', async () => {
  const { GET } = await import('@/app/api/comparar-card/route');
  const { vectorToParams } = await import('@/lib/url');
  const a = vectorToParams({ ...neutro, controle: 20 });
  const b = vectorToParams({ ...neutro, controle: 80 });
  const res = await GET(new Request(`http://x/api/comparar-card?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&na=Ana&nb=Bia`));
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toBe('image/png');
  expect((await GET(new Request('http://x/api/comparar-card?a=x&b=y'))).status).toBe(400);
}, 30000);
