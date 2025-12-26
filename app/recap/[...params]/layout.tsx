import { Metadata } from 'next';
import { query } from '@/lib/db';
import { getPostUrl, parseDate } from '@/utils/post';

const SITE_URL = process.env.SITE_URL || 'https://zerra.blog';

interface LayoutProps {
  params: Promise<{
    params: string[]
  }>
  children: React.ReactNode
}

// Generate metadata for each post
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  try {
    const { params: urlParams } = await params;
    
    // Skip metadata for preview mode
    if (urlParams && urlParams[0] === 'preview') {
      return {
        title: 'Preview',
        description: 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
      };
    }
    
    if (!urlParams || urlParams.length < 4) {
      return {
        title: 'Post Not Found',
        description: 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
      };
    }
    
    const [year, month, day, ...slugParts] = urlParams;
    const urlSlug = slugParts.join('-');
    
    // Fetch post from database
    const posts = await query<any[]>(
      `SELECT 
        p.*,
        a.name as author_name,
        a.avatar as author_avatar
      FROM posts p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ? AND p.is_deleted = 0`,
      [urlSlug]
    );
    
    if (posts.length === 0) {
      return {
        title: 'Post Not Found',
        description: 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
      };
    }
    
    const post = posts[0];
    
    // Verify date matches URL
    const postDate = parseDate(post.date);
    const urlDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    
    const dateMatch = 
      postDate.getFullYear() === urlDate.getFullYear() &&
      postDate.getMonth() === urlDate.getMonth() &&
      postDate.getDate() === urlDate.getDate();
    
    if (!dateMatch) {
      return {
        title: 'Post Not Found',
        description: 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
      };
    }
    
    const postUrl = getPostUrl(post);
    const fullUrl = postUrl.startsWith('http') ? postUrl : `${SITE_URL}${postUrl}`;
    const imageUrl = post.thumbnail || post.image || '';
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;
    
    return {
      title: post.title,
      description: post.excerpt || 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
      openGraph: {
        title: post.title,
        description: post.excerpt || 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
        url: fullUrl,
        siteName: 'Zerra Blog',
        type: 'article',
        publishedTime: postDate.toISOString(),
        authors: [post.author_name || 'Zerra Blog'],
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
        images: [fullImageUrl],
      },
      alternates: {
        canonical: fullUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post',
      description: 'Travel blog, AI, công nghệ và trải nghiệm toàn cầu',
    };
  }
}

export default function PostLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

