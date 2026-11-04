import React from 'react';
import Link from 'next/link';
import CourseCover from './CourseCover';
import { coursePath, formatPrice, formatRating } from '../../lib/format';
import styles from './CourseCard.module.css';

// The whole card links to the course's page here (ratings, alternatives, and a
// link out to the platform). `compact` leaves out the image.
const CourseCard = ({ course, compact = false }) => {
  const isFree = course.pricing === 'audit' || course.pricing === 'free';

  return (
    <article className={styles.card}>
      {!compact && <CourseCover course={course} />}
      <div className={styles.body}>
        <p className={`label ${styles.meta}`}>{[course.platform, course.level].filter(Boolean).join(' · ')}</p>
        <h3 className={styles.title}>
          <Link href={coursePath(course)} className={styles.link}>{course.title}</Link>
        </h3>
        {course.instructor_names && <p className={styles.by}>{course.instructor_names}</p>}
        <div className={styles.facts}>
          <span className={styles.rating}>{formatRating(course)}</span>
          <span className={`chip ${isFree ? styles.free : styles.price}`}>{formatPrice(course)}</span>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
