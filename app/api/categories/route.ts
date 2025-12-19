import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST /api/categories - Tạo danh mục mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      icon,
      image,
      colorClass,
      description,
      isCity = false,
      areaId = null,
      countryId = null,
    } = body;

    // Validation
    if (!id || !name || !icon || !image || !colorClass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: id, name, icon, image, colorClass are required',
        },
        { status: 400 }
      );
    }

    // Check if category ID already exists
    const existingCategory = await query<any[]>(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Category with ID "${id}" already exists`,
        },
        { status: 409 }
      );
    }

    // Validate areaId and countryId if isCity is true
    if (isCity) {
      if (!areaId || !countryId) {
        return NextResponse.json(
          {
            success: false,
            error: 'areaId and countryId are required when isCity is true',
          },
          { status: 400 }
        );
      }

      // Check if area exists
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

      // Check if country exists
      const countryExists = await query<any[]>(
        'SELECT id FROM countries WHERE id = ?',
        [countryId]
      );
      if (countryExists.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Country with ID "${countryId}" does not exist`,
          },
          { status: 404 }
        );
      }
    }

    // Insert new category
    const insertSql = `
      INSERT INTO categories (
        id, name, icon, image, color_class, description,
        is_city, area_id, country_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(insertSql, [
      id,
      name,
      icon,
      image,
      colorClass,
      description || null,
      isCity,
      areaId || null,
      countryId || null,
    ]);

    // Fetch the created category
    const [createdCategory] = await query<any[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: createdCategory,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET /api/categories - Lấy danh sách categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isCity = searchParams.get('isCity');
    const areaId = searchParams.get('areaId');
    const countryId = searchParams.get('countryId');

    let sql = 'SELECT * FROM categories WHERE 1=1';
    const params: any[] = [];

    if (isCity !== null) {
      sql += ' AND is_city = ?';
      params.push(isCity === 'true');
    }

    if (areaId) {
      sql += ' AND area_id = ?';
      params.push(areaId);
    }

    if (countryId) {
      sql += ' AND country_id = ?';
      params.push(countryId);
    }

    sql += ' ORDER BY name ASC';

    const categories = await query<any[]>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: categories,
        count: categories.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

