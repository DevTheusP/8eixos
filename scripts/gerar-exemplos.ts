// Gera os cards de exemplo da home como imagens fixas (public/exemplos/*.webp), usando a mesma rota do card de story.
// Uso: npm run exemplos
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { GET } from '../src/app/api/card/route';
import { getVectors } from '../src/lib/data';
import { EXEMPLOS_LEQUE, vetorPrevia } from '../src/lib/exemplos';
import { vectorToParams } from '../src/lib/url';
import type { Vector } from '../src/lib/types';

const alvos: [string, Vector][] = [
  ...EXEMPLOS_LEQUE.map(id => [id, getVectors().schools[id]] as [string, Vector]),
  ['previa', vetorPrevia()],
];

async function main() {
  mkdirSync('public/exemplos', { recursive: true });
  for (const [id, v] of alvos) {
    const res = await GET(new Request(`http://local/api/card?${vectorToParams(v)}`));
    const png = Buffer.from(await res.arrayBuffer());
    const info = await sharp(png).resize(540).webp({ quality: 82 }).toFile(`public/exemplos/${id}.webp`);
    console.log(`✓ ${id}.webp (${Math.round(info.size / 1024)} KB)`);
  }
}

main();
