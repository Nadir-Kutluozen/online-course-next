// Display helpers shared by course cards and the compare tool.

// Price label that doesn't call a course "free" when only auditing it is free.
// `pricing` is set by scripts/export_courses.py.
export const formatPrice = (course) => {
  switch (course.pricing) {
    case 'audit':
      return 'Free to audit';
    case 'free':
      return 'Free';
    case 'unknown':
      return `See price on ${course.platform}`;
    default:
      return `$${course.price}`;
  }
};

export const formatRating = (course) => {
  if (!course.rating) return 'No rating yet';
  const reviews = course.num_reviews ? ` (${course.num_reviews.toLocaleString('en-US')} reviews)` : '';
  return `Rated ${course.rating.toFixed(1)}${reviews}`;
};

// Udemy stores a 125px-tall image, but its CDN also serves 480x270.
// Coursera only gives a university logo, so cards show it small and sharper.
export const courseImage = (course) => {
  if (!course.image) return null;
  if (course.platform === 'Udemy') {
    return { src: course.image.replace('/125_H/', '/480x270/'), kind: 'cover' };
  }
  return { src: course.image.replace('&h=45', '&h=96'), kind: 'logo' };
};

export const languageName = (locale) =>
  ({
    en_US: 'English',
    en_GB: 'English (UK)',
    es_ES: 'Spanish',
    fr_FR: 'French',
    de_DE: 'German',
    zh_CN: 'Chinese (Simplified)',
  }[locale] || locale || null);

// "microsoft power bi" -> "Microsoft Power BI"
export const topicLabel = (name) =>
  name
    .split(' ')
    .map((w) => (w === 'bi' ? 'BI' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');

// 3368970 -> "3.4M", 773955 -> "774K"
const compactFormat = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
export const compactNumber = (n) => compactFormat.format(n);
