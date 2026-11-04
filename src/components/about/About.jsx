// src/components/about/About.jsx
import React from 'react';
import styles from './Page.module.css';

const SECTIONS = [
  {
    title: 'What I made',
    text: 'OnlineCourseCompare puts courses from Udemy and Coursera in one place, with their real prices, ratings and levels, so you can compare them side by side before you decide.',
  },
  {
    title: 'Why I built it',
    text: 'As a student, I got overwhelmed by all the courses out there, and some of them were not worth the money. I wanted a simple, honest way to compare them, so I made one myself.',
  },
  {
    title: 'Who it is for',
    text: 'Anyone about to pay for a course: students just starting out, people switching careers, and anyone leveling up their skills.',
  },
  {
    title: 'The bigger idea',
    text: 'Finding the right course should not be complicated. You should know what you are signing up for, whether there is a better option, and what people who took it really think.',
  },
];

const About = () => {
  return (
    <div className={`wrap section ${styles.page}`}>
      <h1 className="display h2">About</h1>
      <p className="lede">
        I built OnlineCourseCompare as a personal project while studying computer science, to make it
        easier to find, compare and choose online courses.
      </p>
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
