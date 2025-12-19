import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/posts - Tạo post mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
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
    if (!id || !title || !excerpt || !image || !thumbnail || !category || !author || !date || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: id, title, excerpt, image, thumbnail, category, author, date, slug are required',
        },
        { status: 400 }
      );
    }

    // Check if post ID already exists
    const existingPost = await query<any[]>(
      'SELECT id FROM posts WHERE id = ?',
      [id]
    );

    if (existingPost.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Post with ID "${id}" already exists`,
        },
        { status: 409 }
      );
    }

    // Check if slug already exists
    const existingSlug = await query<any[]>(
      'SELECT id FROM posts WHERE slug = ?',
      [slug]
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

    // Validate author exists (author can be object with id or just id)
    const authorId = typeof author === 'object' ? author.id : author;
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

    // Insert new post
    const insertSql = `
      INSERT INTO posts (
        id, title, excerpt, image, thumbnail, category_id, author_id,
        date, read_time, slug, content, sidebar_banner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(insertSql, [
      id,
      title,
      excerpt,
      image,
      thumbnail,
      category,
      authorId,
      date,
      readTime || null,
      slug,
      content || null,
      sidebarBanner ? JSON.stringify(sidebarBanner) : null,
    ]);

    // Fetch the created post with joined data
    const [createdPost] = await query<any[]>(
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
        message: 'Post created successfully',
        data: createdPost,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET /api/posts - Lấy danh sách posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const authorId = searchParams.get('authorId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let sql = `
      SELECT 
        p.*,
        a.name as author_name,
        a.avatar as author_avatar
      FROM posts p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.is_deleted = 0
    `;
    const params: any[] = [];

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    if (authorId) {
      sql += ' AND p.author_id = ?';
      params.push(authorId);
    }

    sql += ' ORDER BY p.date DESC, p.created_at DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
      
      if (offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const posts = await query<any[]>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: posts,
        count: posts.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

