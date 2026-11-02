import { GET } from '@/app/api/card/route';
import { getVectors } from '@/lib/data';
import { vectorToParams } from '@/lib/url';

test('gera PNG para resultado válido', async () => {
  const v = getVectors().schools['estoicismo'];
  const res = await GET(new Request(`http://x/api/card?${vectorToParams(v)}`));
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toBe('image/png');
  const buf = new Uint8Array(await res.arrayBuffer());
  expect([...buf.slice(1, 4)].map(c => String.fromCharCode(c)).join('')).toBe('PNG');
}, 30000);

test('parâmetros inválidos → 400', async () => {
  const res = await GET(new Request('http://x/api/card?c=abc'));
  expect(res.status).toBe(400);
});

test('card traz QR code apontando pro resultado', async () => {
  const { qrDataUri } = await import('@/lib/share');
  const uri = await qrDataUri('https://8eixos.vercel.app/resultado?c=1');
  expect(uri.startsWith('data:image/svg+xml')).toBe(true);
});

test('retrato do pensador embutido no card (ou nada, se não houver foto)', async () => {
  const { retratoDataUri } = await import('@/lib/card-assets');
  const { getThinkers } = await import('@/lib/data');
  const com = getThinkers().find(t => t.id === 'marco-aurelio')!;
  const sem = getThinkers().find(t => !t.portrait)!;
  expect(retratoDataUri(com)?.startsWith('data:image/jpeg;base64,')).toBe(true);
  expect(retratoDataUri(sem)).toBeNull();
});

test('ícones do card viram SVG puro (sem componente React)', async () => {
  const { iconeSvg } = await import('@/lib/card-assets');
  const { POLE_ICONS } = await import('@/lib/icons');
  for (const par of Object.values(POLE_ICONS)) {
    expect(iconeSvg(par.A, '#000', 24)?.type).toBe('svg');
    expect(iconeSvg(par.B, '#000', 24)?.type).toBe('svg');
  }
});

test('card carrega as fontes do site, com peso de título e de texto', async () => {
  const { cardFonts } = await import('@/lib/card-assets');
  const fontes = cardFonts();
  expect(fontes.find(f => f.name === 'Bricolage' && f.weight === 800)?.data.byteLength).toBeGreaterThan(10000);
  expect(fontes.find(f => f.name === 'Inter' && f.weight === 400)?.data.byteLength).toBeGreaterThan(10000);
});

test('cada eixo tem uma cor própria no card, todas diferentes', async () => {
  const { CORES_EIXO } = await import('@/lib/card-assets');
  const { AXIS_IDS } = await import('@/lib/types');
  const cores = AXIS_IDS.map(a => CORES_EIXO[a]);
  expect(cores.every(c => /^#[0-9a-f]{6}$/i.test(c))).toBe(true);
  expect(new Set(cores).size).toBe(8);
});

test('cor de fundo do card é a cor da família escurecida', async () => {
  const { escurecer } = await import('@/lib/card-assets');
  expect(escurecer('#ffffff', 0.5)).toBe('#808080');
  expect(escurecer('#2f5d8a', 0)).toBe('#2f5d8a');
});

test('cada eixo do card mostra o lado pra onde a pessoa pende, mesmo perto do meio', async () => {
  const { poloDoCard } = await import('@/lib/labels');
  const { getAxes } = await import('@/lib/data');
  const controle = getAxes().find(a => a.id === 'controle')!;
  expect(poloDoCard(controle, 20)).toEqual({ lado: 'A', nome: 'Aceitar', percent: 80, decidido: true });
  expect(poloDoCard(controle, 56)).toEqual({ lado: 'B', nome: 'Transformar', percent: 56, decidido: false });
  expect(poloDoCard(controle, 50)).toMatchObject({ nome: 'Aceitar', percent: 50, decidido: false });
});
