import React from 'react';
import { UpIcon } from '../course/icons';
import styles from './RateTiles.module.css';

// Three tiles on the rating card, each with a small looping drawing of what
// rating here means. Drawings only: no numbers and no reviews, real or fake.
// The tiles uncover from the bottom once (m-wipe); the drawings then loop.
export default function RateTiles() {
  return (
    <ul className={styles.tiles}>
      <li className={`m-wipe ${styles.tile} ${styles.anon}`} style={{ '--d': 3 }}>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.redact}>
            <span className={styles.field}>Your name<i /></span>
            <span className={`${styles.field} ${styles.fieldLate}`}>Your email<i /></span>
          </div>
        </div>
        <p className={`display ${styles.name}`}>Anonymous</p>
        <p className={styles.line}>No name, no account</p>
      </li>

      <li className={`m-wipe ${styles.tile} ${styles.vote}`} style={{ '--d': 4 }}>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.rank}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={styles.row} style={{ '--i': i }}>
                <b><UpIcon size={14} strokeWidth={3.2} /></b>
                <i />
              </span>
            ))}
          </div>
        </div>
        <p className={`display ${styles.name}`}>Vote</p>
        <p className={styles.line}>Best ratings rise</p>
      </li>

      <li className={`m-wipe ${styles.tile} ${styles.pick}`} style={{ '--d': 5 }}>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.race}>
            <span className={styles.bar}><i /></span>
            <span className={`${styles.bar} ${styles.barWin}`}><i /></span>
            <span className={styles.stampMask}><span className={styles.stamp}>Our pick</span></span>
          </div>
        </div>
        <p className={`display ${styles.name}`}>Picks the winner</p>
        <p className={styles.line}>Ratings feed Our pick</p>
      </li>
    </ul>
  );
}
