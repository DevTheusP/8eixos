export const SITE_NAME = '8eixos';
export const SITE_REPO = 'https://github.com/DevTheusP/8eixos';
export function siteUrl(env: Record<string, string | undefined>): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL;
  // Na Vercel, sem a variável configurada, usa o domínio de produção em vez de cair em localhost.
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:3000';
}

export const SITE_URL = siteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
});
export const PAYWALL_ENABLED = process.env.NEXT_PUBLIC_PAYWALL_ENABLED === 'true';

// Pix de apoio: chave aleatória (não expõe CPF, e-mail nem telefone). O nome aparece no app do banco de quem paga.
export const PIX_CHAVE = 'fea91e3a-8975-4edc-92de-80d025b66b63';
export const PIX_NOME = 'Matheus Persch';
export const PIX_CIDADE = 'Brasil';
