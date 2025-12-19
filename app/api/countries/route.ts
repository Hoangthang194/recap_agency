import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/countries - Tạo country mới
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
      areaId,
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

    // Check if country ID already exists
    const existingCountry = await query<any[]>(
      'SELECT id FROM countries WHERE id = ?',
      [id]
    );

    if (existingCountry.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Country with ID "${id}" already exists`,
        },
        { status: 409 }
      );
    }

    // Validate areaId if provided
    if (areaId) {
      const areaExists = await query<any[]>(
        'SELECT id FROM areas WHERE id = ?',
        [areaId]
      );
      if (areaExists.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Area with ID "${areaId}" does not exist`,
          },
          { status: 404 }
        );
      }
    }

    // Insert new country
    const insertSql = `
      INSERT INTO countries (
        id, name, region, icon, image, color_class, description, area_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(insertSql, [
      id,
      name,
      region,
      icon,
      image,
      colorClass,
      description || null,
      areaId || null,
    ]);

    // Fetch the created country
    const [createdCountry] = await query<any[]>(
      'SELECT * FROM countries WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Country created successfully',
        data: createdCountry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating country:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET /api/countries - Lấy danh sách countries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const areaId = searchParams.get('areaId');

    let sql = 'SELECT * FROM countries WHERE is_deleted = 0';
    const params: any[] = [];

    if (region) {
      sql += ' AND region = ?';
      params.push(region);
    }

    if (areaId) {
      sql += ' AND area_id = ?';
      params.push(areaId);
    }

    sql += ' ORDER BY name ASC';

    const countries = await query<any[]>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: countries,
        count: countries.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

