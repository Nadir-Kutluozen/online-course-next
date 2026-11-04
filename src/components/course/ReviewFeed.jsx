import React, { useMemo, useState } from 'react';
import { TOOK_LABELS } from '../../lib/format';
import { CheckIcon, CrossIcon, DownIcon, UpIcon } from './icons';
import styles from './Course.module.css';

const REASONS = [
  ['spam', 'Spam'],
  ['fake', 'Fake'],
  ['offensive', 'Rude'],
  ['off_topic', 'Off topic'],
  ['personal_info', 'Personal info'],
];

// UTC so the server and the browser print the same date.
const shortDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    return data;
  });

const netScore = (r) => (Number(r.helpful) || 0) - (Number(r.not_helpful) || 0);

const Rating = ({ review, tagLabels }) => {
  const [vote, setVote] = useState(0);
  const [score, setScore] = useState(netScore(review));
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [error, setError] = useState('');

  // Click the same arrow again to take the vote back.
  const cast = async (dir) => {
    const next = vote === dir ? 0 : dir;
    setError('');
    setScore((s) => s - vote + next);
    setVote(next);
    try {
      await post('/api/reviews/helpful', { reviewId: review.id, vote: next });
    } catch (err) {
      setScore((s) => s - next + vote);
      setVote(vote);
      setError(err.message);
    }
  };

  const report = async (reason) => {
    setError('');
    try {
      await post('/api/reviews/report', { reviewId: review.id, reason });
      setReported(true);
      setReporting(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const worth = review.verdict === 'worth_it';
  const facts = [
    review.ai_slop && `AI filler ${review.ai_slop}/5`,
    review.learned && `Learned ${review.learned}/5`,
    ...review.tags.map((t) => tagLabels[t]?.label || t),
  ].filter(Boolean);

  return (
    <article className={styles.rating}>
      <div className={styles.votes}>
        <button type="button" className={`${styles.voteBtn} ${vote === 1 ? styles.voteUp : ''}`} onClick={() => cast(1)} aria-pressed={vote === 1} aria-label="Upvote">
          <UpIcon />
        </button>
        <span className={`display ${styles.voteScore}`} aria-label={`Score ${score}`}>{score}</span>
        <button type="button" className={`${styles.voteBtn} ${vote === -1 ? styles.voteDown : ''}`} onClick={() => cast(-1)} aria-pressed={vote === -1} aria-label="Downvote">
          <DownIcon />
        </button>
      </div>
      <div className={styles.ratingBody}>
        <div className={styles.ratingTop}>
          <span className={`${styles.badge} ${worth ? styles.badgeWorth : styles.badgeGrab}`}>
            {worth ? <CheckIcon size={15} /> : <CrossIcon size={15} />}
            {worth ? 'Worth it' : 'Money grab'}
          </span>
          <span className={styles.ratingMeta}>{TOOK_LABELS[review.took_course]} · {shortDate(review.updated_at)}</span>
        </div>
        {review.comment && <p className={styles.comment}>{review.comment}</p>}
        {facts.length > 0 && <p className={styles.ratingFacts}>{facts.join(' · ')}</p>}
        <div className={styles.ratingFoot}>
          {reported ? (
            <span>Reported. Thanks.</span>
          ) : reporting ? (
            <span className={styles.reasons}>
              {REASONS.map(([value, label]) => (
                <button key={value} type="button" onClick={() => report(value)}>{label}</button>
              ))}
              <button type="button" onClick={() => setReporting(false)}>Cancel</button>
            </span>
          ) : (
            <button type="button" onClick={() => setReporting(true)}>Report</button>
          )}
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>
    </article>
  );
};

const ReviewFeed = ({ reviews, tagOptions, onRate }) => {
  const [sort, setSort] = useState('top');
  const tagLabels = useMemo(() => Object.fromEntries(tagOptions.map((t) => [t.code, t])), [tagOptions]);
  const sorted = useMemo(() => {
    const list = [...reviews];
    if (sort === 'top') list.sort((a, b) => netScore(b) - netScore(a) || (b.updated_at > a.updated_at ? 1 : -1));
    return list;
  }, [reviews, sort]);

  return (
    <section className={styles.feed} aria-labelledby="ratings-title">
      <div className={styles.feedHead}>
        <h2 id="ratings-title" className={`display ${styles.feedTitle}`}>
          Ratings <span className={styles.count}>{reviews.length}</span>
        </h2>
        {reviews.length > 1 && (
          <div className={styles.sort} role="group" aria-label="Sort ratings">
            {[['top', 'Top'], ['new', 'New']].map(([value, label]) => (
              <button key={value} type="button" className={sort === value ? styles.sortOn : ''} onClick={() => setSort(value)} aria-pressed={sort === value}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      {sorted.length ? (
        <div className={styles.ratings}>
          {sorted.map((r) => <Rating key={r.id} review={r} tagLabels={tagLabels} />)}
        </div>
      ) : (
        <div className={styles.feedEmpty}>
          <p>No one has rated this course yet.</p>
          <button type="button" className="btn btn-primary" onClick={onRate}>Be the first</button>
        </div>
      )}
    </section>
  );
};

export default ReviewFeed;
