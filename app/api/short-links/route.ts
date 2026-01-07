import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/short-links - Lấy danh sách tất cả short links
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    let sql = `
      SELECT 
        id,
        original_url,
        short_code,
        click_count,
        created_at,
        updated_at
      FROM short_links
      WHERE is_deleted = 0
    `
    const params: any[] = []

    if (search) {
      sql += ` AND (original_url LIKE ? OR short_code LIKE ?)`
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ` ORDER BY created_at DESC`

    const links = await query<any[]>(sql, params)

    return NextResponse.json({
      success: true,
      data: links,
      count: links.length,
    })
  } catch (error: any) {
    console.error('Error fetching short links:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch short links',
      },
      { status: 500 }
    )
  }
}

// POST /api/short-links - Tạo short link mới
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

    // Validate URL format
    let normalizedUrl = originalUrl.trim()
    
    // Add protocol if missing
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

    // Generate short code (6 characters)
    const generateShortCode = (): string => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    // Ensure unique short code
    let shortCode = generateShortCode()
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const existing = await query<any[]>(
        'SELECT id FROM short_links WHERE short_code = ? AND is_deleted = 0',
        [shortCode]
      )

      if (existing.length === 0) {
        break
      }

      shortCode = generateShortCode()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate unique short code',
        },
        { status: 500 }
      )
    }

    // Insert into database
    const result = await query<any>(
      `INSERT INTO short_links (original_url, short_code, click_count, is_deleted)
       VALUES (?, ?, 0, 0)`,
      [normalizedUrl, shortCode]
    )

    const insertId = (result as any).insertId

    // Get base URL from request
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`

    const shortUrl = `${baseUrl}/go?link=${normalizedUrl}`

    return NextResponse.json(
      {
        success: true,
        data: {
          id: insertId,
          originalUrl: normalizedUrl,
          shortCode,
          shortUrl,
          clickCount: 0,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating short link:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create short link',
      },
      { status: 500 }
    )
  }
}


