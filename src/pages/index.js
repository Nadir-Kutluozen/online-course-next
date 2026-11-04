import Head from 'next/head'
import { Hero, Questions, Topics, RateCta } from '../components/home/HomeSections'
import Compare from '../components/compare/Compare'
import { COURSE_COUNT, heroPair, heroStats, topicCounts } from '../lib/courses'

export default function HomePage({ courseCount, pair, stats, topics }) {
  return (
    <>
      <Head>
        <title>Compare Online Courses Before You Buy | OnlineCourseCompare</title>
        <meta name="google-site-verification" content="deaurSH-7sQaiipreMsppVW27TxCijtPN2GhD7oBnqE" />
        <meta name="description" content={`Compare ${courseCount.toLocaleString('en-US')} Udemy and Coursera courses side by side. See the real price, ratings and level, and find out if there's a better course before you pay.`} />
        <meta name="author" content="Nadir Kutluozen" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.onlinecoursecompare.com" />
      </Head>
      <Hero courseCount={courseCount} stats={stats} />
      <Questions />
      <Compare initialPair={pair} />
      <Topics topics={topics} courseCount={courseCount} />
      <RateCta />
    </>
  )
}

// Runs at build time: real counts and real courses, no placeholders.
export async function getStaticProps() {
  return {
    props: {
      courseCount: COURSE_COUNT,
      pair: heroPair(),
      stats: heroStats(),
      topics: topicCounts(),
    },
  };
}
