// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { Livros } from '@/components/result/Livros';
import { siteUrl } from '@/lib/site';
import { tituloSofrimento } from '@/lib/text';

test('pensador sem livro não gera seção "Para ler" vazia', () => {
  const { container } = render(<Livros thinkerIds={['pirro']} title="Para ler" />);
  expect(container.innerHTML).toBe('');
  const com = render(<Livros thinkerIds={['marco-aurelio']} title="Para ler" />);
  expect(com.container.textContent).toContain('Para ler');
  expect(com.container.textContent).toContain('Meditações');
});

test('título do sofrimento sem artigo errado', () => {
  expect(tituloSofrimento('Logoterapia')).toBe('Logoterapia e o sofrimento');
  expect(tituloSofrimento('Estoicismo')).toBe('Estoicismo e o sofrimento');
});

test('URL do site nunca cai em localhost na Vercel', () => {
  expect(siteUrl({ NEXT_PUBLIC_SITE_URL: 'https://meu.site' })).toBe('https://meu.site');
  expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'quiz.vercel.app' })).toBe('https://quiz.vercel.app');
  expect(siteUrl({})).toBe('http://localhost:3000');
});

test('CI e package.json exigem Node 22+, que o Vitest 5 pede', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(pkg.engines?.node).toBe('>=22.12');
  expect(readFileSync('.github/workflows/ci.yml', 'utf8')).toMatch(/node-version: 22/);
});
