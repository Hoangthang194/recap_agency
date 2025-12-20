'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePosts } from '@/hooks'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { posts, loading, fetchPosts } = usePosts()
  
  // Fetch posts on mount
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])
  
  // Check authentication (middleware will handle redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/login?redirect=/admin')
      }
    }
  }, [router])

  const totalPosts = posts?.length || 0
  const latestPosts = posts?.slice(0, 5) || []

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <div className="text-sm text-gray-500">Đang tải...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Bảng Điều Khiển Admin
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng quan về nội dung và tài khoản. Khu vực này hoàn toàn độc lập với header/layout của blog công khai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tổng Bài Viết
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalPosts}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Bản Nháp
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Người Dùng
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">1</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Bài viết mới nhất</h2>
        </div>
        {latestPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Chưa có bài viết nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 pr-4 font-medium">Tiêu đề</th>
                  <th className="py-2 pr-4 font-medium">Danh mục</th>
                  <th className="py-2 pr-4 font-medium">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {latestPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-4 text-gray-900">{post.title}</td>
                    <td className="py-2 pr-4 text-gray-700">{post.category}</td>
                    <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">
                      {post.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


