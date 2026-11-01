import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = { title: 'Privacidade' };

export default function PrivacidadePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8 leading-relaxed sm:px-6">
        <h1 className="font-display text-4xl font-bold">Privacidade</h1>
        <p>Não há cadastro e não pedimos nenhum dado pessoal para fazer o quiz.</p>
        <p>
          Suas respostas ficam só no seu navegador enquanto você responde. O resultado é guardado apenas como 8 números no
          endereço da página, e é isso que vai junto quando você compartilha o link.
        </p>
        <p>Os links de livros levam à Amazon, que tem a própria política de privacidade.</p>
      </main>
    </>
  );
}
