import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: qual é a sua escola filosófica?`, template: `%s | ${SITE_NAME}` },
  description: 'Quiz anônimo que mostra qual escola filosófica de vida combina com você e quais pensadores pensam como você.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
