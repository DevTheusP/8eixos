import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

// Seções do resultado: separadas por um filete dourado e espaço, sem caixa em volta.
export function Section({ id, title, icon: Icone, children, className = '' }: {
  id: string; title?: string; icon?: LucideIcon; children: ReactNode; className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-6 ${className}`}>
      <div className="filete mb-8" />
      {title && (
        <h2 className="mb-6 flex items-center gap-3 font-display text-3xl sm:text-4xl">
          {Icone && <Icone aria-hidden size={22} strokeWidth={1.8} className="text-gold" />}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

// Compatibilidade como número em serifa: mais legível que um anel e sem copiar o visual de outros quizzes.
export function Ring({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex-none text-right leading-none text-brand">
      <span className={`font-display ${size === 'md' ? 'text-5xl' : 'text-3xl'}`}>{Math.round(score)}%</span>
      <span className="block pt-1 text-xs font-semibold text-mute">compatível</span>
    </div>
  );
}
