import { Post } from '@/types';

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse date string like "Aug 8, 2025" to Date object
 */
export function parseDate(dateStr: string): Date {
  const months: { [key: string]: number } = {
    'jan': 0, 'january': 0,
    'feb': 1, 'february': 1,
    'mar': 2, 'march': 2,
    'apr': 3, 'april': 3,
    'may': 4,
    'jun': 5, 'june': 5,
    'jul': 6, 'july': 6,
    'aug': 7, 'august': 7,
    'sep': 8, 'september': 8,
    'oct': 9, 'october': 9,
    'nov': 10, 'november': 10,
    'dec': 11, 'december': 11,
  };

  const parts = dateStr.replace(',', '').split(' ');
  const month = months[parts[0].toLowerCase()] ?? 0;
  const day = parseInt(parts[1]) || 1;
  const year = parseInt(parts[2]) || new Date().getFullYear();

  return new Date(year, month, day);
}

/**
 * Format date to YYYY/MM/DD
 */
export function formatDatePath(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Get post URL in format /recap/YYYY/MM/DD/slug
 */
export function getPostUrl(post: Post): string {
  const slug = post.slug || generateSlug(post.title);
  const date = parseDate(post.date);
  const datePath = formatDatePath(date);
  return `/recap/${datePath}/${slug}`;
}

/**
 * Find post by slug and date
 */
export function findPostBySlugAndDate(
  posts: Post[],
  year: string,
  month: string,
  day: string,
  slug: string
): Post | undefined {
  const targetDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  return posts.find((post) => {
    const postDate = parseDate(post.date);
    // Use post.slug directly (required field now)
    const postSlug = post.slug;
    
    return (
      postDate.getFullYear() === targetDate.getFullYear() &&
      postDate.getMonth() === targetDate.getMonth() &&
      postDate.getDate() === targetDate.getDate() &&
      postSlug === slug
    );
  });
}

