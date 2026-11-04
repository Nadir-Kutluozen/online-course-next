// GET /api/keepalive: a tiny daily read (Vercel Cron, see vercel.json) so the
// free Supabase project never counts as inactive and gets paused.
import { db } from '../../lib/reviews';

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false });
  }
  res.setHeader('Cache-Control', 'no-store');
  const d = db();
  if (!d) return res.status(200).json({ ok: true, reviews: 'off' });
  const { error } = await d.from('review_tags').select('code').limit(1);
  if (error) return res.status(500).json({ ok: false });
  return res.status(200).json({ ok: true });
}
