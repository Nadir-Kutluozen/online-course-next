import React from 'react';
import Link from 'next/link';
import HatMascot from './HatMascot';
import RateTiles from './RateTiles';
import Reveal, { RevealHeading } from '../motion/Reveal';
import { compactNumber, topicLabel, topicPath } from '../../lib/format';
import styles from './Home.module.css';

// Each piece of the headline slides up inside its own mask once on load (--d is its delay step).
const Rise = ({ d, children }) => (
  <span className={styles.mask}><span className={styles.rise} style={{ '--d': d }}>{children}</span></span>
);

export const Hero = ({ courseCount, stats }) => (
  <section className={`wrap ${styles.hero}`}>
    <div className={styles.heroMain}>
      <h1 className={`display ${styles.title}`}>
        <span className={styles.line}><Rise d={0}>About to buy an</Rise></span>
        <span className={`${styles.line} outline`}><Rise d={1}>online course?</Rise></span>
        <span className={`${styles.line} ${styles.accent}`}><Rise d={2}>Compare it first.</Rise></span>
      </h1>
      <p className={`lede ${styles.heroLede}`}>Better options, real prices, honest ratings.</p>
      <div className={styles.searchSpot}>
        {/* The hat sits on top of the search bar; hover it and it talks */}
        <div className={styles.hatSpot} aria-hidden="true">
          <p className={styles.bubble}>
            <span className={styles.bubbleMask}><span className={styles.bubbleText}>Hmm, which one is worth it?</span></span>
            <svg viewBox="0 0 260 100" preserveAspectRatio="none">
              <path
                pathLength="1"
                d="M122 5C172 4 212 5 224 9 235 14 236 29 235 41L255 51 234 60C233 76 231 89 219 93 188 98 62 98 27 94 11 92 5 81 5 50 5 18 10 8 27 6 52 4 92 5 122 5Z"
              />
            </svg>
          </p>
          {/* The shadow sits outside the clip, so it falls on the bar */}
          <div className={styles.hatShadow}>
            <div className={styles.hatClip}>
              <div className={styles.hatRise}><HatMascot className={styles.hat} /></div>
            </div>
          </div>
        </div>
        <form className={styles.search} action="/courses" method="get" role="search">
          <label htmlFor="hero-search" className="sr-only">Search courses</label>
          <input
            id="hero-search"
            name="search"
            type="search"
            placeholder={`Search ${courseCount.toLocaleString('en-US')} courses`}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-dark">Search</button>
        </form>
      </div>
      <div className={styles.heroLinks}>
        <a href="#compare" className="btn btn-outline">Compare two courses</a>
        <a href="#rate" className="btn btn-outline">Rate a course you took</a>
      </div>
    </div>
    <dl className={styles.stats}>
      <div><dt className="label">Courses</dt><dd className="display">{stats.courses.toLocaleString('en-US')}</dd></div>
      <div><dt className="label">Free to audit</dt><dd className="display">{stats.freeToAudit.toLocaleString('en-US')}</dd></div>
      <div><dt className="label">Reviews counted</dt><dd className="display">{compactNumber(stats.reviews)}</dd></div>
    </dl>
  </section>
);

const TILE_COLORS = ['volt', 'coral', 'sky', 'lime'];

export const Topics = ({ topics, courseCount }) => {
  const top = topics.slice(0, 4);
  const rest = topics.slice(4);
  return (
    <section className={`wrap section ${styles.topicsView}`}>
      <RevealHeading>Hot <span className="outline">topics</span></RevealHeading>
      <Reveal className={styles.topics}>
        <Link href="/courses" className={`m-wipe ${styles.tile} ${styles.tileBig} ${styles.butter}`}>
          <span className={`display ${styles.tileName}`}>All {courseCount.toLocaleString('en-US')} courses</span>
          <span className="label">Udemy and Coursera</span>
        </Link>
        {top.map((t, i) => (
          <Link
            key={t.name}
            href={topicPath(t.name)}
            className={`m-wipe ${styles.tile} ${styles[TILE_COLORS[i]]}`}
            style={{ '--d': i + 1 }}
          >
            <span className={`display ${styles.tileName}`}>{topicLabel(t.name)}</span>
            <span className="label">{t.count.toLocaleString('en-US')} courses</span>
          </Link>
        ))}
      </Reveal>
      <div className={styles.more}>
        {rest.map((t) => (
          <Link key={t.name} href={topicPath(t.name)} className="btn btn-outline">
            {topicLabel(t.name)} <span className={styles.count}>{t.count.toLocaleString('en-US')}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export const RateCta = () => (
  <section id="rate" className="wrap section">
    <Reveal>
      <div className={`m-wipe ${styles.rate}`}>
        <div className={styles.rateMain}>
          <h2 className={`display ${styles.rateTitle}`}>
            <span className="m-mask"><span className="m-rise" style={{ '--d': 3 }}>Took a course? Tell people the truth</span></span>
          </h2>
          <p className={styles.rateText}>Anonymous. No account. Takes 30 seconds.</p>
          <span className={styles.ctaRow}>
            <Link href="/courses" className="btn btn-primary">Find your course</Link>
            {/* A hand-drawn arrow with a loop in it, pointing at the button. It
                draws itself, holds, wipes away, and goes again. */}
            <svg className={styles.arrow} viewBox="0 0 140 90" aria-hidden="true">
              <path pathLength="1" d="M128 4C134 32 114 52 94 49 72 46 72 22 88 24 106 26 100 62 18 64" />
              <path pathLength="1" d="M33 51 16 64 34 77" />
            </svg>
          </span>
        </div>
        <RateTiles />
      </div>
    </Reveal>
  </section>
);
