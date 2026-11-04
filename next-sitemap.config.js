// Runs after `next build` (postbuild) and writes public/sitemap*.xml and robots.txt.
const courses = require('./src/data/courses.json');

// Keep these two in step with src/lib/format.js (slugify) and
// src/lib/courses.js (INDEX_MIN_REVIEWS).
const INDEX_MIN_REVIEWS = 100;
const slugify = (text) =>
  String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');

module.exports = {
  // www is the canonical host; the bare domain redirects to it.
  siteUrl: 'https://www.onlinecoursecompare.com',
  generateRobotsTxt: true,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
  },
  // Course pages are built on first visit, so the build can't see them. List
  // the ones worth indexing: courses people search for (100+ platform reviews).
  // Language copies of one course (same platform and title) are left out; their
  // pages point Google to the main one (see mainCourse in src/lib/courses.js).
  additionalPaths: async (config) => {
    const main = new Map();
    for (const c of courses) {
      const key = `${c.platform}|${c.title.trim().toLowerCase()}`;
      const cur = main.get(key);
      const n = c.num_reviews || 0;
      if (!cur || n > (cur.num_reviews || 0) || (n === (cur.num_reviews || 0) && c.id < cur.id)) main.set(key, c);
    }
    const paths = [...main.values()]
      .filter((c) => (c.num_reviews || 0) >= INDEX_MIN_REVIEWS)
      .map((c) => config.transform(config, `/courses/${c.id}-${slugify(c.title)}`));
    return Promise.all(paths);
  },
};
