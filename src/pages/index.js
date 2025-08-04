import Head from 'next/head'
import Homepage from '../components/landingpage/homepage'
import Action from '../components/action/action'
import LogoSlide from '../components/assets/LogoSlide'
import Section2 from '../components/section2/section2'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Compare Online Courses | OnlineCourseCompare</title>
        <meta name="google-site-verification" content="deaurSH-7sQaiipreMsppVW27TxCijtPN2GhD7oBnqE" />
        <meta name="description" content="Find and compare the best online courses from Udemy, Coursera, edX and more." />
        <meta name="keywords" content="online course compare, udemy vs coursera, best online course 2025" />
        <meta name="author" content="Nadir Kutluozen" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.onlinecoursecompare.com" />
      </Head>
      <Homepage />
      <Action />
      <LogoSlide/>
      <Section2 />
          </>
  )
}
