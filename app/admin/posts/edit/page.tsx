'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePosts, useCategories, useAuthors } from '@/hooks'
import { LexicalEditor } from '@/components/admin/LexicalEditor'

// Helper function to parse date from "Aug 8, 2025" format to "YYYY-MM-DD"
const parseDateString = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0]
    }
    return date.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

function AdminEditPostPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get postId from searchParams (query string: /admin/posts/edit?id=1)
  const postId = React.useMemo(() => {
    const id = searchParams?.get('id')
    
    if (!id) {
      console.warn('No id in searchParams')
      return ''
    }
    
    const stringId = String(id).trim()
    
    // Validate the ID
    if (!stringId || 
        stringId === 'undefined' || 
        stringId === 'null' || 
        stringId === '[object Object]' ||
        stringId.includes('[object')) {
      console.error('Invalid postId:', stringId)
      return ''
    }
    
    return stringId
  }, [searchParams])

  const { post, loading: postLoading, error: postError, getPostById, updatePost, creating } = usePosts()
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
  const { authors, loading: authorsLoading, fetchAuthors } = useAuthors()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
  const [slug, setSlug] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [initialContentHtml, setInitialContentHtml] = useState<string>('') // Store initial content separately
  const [rawHtmlFromDb, setRawHtmlFromDb] = useState<string>('') // Store raw HTML directly from DB, never modified
  const [sidebarBanner, setSidebarBanner] = useState({
    badge: '',
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    backgroundColor: '#4c1d95',
    image: ''
  })
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{ fileName: string; url: string; path: string }>>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch post and categories on mount
  useEffect(() => {
    console.log('=== DEBUG: useEffect for fetching ===')
    console.log('postId:', postId, 'type:', typeof postId)
    console.log('postId valid?', postId && postId !== '' && postId !== 'undefined' && !postId.includes('[object'))
    
    const fetchData = async () => {
      if (postId && postId !== '' && postId !== 'undefined' && !postId.includes('[object')) {
        console.log('✅ Fetching post with ID:', postId)
        try {
          const result = await getPostById(postId)
          console.log('✅ Post fetched:', result)
        } catch (error) {
          console.error('❌ Error fetching post:', error)
        }
      } else {
        console.error('❌ Invalid postId, cannot fetch:', postId)
      }
    }
    
    if (postId) {
      fetchData()
    } else {
      console.warn('⚠️ No postId, skipping fetch')
    }
    
    fetchCategories()
    fetchAuthors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]) // Only depend on postId to avoid infinite loops

  // Update form fields when post is loaded
  useEffect(() => {
    console.log('=== DEBUG: useEffect for updating form ===')
    console.log('post:', post)
    console.log('post?.content:', post?.content ? `${post.content.substring(0, 50)}...` : 'no content')
    
    if (post) {
      console.log('✅ Updating form fields with post data')
      setTitle(post.title)
      setExcerpt(post.excerpt)
      setCategory(post.category)
      setImageUrl(post.image)
      setThumbnailUrl(post.thumbnail)
      setSlug(post.slug)
      // Set author ID from post.author
      if (post.author) {
        const authorIdValue = typeof post.author === 'object' && 'id' in post.author 
          ? post.author.id 
          : typeof post.author === 'string' 
            ? post.author 
            : ''
        setAuthorId(authorIdValue)
      }
      // Set initial content HTML - this will trigger LexicalEditor to load initial content
      // Keep this separate from contentHtml to prevent reloading when user edits
      if (post.content) {
        console.log('✅ Setting initialContentHtml, length:', post.content.length)
        setInitialContentHtml(post.content)
        setContentHtml(post.content) // Also set contentHtml for form submission
        setRawHtmlFromDb(post.content) // Store raw HTML from DB for Raw HTML mode
      } else {
        console.log('⚠️ No content in post')
        setInitialContentHtml('')
        setContentHtml('')
        setRawHtmlFromDb('')
      }
      
      if (post.date) {
        const parsed = parseDateString(post.date)
        setSelectedDate(parsed)
        setDate(post.date)
      }
      
      if (post.sidebarBanner) {
        setSidebarBanner({
          badge: post.sidebarBanner.badge || '',
          title: post.sidebarBanner.title || '',
          description: post.sidebarBanner.description || '',
          buttonText: post.sidebarBanner.buttonText || '',
          buttonLink: post.sidebarBanner.buttonLink || '',
          backgroundColor: post.sidebarBanner.backgroundColor || '#4c1d95',
          image: post.sidebarBanner.image || ''
        })
      }
    }
  }, [post])

  const formatDateFromInput = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setSelectedDate(dateValue)
    setDate(formatDateFromInput(dateValue))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn file ảnh')
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File không được vượt quá 5MB')
      toast.error('File không được vượt quá 5MB')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploadedImageUrl(result.url)
      setUploadError(null)
      toast.success('Upload ảnh thành công!')
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi khi upload ảnh')
      toast.error(err.message || 'Lỗi khi upload ảnh')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Đã sao chép URL vào clipboard!')
    }).catch(() => {
      // Fallback cho trình duyệt cũ
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Đã sao chép URL vào clipboard!')
    })
  }

  // Load uploaded images
  const loadUploadedImages = async () => {
    setLoadingImages(true)
    try {
      const response = await fetch('/api/upload/list')
      const result = await response.json()
      if (result.success) {
        setUploadedImages(result.data || [])
      }
    } catch (err) {
      console.error('Error loading uploaded images:', err)
    } finally {
      setLoadingImages(false)
    }
  }

  // Load images when opening picker
  useEffect(() => {
    if (showImagePicker) {
      loadUploadedImages()
    }
  }, [showImagePicker])

  const insertImageUrl = (field: 'banner' | 'thumbnail' | 'sidebarBanner', url?: string) => {
    const imageUrlToUse = url || uploadedImageUrl
    if (imageUrlToUse) {
      if (field === 'banner') {
        setImageUrl(imageUrlToUse)
      } else if (field === 'thumbnail') {
        setThumbnailUrl(imageUrlToUse)
      } else if (field === 'sidebarBanner') {
        setSidebarBanner({ ...sidebarBanner, image: imageUrlToUse })
      }
      setShowMediaModal(false)
      setShowImagePicker(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !excerpt || !imageUrl || !category || !date || !slug || !authorId) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    // Get author from selected authorId
    const selectedAuthor = authors.find(a => a.id === authorId)
    if (!selectedAuthor) {
      toast.error('Vui lòng chọn tác giả hợp lệ')
      return
    }

    const postData = {
      id: String(postId),
      title,
      excerpt,
      category,
      image: imageUrl,
      thumbnail: thumbnailUrl || imageUrl,
      date,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^-+|-+$/g, ''),
      content: contentHtml || null, // Convert undefined to null
      sidebarBanner: sidebarBanner.badge ? sidebarBanner : null, // Convert undefined to null
      author: selectedAuthor,
      readTime: null // Explicitly set to null if not provided
    }

    const updatedPost = await updatePost(String(postId), postData)

    if (updatedPost) {
      toast.success('Cập nhật bài viết thành công!')
      router.push('/admin/posts')
    } else {
      toast.error('Không thể cập nhật bài viết. Vui lòng thử lại.')
    }
  }

  // Loading state
  if (postLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <div className="text-sm text-gray-500">Đang tải bài viết...</div>
        </div>
      </div>
    )
  }

  // Error state or no postId
  if (!postId || postId === '') {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Thiếu ID bài viết</h1>
        <p className="text-sm text-gray-600">Vui lòng cung cấp ID bài viết trong URL: /admin/posts/edit?id=1</p>
        <Link href="/admin/posts" className="text-sm text-primary hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    )
  }

  // Error state
  if (postError || !post) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Không tìm thấy bài viết</h1>
        {postError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{postError}</p>
          </div>
        )}
        <Link href="/admin/posts" className="text-sm text-primary hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Chỉnh Sửa Bài Viết
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Chỉnh sửa thông tin và nội dung bài viết. Nội dung chi tiết dùng Lexical editor.
          </p>
        </div>
        <Link
          href="/admin/posts"
          className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"
        >
          <span className="material-icons-outlined text-sm">arrow_back</span>
          Quay lại danh sách
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-[380px,minmax(0,1fr)] gap-8 items-start"
      >
        {/* Left: meta fields */}
        <div className="space-y-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={categoriesLoading}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {categoriesLoading ? (
                <option value="">Đang tải danh mục...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.isCity ? '(Thành Phố)' : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả *</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              required
              disabled={authorsLoading}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authorsLoading ? (
                <option value="">Đang tải tác giả...</option>
              ) : (
                <>
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình Ảnh Thumbnail</label>
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="URL hình ảnh hoặc chọn từ ảnh đã upload (tùy chọn, dùng banner nếu để trống)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shrink-0"
                >
                  <span className="material-icons-outlined text-sm">
                    {uploading ? 'hourglass_empty' : 'upload'}
                  </span>
                  <span className="hidden sm:inline">{uploading ? 'Đang tải...' : 'Upload'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shrink-0"
                >
                  <span className="material-icons-outlined text-sm">image</span>
                  <span className="hidden sm:inline">Chọn ảnh</span>
                </button>
              </div>
              {thumbnailUrl && (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-w-xs">
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-32 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
            />
            <p className="mt-1 text-xs text-gray-500">Đã chọn: {date}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Sidebar (Tùy chọn)</label>
            <div className="space-y-2">
              <input
                type="text"
                value={sidebarBanner.badge}
                onChange={(e) => setSidebarBanner({ ...sidebarBanner, badge: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="Văn bản badge"
              />
              <input
                type="text"
                value={sidebarBanner.title}
                onChange={(e) => setSidebarBanner({ ...sidebarBanner, title: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="Tiêu đề (dùng \n để xuống dòng)"
              />
              <input
                type="text"
                value={sidebarBanner.description}
                onChange={(e) => setSidebarBanner({ ...sidebarBanner, description: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="Mô tả"
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">URL Hình Ảnh Banner</label>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={sidebarBanner.image}
                    onChange={(e) => setSidebarBanner({ ...sidebarBanner, image: e.target.value })}
                    className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                    placeholder="URL hình ảnh hoặc chọn từ ảnh đã upload"
                  />
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shrink-0"
                  >
                    <span className="material-icons-outlined text-sm">image</span>
                    <span className="hidden sm:inline">Chọn ảnh</span>
                  </button>
                </div>
                {sidebarBanner.image && (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-w-xs mt-2">
                    <img
                      src={sidebarBanner.image}
                      alt="Banner preview"
                      className="w-full h-auto max-h-32 object-contain"
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={sidebarBanner.buttonText}
                onChange={(e) => setSidebarBanner({ ...sidebarBanner, buttonText: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="Văn bản nút"
              />
              <input
                type="text"
                value={sidebarBanner.buttonLink}
                onChange={(e) => setSidebarBanner({ ...sidebarBanner, buttonLink: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="Liên kết nút"
              />
              <input
                type="color"
                value={sidebarBanner.backgroundColor}
                onChange={(e) => setSidebarBanner({ ...sidebarBanner, backgroundColor: e.target.value })}
                className="block w-full h-10 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Đang cập nhật...' : 'Cập Nhật Bài Viết'}
          </button>
        </div>

        {/* Right: Lexical editor component */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Nội dung bài viết</h2>
                <p className="text-xs text-gray-500">
                  Chọn chế độ Lexical Editor (WYSIWYG) hoặc Raw HTML (paste trực tiếp HTML).
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden bg-[#f3f4f6]">
              {(() => {
                console.log('=== DEBUG: Rendering LexicalEditor ===')
                console.log('postId:', postId)
                console.log('contentHtml exists?', !!contentHtml)
                console.log('contentHtml length:', contentHtml?.length || 0)
                console.log('contentHtml preview:', contentHtml ? `${contentHtml.substring(0, 100)}...` : 'empty')
                // Use stable key based on postId only - don't change key when contentHtml changes
                // This prevents editor from re-rendering and losing focus when user types
                const editorKey = `editor-${postId}`
                console.log('Editor key:', editorKey)
                return (
                  <LexicalEditor 
                    key={editorKey}
                    initialHtml={initialContentHtml || ''} 
                    rawHtmlFromDb={rawHtmlFromDb || ''} // Pass raw HTML directly from DB (never modified)
                    onChange={(html) => {
                      console.log('=== DEBUG: LexicalEditor onChange ===')
                      console.log('New HTML length:', html.length)
                      // Only update contentHtml state, don't change initialHtml prop
                      // This prevents InitialHtmlPlugin from reloading and clearing editor
                      setContentHtml(html)
                      // Also update rawHtmlFromDb if in Raw HTML mode (so it reflects changes)
                      // But keep the original DB value for reference
                    }} 
                  />
                )
              })()}
            </div>
          </div>
        </div>
      </form>

      {/* Media Upload Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowMediaModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Quản Lý Media</h2>
                <button
                  onClick={() => {
                    setShowMediaModal(false)
                    setUploadedImageUrl('')
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="material-icons-outlined text-4xl text-gray-400">
                      {uploading ? 'hourglass_empty' : 'cloud_upload'}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {uploading ? 'Đang tải...' : 'Click để chọn ảnh hoặc kéo thả vào đây'}
                    </span>
                    <span className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</span>
                  </label>
                  {uploadError && (
                    <p className="mt-2 text-xs text-red-600">{uploadError}</p>
                  )}
                </div>

                {/* Preview Section */}
                {uploadedImageUrl && (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={uploadedImageUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">URL Ảnh</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={uploadedImageUrl}
                          readOnly
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(uploadedImageUrl)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <span className="material-icons-outlined text-sm">content_copy</span>
                          <span>Sao chép</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => insertImageUrl('banner')}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                      >
                        <span className="material-icons-outlined text-sm">insert_photo</span>
                        <span>Chèn vào Banner</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertImageUrl('thumbnail')}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                      >
                        <span className="material-icons-outlined text-sm">insert_photo</span>
                        <span>Chèn vào Thumbnail</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowImagePicker(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Chọn Ảnh Đã Upload</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadUploadedImages}
                  disabled={loadingImages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  title="Làm mới danh sách"
                >
                  <span className="material-icons-outlined text-sm">refresh</span>
                  <span>Làm mới</span>
                </button>
                <button
                  onClick={() => setShowImagePicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {loadingImages ? (
                <div className="text-center py-12">
                  <div className="text-sm text-gray-500">Đang tải danh sách ảnh...</div>
                </div>
              ) : uploadedImages.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-icons-outlined text-4xl text-gray-300 mb-2">image</span>
                  <div className="text-sm text-gray-500">Chưa có ảnh nào được upload</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((img) => (
                    <div
                      key={img.fileName}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        imageUrl === img.url || thumbnailUrl === img.url || sidebarBanner.image === img.url
                          ? 'border-primary ring-2 ring-primary'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={img.url}
                          alt={img.fileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="material-icons-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          check_circle
                        </span>
                      </div>
                      {(imageUrl === img.url || thumbnailUrl === img.url || sidebarBanner.image === img.url) && (
                        <div className="absolute top-2 right-2">
                          <span className="material-icons-outlined text-primary bg-white rounded-full">
                            check_circle
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">{img.fileName}</p>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            insertImageUrl('banner', img.url)
                          }}
                          className="bg-primary text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Banner
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            insertImageUrl('thumbnail', img.url)
                          }}
                          className="bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
                        >
                          Thumb
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            insertImageUrl('sidebarBanner', img.url)
                          }}
                          className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700"
                        >
                          Sidebar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminEditPostPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    }>
      <AdminEditPostPageContent />
    </Suspense>
  )
}

