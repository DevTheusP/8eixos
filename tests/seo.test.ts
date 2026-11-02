import { readFileSync } from 'node:fs';
import * as escola from '@/app/escolas/[id]/page';
import * as pensador from '@/app/pensadores/[id]/page';
import sitemap from '@/app/sitemap';

test('páginas estáticas de todas as escolas e pensadores', () => {
  expect(escola.generateStaticParams()).toHaveLength(16);
  expect(pensador.generateStaticParams().length).toBeGreaterThanOrEqual(30);
});

test('sitemap tem escolas e pensadores', () => {
  const urls = sitemap().map(e => e.url);
  expect(urls.some(u => u.endsWith('/escolas/estoicismo'))).toBe(true);
  expect(urls.some(u => u.endsWith('/pensadores/marco-aurelio'))).toBe(true);
  expect(urls.some(u => u.includes('/resultado'))).toBe(false);
});

test('metadata das páginas', async () => {
  const m = await escola.generateMetadata({ params: Promise.resolve({ id: 'estoicismo' }) } as never);
  expect(String(m.title)).toMatch(/^Estoicismo/);
  expect(String(m.description).length).toBeLessThanOrEqual(155);
  const p = await pensador.generateMetadata({ params: Promise.resolve({ id: 'marco-aurelio' }) } as never);
  expect(String(p.title)).toBe('Filosofia de Marco Aurélio');
});

test('sobre deixa claro que não é teste científico', () => {
  expect(readFileSync('src/app/sobre/page.tsx', 'utf8')).toContain('Não é um teste científico');
});
