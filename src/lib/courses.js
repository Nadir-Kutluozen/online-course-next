// Server-only: import this from API routes or getStaticProps, never from a component,
// or the whole course list ends up in the browser bundle.
import allCourses from '../data/courses.json';
import { slugify } from './format';

export const PAGE_SIZE = 20;
const MAX_LIMIT = 50;
export const COURSE_COUNT = allCourses.length;

// Same filters the old FastAPI /courses and /courses/free endpoints supported, plus category.
export function queryCourses({
  search,
  rating,
  level,
  maxPrice,
  platform,
  category,
  free = false,
  skip = 0,
  limit = PAGE_SIZE,
} = {}) {
  const searchLower = search ? search.trim().toLowerCase() : '';
  const levelLower = level ? level.toLowerCase() : '';
  const platformLower = platform ? platform.trim().toLowerCase() : '';
  const categoryLower = category ? category.trim().toLowerCase() : '';
  const minRating = Number(rating) || 0;
  const priceCap = maxPrice === undefined || maxPrice === null || maxPrice === '' ? null : Number(maxPrice);

  const matches = allCourses.filter((c) => {
    if (free && c.price !== 0) return false;
    if (searchLower && !c.title.toLowerCase().includes(searchLower)) return false;
    if (minRating && !(c.rating >= minRating)) return false;
    if (levelLower && (c.level || '').toLowerCase() !== levelLower) return false;
    if (priceCap !== null && !(c.price !== null && c.price <= priceCap)) return false;
    if (platformLower && (c.platform || '').toLowerCase() !== platformLower) return false;
    if (categoryLower && (c.category || '').toLowerCase() !== categoryLower) return false;
    return true;
  });

  const start = Math.max(0, Number(skip) || 0);
  const size = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || PAGE_SIZE));
  return matches.slice(start, start + size);
}

// Topics with their real course counts, biggest first.
export function topicCounts() {
  const counts = new Map();
  for (const c of allCourses) {
    if (c.category) counts.set(c.category, (counts.get(c.category) || 0) + 1);
  }
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

const mostReviewed = (courses) => [...courses].sort((a, b) => (b.num_reviews || 0) - (a.num_reviews || 0))[0];

// Two real courses for the same goal (learning Python), one per platform, for the homepage.
export function heroPair() {
  const coursera = mostReviewed(allCourses.filter((c) => c.platform === 'Coursera' && c.rating >= 4.7 && /python/i.test(c.title)));
  const udemy = mostReviewed(allCourses.filter((c) => c.platform === 'Udemy' && /^python/i.test(c.title)));
  return [coursera, udemy];
}

// Real totals for the hero strip.
export function heroStats() {
  return {
    courses: allCourses.length,
    freeToAudit: allCourses.filter((c) => c.pricing === 'audit').length,
    reviews: allCourses.reduce((sum, c) => sum + (c.num_reviews || 0), 0),
  };
}

const byId = new Map(allCourses.map((c) => [c.id, c]));
export const getCourse = (id) => byId.get(Number(id)) || null;

// Course pages Google should index: ones people actually search for (100+
// platform reviews), or ones our own visitors have rated. The rest stay
// reachable but noindex, so thin pages can't drag the site down.
export const INDEX_MIN_REVIEWS = 100;
export const isIndexable = (course, communityReviews = 0) =>
  communityReviews > 0 || (course.num_reviews || 0) >= INDEX_MIN_REVIEWS;
export const indexableCourses = () => allCourses.filter((c) => (c.num_reviews || 0) >= INDEX_MIN_REVIEWS);

// "Worth a look" score: a high rating that many people back up.
const strength = (c) => (c.rating || 0) * Math.log10((c.num_reviews || 0) + 10);

const STOP = new Set([
  'the', 'and', 'for', 'with', 'from', 'your', 'you', 'into', 'how', 'what', 'course', 'courses',
  'introduction', 'intro', 'beginners', 'beginner', 'complete', 'guide', 'learn', 'learning',
  'part', 'using', 'masterclass', 'bootcamp', 'level', 'specialization', 'certificate', 'professional',
  // Filler that says nothing about the subject
  'get', 'getting', 'started', 'start', 'everybody', 'everyone', 'basics', 'basic', 'fundamentals',
  'essentials', 'foundations', 'foundation', 'advanced', 'intermediate', 'practical', 'hands', 'on',
  'new', 'easy', 'simple', 'zero', 'hero', 'ultimate', 'full', 'master', 'mastering', 'crash',
  'quick', 'step', 'by', 'all', 'one', 'ii', 'iii', 'iv', 'tips', 'tricks', 'way', 'real', 'world',
]);
const tokenCache = new Map();
const tokens = (c) => {
  if (!tokenCache.has(c.id)) {
    const words = c.title.toLowerCase().split(/[^a-z0-9+#]+/).filter((w) => w.length > 1 && !STOP.has(w));
    tokenCache.set(c.id, new Set(words));
  }
  return tokenCache.get(c.id);
};

// Other courses for the same goal: same topic when we know it, and titles that
// share real words. Highest rated with the most reviews first.
export function similarCourses(course, n = 4) {
  const mine = tokens(course);
  const title = course.title.toLowerCase();
  const scored = [];
  for (const c of allCourses) {
    if (c.id === course.id || c.title.toLowerCase() === title) continue;
    if (course.category && c.category !== course.category) continue;
    let shared = 0;
    for (const w of tokens(c)) if (mine.has(w)) shared += 1;
    if (!course.category && shared === 0) continue;
    // A shared subject word outweighs popularity (strength tops out around 25).
    scored.push([shared * 15 + strength(c), c]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, n).map(([, c]) => c);
}

// Topic pages: /topics/<slug>
export const topicSlugs = () => topicCounts().map((t) => ({ name: t.name, slug: slugify(t.name) }));
export const topicBySlug = (slug) => topicSlugs().find((t) => t.slug === slug)?.name || null;

export function topicOverview(name) {
  const inTopic = allCourses.filter((c) => c.category === name);
  const rated = inTopic.filter((c) => c.rating > 0);
  const best = [...rated].sort((a, b) => strength(b) - strength(a));
  const free = inTopic.filter((c) => c.pricing === 'audit');
  return {
    name,
    count: inTopic.length,
    freeToAudit: free.length,
    rated: rated.length,
    platforms: [...new Set(inTopic.map((c) => c.platform))],
    top: best.slice(0, 12),
    freePicks: best.filter((c) => c.pricing === 'audit' && !best.slice(0, 12).includes(c)).slice(0, 8),
    beginner: best.filter((c) => c.level === 'Beginner').slice(0, 4),
  };
}
