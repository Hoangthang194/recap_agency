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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  
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

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) {
      return categories
    }
    const query = categorySearchQuery.toLowerCase()
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query)
    )
  }, [categories, categorySearchQuery])

  // Get current category name
  const currentCategoryName = useMemo(() => {
    if (category === 'all') return 'Tất cả'
    const found = categories.find(cat => cat.id === category)
    return found?.name || category
  }, [category, categories])

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

  // Pagination (client-side)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalItems = filteredPosts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredPosts.slice(start, start + pageSize)
  }, [filteredPosts, page, pageSize])

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
        
        {/* Category Dropdown */}
        <div className="relative w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="w-full md:w-auto inline-flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-[200px]"
          >
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-base text-gray-400">
                category
              </span>
              <span>{currentCategoryName}</span>
            </div>
            <span className={`material-icons-outlined text-base transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          
          {/* Dropdown Menu */}
          {isCategoryDropdownOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsCategoryDropdownOpen(false)}
              />
              
              {/* Dropdown Content */}
              <div className="absolute right-0 mt-2 w-full md:w-80 z-20 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 flex flex-col">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-base">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Tìm kiếm danh mục..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                
                {/* Categories List */}
                <div className="flex-1 overflow-y-auto max-h-64">
                  {categoriesLoading ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Đang tải...
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Không tìm thấy danh mục nào
                    </div>
                  ) : (
                    <div className="py-1">
                      {/* "All" option */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('all')
                          setIsCategoryDropdownOpen(false)
                          setCategorySearchQuery('')
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                          category === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <span className="material-icons-outlined text-base text-gray-400">
                          list
                        </span>
                        <div className="flex-1 font-medium">Tất cả</div>
                        {category === 'all' && (
                          <span className="material-icons-outlined text-primary text-base">
                            check
                          </span>
                        )}
                      </button>
                      
                      {/* Category options */}
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategory(cat.id)
                            setIsCategoryDropdownOpen(false)
                            setCategorySearchQuery('')
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                            category === cat.id ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700'
                          }`}
                        >
                          <span className="material-icons-outlined text-base text-gray-400">
                            {cat.icon || 'folder'}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">{cat.name}</div>
                            {cat.description && (
                              <div className="text-xs text-gray-500 line-clamp-1">
                                {cat.description}
                              </div>
                            )}
                          </div>
                          {category === cat.id && (
                            <span className="material-icons-outlined text-primary text-base">
                              check
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
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
                {paginatedPosts.map((post) => {
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
                {paginatedPosts.length === 0 && !postsLoading && (
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-600">
          Hiển thị {Math.min((page - 1) * pageSize + 1, totalItems)}–{Math.min(page * pageSize, totalItems)} của {totalItems}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="rounded border-gray-300"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={25}>25 / trang</option>
          </select>

          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >Prev</button>
            <span className="px-2 text-sm">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >Next</button>
          </div>
        </div>
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


