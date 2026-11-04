import React from 'react';
import styles from './Course.module.css';

// Five little bars for a 1-5 average.
export const Bars = ({ value }) => (
  <span className={styles.bars} aria-hidden="true">
    {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= Math.round(value) ? styles.barOn : styles.barOff} />)}
  </span>
);

// The score people see first: what share of people who took it say it's worth it.
const ScoreCard = ({ summary, topTags, onRate }) => {
  if (!summary || !summary.reviews) {
    return (
      <div className={styles.score}>
        <p className={`display ${styles.scoreEmpty}`}>No ratings yet</p>
        <p className={styles.scoreSub}>Took it? Be the first to say if it was worth it.</p>
        <button type="button" className="btn btn-dark" onClick={onRate}>Rate this course</button>
      </div>
    );
  }

  const pct = Number(summary.worth_it_pct);
  return (
    <div className={styles.score}>
      <div className={styles.scoreTop}>
        <span className={`display ${styles.scoreNum}`}>{pct}%</span>
        <span className={styles.scoreWord}>say it&apos;s<br />worth it</span>
      </div>
      <div className={styles.split} role="img" aria-label={`${pct}% worth it, ${100 - pct}% money grab`}>
        <span className={styles.splitWorth} style={{ width: `${pct}%` }} />
        <span className={styles.splitGrab} style={{ width: `${100 - pct}%` }} />
      </div>
      <p className={styles.scoreSub}>
        {summary.reviews} {summary.reviews === 1 ? 'rating' : 'ratings'} · {summary.money_grab} called it a money grab
      </p>
      <dl className={styles.mini}>
        {summary.avg_ai_slop !== null && (
          <div><dt>AI filler</dt><dd><Bars value={summary.avg_ai_slop} /> {Number(summary.avg_ai_slop).toFixed(1)}</dd></div>
        )}
        {summary.avg_learned !== null && (
          <div><dt>Learned</dt><dd><Bars value={summary.avg_learned} /> {Number(summary.avg_learned).toFixed(1)}</dd></div>
        )}
      </dl>
      {topTags.length > 0 && (
        <ul className={styles.tagRow}>
          {topTags.slice(0, 3).map((t) => (
            <li key={t.tag} className={t.kind === 'good' ? styles.tagGood : styles.tagBad}>{t.label}</li>
          ))}
        </ul>
      )}
      <button type="button" className="btn btn-dark" onClick={onRate}>Rate this course</button>
    </div>
  );
};

export default ScoreCard;
