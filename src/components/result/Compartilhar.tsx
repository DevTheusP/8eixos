'use client';

import { Link as LinkIcon, MessageCircle, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { whatsappUrl } from '@/lib/share';
import { track } from '@/lib/track';

export function Compartilhar({ params, escola, score, pensador }: { params: string; escola: string; score: number; pensador: string }) {
  const dados = () => ({ escola, score, pensador, url: location.href });
  const [status, setStatus] = useState<string | null>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const imagem = useRef<Promise<Blob> | null>(null);
  const preparar = () => (imagem.current ??= fetch(`/api/card?${params}`).then(r => r.blob()));

  // A imagem é gerada quando o botão aparece na tela: no toque, o menu de compartilhar abre na hora
  // (o Safari do iPhone só deixa abrir esse menu logo depois do toque, sem esperar a rede).
  useEffect(() => {
    const el = botao.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { preparar().catch(() => { imagem.current = null; }); io.disconnect(); } });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prepara uma vez por resultado
  }, [params]);

  async function compartilhar() {
    track('compartilhar_story', { escola });
    // O link vai copiado para colar no adesivo de link do story.
    try { await navigator.clipboard.writeText(location.href); } catch { /* sem permissão: segue sem o link copiado */ }
    try {
      if (!imagem.current) setStatus('Gerando imagem…');
      const blob = await preparar();
      const file = new File([blob], 'minha-filosofia.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        // Só a imagem, sem texto nem link: assim o Instagram aparece no menu com a opção Stories.
        await navigator.share({ files: [file] });
        setStatus('Link copiado: no story, use o adesivo de link e cole.');
        return;
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'minha-filosofia.png';
      a.click();
      URL.revokeObjectURL(a.href);
      setStatus('Imagem baixada e link copiado. Poste no story e cole o link no adesivo de link.');
    } catch (e) {
      // Cancelar o compartilhamento nativo lança AbortError: não é erro pra mostrar.
      if (!(e instanceof DOMException && e.name === 'AbortError')) { imagem.current = null; setStatus('Não deu pra gerar a imagem. Tente de novo.'); }
      else setStatus(null);
    }
  }

  async function copiarLink() {
    try {
      track('copiar_link', { escola });
      await navigator.clipboard.writeText(location.href);
      setStatus('Link copiado!');
    } catch {
      setStatus('Copie o endereço da barra do navegador.');
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button ref={botao} type="button" onClick={compartilhar} className="press inline-flex items-center gap-2 rounded-xl brilho px-4 py-2.5 text-sm font-semibold">
        <Share2 aria-hidden size={16} /> Postar no story do Instagram
      </button>
      <a
        href={whatsappUrl({ escola, score, pensador, url: '' })}
        onClick={e => { e.currentTarget.href = whatsappUrl(dados()); }}
        target="_blank"
        rel="noopener noreferrer"
        data-track="compartilhar_whatsapp"
        data-track-escola={escola}
        className="press inline-flex items-center gap-2 rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft"
      >
        <MessageCircle aria-hidden size={16} /> WhatsApp
      </a>
      <button type="button" onClick={copiarLink} className="press inline-flex items-center gap-2 rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft">
        <LinkIcon aria-hidden size={16} /> Copiar link
      </button>
      {status && <span className="text-sm text-brand" role="status">{status}</span>}
    </div>
  );
}
