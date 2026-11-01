import type { Metadata } from 'next';
import { Cta } from '@/components/Cta';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = { title: 'Como funciona', description: 'Como o quiz calcula sua escola filosófica de vida.' };

export default function SobrePage() {
  return (
    <>
      <SiteHeader action={{ href: '/', label: 'Fazer o quiz' }} />
      <main className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 leading-relaxed sm:px-6">
        <h1 className="font-display text-4xl font-bold">Como funciona</h1>
        <p>
          O quiz mede você em 8 eixos independentes: controle, bem viver, sentido, mundo, eu, rotina, guia e verdade.
          Cada resposta puxa um eixo para um dos lados. No fim, cada eixo vira uma porcentagem entre os dois polos.
        </p>
        <p>
          Cada escola e cada pensador do catálogo respondeu às mesmas perguntas que você, do jeito que eles responderiam.
          Assim, todos ficam no mesmo mapa, e a compatibilidade mostra o quanto o seu perfil se parece com o deles.
        </p>
        <p className="rounded-2xl bg-soft p-5 font-semibold text-navy">
          É uma ferramenta pra explorar ideias. Não é um teste científico nem diagnóstico psicológico.
        </p>
        <p>
          Uma compatibilidade alta quer dizer que as suas respostas se parecem com as de uma escola, não que você pertence a ela.
          Os perfis são simplificações, e as perguntas carregam o olhar de quem as escreveu.
        </p>
        <Cta />
      </main>
    </>
  );
}
