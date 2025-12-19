'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useCategories, useAuthors, usePosts } from '@/hooks'
import Link from 'next/link'
import { LexicalEditor } from '@/components/admin/LexicalEditor'

export default function AdminNewPostPage() {
  const router = useRouter()
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
  const { authors, loading: authorsLoading, fetchAuthors } = useAuthors()
  const { createPost, creating, error: createError } = usePosts()
  
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

  // Fetch categories and authors on mount
  useEffect(() => {
    fetchCategories()
    fetchAuthors()
  }, [fetchCategories, fetchAuthors])

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !category) {
      // Set first non-city category as default, or first category if all are cities
      const firstCategory = categories.find(c => !c.isCity) || categories[0]
      if (firstCategory) {
        setCategory(firstCategory.id)
      }
    }
  }, [categories, category])

  // Set default author when authors are loaded
  useEffect(() => {
    if (authors.length > 0 && !authorId) {
      setAuthorId(authors[0].id)
    }
  }, [authors, authorId])

  const formatDateFromInput = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setSelectedDate(dateValue)
    setDate(formatDateFromInput(dateValue))
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
      // Refresh uploaded images list if picker is open
      if (showImagePicker) {
        loadUploadedImages()
      }
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
      setShowImagePicker(false)
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^-+|-+$/g, '')
      setSlug(generatedSlug)
    }
  }, [title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !excerpt || !imageUrl || !category || !date || !authorId) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    const selectedAuthor = authors.find(a => a.id === authorId)
    if (!selectedAuthor) {
      toast.error('Vui lòng chọn tác giả')
      return
    }

    // Auto-generate slug if empty
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^-+|-+$/g, '')
    
    // Generate ID from slug or title
    const postId = finalSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    const postData = {
      id: postId,
      title,
      excerpt,
      category,
      image: imageUrl,
      thumbnail: thumbnailUrl || imageUrl,
      date,
      slug: finalSlug,
      content: contentHtml || null,
      sidebarBanner: sidebarBanner.badge ? sidebarBanner : null,
      author: selectedAuthor
    }

    const newPost = await createPost(postData)
    
    if (newPost) {
      toast.success('Tạo bài viết thành công!')
      router.push('/admin/posts')
    } else {
      toast.error(createError || 'Lỗi khi tạo bài viết')
    }
  }

  const handlePreview = () => {
    if (typeof window === 'undefined') return

    const selectedCategory = categories.find(c => c.id === category)
    const draft = {
      id: 'preview',
      title: title || 'Preview title',
      excerpt: excerpt || 'Preview excerpt',
      category: category || 'Preview',
      image: imageUrl || 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thumbnail: thumbnailUrl || imageUrl || 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1600',
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      slug: slug || 'preview',
      content: contentHtml,
      sidebarBanner: sidebarBanner.badge ? sidebarBanner : undefined
    }

    // Lưu tạm dữ liệu preview vào sessionStorage
    window.sessionStorage.setItem('postPreview', JSON.stringify(draft))
    // Mở trang bài viết preview trong tab mới
    window.open('/post/preview', '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Bài Viết Mới
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tạo bài viết mới. Nội dung chi tiết được soạn bằng Lexical editor bên dưới.
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

      {createError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{createError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[380px,minmax(0,1fr)] gap-8 items-start">
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
              placeholder="Nhập tiêu đề bài viết"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="Tóm tắt ngắn hiển thị trên thẻ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={categoriesLoading}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {categoriesLoading ? (
                <option value="">Đang tải danh mục...</option>
              ) : category ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.isCity ? '(Thành Phố)' : ''}
                  </option>
                ))
              ) : (
                <>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.isCity ? '(Thành Phố)' : ''}
                    </option>
                  ))}
                </>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình Ảnh Banner</label>
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="URL hình ảnh hoặc chọn từ ảnh đã upload"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
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
              {uploadError && (
                <p className="text-xs text-red-600">{uploadError}</p>
              )}
              {imageUrl && (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-w-xs">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-32 object-contain"
                  />
                </div>
              )}
            </div>
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

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Xem Trước
            </button>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Đang tạo...' : 'Lưu Bài Viết'}
            </button>
          </div>
        </div>

        {/* Right: Lexical editor component */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Nội dung bài viết</h2>
                <p className="text-xs text-gray-500">
                  Soạn nội dung chi tiết với đầy đủ toolbar, block, bảng, media...
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden bg-[#f3f4f6]">
              <LexicalEditor onChange={setContentHtml} />
            </div>
          </div>
        </div>
      </form>

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
                        imageUrl === img.url || thumbnailUrl === img.url
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
                      {(imageUrl === img.url || thumbnailUrl === img.url) && (
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


