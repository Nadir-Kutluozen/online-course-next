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
  additionalPaths: async (config) => {
    const paths = courses
      .filter((c) => (c.num_reviews || 0) >= INDEX_MIN_REVIEWS)
      .map((c) => config.transform(config, `/courses/${c.id}-${slugify(c.title)}`));
    return Promise.all(paths);
  },
};
