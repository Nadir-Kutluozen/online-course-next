import { queryCourses } from '../../lib/courses';

// Replaces the old Render backend. Query params match it:
// search, rating, level, max_price, platform, category, free, skip, limit
export default function handler(req, res) {
  const { search, rating, level, max_price, platform, category, free, skip, limit } = req.query;

  const courses = queryCourses({
    search,
    rating,
    level,
    maxPrice: max_price,
    platform,
    category,
    free: free === '1' || free === 'true',
    skip,
    limit,
  });

  // Course data only changes on deploy, so let Vercel's CDN cache each query.
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).json(courses);
}
