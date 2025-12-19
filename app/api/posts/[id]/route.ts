import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/posts/[id] - Lấy post theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const posts = await query<any[]>(
      `SELECT 
        p.*,
        a.name as author_name,
        a.avatar as author_avatar
      FROM posts p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.id = ? AND p.is_deleted = 0`,
      [id]
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
    console.error('Error fetching post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Cập nhật post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      excerpt,
      image,
      thumbnail,
      category,
      author,
      date,
      readTime,
      slug,
      content,
      sidebarBanner,
    } = body;

    // Validation
    if (!title || !excerpt || !image || !thumbnail || !category || !author || !date || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, excerpt, image, thumbnail, category, author, date, slug are required',
        },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await query<any[]>(
      'SELECT id FROM posts WHERE id = ?',
      [id]
    );

    if (existingPost.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Post with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Check if slug already exists (for another post)
    const existingSlug = await query<any[]>(
      'SELECT id FROM posts WHERE slug = ? AND id != ?',
      [slug, id]
    );

    if (existingSlug.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Post with slug "${slug}" already exists`,
        },
        { status: 409 }
      );
    }

    // Validate category exists
    const categoryExists = await query<any[]>(
      'SELECT id FROM categories WHERE id = ? AND is_deleted = 0',
      [category]
    );
    if (categoryExists.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Category with ID "${category}" does not exist`,
        },
        { status: 404 }
      );
    }

    // Validate author exists
    let authorId: string | null = null;
    
    if (typeof author === 'object' && author !== null) {
      authorId = author.id || null;
    } else if (typeof author === 'string') {
      authorId = author;
    }
    
    // If authorId is undefined or null, return error
    if (!authorId || authorId === 'undefined' || authorId === 'null') {
      return NextResponse.json(
        {
          success: false,
          error: 'Author ID is required',
        },
        { status: 400 }
      );
    }
    
    const authorExists = await query<any[]>(
      'SELECT id FROM authors WHERE id = ?',
      [authorId]
    );
    if (authorExists.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Author with ID "${authorId}" does not exist`,
        },
        { status: 404 }
      );
    }

    // Update post
    const updateSql = `
      UPDATE posts SET
        title = ?,
        excerpt = ?,
        image = ?,
        thumbnail = ?,
        category_id = ?,
        author_id = ?,
        date = ?,
        read_time = ?,
        slug = ?,
        content = ?,
        sidebar_banner = ?
      WHERE id = ?
    `;

    // Ensure all values are not undefined - convert to null if needed
    const updateParams = [
      title || null,
      excerpt || null,
      image || null,
      thumbnail || null,
      category || null,
      authorId || null,
      date || null,
      readTime !== undefined ? readTime : null,
      slug || null,
      content !== undefined ? content : null,
      sidebarBanner ? JSON.stringify(sidebarBanner) : null,
      id,
    ];

    // Validate no undefined values
    if (updateParams.some(param => param === undefined)) {
      console.error('Update params contain undefined:', updateParams);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data: some fields are undefined',
        },
        { status: 400 }
      );
    }

    await query(updateSql, updateParams);

    // Fetch the updated post with joined data
    const [updatedPost] = await query<any[]>(
      `SELECT 
        p.*,
        a.name as author_name,
        a.avatar as author_avatar
      FROM posts p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.id = ?`,
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Post updated successfully',
        data: updatedPost,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Xóa post (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if post exists
    const existingPost = await query<any[]>(
      'SELECT id FROM posts WHERE id = ?',
      [id]
    );

    if (existingPost.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Post with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Soft delete: Set is_deleted = 1
    await query('UPDATE posts SET is_deleted = 1 WHERE id = ?', [id]);

    return NextResponse.json(
      {
        success: true,
        message: 'Post deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

