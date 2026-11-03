import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { getAxes, getQuestions } from '@/lib/data';
import { escolasPorPolo } from '@/lib/exemplos-eixo';
import { FORMATOS, type Formato } from '@/lib/selection';
import { QuizRunner } from './QuizRunner';

export function generateStaticParams() {
  return (Object.keys(FORMATOS) as Formato[]).map(formato => ({ formato }));
}

export async function generateMetadata({ params }: PageProps<'/quiz/[formato]'>) {
  const { formato } = await params;
  const info = FORMATOS[formato as Formato];
  return info ? { title: `Versão ${info.titulo.toLowerCase()} (${info.perguntas} perguntas)` } : {};
}

async function QuizBody({ params }: { params: PageProps<'/quiz/[formato]'>['params'] }) {
  const { formato } = await params;
  if (!(formato in FORMATOS)) notFound();
  return <QuizRunner formato={formato as Formato} pool={getQuestions()} axes={getAxes()} exemplos={escolasPorPolo(2)} />;
}

export default function QuizPage({ params }: PageProps<'/quiz/[formato]'>) {
  return (
    <>
      <SiteHeader />
      <main className="w-full px-4 py-10 sm:py-16">
        <Suspense fallback={<p className="py-20 text-center text-mute">Preparando as perguntas…</p>}>
          <QuizBody params={params} />
        </Suspense>
      </main>
    </>
  );
}
