'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface ShortLink {
  id: number
  original_url: string
  short_code: string
  short_url: string
  click_count: number
  created_at: string
  updated_at: string
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<ShortLink[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const hasFetched = useRef(false)

  // Fetch links
  const fetchLinks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/short-links?search=${encodeURIComponent(search)}`)
      const result = await response.json()

      if (result.success) {
        // Generate short URLs for each link
        const baseUrl = window.location.origin
        const linksWithShortUrl = result.data.map((link: any) => ({
          ...link,
          short_url: `${baseUrl}/go?link=${encodeURIComponent(link.original_url)}`,
        }))
        setLinks(linksWithShortUrl)
      } else {
        toast.error(result.error || 'Không thể tải danh sách links')
      }
    } catch (error: any) {
      console.error('Error fetching links:', error)
      toast.error('Lỗi khi tải danh sách links')
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchLinks()
    }
  }, [])

  // Fetch when search changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasFetched.current) {
        fetchLinks()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Create new link
  const handleCreateLink = async () => {
    if (!newLinkUrl.trim()) {
      toast.error('Vui lòng nhập URL')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/short-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: newLinkUrl.trim(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Tạo link thành công!')
        setShowCreateModal(false)
        setNewLinkUrl('')
        fetchLinks()
      } else {
        toast.error(result.error || 'Không thể tạo link')
      }
    } catch (error: any) {
      console.error('Error creating link:', error)
      toast.error('Lỗi khi tạo link')
    } finally {
      setCreating(false)
    }
  }

  // Delete link
  const handleDelete = async (linkId: number) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/short-links/${linkId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Xóa link thành công!')
        setDeleteConfirm(null)
        fetchLinks()
      } else {
        toast.error(result.error || 'Không thể xóa link')
      }
    } catch (error: any) {
      console.error('Error deleting link:', error)
      toast.error('Lỗi khi xóa link')
    } finally {
      setDeleting(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Đã copy vào clipboard!')
    }).catch(() => {
      toast.error('Không thể copy')
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Quản Lý Links
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tạo và quản lý các link rút gọn
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover transition-colors"
        >
          <span className="material-icons-outlined text-lg mr-2">add</span>
          Tạo Link Mới
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm theo URL hoặc short code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <div className="text-sm text-gray-500">Đang tải...</div>
        </div>
      )}

      {/* Links Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {links.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              {search ? 'Không tìm thấy link nào' : 'Chưa có link nào. Hãy tạo link mới!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL Gốc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link Rút Gọn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số Lần Click
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày Tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={link.original_url}>
                          {link.original_url}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-primary max-w-xs truncate">
                            {link.short_url}
                          </div>
                          <button
                            onClick={() => copyToClipboard(link.short_url)}
                            className="p-1 text-gray-400 hover:text-primary transition-colors"
                            title="Copy link"
                          >
                            <span className="material-icons-outlined text-sm">content_copy</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.click_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(link.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setDeleteConfirm(link.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowCreateModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Tạo Link Mới
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Gốc
                        </label>
                        <input
                          type="text"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder="Ví dụ: youtube.com hoặc https://youtube.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateLink()
                            }
                          }}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Nhập URL (có thể có hoặc không có http:// hoặc https://)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateLink}
                  disabled={creating}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Đang tạo...' : 'Tạo Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewLinkUrl('')
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setDeleteConfirm(null)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Xác Nhận Xóa
                    </h3>
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa link này? Hành động này không thể hoàn tác.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Đang xóa...' : 'Xóa'}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


