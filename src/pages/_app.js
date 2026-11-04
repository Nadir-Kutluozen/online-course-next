import '../styles/globals.css'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import localFont from 'next/font/local';
import { Archivo } from 'next/font/google';

// The same pair as Stew: Clash Display for big headings, Archivo for everything else.
// Clash Display (ITF Free Font License, see src/fonts) ships one cut, Semibold; declaring
// it for 500-900 makes bold headings use its real glyphs instead of a faked bold.
// Both are self-hosted by Next.js, so the browser never calls Google Fonts.
// Array, the dotted accent face, comes from Fontshare in _document.js and is used sparingly.
const clash = localFont({ src: '../fonts/ClashDisplay-Semibold.woff2', weight: '500 900', display: 'swap' });
const archivo = Archivo({ subsets: ['latin'], display: 'swap' });

// Site-wide tags only. Title, description and canonical belong in each page's <Head>:
// a canonical here was added to every page and pointed Google at the homepage.
export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-display: ${clash.style.fontFamily};
          --font-body: ${archivo.style.fontFamily};
        }
      `}</style>
      <Head>
        <link rel="icon" href="/logo.svg" />
        <script type="application/ld+json">
{`
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://www.onlinecoursecompare.com",
  "logo": "https://www.onlinecoursecompare.com/logo.svg"
}
`}
</script>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Analytics />
      <Footer />
    </>
  )
}
