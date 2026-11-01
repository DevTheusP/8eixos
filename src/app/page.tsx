import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { FORMATOS, type Formato } from '@/lib/selection';

const ORDEM: Formato[] = ['curta', 'completa', 'profunda'];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-wine">— Escolha o formato</p>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Qual é a sua <span className="text-navy">filosofia de vida?</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-mute">
          Responda o que você pensa sobre controle, sentido, prazer, dúvida e outras grandes perguntas. No fim, você
          descobre a escola filosófica e os pensadores mais parecidos com você.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ORDEM.map(f => {
            const info = FORMATOS[f];
            const destaque = info.recomendado;
            return (
              <article
                key={f}
                className={`flex flex-col rounded-3xl border p-6 ${destaque ? 'border-transparent bg-[#14302a] text-white shadow-xl' : 'border-line bg-card'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${destaque ? 'text-[#e8a9b0]' : 'text-wine'}`}>
                    {info.titulo}
                  </span>
                  {destaque && <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-ink">Recomendada</span>}
                </div>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-6xl font-bold">{info.perguntas}</span>
                  <span className="text-lg">perguntas</span>
                </p>
                <p className={`mt-3 flex-1 ${destaque ? 'text-white/80' : 'text-mute'}`}>{info.descricao}</p>
                <p className={`mt-4 border-t pt-4 text-sm ${destaque ? 'border-white/20 text-white/80' : 'border-line text-mute'}`}>
                  Aprox. {info.minutos} min
                </p>
                <Link
                  href={`/quiz/${f}`}
                  className={`mt-5 rounded-full px-5 py-3 text-center font-semibold ${destaque ? 'bg-card text-ink' : 'bg-[#14302a] text-white'}`}
                >
                  Começar versão {info.titulo.toLowerCase()} →
                </Link>
              </article>
            );
          })}
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute [&>li]:before:mr-2 [&>li]:before:content-['•']">
          <li>Todos os formatos usam os mesmos 8 eixos</li>
          <li>Anônimo, sem cadastro</li>
          <li>Resultado imediato</li>
        </ul>
      </main>
    </>
  );
}
