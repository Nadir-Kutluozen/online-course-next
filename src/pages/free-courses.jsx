// src/pages/FreeCoursesPage.jsx
import React from 'react';
import FreeCourseList from '../components/courses/FreeCourseList';
import Head from 'next/head';
import { queryCourses } from '../lib/courses';

const FreeCoursesPage = ({ initialCourses }) => {
  return (
    <>
        <Head>
          <title>Free Online Courses | OnlineCourseCompare</title>
          <meta name="description" content="Find out best free online courses available now on platforms like Coursera, Udemy, and more on Online Course Compare " />
          <meta name="keywords" content="free online courses, free udemy courses, learn for free" />
          <meta name="author" content="Nadir Kutluozen" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://www.onlinecoursecompare.com/free-courses" />
        </Head>
      <FreeCourseList initialCourses={initialCourses}></FreeCourseList>
    </>
  );
};

// Runs at build time, so the first page of courses is in the HTML.
export async function getStaticProps() {
  return { props: { initialCourses: queryCourses({ free: true }) } };
}

export default FreeCoursesPage;
