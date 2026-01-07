import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// DELETE /api/short-links/[id] - Xóa short link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Soft delete
    await query(
      'UPDATE short_links SET is_deleted = 1 WHERE id = ?',
      [id]
    )

    return NextResponse.json({
      success: true,
      message: 'Short link deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting short link:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete short link',
      },
      { status: 500 }
    )
  }
}

// GET /api/short-links/[id] - Lấy thông tin short link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const links = await query<any[]>(
      `SELECT 
        id,
        original_url,
        short_code,
        click_count,
        created_at,
        updated_at
      FROM short_links
      WHERE id = ? AND is_deleted = 0`,
      [id]
    )

    if (links.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Short link not found',
        },
        { status: 404 }
      )
    }

    const link = links[0]

    // Get base URL from request
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`

    const shortUrl = `${baseUrl}/go?link=${encodeURIComponent(link.original_url)}`

    return NextResponse.json({
      success: true,
      data: {
        ...link,
        shortUrl,
      },
    })
  } catch (error: any) {
    console.error('Error fetching short link:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch short link',
      },
      { status: 500 }
    )
  }
}


