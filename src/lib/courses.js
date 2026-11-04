// Server-only: import this from API routes or getStaticProps, never from a component,
// or the whole course list ends up in the browser bundle.
import allCourses from '../data/courses.json';

export const PAGE_SIZE = 20;
const MAX_LIMIT = 50;

// Same filters the old FastAPI /courses and /courses/free endpoints supported.
export function queryCourses({
  search,
  rating,
  level,
  maxPrice,
  platform,
  free = false,
  skip = 0,
  limit = PAGE_SIZE,
} = {}) {
  const searchLower = search ? search.trim().toLowerCase() : '';
  const levelLower = level ? level.toLowerCase() : '';
  const platformLower = platform ? platform.trim().toLowerCase() : '';
  const minRating = Number(rating) || 0;
  const priceCap = maxPrice === undefined || maxPrice === null || maxPrice === '' ? null : Number(maxPrice);

  const matches = allCourses.filter((c) => {
    if (free && c.price !== 0) return false;
    if (searchLower && !c.title.toLowerCase().includes(searchLower)) return false;
    if (minRating && !(c.rating >= minRating)) return false;
    if (levelLower && (c.level || '').toLowerCase() !== levelLower) return false;
    if (priceCap !== null && !(c.price !== null && c.price <= priceCap)) return false;
    if (platformLower && (c.platform || '').toLowerCase() !== platformLower) return false;
    return true;
  });

  const start = Math.max(0, Number(skip) || 0);
  const size = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || PAGE_SIZE));
  return matches.slice(start, start + size);
}
