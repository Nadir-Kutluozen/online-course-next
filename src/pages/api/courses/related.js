// GET /api/courses/related?id=123: the courses most worth comparing with one course.
import { getCourse, relatedCourses } from '../../../lib/courses';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const course = getCourse(req.query.id);
  if (!course) return res.status(404).json({ error: 'That course was not found.' });

  const slim = ({ id, title, platform, pricing, price, rating, num_reviews, level }) =>
    ({ id, title, platform, pricing, price, rating, num_reviews, level });

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).json({ related: relatedCourses(course, 4).map(slim) });
}
