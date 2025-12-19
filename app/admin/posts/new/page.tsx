'use client'

import { useState, useRef } from 'react'
import { categories } from '@/data'
import Link from 'next/link'
import { LexicalEditor } from '@/components/admin/LexicalEditor'

export default function AdminNewPostPage() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState(categories[0]?.id ?? '')
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
    backgroundColor: '#4c1d95'
  })
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [showMediaModal, setShowMediaModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatDateFromInput = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setSelectedDate(dateValue)
    setDate(formatDateFromInput(dateValue))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh')
      return
    }

    // Tạo data URL từ file (demo - trong thực tế sẽ upload lên server)
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      setUploadedImageUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã sao chép URL vào clipboard!')
    }).catch(() => {
      // Fallback cho trình duyệt cũ
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Đã sao chép URL vào clipboard!')
    })
  }

  const insertImageUrl = (field: 'banner' | 'thumbnail') => {
    if (uploadedImageUrl) {
      if (field === 'banner') {
        setImageUrl(uploadedImageUrl)
      } else {
        setThumbnailUrl(uploadedImageUrl)
      }
      setShowMediaModal(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ở đây bạn có thể gọi API để lưu bài viết mới.
    // Tạm thời chỉ log ra console để demo.
    const postData = {
      title,
      excerpt,
      category,
      image: imageUrl,
      thumbnail: thumbnailUrl || imageUrl,
      date,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^-+|-+$/g, ''),
      content: contentHtml,
      sidebarBanner: sidebarBanner.badge ? sidebarBanner : undefined
    }
    console.log('Create post', postData)
    alert('Demo only: dữ liệu đã log ra console. Bạn có thể gắn API lưu vào DB sau.')
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
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {cat.isCity ? '(Thành Phố)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình Ảnh Banner</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => setShowMediaModal(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                title="Upload ảnh"
              >
                <span className="material-icons-outlined text-sm">image</span>
                <span>Upload</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình Ảnh Thumbnail</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="https://... (tùy chọn, dùng banner nếu để trống)"
              />
              <button
                type="button"
                onClick={() => setShowMediaModal(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                title="Upload ảnh"
              >
                <span className="material-icons-outlined text-sm">image</span>
                <span>Upload</span>
              </button>
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
              placeholder="tự động tạo từ tiêu đề nếu để trống"
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
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
            >
              Lưu Bài Viết
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
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <span className="material-icons-outlined text-4xl text-gray-400">cloud_upload</span>
                    <span className="text-sm font-medium text-gray-700">Click để chọn ảnh hoặc kéo thả vào đây</span>
                    <span className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</span>
                  </label>
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
    </div>
  )
}


