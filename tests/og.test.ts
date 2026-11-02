import { GET } from '@/app/api/og/route';
import { generateMetadata } from '@/app/resultado/page';
import { getVectors } from '@/lib/data';
import { vectorToParams } from '@/lib/url';

const v = getVectors().schools['estoicismo'];

test('link do resultado tem prévia com imagem da própria escola', async () => {
  const m = await generateMetadata({ searchParams: Promise.resolve(Object.fromEntries(new URLSearchParams(vectorToParams(v)))) } as never);
  expect(String(m.title)).toMatch(/Estoicismo/);
  const imgs = m.openGraph?.images as { url: string }[];
  expect(imgs[0].url).toBe(`/api/og?${vectorToParams(v)}`);
  expect((m.twitter as { card?: string })?.card).toBe('summary_large_image');
});

test('resultado inválido não quebra a metadata', async () => {
  const m = await generateMetadata({ searchParams: Promise.resolve({ c: 'x' }) } as never);
  expect(m.openGraph?.images).toBeUndefined();
});

test('imagem de prévia horizontal 1200×630', async () => {
  const res = await GET(new Request(`http://x/api/og?${vectorToParams(v)}`));
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toBe('image/png');
  expect((await GET(new Request('http://x/api/og?c=x'))).status).toBe(400);
}, 30000);
