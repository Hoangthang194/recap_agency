import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/contact - Get all contact messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isRead = searchParams.get('isRead');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let sql = 'SELECT * FROM contact_messages WHERE 1=1';
    const params: any[] = [];

    if (isRead !== null) {
      sql += ' AND is_read = ?';
      params.push(isRead === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY created_at DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
      if (offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const messages = await query<any[]>(sql, params);

    // Get total count
    const countSql = 'SELECT COUNT(*) as total FROM contact_messages WHERE 1=1';
    const countParams: any[] = [];
    if (isRead !== null) {
      const countSqlWithFilter = countSql + ' AND is_read = ?';
      const [countResult] = await query<any[]>(countSqlWithFilter, [isRead === 'true' ? 1 : 0]);
      return NextResponse.json(
        {
          success: true,
          data: messages,
          count: messages.length,
          total: countResult.total,
        },
        { status: 200 }
      );
    }

    const [countResult] = await query<any[]>(countSql, countParams);

    return NextResponse.json(
      {
        success: true,
        data: messages,
        count: messages.length,
        total: countResult.total,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, email, subject, and message are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Insert contact message
    const insertSql = `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `;

    const result = await query<any>(insertSql, [name, email, subject, message]);
    const messageId = result.insertId;

    // Fetch the created message
    const [createdMessage] = await query<any[]>(
      'SELECT * FROM contact_messages WHERE id = ?',
      [messageId]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Contact message submitted successfully',
        data: createdMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting contact message:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

