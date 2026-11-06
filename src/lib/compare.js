// Which of two courses we'd pick, and why, from real numbers only: what it
// costs, its rating (weighted by how many people rated it), how many people
// rated it, and what people here said. Safe to use in the browser.
import { compactNumber } from './format';

// What you pay to start: free to audit counts as 0. Unknown stays unknown.
const cost = (c) => {
  if (c.pricing === 'audit' || c.pricing === 'free') return 0;
  if (c.pricing === 'paid' && typeof c.price === 'number') return c.price;
  return null;
};

// A rating pulled toward 4.4 when few people rated it, so a 4.9 from 12
// people doesn't beat a 4.8 from 50,000.
const weightedRating = (c) => {
  if (!c.rating) return null;
  const n = c.num_reviews || 0;
  return (c.rating * n + 4.4 * 30) / (n + 30);
};

const priceText = (c) => {
  if (cost(c) === 0) return c.pricing === 'audit' ? 'free to audit' : 'free';
  return `$${c.price}`;
};
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function compareCourses(a, b, summaryA, summaryB) {
  const courses = [a, b];
  const criteria = [];

  const ca = cost(a);
  const cb = cost(b);
  if (ca !== null && cb !== null && ca !== cb) {
    const w = ca < cb ? 0 : 1;
    criteria.push({
      key: 'price',
      weight: 2,
      winner: w,
      reason: `${capital(priceText(courses[w]))}, the other is ${priceText(courses[1 - w])}`,
    });
  }

  const ra = weightedRating(a);
  const rb = weightedRating(b);
  if (ra !== null && rb !== null && Math.abs(ra - rb) >= 0.04) {
    const w = ra > rb ? 0 : 1;
    criteria.push({
      key: 'rating',
      weight: 2,
      winner: w,
      reason: `Rated ${courses[w].rating.toFixed(1)} vs ${courses[1 - w].rating.toFixed(1)}`,
    });
  }

  const na = a.num_reviews || 0;
  const nb = b.num_reviews || 0;
  if (Math.max(na, nb) > 0 && Math.max(na, nb) >= 1.25 * Math.min(na, nb)) {
    const w = na > nb ? 0 : 1;
    criteria.push({
      key: 'reviews',
      weight: 1,
      winner: w,
      reason: `More people rated it (${compactNumber(courses[w].num_reviews)} vs ${compactNumber(courses[1 - w].num_reviews || 0)})`,
    });
  }

  // What people here said only counts once a few people have said it.
  if ((summaryA?.reviews || 0) >= 3 && (summaryB?.reviews || 0) >= 3) {
    const pa = Number(summaryA.worth_it_pct);
    const pb = Number(summaryB.worth_it_pct);
    if (Math.abs(pa - pb) >= 5) {
      const w = pa > pb ? 0 : 1;
      criteria.push({
        key: 'community',
        weight: 3,
        winner: w,
        reason: `${Math.max(pa, pb)}% of people here say it's worth it, vs ${Math.min(pa, pb)}%`,
      });
    }
  }

  const score = [0, 0];
  for (const c of criteria) score[c.winner] += c.weight;
  let pick = null;
  if (score[0] !== score[1]) pick = score[0] > score[1] ? 0 : 1;
  else if (ra !== null && rb !== null && ra !== rb) pick = ra > rb ? 0 : 1;

  return {
    pick,
    reasons: pick === null ? [] : criteria.filter((c) => c.winner === pick).map((c) => c.reason),
    winners: Object.fromEntries(criteria.map((c) => [c.key, c.winner])),
  };
}
