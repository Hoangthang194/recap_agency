import { NextRequest, NextResponse } from 'next/server'

// GET /go?link=... - Redirect to original URL
// This uses server-side redirect which works better with crawlers like Google
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const linkParam = searchParams.get('link')

    if (!linkParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Link parameter is required',
        },
        { status: 400 }
      )
    }

    // Decode URL
    let originalUrl = decodeURIComponent(linkParam)

    // Add protocol if missing
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      originalUrl = `https://${originalUrl}`
    }

    // Validate URL
    try {
      new URL(originalUrl)
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL format',
        },
        { status: 400 }
      )
    }

    // Use 302 (temporary redirect) or 301 (permanent redirect)
    // 302 is better for URL shorteners as links might change
    return NextResponse.redirect(originalUrl, { status: 302 })
  } catch (error: any) {
    console.error('Error redirecting:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to redirect',
      },
      { status: 500 }
    )
  }
}


