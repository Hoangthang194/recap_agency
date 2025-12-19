import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/areas - Tạo area mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      region,
      icon,
      image,
      colorClass,
      description,
    } = body;

    // Validation
    if (!id || !name || !region || !icon || !image || !colorClass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: id, name, region, icon, image, colorClass are required',
        },
        { status: 400 }
      );
    }

    // Check if area ID already exists
    const existingArea = await query<any[]>(
      'SELECT id FROM areas WHERE id = ?',
      [id]
    );

    if (existingArea.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Area with ID "${id}" already exists`,
        },
        { status: 409 }
      );
    }

    // Insert new area
    const insertSql = `
      INSERT INTO areas (
        id, name, region, icon, image, color_class, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await query(insertSql, [
      id,
      name,
      region,
      icon,
      image,
      colorClass,
      description || null,
    ]);

    // Fetch the created area
    const [createdArea] = await query<any[]>(
      'SELECT * FROM areas WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Area created successfully',
        data: createdArea,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating area:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET /api/areas - Lấy danh sách areas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');

    let sql = 'SELECT * FROM areas WHERE is_deleted = 0';
    const params: any[] = [];

    if (region) {
      sql += ' AND region = ?';
      params.push(region);
    }

    sql += ' ORDER BY name ASC';

    const areas = await query<any[]>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: areas,
        count: areas.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

