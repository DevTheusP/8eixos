import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import { SiteFooter } from '@/components/SiteFooter';
import { TrackClicks } from '@/components/TrackClicks';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'] });

// Google Analytics é opcional: só entra se o ID estiver configurado na Vercel.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: qual é a sua escola filosófica?`, template: `%s | ${SITE_NAME}` },
  description: 'Quiz anônimo que mostra qual escola filosófica de vida combina com você e quais pensadores pensam como você.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
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
