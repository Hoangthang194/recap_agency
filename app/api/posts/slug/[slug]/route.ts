import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/posts/slug/[slug] - Lấy post theo slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Decode slug in case it's URL encoded
    const decodedSlug = decodeURIComponent(slug);
    
    const posts = await query<any[]>(
      `SELECT 
        p.*,
        a.id as author_id,
        a.name as author_name,
        a.avatar as author_avatar
      FROM posts p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ? AND p.is_deleted = 0`,
      [decodedSlug]
    );

    if (posts.length === 0) {
      // Try to find similar slugs for debugging
      const allPosts = await query<any[]>(
        `SELECT slug, title FROM posts WHERE is_deleted = 0 LIMIT 10`
      );
      
      return NextResponse.json(
        {
          success: false,
          error: `Post not found with slug: ${decodedSlug}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: posts[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

