import { BookOpen, Compass, Fingerprint, HeartHandshake, Users, Zap } from 'lucide-react';
import { getSchools, getVectors } from '@/lib/data';
import { vectorToParams } from '@/lib/url';

const DESCOBRE = [
  { Icone: Compass, titulo: 'Sua escola filosófica', texto: 'Entre 12 escolas, da Grécia antiga ao século XX, qual pensa mais parecido com você.' },
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

const EXEMPLOS = ['estoicismo', 'budismo', 'absurdismo'];

export function Exemplos() {
  const vs = getVectors().schools;
  const nomes = new Map(getSchools().map(s => [s.id, s.name]));
  return (
    <section className="mt-16">
      <h2 className="font-display text-3xl font-bold">Resultados que as pessoas compartilham</h2>
      <p className="mt-2 text-mute">No fim, você ganha um card pronto pro story, na cor da sua escola.</p>
      <div className="mt-6 flex snap-x gap-5 overflow-x-auto pb-2 sm:justify-center sm:overflow-visible">
        {EXEMPLOS.filter(id => vs[id]).map(id => (
          // eslint-disable-next-line @next/next/no-img-element -- imagem gerada sob demanda por /api/card
          <img key={id} src={`/api/card?${vectorToParams(vs[id])}`} alt={`Exemplo de card: ${nomes.get(id)}`} loading="lazy" width={1080} height={1920}
            className="h-auto w-52 flex-none snap-center rounded-2xl border border-line shadow-sm sm:w-60" />
        ))}
      </div>
    </section>
  );
}

export function Descobre() {
  return (
    <section className="mt-16">
      <h2 className="font-display text-3xl font-bold">O que você vai descobrir</h2>
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
    <section className="mt-16">
      <h2 className="font-display text-3xl font-bold">Perguntas frequentes</h2>
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
