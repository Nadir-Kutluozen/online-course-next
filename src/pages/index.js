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
        <meta name="description" content="Find and compare the best online courses from Udemy, Coursera, edX and more." />
      </Head>
      <Homepage />
      <Action />
      <LogoSlide/>
      <Section2 />
          </>
  )
}
