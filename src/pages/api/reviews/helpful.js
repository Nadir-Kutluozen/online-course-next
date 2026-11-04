// POST /api/reviews/helpful: "Was this review helpful?" One vote per visitor,
// which they can change.
import { getCourse } from '../../../lib/courses';
import { db, findReview, voterHash } from '../../../lib/reviews';
import { guard, refreshCoursePage } from '../../../lib/reviewApi';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const { reviewId, helpful } = req.body || {};
  if (typeof helpful !== 'boolean') return res.status(400).json({ error: 'Say yes or no.' });

  const review = await findReview(reviewId).catch(() => null);
  if (!review) return res.status(404).json({ error: 'That review was not found.' });

  const { error } = await db()
    .from('review_helpful_votes')
    .upsert({ review_id: review.id, voter_hash: voterHash(req), helpful }, { onConflict: 'review_id,voter_hash' });
  if (error) {
    console.error('helpful vote failed:', error.message);
    return res.status(500).json({ error: 'Your vote could not be saved.' });
  }

  await refreshCoursePage(res, getCourse(review.course_id));
  return res.status(200).json({ ok: true });
}
