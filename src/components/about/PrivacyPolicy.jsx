import React from 'react';
import styles from './Page.module.css';

const SECTIONS = [
  {
    title: 'No personal info collected',
    text: 'I don’t collect names, emails or anything sensitive. You can browse freely: no sign-ups, no pop-ups, no spam.',
  },
  {
    title: 'Analytics for improvement',
    text: 'I use Google Analytics and Vercel Analytics to understand how people use the site: which pages get visited, what people search for, and how long they stay. This helps me make the site better without identifying you.',
  },
  {
    title: 'Ads',
    text: 'I use Google AdSense to show ads that keep this site free. Some ads may use cookies to personalize what you see, and you can turn those off in your browser.',
  },
  {
    title: 'You are in control',
    text: 'You are just browsing, and that is fine. I don’t ask for or track anything personal, and you stay in control of your own data.',
  },
];

const PrivacyPolicy = () => {
  return (
    <div className={`wrap section ${styles.page}`}>
      <h1 className="display h2">Privacy policy</h1>
      <p className="lede">Thanks for checking out OnlineCourseCompare. Here is what happens with your data.</p>
      <div className={styles.grid}>
        {SECTIONS.map((s) => (
          <section key={s.title} className={styles.card}>
            <h2 className={`display ${styles.cardTitle}`}>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
