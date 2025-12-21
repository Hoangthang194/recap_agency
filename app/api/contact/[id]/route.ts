import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT /api/contact/[id] - Update message (mark as read/unread)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    if (typeof isRead !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'isRead must be a boolean',
        },
        { status: 400 }
      );
    }

    await query(
      'UPDATE contact_messages SET is_read = ? WHERE id = ?',
      [isRead ? 1 : 0, id]
    );

    // Fetch updated message
    const [updatedMessage] = await query<any[]>(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Message updated successfully',
        data: updatedMessage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/contact/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await query('DELETE FROM contact_messages WHERE id = ?', [id]);

    return NextResponse.json(
      {
        success: true,
        message: 'Message deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

