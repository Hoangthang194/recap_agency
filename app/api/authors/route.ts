import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/authors - Lấy danh sách authors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    let sql = 'SELECT * FROM authors';
    const params: any[] = [];

    if (!includeDeleted) {
      sql += ' WHERE is_deleted = 0';
    }

    sql += ' ORDER BY name ASC';

    const authors = await query<any[]>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: authors,
        count: authors.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST /api/authors - Tạo author mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, avatar } = body;

    // Validation
    if (!name || !avatar) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name and avatar are required',
        },
        { status: 400 }
      );
    }

    // Insert author
    const result = await query<any>(
      'INSERT INTO authors (name, avatar) VALUES (?, ?)',
      [name, avatar]
    );

    const authorId = result.insertId;

    // Fetch the created author
    const [newAuthor] = await query<any[]>(
      'SELECT * FROM authors WHERE id = ?',
      [authorId]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Author created successfully',
        data: newAuthor,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

