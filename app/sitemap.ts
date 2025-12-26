import { MetadataRoute } from 'next';
import { query } from '@/lib/db';
import { getPostUrl } from '@/utils/post';

const SITE_URL = process.env.SITE_URL || 'https://zerra.blog';

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
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => {
      const url = `${SITE_URL}/${encodeURIComponent(c.id)}`;
      const lastMod = c.updated_at ? new Date(c.updated_at).toISOString() : undefined;
      return {
        url,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    // Add some top-level static pages
    const staticEntries: MetadataRoute.Sitemap = [
      { 
        url: SITE_URL, 
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      { 
        url: `${SITE_URL}/categories`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      { 
        url: `${SITE_URL}/about`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      { 
        url: `${SITE_URL}/contact`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
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
