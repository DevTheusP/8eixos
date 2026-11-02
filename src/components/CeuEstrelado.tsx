'use client';

import { useEffect, useRef } from 'react';

type Estrela = { x: number; y: number; z: number; r: number; f: number; v: number; cor: string };
type Cadente = { x: number; y: number; vx: number; vy: number; vida: number };

// Fundo vivo do site: estrelas que piscam, derivam devagar e reagem ao mouse, e uma estrela cadente de vez em quando.
// Com "reduzir movimento" ligado, desenha o céu uma vez e para.
export function CeuEstrelado() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, mx = 0, my = 0, ultimo = 0, quadro = 0;
    let estrelas: Estrela[] = [];
    let cadentes: Cadente[] = [];

    function montar() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv!.width = W * dpr; cv!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      estrelas = Array.from({ length: Math.round((W * H) / 2600) }, () => ({
        x: Math.random() * W, y: Math.random() * H, z: Math.random() ** 2,
        r: Math.random() * 1.3 + 0.2, f: Math.random() * Math.PI * 2, v: 0.6 + Math.random() * 1.8,
        cor: Math.random() < 0.12 ? '255,217,138' : Math.random() < 0.2 ? '185,168,255' : '255,255,255',
      }));
    }

    function desenhar(t: number) {
      ctx!.clearRect(0, 0, W, H);
      for (const s of estrelas) {
        const brilho = calmo ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t / 1000) * s.v + s.f));
        const dx = calmo ? 0 : -mx * 18 * s.z;
        const dy = calmo ? 0 : -my * 12 * s.z;
        if (!calmo) { s.x += 0.015 + s.z * 0.05; if (s.x > W + 5) s.x = -5; }
        ctx!.beginPath();
        ctx!.arc(s.x + dx, s.y + dy, s.r * (0.6 + s.z), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${s.cor},${brilho * (0.4 + s.z * 0.6)})`;
        ctx!.fill();
        if (s.r > 1.25) {
          ctx!.beginPath();
          ctx!.arc(s.x + dx, s.y + dy, s.r * 5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${s.cor},${brilho * 0.08})`;
          ctx!.fill();
        }
      }
      if (calmo) return;
      if (t - ultimo > 5200 + Math.random() * 4000) {
        cadentes.push({ x: Math.random() * W * 0.7 + W * 0.2, y: Math.random() * H * 0.35, vx: -(6 + Math.random() * 4), vy: 2.4 + Math.random() * 1.5, vida: 1 });
        ultimo = t;
      }
      cadentes = cadentes.filter(c => c.vida > 0);
      for (const c of cadentes) {
        const g = ctx!.createLinearGradient(c.x, c.y, c.x - c.vx * 14, c.y - c.vy * 14);
        g.addColorStop(0, `rgba(255,240,210,${c.vida})`);
        g.addColorStop(1, 'rgba(255,240,210,0)');
        ctx!.strokeStyle = g;
        ctx!.lineWidth = 1.6;
        ctx!.beginPath();
        ctx!.moveTo(c.x, c.y);
        ctx!.lineTo(c.x - c.vx * 14, c.y - c.vy * 14);
        ctx!.stroke();
        c.x += c.vx; c.y += c.vy; c.vida -= 0.012;
      }
      quadro = requestAnimationFrame(desenhar);
    }

    const mouse = (e: MouseEvent) => { mx = e.clientX / W - 0.5; my = e.clientY / H - 0.5; };
    const redimensionar = () => { montar(); if (calmo) desenhar(0); };
    montar();
    addEventListener('resize', redimensionar);
    addEventListener('mousemove', mouse);
    quadro = requestAnimationFrame(desenhar);
    return () => {
      cancelAnimationFrame(quadro);
      removeEventListener('resize', redimensionar);
      removeEventListener('mousemove', mouse);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(800px 500px at 80% 0%, rgb(122 92 255 / 0.22), transparent 60%), radial-gradient(700px 500px at 0% 100%, rgb(40 120 255 / 0.16), transparent 60%)',
        }}
      />
    </>
  );
}
