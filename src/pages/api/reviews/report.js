// POST /api/reviews/report: flag a review. Three reports hide it (the database
// does that), and it can be restored in the Supabase Table Editor.
import { getCourse } from '../../../lib/courses';
import { db, findReview, voterHash } from '../../../lib/reviews';
import { guard, refreshCoursePage } from '../../../lib/reviewApi';

const REASONS = ['spam', 'offensive', 'fake', 'off_topic', 'personal_info'];

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const { reviewId, reason } = req.body || {};
  if (!REASONS.includes(reason)) return res.status(400).json({ error: 'Pick a reason.' });

  const review = await findReview(reviewId).catch(() => null);
  if (!review) return res.status(404).json({ error: 'That review was not found.' });

  const { error } = await db()
    .from('review_reports')
    .insert({ review_id: review.id, voter_hash: voterHash(req), reason });
  // 23505: this visitor already reported it, which is fine.
  if (error && error.code !== '23505') {
    console.error('report failed:', error.message);
    return res.status(500).json({ error: 'Your report could not be sent.' });
  }

  await refreshCoursePage(res, getCourse(review.course_id));
  return res.status(200).json({ ok: true });
}
