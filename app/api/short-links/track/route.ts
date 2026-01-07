import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// POST /api/short-links/track - Track click on a short link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalUrl } = body

    if (!originalUrl || typeof originalUrl !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'originalUrl is required',
        },
        { status: 400 }
      )
    }

    // Normalize URL (same logic as when creating)
    let normalizedUrl = originalUrl.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    // Validate URL
    try {
      new URL(normalizedUrl)
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL format',
        },
        { status: 400 }
      )
    }

    // Find the link by original_url and increment click_count
    const result = await query<any>(
      `UPDATE short_links 
       SET click_count = click_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE original_url = ? AND is_deleted = 0`,
      [normalizedUrl]
    )

    // If no rows were affected, the link doesn't exist in database
    // But we still allow the redirect to proceed (for flexibility)
    const affectedRows = (result as any).affectedRows || 0

    return NextResponse.json({
      success: true,
      tracked: affectedRows > 0,
      message: affectedRows > 0 
        ? 'Click tracked successfully' 
        : 'Link not found in database, but redirect allowed',
    })
  } catch (error: any) {
    console.error('Error tracking click:', error)
    // Don't fail the redirect if tracking fails
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to track click',
      },
      { status: 500 }
    )
  }
}

