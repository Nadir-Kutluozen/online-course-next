import React from 'react';
import Link from 'next/link';
import { compactNumber, coursePath, formatPrice } from '../../lib/format';
import { StarIcon } from './icons';
import styles from './Course.module.css';

// "Like this one, but cheaper": a short list, one line of facts each.
const Alternatives = ({ alternatives, topic }) => {
  if (!alternatives.courses.length) return null;
  return (
    <section className={styles.alts} aria-labelledby="alts-title">
      <h2 id="alts-title" className={styles.sideTitle}>
        {alternatives.kind === 'cheaper' ? 'Like this, but cheaper' : 'More free ones like this'}
      </h2>
      <ul className={styles.altList}>
        {alternatives.courses.map((c) => {
          const free = c.pricing === 'audit' || c.pricing === 'free';
          return (
            <li key={c.id}>
              <Link href={coursePath(c)} className={styles.alt}>
                <span className={styles.altTitle}>{c.title}</span>
                <span className={styles.altMeta}>
                  <span className={`${styles.altPrice} ${free ? styles.altFree : ''}`}>{formatPrice(c)}</span>
                  <span className={styles.altStar}><StarIcon size={13} /> {c.rating.toFixed(1)}</span>
                  {c.num_reviews ? <span>{compactNumber(c.num_reviews)} reviews</span> : null}
                  <span>{c.platform}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {topic && <Link href={topic.path} className={styles.altMore}>Best {topic.label} courses</Link>}
    </section>
  );
};

export default Alternatives;
