import { MetadataRoute } from 'next';
import { query } from '@/lib/db';
import { getPostUrl } from '@/utils/post';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch posts (slug and date are enough for URL generation)
    const posts = (await query<any[]>(
      'SELECT slug, date, updated_at FROM posts WHERE is_deleted = 0'
    )) || [];

    // Fetch categories (id and updated_at)
    const categories = (await query<any[]>(
      'SELECT id, updated_at FROM categories WHERE is_deleted = 0'
    )) || [];

    const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
      // Construct a minimal post-like object for getPostUrl
      const postLike = { slug: p.slug, date: p.date } as any;
      const path = getPostUrl(postLike);
      const url = `${SITE_URL}${path}`;

      const lastMod = p.updated_at ? new Date(p.updated_at).toISOString() : undefined;

      return {
        url,
        lastModified: lastMod,
      };
    });

    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => {
      const url = `${SITE_URL}/${encodeURIComponent(c.id)}`;
      const lastMod = c.updated_at ? new Date(c.updated_at).toISOString() : undefined;
      return {
        url,
        lastModified: lastMod,
      };
    });

    // Add some top-level static pages
    const staticEntries: MetadataRoute.Sitemap = [
      { url: SITE_URL, lastModified: new Date().toISOString() },
      { url: `${SITE_URL}/categories` },
      { url: `${SITE_URL}/about` },
      { url: `${SITE_URL}/contact` },
    ];

    return [...staticEntries, ...categoryEntries, ...postEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback minimal sitemap
    return [
      { url: SITE_URL, lastModified: new Date().toISOString() },
      { url: `${SITE_URL}/categories` },
    ];
  }
}
