import Link from 'next/link';

export function Cta() {
  return (
    <div className=" rounded-3xl bg-deep p-6 text-white sm:p-8">
      <p className="font-display text-2xl font-bold sm:text-3xl">Qual escola combina com você?</p>
      <p className="mt-2 text-white/80">Responda o quiz e descubra sua filosofia de vida e os pensadores mais parecidos com você.</p>
      <Link href="/" className="press group mt-5 inline-block rounded-full bg-card px-6 py-3 font-semibold text-ink">Fazer o quiz</Link>
    </div>
  );
}
