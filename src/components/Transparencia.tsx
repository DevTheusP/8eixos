import { Calculator, FileText, Lock, ShieldCheck, type LucideIcon } from 'lucide-react';
import { SITE_REPO } from '@/lib/site';

const PONTOS: { Icone: LucideIcon; titulo: string; texto: string; cor: string }[] = [
  {
    Icone: ShieldCheck, titulo: 'Independente', cor: '#8fb3ff',
    texto: 'Sem vínculo com religião, partido ou escola filosófica. Nenhuma escola paga para aparecer no seu resultado. Os links de livros só levam até a Amazon e não mudam o cálculo.',
  },
  {
    Icone: Calculator, titulo: 'Cálculo à vista', cor: '#7fdba6',
    texto: 'Como cada resposta puxa os eixos e como a compatibilidade é calculada está no código público. Não tem caixa-preta.',
  },
  {
    Icone: FileText, titulo: 'Perfis abertos', cor: '#ffd98a',
    texto: 'As 120 respostas de cada escola e de cada pensador ficam em arquivos do projeto, com o histórico de cada mudança.',
  },
  {
    Icone: Lock, titulo: 'Suas respostas são suas', cor: '#ff8fb1',
    texto: 'Nada sai do seu navegador. O resultado vira só 8 números no endereço da página, e é isso que vai junto quando você compartilha.',
  },
];

function MarcaGithub() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" width="28" height="28" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

// Por que confiar no resultado: independência, cálculo e perfis à vista, e privacidade. Os pontos ficam ligados como uma constelação.
export function Transparencia() {
  const repo = SITE_REPO.replace('https://github.com/', '');
  return (
    <section className="reveal mt-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Feito à vista de todos</h2>
        <p className="mt-3 max-w-md text-mute">
          Você não precisa acreditar na nossa palavra. O código do 8eixos e as respostas de cada escola e pensador estão
          públicos: dá pra ver exatamente de onde vem o seu resultado.
        </p>
        <div className="vidro mt-6 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-ink"><MarcaGithub /></span>
            <div className="min-w-0">
              <p className="font-bold">{repo}</p>
              <p className="text-sm text-mute">O código e os dados do quiz, abertos para leitura.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={SITE_REPO} target="_blank" rel="noopener noreferrer" data-track="ver_github" className="press group brilho rounded-full px-4 py-2 text-sm font-bold">
              Ver no GitHub <span className="nudge">↗</span>
            </a>
            <a href={`${SITE_REPO}/issues`} target="_blank" rel="noopener noreferrer" data-track="sugerir_correcao" className="press rounded-full border border-line bg-tile px-4 py-2 text-sm font-semibold hover:bg-tile-strong">
              Sugerir uma correção
            </a>
          </div>
          <p className="mt-3 text-xs text-mute">Achou uma resposta estranha no perfil de uma escola? Conta pra gente numa issue.</p>
        </div>
      </div>

      <ol className="relative space-y-4">
        {/* Linha da constelação ligando os quatro pontos. */}
        <span aria-hidden className="absolute bottom-8 left-[26px] top-8 w-px bg-gradient-to-b from-[#8fb3ff]/60 via-[#ffd98a]/60 to-[#ff8fb1]/60" />
        {PONTOS.map(({ Icone, titulo, texto, cor }) => (
          <li key={titulo} className="group relative flex gap-4">
            <span
              className="relative z-10 flex h-[54px] w-[54px] flex-none items-center justify-center rounded-2xl border border-line bg-bg transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-110"
              style={{ color: cor, boxShadow: `0 0 24px -6px ${cor}` }}
            >
              <Icone aria-hidden size={22} strokeWidth={2.2} />
            </span>
            <div className="vidro lift flex-1 rounded-2xl p-4">
              <p className="font-bold" style={{ color: cor }}>{titulo}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/85">{texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
