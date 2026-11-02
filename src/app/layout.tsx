import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Manrope, Unbounded } from 'next/font/google';
import { CeuEstrelado } from '@/components/CeuEstrelado';
import { SiteFooter } from '@/components/SiteFooter';
import { TrackClicks } from '@/components/TrackClicks';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });
const unbounded = Unbounded({ variable: '--font-unbounded', subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// Google Analytics é opcional: só entra se o ID estiver configurado na Vercel.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: qual é a sua escola filosófica?`, template: `%s | ${SITE_NAME}` },
  description: 'Quiz anônimo que mostra qual escola filosófica de vida combina com você e quais pensadores pensam como você.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <CeuEstrelado />
        {children}
        <SiteFooter />
        <TrackClicks />
        <Analytics />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
