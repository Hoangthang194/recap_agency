import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/users/[id] - Lấy user theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [user] = await query<any[]>(
      'SELECT * FROM users WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Cập nhật user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role, status } = body;

    // Check if user exists
    const [existingUser] = await query<any[]>(
      'SELECT * FROM users WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Validate role if provided
    if (role && !['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role. Must be one of: admin, editor, viewer',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['active', 'invited', 'suspended'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be one of: active, invited, suspended',
        },
        { status: 400 }
      );
    }

    // Check if email already exists (if email is being changed)
    if (email && email !== existingUser.email) {
      const [emailExists] = await query<any[]>(
        'SELECT * FROM users WHERE email = ? AND id != ? AND is_deleted = 0',
        [email, id]
      );

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email already exists',
          },
          { status: 400 }
        );
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No fields to update',
        },
        { status: 400 }
      );
    }

    values.push(id);

    await query<any>(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Fetch updated user
    const [updatedUser] = await query<any[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Soft delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user exists
    const [existingUser] = await query<any[]>(
      'SELECT * FROM users WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Soft delete
    await query<any>(
      'UPDATE users SET is_deleted = 1 WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

