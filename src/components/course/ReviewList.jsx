import React, { useState } from 'react';
import { PAID_LABELS, TOOK_LABELS, VERDICT_LABELS } from '../../lib/format';
import styles from './Course.module.css';

const REASONS = [
  ['spam', 'Spam or an ad'],
  ['fake', 'Looks fake'],
  ['offensive', 'Rude or hateful'],
  ['off_topic', 'Not about this course'],
  ['personal_info', 'Shares personal info'],
];

// UTC so the server and the browser print the same month.
const monthYear = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(
    async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      return data;
    },
  );

const Review = ({ review, tagLabels }) => {
  const [counts, setCounts] = useState({ yes: Number(review.helpful) || 0, no: Number(review.not_helpful) || 0 });
  const [vote, setVote] = useState(null);
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [error, setError] = useState('');

  const sendVote = async (helpful) => {
    if (vote === helpful) return;
    setError('');
    try {
      await post('/api/reviews/helpful', { reviewId: review.id, helpful });
      setCounts((c) => ({
        yes: c.yes + (helpful ? 1 : 0) - (vote === true ? 1 : 0),
        no: c.no + (helpful ? 0 : 1) - (vote === false ? 1 : 0),
      }));
      setVote(helpful);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendReport = async (reason) => {
    setError('');
    try {
      await post('/api/reviews/report', { reviewId: review.id, reason });
      setReported(true);
      setReporting(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const scores = [
    review.ai_slop && `AI filler ${review.ai_slop}/5`,
    review.learned && `Learned ${review.learned}/5`,
    review.difficulty && `Difficulty ${review.difficulty}/5`,
    review.paid && `Paid: ${PAID_LABELS[review.paid].toLowerCase()}`,
  ].filter(Boolean);

  return (
    <article className={styles.review}>
      <div className={styles.reviewTop}>
        <span className={`chip ${review.verdict === 'worth_it' ? styles.worthChip : styles.grabChip}`}>
          {VERDICT_LABELS[review.verdict]}
        </span>
        <span className={styles.reviewMeta}>
          {TOOK_LABELS[review.took_course]} · {monthYear(review.updated_at)}
        </span>
      </div>
      {scores.length > 0 && <p className={styles.scores}>{scores.join(' · ')}</p>}
      {review.tags.length > 0 && (
        <ul className={styles.tagList}>
          {review.tags.map((t) => (
            <li key={t} className={`chip ${tagLabels[t]?.kind === 'good' ? styles.good : styles.bad}`}>
              {tagLabels[t]?.label || t}
            </li>
          ))}
        </ul>
      )}
      {review.comment && <p className={styles.comment}>{review.comment}</p>}
      <div className={styles.reviewActions}>
        <span className={styles.helpfulLabel}>Helpful?</span>
        <button type="button" className={`${styles.small} ${vote === true ? styles.smallOn : ''}`} onClick={() => sendVote(true)} aria-pressed={vote === true}>
          Yes {counts.yes > 0 && counts.yes}
        </button>
        <button type="button" className={`${styles.small} ${vote === false ? styles.smallOn : ''}`} onClick={() => sendVote(false)} aria-pressed={vote === false}>
          No {counts.no > 0 && counts.no}
        </button>
        {reported ? (
          <span className={styles.reportDone}>Thanks, we got your report.</span>
        ) : (
          <button type="button" className={styles.reportLink} onClick={() => setReporting((r) => !r)} aria-expanded={reporting}>
            Report
          </button>
        )}
      </div>
      {reporting && (
        <div className={styles.reportBox}>
          <span className="label">What&apos;s wrong with it?</span>
          <div className={styles.reportReasons}>
            {REASONS.map(([value, label]) => (
              <button key={value} type="button" className={styles.small} onClick={() => sendReport(value)}>{label}</button>
            ))}
          </div>
        </div>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </article>
  );
};

const ReviewList = ({ reviews, tagOptions }) => {
  const tagLabels = Object.fromEntries(tagOptions.map((t) => [t.code, t]));
  if (!reviews.length) return <p className={styles.noReviews}>No written reviews yet.</p>;
  return (
    <div className={styles.reviews}>
      {reviews.map((r) => <Review key={r.id} review={r} tagLabels={tagLabels} />)}
    </div>
  );
};

export default ReviewList;
