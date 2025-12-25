import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/categories/[id] - Lấy category theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const categories = await query<any[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: categories[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Cập nhật category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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
    if (!name || !icon || !image || !colorClass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, icon, image, colorClass are required',
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await query<any[]>(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Category with ID "${id}" not found`,
        },
        { status: 404 }
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

    // Update category
    const updateSql = `
      UPDATE categories SET
        name = ?,
        icon = ?,
        image = ?,
        color_class = ?,
        description = ?,
        is_city = ?,
        area_id = ?,
        country_id = ?
      WHERE id = ?
    `;

    await query(updateSql, [
      name,
      icon,
      image,
      colorClass,
      description || null,
      isCity,
      areaId || null,
      countryId || null,
      id,
    ]);

    // Fetch the updated category
    const [updatedCategory] = await query<any[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Xóa category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category exists
    const existingCategory = await query<any[]>(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Category with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Soft delete: Set is_deleted = 1 instead of hard delete
    await query('UPDATE categories SET is_deleted = 1 WHERE id = ?', [id]);

    return NextResponse.json(
      {
        success: true,
        message: 'Category deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

