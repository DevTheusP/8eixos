import type { Thinker } from '@/lib/types';

export function iniciais(nome: string): string {
  const partes = nome.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(p => p.length > 2 || /^[A-Z]/.test(p));
  const letras = partes.length > 1 ? [partes[0], partes.at(-1)!] : [partes[0] ?? '?'];
  return letras.map(p => p[0].toUpperCase()).join('');
}

export function Retrato({ thinker, size }: { thinker: Thinker; size: number }) {
  const style = { width: size, height: size };
  if (thinker.portrait) {
    // eslint-disable-next-line @next/next/no-img-element -- retratos pequenos e já otimizados em webp
    return <img src={`/retratos/${thinker.portrait.file}`} alt={thinker.name} style={style} className="flex-none rounded-2xl object-cover" />;
  }
  return (
    <div
      style={{ ...style, fontSize: size * 0.32 }}
      className="flex flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#b9b3a4] to-[#8d8677] font-display font-bold text-white"
      aria-label={thinker.name}
    >
      {iniciais(thinker.name)}
    </div>
  );
}
