import Head from 'next/head';
import Link from 'next/link';
import CourseCover from '../../components/courses/CourseCover';
import { CheckIcon, CrossIcon, StarIcon } from '../../components/course/icons';
import { getCourse, isIndexable, mainCourse, relatedCourses } from '../../lib/courses';
import { getCourseReviews } from '../../lib/reviews';
import { compareCourses } from '../../lib/compare';
import {
  SITE_URL,
  TOOK_LABELS,
  compactNumber,
  comparePath,
  coursePath,
  formatPrice,
  languageName,
  parseCompareSlug,
  topicLabel,
  topicPath,
} from '../../lib/format';
import styles from '../../components/compare/ComparePage.module.css';

const ROWS = [
  ['Price', 'price', (c) => formatPrice(c)],
  ['Rating', 'rating', (c) => (c.rating ? `${c.rating.toFixed(1)} on ${c.platform}` : null)],
  ['Reviews', 'reviews', (c) => (c.num_reviews ? c.num_reviews.toLocaleString('en-US') : null)],
  ['Level', null, (c) => c.level],
  ['Length', null, (c) => c.course_length],
  ['Taught by', null, (c) => c.instructor_names],
  ['Language', null, (c) => languageName(c.locale)],
  ['Platform', null, (c) => c.platform],
];

const shortDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

// What people who took one course said here: the summary and a few ratings.
const PeopleSay = ({ course, summary, reviews }) => (
  <div className={styles.say}>
    <Link href={coursePath(course)} className={styles.sayTitle}>{course.title}</Link>
    {summary?.reviews ? (
      <p className={styles.sayScore}>
        <b className="display">{summary.worth_it_pct}%</b> say it&apos;s worth it · {summary.reviews} {summary.reviews === 1 ? 'rating' : 'ratings'}
      </p>
    ) : (
      <p className={styles.sayScore}>No ratings yet.</p>
    )}
    {reviews.map((r) => (
      <article key={r.id} className={styles.review}>
        <span className={`${styles.badge} ${r.verdict === 'worth_it' ? styles.badgeWorth : styles.badgeGrab}`}>
          {r.verdict === 'worth_it' ? <CheckIcon size={14} /> : <CrossIcon size={14} />}
          {r.verdict === 'worth_it' ? 'Worth it' : 'Money grab'}
        </span>
        {r.comment && <p className={styles.reviewText}>{r.comment}</p>}
        <span className={styles.reviewMeta}>{TOOK_LABELS[r.took_course]} · {shortDate(r.updated_at)}</span>
      </article>
    ))}
    <Link href={`${coursePath(course)}#rate`} className={`btn btn-dark ${styles.rateBtn}`}>Took it? Rate it</Link>
  </div>
);

export default function ComparePage({ a, b, summaries, reviews, moreA, moreB, topic, indexable }) {
  const courses = [a, b];
  const verdict = compareCourses(a, b, summaries[0], summaries[1]);
  const url = `${SITE_URL}${comparePath(a, b)}`;
  const winner = verdict.pick === null ? null : courses[verdict.pick];
  const title = `${a.title} vs ${b.title}: Which Is Better? | OnlineCourseCompare`;
  const description = `${a.title} vs ${b.title}, side by side: price, rating, level and what people who took them say.${winner ? ` Our pick: ${winner.title}.` : ''}`;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `${a.title} vs ${b.title}`,
        itemListElement: courses.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${coursePath(c)}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Courses', item: `${SITE_URL}/courses` },
          ...(topic ? [{ '@type': 'ListItem', position: 2, name: topic.label, item: `${SITE_URL}${topic.path}` }] : []),
          { '@type': 'ListItem', position: topic ? 3 : 2, name: `${a.title} vs ${b.title}`, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        {!indexable && <meta name="robots" content="noindex, follow" />}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      </Head>

      <div className={`wrap ${styles.page}`}>
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          <Link href="/#compare">Compare</Link>
          {topic && <><span aria-hidden="true">/</span><Link href={topic.path}>{topic.label}</Link></>}
        </nav>
        <h1 className={styles.title}>
          {a.title} <span className={styles.vs}>vs</span> {b.title}
        </h1>

        {/* The two courses, side by side, with our pick marked */}
        <div className={styles.heads}>
          {courses.map((c, i) => (
            <Link key={c.id} href={coursePath(c)} className={`${styles.head} ${verdict.pick === i ? styles.headPick : ''}`}>
              {verdict.pick === i && <span className={styles.pickBanner}>Our pick</span>}
              <CourseCover course={c} eager className={styles.cover} />
              <span className={styles.headBody}>
                <span className="label">{[c.platform, c.level].filter(Boolean).join(' · ')}</span>
                <span className={styles.headTitle}>{c.title}</span>
                <span className={styles.headFacts}>
                  <span className={`${styles.chip} ${c.pricing === 'audit' || c.pricing === 'free' ? styles.free : ''}`}>{formatPrice(c)}</span>
                  {c.rating ? <span className={styles.star}><StarIcon size={14} /> {c.rating.toFixed(1)}</span> : null}
                  {c.num_reviews ? <span>{compactNumber(c.num_reviews)} reviews</span> : null}
                </span>
                {verdict.pick === i && verdict.reasons.length > 0 && (
                  <span className={styles.reasons}>
                    {verdict.reasons.map((r) => <span key={r} className={styles.reason}><CheckIcon size={13} /> {r}</span>)}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>

        {!winner && <p className={styles.tie}>Too close to call: pick by level and style.</p>}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Detail</span></th>
                {courses.map((c) => <th scope="col" key={c.id}><span className={styles.oneLine}>{c.title}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, key, value]) => (
                <tr key={label}>
                  <th scope="row" className="label">{label}</th>
                  {courses.map((c, i) => (
                    <td key={c.id} className={key && verdict.winners[key] === i ? styles.win : ''}>
                      {value(c) || <span className={styles.none}>Not listed</span>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="label">People here say</th>
                {courses.map((c, i) => (
                  <td key={c.id} className={verdict.winners.community === i ? styles.win : ''}>
                    {summaries[i]?.reviews ? `${summaries[i].worth_it_pct}% worth it (${summaries[i].reviews})` : <span className={styles.none}>No ratings yet</span>}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <section className={styles.section} aria-labelledby="say-title">
          <h2 id="say-title" className={styles.sectionTitle}>Ratings</h2>
          <div className={styles.sayGrid}>
            {courses.map((c, i) => <PeopleSay key={c.id} course={c} summary={summaries[i]} reviews={reviews[i]} />)}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="more-title">
          <h2 id="more-title" className={styles.sectionTitle}>More comparisons</h2>
          <div className={styles.moreGrid}>
            {[[a, moreA], [b, moreB]].map(([base, list]) => (
              <div key={base.id}>
                <p className="label">{base.title} vs</p>
                <ul className={styles.moreList}>
                  {list.map((c) => (
                    <li key={c.id}><Link href={comparePath(base, c)}>{c.title}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

// Built on first visit and cached, like course pages.
export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

const topReviews = (list) =>
  [...list]
    .sort((x, y) => (Number(y.helpful) || 0) - (Number(y.not_helpful) || 0) - ((Number(x.helpful) || 0) - (Number(x.not_helpful) || 0)))
    .slice(0, 3);

export async function getStaticProps({ params }) {
  const ids = parseCompareSlug(params.pair);
  const a = ids && getCourse(ids[0]);
  const b = ids && getCourse(ids[1]);
  if (!a || !b || a.id === b.id) return { notFound: true, revalidate: 3600 };

  const canonical = comparePath(a, b);
  if (`/compare/${params.pair}` !== canonical) {
    return { redirect: { destination: canonical, permanent: true } };
  }

  let summaries = [null, null];
  let reviews = [[], []];
  let fresh = true;
  try {
    const both = await Promise.all([getCourseReviews(a.id), getCourseReviews(b.id)]);
    summaries = both.map((r) => r.summary || null);
    reviews = both.map((r) => topReviews(r.reviews || []));
  } catch (err) {
    console.error(`Reviews for ${a.id} vs ${b.id} could not be loaded:`, err.message);
    fresh = false;
  }

  const slim = ({ id, title }) => ({ id, title });
  const sameTopic = a.category && a.category === b.category;
  const indexable =
    mainCourse(a).id === a.id &&
    mainCourse(b).id === b.id &&
    isIndexable(a, summaries[0]?.reviews || 0) &&
    isIndexable(b, summaries[1]?.reviews || 0);

  return {
    props: {
      a,
      b,
      summaries,
      reviews,
      moreA: relatedCourses(a, 4).filter((c) => c.id !== b.id).slice(0, 3).map(slim),
      moreB: relatedCourses(b, 4).filter((c) => c.id !== a.id).slice(0, 3).map(slim),
      topic: sameTopic ? { label: topicLabel(a.category), path: topicPath(a.category) } : null,
      indexable,
    },
    revalidate: fresh ? 3600 : 60,
  };
}
