import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/areas/[id] - Lấy area theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const areas = await query<any[]>(
      'SELECT * FROM areas WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (areas.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Area not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: areas[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching area:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/areas/[id] - Cập nhật area
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

    // Check if area exists
    const existingArea = await query<any[]>(
      'SELECT id FROM areas WHERE id = ?',
      [id]
    );

    if (existingArea.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Area with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Update area
    const updateSql = `
      UPDATE areas SET
        name = ?,
        region = ?,
        icon = ?,
        image = ?,
        color_class = ?,
        description = ?
      WHERE id = ?
    `;

    await query(updateSql, [
      name,
      region,
      icon,
      image,
      colorClass,
      description || null,
      id,
    ]);

    // Fetch the updated area
    const [updatedArea] = await query<any[]>(
      'SELECT * FROM areas WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Area updated successfully',
        data: updatedArea,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating area:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/areas/[id] - Xóa area (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if area exists
    const existingArea = await query<any[]>(
      'SELECT id FROM areas WHERE id = ?',
      [id]
    );

    if (existingArea.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Area with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Soft delete: Set is_deleted = 1
    await query('UPDATE areas SET is_deleted = 1 WHERE id = ?', [id]);

    return NextResponse.json(
      {
        success: true,
        message: 'Area deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting area:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

