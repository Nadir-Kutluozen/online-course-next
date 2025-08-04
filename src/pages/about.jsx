// src/pages/about.jsx
import React from 'react';
import About from '../components/about/About';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Us | OnlineCourseCompare</title>
        <meta name="description" content="Learn about OnlineCourseCompare, my mission to help users find the best online courses." />
        <meta name="keywords" content="about online course compare, online course comparison project, who am I" />
        <meta name="author" content="Nadir Kutluozen" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.onlinecoursecompare.com/about" />
      </Head>
      <About></About>
    </>
  );
};

export default AboutPage;
