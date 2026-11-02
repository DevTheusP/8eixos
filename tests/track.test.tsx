// @vitest-environment jsdom
import { fireEvent, render } from '@testing-library/react';
import { TrackClicks } from '@/components/TrackClicks';
import { track } from '@/lib/track';

const vercelTrack = vi.fn();
vi.mock('@vercel/analytics', () => ({ track: (...a: unknown[]) => vercelTrack(...a) }));

beforeEach(() => { vercelTrack.mockReset(); delete (window as { gtag?: unknown }).gtag; });

test('track envia pro Vercel e, se houver, pro Google Analytics', () => {
  const gtag = vi.fn();
  (window as { gtag?: unknown }).gtag = gtag;
  track('compartilhar_story', { escola: 'estoicismo' });
  expect(vercelTrack).toHaveBeenCalledWith('compartilhar_story', { escola: 'estoicismo' });
  expect(gtag).toHaveBeenCalledWith('event', 'compartilhar_story', { escola: 'estoicismo' });
});

test('cliques em elementos com data-track viram eventos', () => {
  const { getByText } = render(<><TrackClicks /><a href="#" data-track="clique_amazon" data-track-livro="Meditações">Ver</a></>);
  fireEvent.click(getByText('Ver'));
  expect(vercelTrack).toHaveBeenCalledWith('clique_amazon', { livro: 'Meditações' });
});
