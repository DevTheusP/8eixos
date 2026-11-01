import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { SiteFooter } from '@/components/SiteFooter';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });
const cormorant = Cormorant_Garamond({ variable: '--font-cormorant', subsets: ['latin'], weight: ['500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: qual é a sua escola filosófica?`, template: `%s | ${SITE_NAME}` },
  description: 'Quiz anônimo que mostra qual escola filosófica de vida combina com você e quais pensadores pensam como você.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
