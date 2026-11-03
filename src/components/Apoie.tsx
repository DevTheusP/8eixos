'use client';

import { Check, Copy, Heart } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import { payloadPix } from '@/lib/pix';
import { PIX_CHAVE, PIX_CIDADE, PIX_NOME } from '@/lib/site';
import { track } from '@/lib/track';

const VALORES = [5, 10, 20];

// Apoio por Pix: QR code e "copia e cola" no padrão do Banco Central, com valores sugeridos ou valor livre.
export function Apoie({ id = 'apoie' }: { id?: string }) {
  const [valor, setValor] = useState<number | undefined>(10);
  const [qr, setQr] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const codigo = useMemo(() => payloadPix({ chave: PIX_CHAVE, nome: PIX_NOME, cidade: PIX_CIDADE, valor }), [valor]);

  useEffect(() => {
    let vivo = true;
    QRCode.toString(codigo, { type: 'svg', margin: 1, color: { dark: '#0b0d26', light: '#ffffff' } })
      .then(svg => { if (vivo) setQr(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`); })
      .catch(() => {});
    return () => { vivo = false; };
  }, [codigo]);

  async function copiar() {
    track('apoio_copiar', { valor: valor ?? 'livre' });
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // sem permissão de área de transferência: o código continua visível pra copiar na mão
    }
  }

  const escolher = (v: number | undefined) => { setValor(v); track('apoio_valor', { valor: v ?? 'livre' }); };

  return (
    <section id={id} className="reveal relative mt-24 scroll-mt-20 overflow-hidden rounded-[32px] border border-[#ffb4d9]/30 p-6 sm:p-10" style={{ background: 'linear-gradient(135deg, rgb(255 180 217 / 0.12), rgb(18 22 58 / 0.65) 55%, rgb(195 178 255 / 0.12))' }}>
      <span aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-60 w-60 rounded-full bg-[#ffb4d9]/20 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_auto]">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-[#ffb4d9]"><Heart aria-hidden size={16} className="fill-current" /> Apoie o projeto</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">O 8eixos é grátis e sem anúncios</h2>
          <p className="mt-3 max-w-xl text-mute">
            Se o quiz te fez pensar, um Pix de qualquer valor ajuda a manter o site no ar e a trazer novas escolas e pensadores.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {VALORES.map(v => (
              <button key={v} type="button" onClick={() => escolher(v)} aria-pressed={valor === v}
                className={`press rounded-full px-5 py-2.5 font-display text-sm font-bold transition-colors ${valor === v ? 'brilho' : 'border border-line bg-tile hover:bg-tile-strong'}`}>
                {`R$ ${v}`}
              </button>
            ))}
            <button type="button" onClick={() => escolher(undefined)} aria-pressed={valor === undefined}
              className={`press rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${valor === undefined ? 'brilho' : 'border border-line bg-tile hover:bg-tile-strong'}`}>
              Outro valor
            </button>
          </div>
          <textarea aria-label="Pix copia e cola" readOnly value={codigo} rows={2}
            className="mt-5 w-full max-w-xl resize-none rounded-xl border border-line bg-tile p-3 font-mono text-xs text-mute" onFocus={e => e.currentTarget.select()} />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copiar} className="press inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-bold text-bg">
              {copiado ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
              {copiado ? 'Código copiado!' : 'Copiar código Pix'}
            </button>
            <span className="text-xs text-mute">{valor ? `Valor de R$ ${valor},00 já preenchido.` : 'Você escolhe o valor no app do banco.'}</span>
          </div>
        </div>
        <div className="mx-auto flex flex-col items-center">
          <div className="rounded-3xl bg-white p-3 shadow-[0_30px_60px_-25px_rgb(255_180_217_/_0.5)]">
            {qr
              // eslint-disable-next-line @next/next/no-img-element -- QR gerado na hora no navegador
              ? <img src={qr} alt="QR code do Pix de apoio" width={200} height={200} className="h-[200px] w-[200px]" />
              : <div className="carregando h-[200px] w-[200px] rounded-xl" aria-hidden />}
          </div>
          <p className="mt-3 text-center text-xs text-mute">Aponte a câmera do app do seu banco</p>
        </div>
      </div>
    </section>
  );
}
