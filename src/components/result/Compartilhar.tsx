'use client';

import { Link as LinkIcon, Share2 } from 'lucide-react';
import { useState } from 'react';

export function Compartilhar({ params }: { params: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function compartilhar() {
    setStatus('Gerando imagem…');
    try {
      const blob = await (await fetch(`/api/card?${params}`)).blob();
      const file = new File([blob], 'minha-filosofia.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: 'Descobri minha filosofia de vida. E você?', url: location.href });
        setStatus(null);
        return;
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'minha-filosofia.png';
      a.click();
      URL.revokeObjectURL(a.href);
      setStatus('Imagem baixada. É só postar no story!');
    } catch (e) {
      // Cancelar o compartilhamento nativo lança AbortError: não é erro pra mostrar.
      setStatus(e instanceof DOMException && e.name === 'AbortError' ? null : 'Não deu pra gerar a imagem. Tente de novo.');
    }
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      setStatus('Link copiado!');
    } catch {
      setStatus('Copie o endereço da barra do navegador.');
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={compartilhar} className="press inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">
        <Share2 aria-hidden size={16} /> Compartilhar no story
      </button>
      <button type="button" onClick={copiarLink} className="press inline-flex items-center gap-2 rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft">
        <LinkIcon aria-hidden size={16} /> Copiar link
      </button>
      {status && <span className="text-sm text-brand" role="status">{status}</span>}
    </div>
  );
}
