import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Chỉ protect các route /admin/* trừ /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured')

      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwtVerify(token, secret)

      // Token hợp lệ → tiếp tục
      return NextResponse.next()
    } catch (error: any) {
      console.error('JWT verify failed:', error)

      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)

      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth_token') // xóa token invalid
      return response
    }
  }

  // Cho các route khác
  return NextResponse.next()
}

// Matcher chỉ áp dụng cho admin routes
export const config = {
  matcher: ['/admin/:path*'], // Chỉ apply middleware cho /admin/*
}
