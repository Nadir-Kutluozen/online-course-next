import Head from 'next/head';
import Link from 'next/link';
import CourseCard from '../../components/courses/CourseCard';
import ReviewSummary from '../../components/course/ReviewSummary';
import ReviewList from '../../components/course/ReviewList';
import RateForm from '../../components/course/RateForm';
import { getCourse, isIndexable, similarCourses } from '../../lib/courses';
import { emptyReviews, getCourseReviews } from '../../lib/reviews';
import {
  SITE_URL,
  compactNumber,
  courseImage,
  coursePath,
  courseSlug,
  formatPrice,
  formatRating,
  languageName,
  topicLabel,
  topicPath,
} from '../../lib/format';
import styles from '../../components/course/Course.module.css';

const PLATFORM_SITES = { Udemy: 'https://www.udemy.com', Coursera: 'https://www.coursera.org' };

// "25 hours" -> "PT25H", "45 mins" -> "PT45M" (ISO 8601, for structured data)
const isoDuration = (text) => {
  const hours = /([\d.]+)\s*h/i.exec(text || '');
  if (hours) return `PT${hours[1]}H`;
  const mins = /([\d.]+)\s*m/i.exec(text || '');
  return mins ? `PT${mins[1]}M` : null;
};

const offerFor = (course) => {
  if (course.pricing === 'paid' && course.price) {
    return { '@type': 'Offer', category: 'Paid', price: course.price, priceCurrency: course.currency || 'USD' };
  }
  if (course.pricing === 'audit') return { '@type': 'Offer', category: 'Partially Free', price: 0, priceCurrency: 'USD' };
  if (course.pricing === 'free') return { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'USD' };
  return null;
};

// Course and breadcrumb structured data. The rating stars Google shows can
// only come from reviews collected here, so the platform's rating stays out.
function structuredData(course, url, topic) {
  const offer = offerFor(course);
  const workload = isoDuration(course.course_length);
  const lang = languageName(course.locale);
  const crumbs = [
    { name: 'Courses', item: `${SITE_URL}/courses` },
    ...(topic ? [{ name: topic.label, item: `${SITE_URL}${topic.path}` }] : []),
    { name: course.title, item: url },
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        '@id': `${url}#course`,
        name: course.title,
        description: course.headline || `${course.title}, an online course on ${course.platform}.`,
        url,
        provider: { '@type': 'Organization', name: course.platform, ...(PLATFORM_SITES[course.platform] && { sameAs: PLATFORM_SITES[course.platform] }) },
        ...(course.level && course.level !== 'All Levels' && { educationalLevel: course.level }),
        ...(lang && { inLanguage: lang.startsWith('English') ? 'en' : lang }),
        ...(offer && { offers: [offer] }),
        hasCourseInstance: [{ '@type': 'CourseInstance', courseMode: 'Online', ...(workload && { courseWorkload: workload }) }],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
      },
    ],
  };
}

function metaDescription(course, summary) {
  const parts = [`Is ${course.title} on ${course.platform} worth it?`];
  if (course.pricing === 'paid' && course.price) parts.push(`It costs $${course.price}.`);
  if (course.pricing === 'audit') parts.push('It is free to audit.');
  if (summary?.reviews) {
    parts.push(`${summary.worth_it_pct}% of people who took it here say it's worth it.`);
  } else if (course.rating && course.num_reviews) {
    parts.push(`Rated ${course.rating.toFixed(1)} by ${course.num_reviews.toLocaleString('en-US')} learners on ${course.platform}.`);
  }
  parts.push('See honest ratings and better options for the same goal.');
  return parts.join(' ');
}

export default function CoursePage({ course, similar, topic, reviews, indexable }) {
  const url = `${SITE_URL}${coursePath(course)}`;
  const title = `${course.title}: Worth It or a Money Grab? | OnlineCourseCompare`;
  const description = metaDescription(course, reviews.summary);
  const img = courseImage(course);
  const isFree = course.pricing === 'audit' || course.pricing === 'free';
  const lang = languageName(course.locale);

  const facts = [
    course.rating ? `${formatRating(course)} on ${course.platform}` : null,
    course.num_subscribers ? `${compactNumber(course.num_subscribers)} enrolled` : null,
    course.course_length || null,
    lang,
  ].filter(Boolean);

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
        {img?.kind === 'cover' && <meta property="og:image" content={img.src} />}
        <meta name="twitter:card" content={img?.kind === 'cover' ? 'summary_large_image' : 'summary'} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(course, url, topic)).replace(/</g, '\\u003c') }}
        />
      </Head>

      <div className={`wrap ${styles.page}`}>
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          <Link href="/courses">Courses</Link>
          {topic && <><span aria-hidden="true">/</span><Link href={topic.path}>{topic.label}</Link></>}
          <span aria-hidden="true">/</span>
          <span aria-current="page" className={styles.crumbHere}>{course.title}</span>
        </nav>

        <header className={styles.head}>
          <p className="label">{[course.platform, course.level].filter(Boolean).join(' · ')}</p>
          <h1 className={styles.title}>{course.title}</h1>
          {course.headline && <p className={`lede ${styles.headline}`}>{course.headline}</p>}
          <div className={styles.factsRow}>
            <span className={`chip ${isFree ? styles.free : styles.price}`}>{formatPrice(course)}</span>
            {facts.map((f) => <span key={f} className={styles.fact}>{f}</span>)}
          </div>
          {course.instructor_names && <p className={styles.by}>Taught by {course.instructor_names}</p>}
          <div className={styles.actions}>
            <a href="#rate" className="btn btn-primary">Rate this course</a>
            <a href={course.url} className="btn btn-outline" target="_blank" rel="noopener noreferrer nofollow">
              See it on {course.platform}
            </a>
          </div>
        </header>

        <ReviewSummary summary={reviews.summary} topTags={reviews.topTags} />

        {reviews.reviews.length > 0 && (
          <section className={styles.section} aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="display h2">What people who took it say</h2>
            <ReviewList reviews={reviews.reviews} tagOptions={reviews.tagOptions} />
          </section>
        )}

        <section id="rate" className={styles.section}>
          <RateForm course={course} tagOptions={reviews.tagOptions} enabled={reviews.enabled} />
        </section>

        {similar.length > 0 && (
          <section className={styles.section} aria-labelledby="similar-title">
            <h2 id="similar-title" className="display h2">Is there a better one?</h2>
            <p className={`lede ${styles.sectionLede}`}>
              Other {topic ? topic.label : 'courses'} for the same goal, the highest rated with the most reviews first.
            </p>
            <div className={styles.similar}>
              {similar.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
            {topic && (
              <Link href={topic.path} className={`btn btn-outline ${styles.moreLink}`}>
                See the best {topic.label} courses
              </Link>
            )}
          </section>
        )}
      </div>
    </>
  );
}

// Pages are built the first time someone opens them, then cached. A new
// rating rebuilds the page right away (see /api/reviews).
export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const course = getCourse(parseInt(params.slug, 10));
  if (!course) return { notFound: true, revalidate: 3600 };

  // Old or mistyped names redirect to the one real address.
  const slug = courseSlug(course);
  if (params.slug !== slug) {
    return { redirect: { destination: `/courses/${slug}`, permanent: true } };
  }

  let reviews = emptyReviews();
  let fresh = true;
  try {
    reviews = await getCourseReviews(course.id);
  } catch (err) {
    // The page still works without reviews; try again in a minute.
    console.error(`Reviews for course ${course.id} could not be loaded:`, err.message);
    fresh = false;
  }

  return {
    props: {
      course,
      similar: similarCourses(course, 4),
      topic: course.category ? { label: topicLabel(course.category), path: topicPath(course.category) } : null,
      reviews,
      indexable: isIndexable(course, reviews.summary?.reviews || 0),
    },
    revalidate: fresh ? 3600 : 60,
  };
}
