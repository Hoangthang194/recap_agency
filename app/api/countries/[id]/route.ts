import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/countries/[id] - Lấy country theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const countries = await query<any[]>(
      'SELECT * FROM countries WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (countries.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Country not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: countries[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching country:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/countries/[id] - Cập nhật country
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      region,
      icon,
      image,
      colorClass,
      description,
      areaId,
    } = body;

    // Validation
    if (!name || !region || !icon || !image || !colorClass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, region, icon, image, colorClass are required',
        },
        { status: 400 }
      );
    }

    // Check if country exists
    const existingCountry = await query<any[]>(
      'SELECT id FROM countries WHERE id = ?',
      [id]
    );

    if (existingCountry.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Country with ID "${id}" not found`,
        },
        { status: 404 }
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

    // Update country
    const updateSql = `
      UPDATE countries SET
        name = ?,
        region = ?,
        icon = ?,
        image = ?,
        color_class = ?,
        description = ?,
        area_id = ?
      WHERE id = ?
    `;

    await query(updateSql, [
      name,
      region,
      icon,
      image,
      colorClass,
      description || null,
      areaId || null,
      id,
    ]);

    // Fetch the updated country
    const [updatedCountry] = await query<any[]>(
      'SELECT * FROM countries WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Country updated successfully',
        data: updatedCountry,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating country:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/countries/[id] - Xóa country (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if country exists
    const existingCountry = await query<any[]>(
      'SELECT id FROM countries WHERE id = ?',
      [id]
    );

    if (existingCountry.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Country with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Soft delete: Set is_deleted = 1
    await query('UPDATE countries SET is_deleted = 1 WHERE id = ?', [id]);

    return NextResponse.json(
      {
        success: true,
        message: 'Country deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting country:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

