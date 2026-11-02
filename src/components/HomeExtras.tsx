import { BookOpen, Compass, Fingerprint, HeartHandshake, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Eixos } from '@/components/result/Eixos';
import { Hero } from '@/components/result/Hero';
import { getAxes, getFamilies, getSchools, getThinkers, getVectors } from '@/lib/data';
import { familyStyle } from '@/lib/family-theme';
import { POLE_ICONS } from '@/lib/icons';
import { buildResult } from '@/lib/result';
import { vectorToParams } from '@/lib/url';

const DESCOBRE = [
  { Icone: Compass, titulo: 'Sua escola filosófica', texto: `Entre ${getSchools().length} escolas, da Grécia antiga ao século XX, qual pensa mais parecido com você.` },
  { Icone: Users, titulo: 'Pensadores como você', texto: 'De Marco Aurélio a Camus: quem responderia o quiz do mesmo jeito que você.' },
  { Icone: Fingerprint, titulo: 'Sua posição em 8 eixos', texto: 'Aceitar ou transformar, razão ou emoção, certeza ou dúvida, e outros cinco.' },
  { Icone: Zap, titulo: 'Sua combinação rara', texto: 'O par de posições que quase ninguém junta e que diz muito sobre você.' },
  { Icone: HeartHandshake, titulo: 'Compatibilidade com quem você quiser', texto: 'Compare com amigos, namorado ou namorada e veja onde vocês concordam e divergem.' },
  { Icone: BookOpen, titulo: 'Por onde começar a ler', texto: 'Os livros de entrada dos pensadores mais parecidos com você.' },
];

const FAQ = [
  { p: 'O quiz é gratuito?', r: 'Sim. Os três formatos são grátis, anônimos e não pedem cadastro.' },
  { p: 'Quanto tempo leva?', r: 'A versão rápida leva uns 5 minutos, a equilibrada uns 10 e a profunda uns 20.' },
  { p: 'Como o resultado é calculado?', r: 'Cada resposta puxa um dos 8 eixos para um lado. Cada escola e cada pensador do catálogo respondeu às mesmas perguntas, e a compatibilidade mostra o quanto o seu perfil se parece com o deles.' },
  { p: 'É um teste científico ou psicológico?', r: 'Não. É uma ferramenta para explorar ideias e se conhecer melhor. Não é diagnóstico nem avaliação psicológica.' },
  { p: 'Minhas respostas ficam salvas em algum lugar?', r: 'Não saem do seu navegador. O resultado vira só 8 números no endereço da página, e é isso que vai junto quando você compartilha.' },
  { p: 'Dá para comparar com outra pessoa?', r: 'Sim. No resultado, cole o link do resultado de outra pessoa e veja os eixos em que vocês concordam e divergem.' },
];



export function Descobre() {
  return (
    <section className="reveal mt-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">O que você vai descobrir</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESCOBRE.map(({ Icone, titulo, texto }) => (
          <div key={titulo} className="rounded-2xl border border-line bg-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand"><Icone aria-hidden size={20} /></span>
            <p className="mt-3 font-semibold">{titulo}</p>
            <p className="mt-1 text-sm text-mute">{texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
  };
  return (
    <section className="reveal mt-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Perguntas frequentes</h2>
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
        {FAQ.map(f => (
          <details key={f.p} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              {f.p}
              <span aria-hidden className="text-brand transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-mute">{f.r}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}

// ——— Seções novas da home ———

const LEQUE = [
  { id: 'budismo', cls: 'leque-esq', base: 'translateX(-28%) rotate(-8deg)', f: '0s' },
  { id: 'estoicismo', cls: 'leque-meio', base: 'none', f: '-2s' },
  { id: 'absurdismo', cls: 'leque-dir', base: 'translateX(28%) rotate(8deg)', f: '-4s' },
];

export function LequeCards() {
  const vs = getVectors().schools;
  const nomes = new Map(getSchools().map(s => [s.id, s.name]));
  return (
    <div className="leque relative mx-auto h-[420px] w-full max-w-[460px] sm:h-[520px]" aria-label="Exemplos de card de resultado">
      {LEQUE.filter(c => vs[c.id]).map((c, i) => (
        <div key={c.id} className={`absolute left-1/2 top-4 w-[48%] -translate-x-1/2 ${i === 1 ? 'z-10' : 'z-0'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- card gerado sob demanda por /api/card */}
          <img
            src={`/api/card?${vectorToParams(vs[c.id])}`}
            alt={`Exemplo de card: ${nomes.get(c.id)}`}
            width={1080}
            height={1920}
            className={`leque-card ${c.cls} h-auto w-full rounded-[22px] shadow-[0_24px_50px_-24px_rgb(23_26_46/0.55)]`}
            style={{ transform: c.base, '--f': c.f } as CSSProperties}
          />
        </div>
      ))}
    </div>
  );
}

export function PreviaResultado() {
  // Alguém parecido com um estoico, mas não idêntico: o exemplo mostra um resultado realista.
  const e = getVectors().schools['estoicismo'];
  const r = buildResult({ ...e, eu: e.eu - 14, mundo: e.mundo + 10, verdade: e.verdade + 12 });
  return (
    <section className="reveal mt-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Veja como fica o seu resultado</h2>
      <p className="mt-2 max-w-2xl text-mute">Um exemplo de verdade: alguém que respondeu como um estoico. O seu vem na cor da sua escola.</p>
      <div className="relative mt-6 rounded-[28px] border border-line bg-bg p-4 sm:p-6" style={familyStyle(r.school.family)}>
        <span className="absolute -top-3 left-6 rounded-full brilho px-3 py-1 text-xs font-semibold">Exemplo</span>
        <div className="pointer-events-none space-y-4 select-none" aria-hidden>
          <Hero result={r} params={vectorToParams(r.vector)} />
          <div className="rounded-3xl border border-line bg-card p-5"><Eixos vector={r.vector} ids={['controle', 'bemviver', 'guia']} /></div>
        </div>
      </div>
    </section>
  );
}

const PASSOS = [
  { titulo: 'Responda', texto: 'Diga o quanto concorda com frases sobre controle, prazer, sentido, razão e outras grandes perguntas. Não existe resposta certa.' },
  { titulo: 'Veja sua forma', texto: 'Cada resposta puxa um dos 8 eixos pra um lado. No fim, você vê onde fica em cada um.' },
  { titulo: 'Descubra sua escola', texto: `Comparamos seu perfil com ${getSchools().length} escolas e ${getThinkers().length} pensadores que responderam às mesmas perguntas.` },
];

export function ComoFunciona() {
  return (
    <section className="reveal mt-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Como funciona</h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="rounded-2xl border border-line bg-card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-strong font-display font-bold text-white">{i + 1}</span>
            <p className="mt-3 font-semibold">{p.titulo}</p>
            <p className="mt-1 text-sm text-mute">{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function OitoEixos() {
  return (
    <section id="eixos" className="reveal mt-20 scroll-mt-6">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Os 8 eixos</h2>
      <p className="mt-2 max-w-2xl text-mute">Cada eixo é uma grande pergunta da vida, com duas respostas possíveis. Quase ninguém fica totalmente de um lado: o quiz mostra onde você fica.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {getAxes().map(a => {
          const { A: IA, B: IB } = POLE_ICONS[a.id];
          return (
            <div key={a.id} className="rounded-2xl border border-line bg-card p-5">
              <p className="font-display text-xl font-bold">{a.name}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-brand-soft p-3">
                  <p className="flex items-center gap-1.5 font-semibold text-brand"><IA aria-hidden size={15} /> {a.poleA}</p>
                  <p className="mt-1 text-mute">{a.descA}</p>
                </div>
                <div className="rounded-xl bg-amber-faint p-3">
                  <p className="flex items-center gap-1.5 font-semibold text-amber"><IB aria-hidden size={15} /> {a.poleB}</p>
                  <p className="mt-1 text-mute">{a.descB}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Familias() {
  const familias = getFamilies();
  const escolas = getSchools();
  return (
    <section className="reveal mt-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">As 6 famílias de escolas</h2>
      <p className="mt-2 max-w-2xl text-mute">As escolas se agrupam pelo jeito de encarar a vida. Cada família tem a sua cor, e o seu resultado aparece nela.</p>
      <div className="mt-6 flex h-2 overflow-hidden rounded-full" aria-hidden>
        {familias.map(f => <span key={f.id} className="flex-1" style={{ background: f.color }} />)}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {familias.map(f => (
          <div key={f.id} className="rounded-2xl p-5" style={{ background: f.soft }}>
            <span className="block h-6 w-6 rounded-md" style={{ background: f.color }} />
            <p className="mt-3 font-display text-xl font-bold" style={{ color: f.color }}>{f.name}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {escolas.filter(s => s.familyId === f.id).map(s => (
                <Link key={s.id} href={`/escolas/${s.id}`} className="underline decoration-1 underline-offset-2 hover:opacity-70">{s.name}</Link>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
