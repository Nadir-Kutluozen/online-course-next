// Shared checks for the review API routes. Server-only.
import { reviewsEnabled } from './reviews';
import { courseSlug } from './format';

// Only JSON posts: a browser can't send those cross-site without a preflight.
export function guard(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  if (!String(req.headers['content-type'] || '').includes('application/json')) {
    res.status(415).json({ error: 'Send JSON' });
    return false;
  }
  if (!reviewsEnabled()) {
    res.status(503).json({ error: 'Ratings are not switched on yet. Please try again later.' });
    return false;
  }
  res.setHeader('Cache-Control', 'no-store');
  return true;
}

// Rebuild the course page now, so the change shows up right away.
export async function refreshCoursePage(res, course) {
  if (!course) return;
  try {
    await res.revalidate(`/courses/${courseSlug(course)}`);
  } catch (err) {
    console.error('Could not refresh the course page:', err.message);
  }
}
