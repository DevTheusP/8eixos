import type { MetadataRoute } from 'next';
import { getSchools, getThinkers } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ['', '/sobre', '/escolas', '/pensadores', '/livros', '/privacidade'];
  return [
    ...fixas.map(p => ({ url: `${SITE_URL}${p}` })),
    ...getSchools().map(s => ({ url: `${SITE_URL}/escolas/${s.id}` })),
    ...getThinkers().map(t => ({ url: `${SITE_URL}/pensadores/${t.id}` })),
  ];
}
