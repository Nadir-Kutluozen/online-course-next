import Head from 'next/head';
import Link from 'next/link';
import CourseCard from '../../components/courses/CourseCard';
import { topicBySlug, topicOverview, topicSlugs } from '../../lib/courses';
import { SITE_URL, coursePath, topicLabel, topicPath } from '../../lib/format';
import styles from '../../components/course/Topic.module.css';

const listOf = (items) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0] || '');

export default function TopicPage({ topic, others }) {
  const label = topicLabel(topic.name);
  const url = `${SITE_URL}${topicPath(topic.name)}`;
  const title = `Best ${label} Courses Online, Compared | OnlineCourseCompare`;
  const description = `We compared ${topic.count.toLocaleString('en-US')} ${label} courses from ${listOf(topic.platforms)}. ${topic.freeToAudit.toLocaleString('en-US')} are free to audit. See the highest rated, the best free ones, and which are worth the money.`;

  // Course list structured data: the ranked courses, each with its own page here.
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `Best ${label} courses`,
        itemListElement: topic.top.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${coursePath(c)}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Courses', item: `${SITE_URL}/courses` },
          { '@type': 'ListItem', position: 2, name: label, item: url },
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
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      </Head>

      <div className={`wrap ${styles.page}`}>
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          <Link href="/courses">Courses</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>

        <header className={styles.head}>
          <div className={styles.headText}>
            <h1 className="display">
              Best {label} courses, <span className="outline">compared</span>
            </h1>
            <p className={styles.sub}>Ranked by rating and how many people back it up.</p>
          </div>
          <dl className={styles.stats}>
            <div><dt className="label">Courses</dt><dd className="display">{topic.count.toLocaleString('en-US')}</dd></div>
            <div><dt className="label">Free to audit</dt><dd className="display">{topic.freeToAudit.toLocaleString('en-US')}</dd></div>
            <div><dt className="label">With a rating</dt><dd className="display">{topic.rated.toLocaleString('en-US')}</dd></div>
          </dl>
        </header>

        <section className={styles.section} aria-labelledby="top-title">
          <h2 id="top-title" className={styles.banner}>Highest rated</h2>
          <ol className={styles.grid}>
            {topic.top.map((c, i) => (
              <li key={c.id} className={styles.item}>
                <span className={`display ${styles.rank}`}>{i + 1}</span>
                <CourseCard course={c} />
              </li>
            ))}
          </ol>
        </section>

        {topic.beginner.length > 0 && (
          <section className={styles.section} aria-labelledby="beginner-title">
            <h2 id="beginner-title" className={`${styles.banner} ${styles.bannerSky}`}>Best for beginners</h2>
            <div className={styles.grid}>
              {topic.beginner.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </section>
        )}

        {topic.freePicks.length > 0 && (
          <section className={styles.section} aria-labelledby="free-title">
            <h2 id="free-title" className={`${styles.banner} ${styles.bannerLime}`}>Free to start</h2>
            <div className={styles.grid}>
              {topic.freePicks.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.more}>
            <Link href={`/courses?category=${encodeURIComponent(topic.name)}`} className="btn btn-primary">
              See all {topic.count.toLocaleString('en-US')} {label} courses
            </Link>
            {others.map((o) => (
              <Link key={o.slug} href={topicPath(o.name)} className="btn btn-outline">{topicLabel(o.name)}</Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: topicSlugs().map((t) => ({ params: { slug: t.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const name = topicBySlug(params.slug);
  if (!name) return { notFound: true };
  return {
    props: {
      topic: topicOverview(name),
      others: topicSlugs().filter((t) => t.name !== name),
    },
  };
}
