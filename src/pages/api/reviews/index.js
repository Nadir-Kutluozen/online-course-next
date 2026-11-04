// POST /api/reviews: save (or update) one visitor's rating of one course.
import { getCourse } from '../../../lib/courses';
import { db, voterHash } from '../../../lib/reviews';
import { guard, refreshCoursePage } from '../../../lib/reviewApi';

const TOOK = ['finished', 'in_progress', 'dropped'];
const VERDICTS = ['worth_it', 'money_grab'];
const PAID = ['free', 'discount', 'full_price', 'subscription'];

// An optional 1-5 score: null when left out, NaN when it's not a valid score.
const score = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : NaN;
};

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const b = req.body || {};

  // Bots fill in every field, including this hidden one. Pretend it worked.
  if (b.website) return res.status(200).json({ ok: true });

  const course = getCourse(b.courseId);
  if (!course) return res.status(400).json({ error: 'That course was not found.' });
  if (!TOOK.includes(b.tookCourse)) return res.status(400).json({ error: 'Tell us if you took the course.' });
  if (!VERDICTS.includes(b.verdict)) return res.status(400).json({ error: 'Pick worth it or money grab.' });

  const aiSlop = score(b.aiSlop);
  const learned = score(b.learned);
  const difficulty = score(b.difficulty);
  if ([aiSlop, learned, difficulty].some(Number.isNaN)) {
    return res.status(400).json({ error: 'Scores go from 1 to 5.' });
  }

  const paid = b.paid ? String(b.paid) : null;
  if (paid && !PAID.includes(paid)) return res.status(400).json({ error: 'Pick what you paid.' });

  const comment = typeof b.comment === 'string' ? b.comment.trim() : '';
  if (comment && (comment.length < 10 || comment.length > 2000)) {
    return res.status(400).json({ error: 'Comments need 10 to 2,000 characters.' });
  }

  const tags = Array.isArray(b.tags) ? [...new Set(b.tags.filter((t) => typeof t === 'string'))] : [];
  if (tags.length > 5) return res.status(400).json({ error: 'Pick at most 5 tags.' });

  const { data, error } = await db().rpc('submit_review', {
    p_course_id: course.id,
    p_platform: course.platform,
    p_voter_hash: voterHash(req),
    p_took_course: b.tookCourse,
    p_verdict: b.verdict,
    p_ai_slop: aiSlop,
    p_learned: learned,
    p_difficulty: difficulty,
    p_paid: paid,
    p_comment: comment || null,
    p_tags: tags,
  });

  if (error) {
    if (/Too many reviews/i.test(error.message)) {
      return res.status(429).json({ error: 'That is a lot of ratings for one day. Please come back tomorrow.' });
    }
    if (error.code === '23503') return res.status(400).json({ error: 'One of those tags does not exist.' });
    console.error('submit_review failed:', error.message);
    return res.status(500).json({ error: 'Your rating could not be saved. Please try again.' });
  }

  await refreshCoursePage(res, course);
  return res.status(200).json({ ok: true, id: data });
}
