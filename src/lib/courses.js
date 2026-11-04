// Server-only: import this from API routes or getStaticProps, never from a component,
// or the whole course list ends up in the browser bundle.
import allCourses from '../data/courses.json';

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
