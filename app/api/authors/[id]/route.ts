import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/authors/[id] - Lấy author theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const authors = await query<any[]>(
      'SELECT * FROM authors WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (authors.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Author not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: authors[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/authors/[id] - Cập nhật author
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if author exists
    const existingAuthor = await query<any[]>(
      'SELECT id FROM authors WHERE id = ?',
      [id]
    );

    if (existingAuthor.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Author with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Update author
    await query(
      'UPDATE authors SET name = ?, avatar = ? WHERE id = ?',
      [name, avatar, id]
    );

    // Fetch the updated author
    const [updatedAuthor] = await query<any[]>(
      'SELECT * FROM authors WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Author updated successfully',
        data: updatedAuthor,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/authors/[id] - Xóa author (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if author exists
    const existingAuthor = await query<any[]>(
      'SELECT id FROM authors WHERE id = ?',
      [id]
    );

    if (existingAuthor.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Author with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Soft delete: Set is_deleted = 1
    await query('UPDATE authors SET is_deleted = 1 WHERE id = ?', [id]);

    return NextResponse.json(
      {
        success: true,
        message: 'Author deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

