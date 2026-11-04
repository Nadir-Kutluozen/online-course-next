// Server-only: reviews live in Supabase and are reached with the project's
// secret key (SUPABASE_SECRET_KEY). Import this from API routes and
// getStaticProps only; the key must never reach the browser.
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

export const reviewsEnabled = () => Boolean(url && key);

let client = null;
export function db() {
  if (!reviewsEnabled()) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return client;
}

// One-way hash of the visitor's connection: one review per visitor per course,
// and no IP address is ever stored. Vercel sets these headers itself.
export function voterHash(req) {
  const h = req.headers;
  const first = (v) => (Array.isArray(v) ? v[0] : v || '').split(',')[0].trim();
  const ip =
    first(h['x-vercel-forwarded-for']) ||
    first(h['x-real-ip']) ||
    first(h['x-forwarded-for']) ||
    req.socket?.remoteAddress ||
    'unknown';
  return crypto.createHmac('sha256', key).update(`voter:${ip}`).digest('hex');
}

export const emptyReviews = (enabled = reviewsEnabled()) => ({
  enabled,
  summary: null,
  topTags: [],
  reviews: [],
  tagOptions: [],
});

const throwIf = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};

// Everything a course page shows: the summary, top tags, the reviews and the
// tags people can pick in the form.
export async function getCourseReviews(courseId) {
  const d = db();
  if (!d) return emptyReviews(false);
  const [summary, topTags, reviews, tagOptions] = await Promise.all([
    d.from('course_review_summary').select('*').eq('course_id', courseId).maybeSingle().then(throwIf),
    d.from('course_tag_counts')
      .select('tag, label, kind, uses')
      .eq('course_id', courseId)
      .order('uses', { ascending: false })
      .limit(8)
      .then(throwIf),
    d.from('course_review_feed')
      .select('id, took_course, verdict, ai_slop, learned, difficulty, paid, comment, created_at, updated_at, helpful, not_helpful, tags')
      .eq('course_id', courseId)
      .order('helpful', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(30)
      .then(throwIf),
    d.from('review_tags').select('code, label, kind').order('sort_order').then(throwIf),
  ]);
  return { enabled: true, summary, topTags, reviews, tagOptions };
}

// The published review a helpful vote or report is about, or null.
export async function findReview(reviewId) {
  const id = Number(reviewId);
  if (!Number.isInteger(id) || id <= 0) return null;
  return db().from('course_reviews').select('id, course_id').eq('id', id).eq('status', 'published').maybeSingle().then(throwIf);
}
