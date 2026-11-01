import Link from 'next/link';

export function Invalido() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-line bg-card p-8 text-center">
      <h1 className="font-display text-3xl font-bold">Não conseguimos ler esse resultado</h1>
      <p className="mt-3 text-mute">O link pode estar incompleto ou ter sido alterado. Que tal fazer o quiz de novo?</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-[#14302a] px-6 py-3 font-semibold text-white">Fazer o quiz →</Link>
    </div>
  );
}
