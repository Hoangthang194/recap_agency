import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// PUT /api/users/[id]/password - Cập nhật mật khẩu
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'New password must be at least 6 characters long',
        },
        { status: 400 }
      );
    }

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

    // Verify current password if provided
    if (currentPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Current password is incorrect',
          },
          { status: 401 }
        );
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await query<any>(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

