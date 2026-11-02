import { track as vercelTrack } from '@vercel/analytics';

type Props = Record<string, string | number | boolean>;

// Um só ponto pra eventos: Vercel Analytics sempre; Google Analytics só se o script dele estiver na página.
export function track(evento: string, props: Props = {}): void {
  try {
    vercelTrack(evento, props);
    const gtag = (window as { gtag?: (...a: unknown[]) => void }).gtag;
    gtag?.('event', evento, props);
  } catch {
    // medir nunca pode quebrar a página
  }
}
