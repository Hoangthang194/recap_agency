import { NextResponse } from 'next/server';

// POST /api/auth/logout - Đăng xuất và xóa cookie
export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: 'Logout successful',
    },
    { status: 200 }
  );

  // Clear auth cookie
  response.cookies.delete('auth_token');

  return response;
}

