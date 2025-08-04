import '../styles/globals.css'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import '../components/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';  
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';




export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="./logo.svg" />
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
        
        <title>Online Course Compare</title>
      </Head>
      <Header />
      <Component {...pageProps} />
      <Analytics />
      <Footer />
    </>
  )
}

