import config from '../next.config';

test('site manda cabeçalhos de segurança em todas as páginas', async () => {
  const regras = await config.headers!();
  const todas = regras.find(r => r.source === '/:path*')!;
  const h = Object.fromEntries(todas.headers.map(x => [x.key.toLowerCase(), x.value]));
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['permissions-policy']).toContain('camera=()');
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
});
