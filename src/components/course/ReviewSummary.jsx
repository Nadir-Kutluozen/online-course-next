import React from 'react';
import styles from './Course.module.css';

// A 1-5 average shown as five segments.
const Meter = ({ label, value, low, high }) => (
  <div className={styles.meter}>
    <dt className="label">{label}</dt>
    <dd>
      {value === null || value === undefined ? (
        <span className={styles.meterEmpty}>Not rated yet</span>
      ) : (
        <>
          <span className={`display ${styles.meterValue}`}>{Number(value).toFixed(1)}<small>/5</small></span>
          <span className={styles.segments} aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= Math.round(value) ? styles.segOn : styles.seg} />
            ))}
          </span>
          <span className={styles.scale}><span>{low}</span><span>{high}</span></span>
        </>
      )}
    </dd>
  </div>
);

// What people who took the course said here, in one block. Real numbers only.
const ReviewSummary = ({ summary, topTags }) => {
  if (!summary || !summary.reviews) {
    return (
      <section className={`${styles.verdict} ${styles.verdictEmpty}`} aria-labelledby="verdict-title">
        <h2 id="verdict-title" className="display h2">Worth it or a money grab?</h2>
        <p className={styles.verdictText}>
          No one has rated this course here yet. Took it? Be the first to tell people the truth.
        </p>
        <a href="#rate" className="btn btn-dark">Rate this course</a>
      </section>
    );
  }

  const pct = Number(summary.worth_it_pct);
  const headline = pct > 55 ? 'Mostly worth it' : pct < 45 ? 'Mostly a money grab' : 'People are split';
  const people = summary.reviews === 1 ? '1 person who took it' : `${summary.reviews} people who took it`;

  return (
    <section className={styles.verdict} aria-labelledby="verdict-title">
      <p className="label">The verdict from {people}</p>
      <h2 id="verdict-title" className="display h2">{headline}</h2>
      <div>
        <div className={styles.bar} role="img" aria-label={`${pct}% say worth it, ${100 - pct}% say money grab`}>
          <span className={styles.barWorth} style={{ width: `${pct}%` }} />
          <span className={styles.barGrab} style={{ width: `${100 - pct}%` }} />
        </div>
        <div className={styles.barLegend} aria-hidden="true">
          <span><b className="display">{pct}%</b> worth it</span>
          <span><b className="display">{100 - pct}%</b> money grab</span>
        </div>
      </div>
      <dl className={styles.meters}>
        <Meter label="AI filler" value={summary.avg_ai_slop} low="Made by a person" high="Mostly AI" />
        <Meter label="Learned" value={summary.avg_learned} low="Nothing" high="A lot" />
        <Meter label="Difficulty" value={summary.avg_difficulty} low="Very easy" high="Very hard" />
        <div className={styles.meter}>
          <dt className="label">Dropped it</dt>
          <dd><span className={`display ${styles.meterValue}`}>{summary.dropped}<small> of {summary.reviews}</small></span></dd>
        </div>
      </dl>
      {topTags.length > 0 && (
        <ul className={styles.tagList} aria-label="What people said most">
          {topTags.map((t) => (
            <li key={t.tag} className={`chip ${t.kind === 'good' ? styles.good : styles.bad}`}>
              {t.label} <span className={styles.tagCount}>{t.uses}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReviewSummary;
