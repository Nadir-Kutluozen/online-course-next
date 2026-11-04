// POST /api/reviews/helpful: upvote (1), downvote (-1) or take the vote back (0).
// One vote per visitor per review.
import { getCourse } from '../../../lib/courses';
import { db, findReview, voterHash } from '../../../lib/reviews';
import { guard, refreshCoursePage } from '../../../lib/reviewApi';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const { reviewId, vote } = req.body || {};
  if (![1, -1, 0].includes(vote)) return res.status(400).json({ error: 'Vote up, down or neither.' });

  const review = await findReview(reviewId).catch(() => null);
  if (!review) return res.status(404).json({ error: 'That rating was not found.' });

  const voter = voterHash(req);
  const table = db().from('review_helpful_votes');
  const { error } =
    vote === 0
      ? await table.delete().eq('review_id', review.id).eq('voter_hash', voter)
      : await table.upsert({ review_id: review.id, voter_hash: voter, helpful: vote === 1 }, { onConflict: 'review_id,voter_hash' });
  if (error) {
    console.error('vote failed:', error.message);
    return res.status(500).json({ error: 'Your vote could not be saved.' });
  }

  await refreshCoursePage(res, getCourse(review.course_id));
  return res.status(200).json({ ok: true });
}
