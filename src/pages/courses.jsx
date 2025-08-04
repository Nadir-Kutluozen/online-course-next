// src/pages/about.jsx
import React from 'react';
import CourseList from '../components/courses/CourseList';
import Head from 'next/head';

const CoursesPage = () => {
  return (
    <>
      <Head>
          <title>All Courses | OnlineCourseCompare</title>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4949825107605621"
     crossorigin="anonymous"></script>
          <meta name="description" content="Browse and compare top-rated online courses from leading platforms like Udemy, Coursera, and edX." />
          <meta name="keywords" content="compare online courses, course ratings, course listings, Udemy, Coursera" />
          <meta name="author" content="Nadir Kutluozen" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://www.onlinecoursecompare.com/courses" />
      </Head>
      <CourseList></CourseList>
    </>
  );
};

export default CoursesPage;
