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
 * Converts snake_case slug to kebab-case for URL
 */
export function getPostUrl(post: Post): string {
  const slug = post.slug || generateSlug(post.title);
  // Convert snake_case to kebab-case for URL
  const urlSlug = slug.replace(/_/g, '-');
  const date = parseDate(post.date);
  const datePath = formatDatePath(date);
  return `/recap/${datePath}/${urlSlug}`;
}

/**
 * Find post by slug and date
 * URL slug is kebab-case, post.slug is snake_case, so we need to convert for comparison
 */
export function findPostBySlugAndDate(
  posts: Post[],
  year: string,
  month: string,
  day: string,
  urlSlug: string // This is already converted from kebab-case to snake_case
): Post | undefined {
  const targetDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  console.log('🔎 findPostBySlugAndDate:', {
    year,
    month,
    day,
    urlSlug,
    targetDate: targetDate.toISOString(),
    postsCount: posts.length
  });

  const found = posts.find((post) => {
    const postDate = parseDate(post.date);
    const postSlug = post.slug || '';
    
    // Compare dates
    const dateMatch = 
      postDate.getFullYear() === targetDate.getFullYear() &&
      postDate.getMonth() === targetDate.getMonth() &&
      postDate.getDate() === targetDate.getDate();
    
    // Compare slugs (both should be snake_case now)
    const slugMatch = postSlug === urlSlug;
    
    if (dateMatch && !slugMatch) {
      console.log('⚠️ Date matches but slug differs:', {
        postTitle: post.title,
        postSlug,
        urlSlug,
        postDate: postDate.toISOString(),
        targetDate: targetDate.toISOString()
      });
    }
    
    return dateMatch && slugMatch;
  });

  if (found) {
    console.log('✅ Post found:', found.title, '| Slug:', found.slug);
  } else {
    console.log('❌ No post found matching:', { year, month, day, urlSlug });
  }

  return found;
}

