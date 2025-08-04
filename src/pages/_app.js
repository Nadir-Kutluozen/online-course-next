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
        <meta name="description" content="Find and compare the best online courses from Udemy, Coursera, edX and more." />
        <meta name="keywords" content="online course compare, udemy vs coursera, best online course 2025" />
        <meta name="author" content="Nadir Kutluozen" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.onlinecoursecompare.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4949825107605621"
     crossorigin="anonymous"></script>
      </Head>
      <Header />
      <Component {...pageProps} />
      <Analytics />
      <Footer />
    </>
  )
}

