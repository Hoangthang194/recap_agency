import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  

  // Only protect admin routes (except login and API routes)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    // Get token from cookie or Authorization header
    const token = 
  request.cookies.get('auth_token')?.value ||
  request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify token using jose (Edge Runtime compatible)
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured')
      }
      
      // Convert secret to Uint8Array for jose
      const secret = new TextEncoder().encode(JWT_SECRET)
      
      // Verify token (async in jose)
      await jwtVerify(token, secret)
      
      // Token is valid, continue
      return NextResponse.next()
    } catch (error: any) {

      
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      
      // Clear invalid token cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth_token')
      return response
    }
  }
  
  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
