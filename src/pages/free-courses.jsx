// src/pages/FreeCoursesPage.jsx
import React from 'react';
import FreeCourseList from '../components/courses/FreeCourseList';
import Head from 'next/head';

const FreeCoursesPage = () => {
  return (
    <>
        <Head>
          <title>Free Online Courses | OnlineCourseCompare</title>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4949825107605621"
     crossorigin="anonymous"></script>
          <meta name="description" content="Find out best free online courses available now on platforms like Coursera, Udemy, and more on Online Course Compare " />
          <meta name="keywords" content="free online courses, free udemy courses, learn for free" />
          <meta name="author" content="Nadir Kutluozen" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://www.onlinecoursecompare.com/free-courses" />
        </Head>
      <FreeCourseList></FreeCourseList>
    </>
  );
};

export default FreeCoursesPage;
