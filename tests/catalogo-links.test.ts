import * as vs from '@/app/escolas/[id]/vs/[outro]/page';
import sitemap from '@/app/sitemap';
import { parecidos } from '@/lib/catalogo';

test('pensadores parecidos: os mais próximos, sem o próprio', () => {
  const r = parecidos('thinker', 'marco-aurelio', 4);
  expect(r).toHaveLength(4);
  expect(r.map(x => x.id)).not.toContain('marco-aurelio');
  expect(r[0].score).toBeGreaterThanOrEqual(r[3].score);
});

test('uma página por par de escolas (66), sempre na mesma ordem', () => {
  const ps = vs.generateStaticParams();
  expect(ps).toHaveLength(66);
  for (const p of ps) expect(p.id < p.outro).toBe(true);
});

test('metadata do comparativo e sitemap', async () => {
  const m = await vs.generateMetadata({ params: Promise.resolve({ id: 'epicurismo', outro: 'estoicismo' }) } as never);
  expect(String(m.title)).toBe('Epicurismo × Estoicismo: diferenças e semelhanças');
  expect(sitemap().some(e => e.url.endsWith('/escolas/epicurismo/vs/estoicismo'))).toBe(true);
});
