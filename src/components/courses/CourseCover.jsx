import React, { useEffect, useRef, useState } from 'react';
import { courseImage } from '../../lib/format';
import styles from './CourseCover.module.css';

// One color per topic, so a page of covers looks planned rather than random.
const TOPIC_TONES = {
  'data analytics': 'volt',
  'data science': 'coral',
  'microsoft power bi': 'sky',
  'big data': 'lime',
  coding: 'butter',
  cybersecurity: 'lilac',
  'digital marketing': 'coral',
  java: 'sky',
};

// The course's picture when the platform has a real one (Udemy). Coursera
// only gives the school's or company's logo, so those get a color block with
// the logo set neatly in a white pill. A picture that fails to load falls
// back to the block too.
const CourseCover = ({ course, eager = false, className = '' }) => {
  const img = courseImage(course);
  const photo = useRef(null);
  const [broken, setBroken] = useState(false);

  // An image can fail before React is listening; catch that case too.
  useEffect(() => {
    const el = photo.current;
    if (el && el.complete && el.naturalWidth === 0) setBroken(true);
  }, []);

  if (img?.kind === 'cover' && !broken) {
    return (
      <img
        ref={photo}
        className={`${styles.photo} ${className}`}
        src={img.src}
        alt=""
        width="480"
        height="270"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        onError={() => setBroken(true)}
      />
    );
  }

  const tone = TOPIC_TONES[course.category] || 'butter';
  return (
    <div className={`${styles.block} ${styles[tone]} ${className}`} aria-hidden="true">
      {img?.kind === 'logo' ? (
        <span className={styles.pill}>
          <img src={img.src} alt="" loading={eager ? 'eager' : 'lazy'} />
        </span>
      ) : (
        <span className={`display ${styles.word}`}>{course.platform}</span>
      )}
    </div>
  );
};

export default CourseCover;
