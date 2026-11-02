'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

// Qualquer elemento com data-track="evento" (e data-track-* como detalhes) vira evento ao ser clicado.
export function TrackClicks() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const props: Record<string, string> = {};
      for (const [k, v] of Object.entries(el.dataset)) {
        if (k.startsWith('track') && k !== 'track' && v) props[k.slice(5, 6).toLowerCase() + k.slice(6)] = v;
      }
      track(el.dataset.track!, props);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
