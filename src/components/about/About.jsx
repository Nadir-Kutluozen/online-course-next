// src/components/about/About.jsx
import React from 'react';
import styles from './Page.module.css';

const SECTIONS = [
  { title: 'What it is', text: 'Udemy and Coursera courses in one place, compared side by side.' },
  { title: 'Why', text: 'Too many courses, and some are not worth the money.' },
  { title: 'Who it is for', text: 'Anyone about to pay for a course.' },
  { title: 'The idea', text: 'Know what you get, if there is a better option, and what people really think.' },
];

const About = () => {
  return (
    <div className={`wrap section ${styles.page}`}>
      <h1 className="display h2">About</h1>
      <p className="lede">A personal project, built while studying computer science.</p>
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

export default About;
