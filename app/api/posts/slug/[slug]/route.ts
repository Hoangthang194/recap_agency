import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/posts/slug/[slug] - Lấy post theo slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const posts = await query<any[]>(
      `SELECT 
        p.*,
        a.name as author_name,
        a.avatar as author_avatar
      FROM posts p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ? AND p.is_deleted = 0`,
      [slug]
    );

    if (posts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
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
    console.error('Error fetching post by slug:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

