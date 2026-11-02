import QRCode from 'qrcode';
import { SITE_URL } from './site';

type Dados = { escola: string; score: number; pensador: string; url: string };

export function textoCompartilhar({ escola, score, pensador }: Dados): string {
  return `Minha filosofia de vida é ${escola} (${Math.round(score)}%) e eu penso como ${pensador}. Qual é a sua?`;
}

export function whatsappUrl(d: Dados): string {
  return `https://wa.me/?text=${encodeURIComponent(`${textoCompartilhar(d)} ${d.url}`)}`;
}

// QR code em SVG pro card de story: no story o link não é clicável, a câmera resolve.
export async function qrDataUri(url: string, cor = '#171a2e'): Promise<string> {
  const svg = await QRCode.toString(url, { type: 'svg', margin: 1, color: { dark: cor, light: '#ffffff' } });
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function whatsappComparacao(eu: string, outro: string, score: number): string {
  return `https://wa.me/?text=${encodeURIComponent(`${eu} e ${outro}: ${score}% compatíveis na filosofia de vida. Faça o quiz e compare com a gente: ${SITE_URL}`)}`;
}
