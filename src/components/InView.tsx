'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Segura as animações (via data-inview) até o bloco aparecer na tela, pra quem rola ainda ver o movimento.
export function InView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisto(true); // sem IntersectionObserver, mostra direto
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisto(true);
        io.disconnect();
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} data-inview={visto} className={className}>{children}</div>;
}
