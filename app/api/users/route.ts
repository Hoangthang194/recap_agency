import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/users - Lấy danh sách users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const role = searchParams.get('role'); // Filter by role
    const status = searchParams.get('status'); // Filter by status

    let sql = 'SELECT * FROM users';
    const params: any[] = [];
    const conditions: string[] = [];

    if (!includeDeleted) {
      conditions.push('is_deleted = 0');
    }

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY name ASC';

    const users = await query<any[]>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: users,
        count: users.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Tạo user mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, status } = body;

    // Validation
    if (!name || !email || !role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, email, and role are required',
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role. Must be one of: admin, editor, viewer',
        },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !['active', 'invited', 'suspended'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be one of: active, invited, suspended',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await query<any[]>(
      'SELECT * FROM users WHERE email = ? AND is_deleted = 0',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists',
        },
        { status: 400 }
      );
    }

    // Generate ID from name (lowercase, replace spaces with hyphens)
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Insert user
    await query<any>(
      'INSERT INTO users (id, name, email, role, status) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, role, status || 'invited']
    );

    // Fetch the created user
    const [newUser] = await query<any[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

