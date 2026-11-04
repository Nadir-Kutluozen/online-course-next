import React from 'react';
import Link from 'next/link';
import HatMascot from './HatMascot';
import Reveal, { RevealHeading } from '../motion/Reveal';
import { compactNumber, topicLabel } from '../../lib/format';
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
      <p className={`lede ${styles.heroLede}`}>
        See if there&apos;s a better course for the same goal, whether it&apos;s worth the money,
        and what people who took it really say.
      </p>
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

const QUESTIONS = [
  { color: 'butter', q: 'Is there a better one?', a: 'Put two courses side by side: price, rating, level, length and who teaches it.' },
  { color: 'coral', q: 'Is it worth the money?', a: 'See the real price, what is only free to audit, and whether people call it worth it or a money grab.' },
  { color: 'sky', q: 'Will you learn anything?', a: 'People who took it say how much they learned and whether it is still up to date.' },
  { color: 'lime', q: 'Is it your kind of course?', a: 'Beginner or advanced, hands-on or theory, taught by a person or padded with AI filler.' },
];

export const Questions = () => (
  <section className="wrap section">
    <RevealHeading>
      Know the{' '}
      <span className={styles.marked}>
        truth
        <svg className="m-draw" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d="M3 9C38 4 70 11 104 7 138 3 170 5 197 8" />
        </svg>
      </span>{' '}
      before you pay
    </RevealHeading>
    <Reveal className={styles.questions}>
      {QUESTIONS.map((item, i) => (
        <div key={item.q} className={`m-wipe ${styles.block} ${styles[item.color]}`} style={{ '--d': i }}>
          <h3 className={`display ${styles.blockTitle}`}>{item.q}</h3>
          <p>{item.a}</p>
        </div>
      ))}
    </Reveal>
  </section>
);

const TILE_COLORS = ['volt', 'coral', 'sky', 'lime'];

export const Topics = ({ topics, courseCount }) => {
  const top = topics.slice(0, 4);
  const rest = topics.slice(4);
  return (
    <section className="wrap section">
      <RevealHeading>Browse <span className="outline">by topic</span></RevealHeading>
      <Reveal className={styles.topics}>
        <Link href="/courses" className={`m-wipe ${styles.tile} ${styles.tileBig} ${styles.butter}`}>
          <span className={`display ${styles.tileName}`}>All {courseCount.toLocaleString('en-US')} courses</span>
          <span className="label">Udemy and Coursera</span>
        </Link>
        {top.map((t, i) => (
          <Link
            key={t.name}
            href={`/courses?category=${encodeURIComponent(t.name)}`}
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
          <Link key={t.name} href={`/courses?category=${encodeURIComponent(t.name)}`} className="btn btn-outline">
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
      <h2 className="display h2">
        <span className="m-mask"><span className="m-rise" style={{ '--d': 3 }}>Took a course? Tell people the truth</span></span>
      </h2>
      <p className={styles.rateText}>
        Was it worth it or a money grab? Did you learn anything? How much of it was AI filler?
        Your rating helps the next person decide. No account needed.
      </p>
      <span className={styles.ctaRow}>
        <Link href="/courses" className="btn btn-primary">Find your course</Link>
        {/* A hand-drawn arrow pointing at the button */}
        <svg className={`m-draw ${styles.arrow}`} viewBox="0 0 120 80" aria-hidden="true" style={{ '--d': 4 }}>
          <path pathLength="1" d="M114 6C110 40 82 62 16 60" />
          <path pathLength="1" d="M32 46 14 60 32 73" />
        </svg>
      </span>
      </div>
    </Reveal>
  </section>
);
