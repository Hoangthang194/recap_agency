'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { usePosts, useCategories } from '@/hooks'

export default function AdminPostsPage() {
  const { posts, loading: postsLoading, error: postsError, fetchPosts, deletePost } = usePosts()
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  // Use refs to track if we've already fetched to prevent multiple calls
  const hasFetchedPosts = useRef(false)
  const hasFetchedCategories = useRef(false)

  // Fetch posts and categories on mount (only once)
  useEffect(() => {
    if (!hasFetchedPosts.current && !postsLoading) {
      hasFetchedPosts.current = true
      fetchPosts()
    }
  }, []) // Empty dependency array - only run once on mount
  
  useEffect(() => {
    if (!hasFetchedCategories.current && !categoriesLoading) {
      hasFetchedCategories.current = true
      fetchCategories()
    }
  }, []) // Empty dependency array - only run once on mount

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || post.category === category
      return matchesSearch && matchesCategory
    })
  }, [posts, search, category])

  const handleDelete = async (postId: string) => {
    setDeleting(true)
    const success = await deletePost(postId)
    setDeleting(false)
    setDeleteConfirm(null)
    
    if (success) {
      toast.success('Xóa bài viết thành công!')
      // Refresh posts list
      fetchPosts()
    } else {
      toast.error('Không thể xóa bài viết. Vui lòng thử lại.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Quản Lý Bài Viết
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tìm kiếm, lọc và quản lý bài viết blog. (Chỉ demo front-end, không có ghi thực tế.)
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
        >
          <span className="material-icons-outlined text-sm">add</span>
          <span>Bài Viết Mới</span>
        </Link>
      </div>

      {/* Error Display */}
      {postsError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{postsError}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative md:w-80">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategory('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              category === 'all'
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            Tất cả
          </button>
          {categoriesLoading ? (
            <div className="text-xs text-gray-500 px-3 py-1">Đang tải danh mục...</div>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  category === cat.id
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {postsLoading ? (
          <div className="text-center py-12">
            <div className="text-sm text-gray-500">Đang tải danh sách bài viết...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 pr-4 font-medium">Tiêu đề</th>
                  <th className="py-2 pr-4 font-medium">Danh mục</th>
                  <th className="py-2 pr-4 font-medium hidden md:table-cell">Mô tả</th>
                  <th className="py-2 pr-4 font-medium">Ngày</th>
                  <th className="py-2 pr-2 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => {
                  // Find category name
                  const categoryName = categories.find(cat => cat.id === post.category)?.name || post.category
                  // Ensure post.id is a string and valid
                  const postId = post?.id ? String(post.id).trim() : ''
                  
                  // Skip if postId is invalid
                  if (!postId || postId === 'undefined' || postId === 'null') {
                    console.warn('Invalid post ID:', post.id, 'for post:', post.title)
                    return null
                  }
                  
                  // Construct URL safely
                  const editUrl = `/admin/posts/edit?id=${postId}`
                  
                  return (
                    <tr key={postId} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 pr-4 text-gray-900">{post.title}</td>
                      <td className="py-2 pr-4 text-gray-700">{categoryName}</td>
                      <td className="py-2 pr-4 text-gray-500 hidden md:table-cell max-w-xs">
                        <span className="line-clamp-2">{post.excerpt}</span>
                      </td>
                      <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{post.date}</td>
                      <td className="py-2 pr-2 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={editUrl}
                            prefetch={false}
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:border-primary hover:text-primary"
                            onClick={(e) => {
                              // Double check URL is valid before navigation
                              if (!postId || postId === 'undefined' || postId === 'null' || postId.includes('[object')) {
                                e.preventDefault()
                                console.error('Invalid postId for navigation:', postId)
                                return false
                              }
                            }}
                          >
                            Sửa
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(postId)}
                            className="inline-flex items-center justify-center rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredPosts.length === 0 && !postsLoading && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-gray-500">
                      {posts.length === 0
                        ? 'Chưa có bài viết nào.'
                        : 'Không có bài viết nào khớp với bộ lọc của bạn.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !deleting && setDeleteConfirm(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


