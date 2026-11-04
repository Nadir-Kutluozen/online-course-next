// src/pages/about.jsx
import React from 'react';
import PrivacyPolicy from '../components/assets/PrivacyPolicy';
import Head from 'next/head';

const PrivacyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | OnlineCourseCompare</title>
        <meta name="description" content="Read our privacy policy to understand how we handle your data and protect your privacy at OnlineCourseCompare." />
        <meta name="keywords" content="privacy policy, data protection, online course compare" />
        <meta name="author" content="Nadir Kutluozen" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.onlinecoursecompare.com/privacy" />
      </Head>
      <PrivacyPolicy></PrivacyPolicy>
    </>
  );
};

export default PrivacyPage;
