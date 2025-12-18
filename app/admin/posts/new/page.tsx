'use client'

import { useState } from 'react'
import { categories } from '@/data'
import Link from 'next/link'
import { LexicalEditor } from '@/components/admin/LexicalEditor'

export default function AdminNewPostPage() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState(categories[0]?.name ?? '')
  const [imageUrl, setImageUrl] = useState('')
  const [contentHtml, setContentHtml] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ở đây bạn có thể gọi API để lưu bài viết mới.
    // Tạm thời chỉ log ra console để demo.
    console.log('Create post', { title, excerpt, category, imageUrl, contentHtml })
    alert('Demo only: dữ liệu đã log ra console. Bạn có thể gắn API lưu vào DB sau.')
  }

  const handlePreview = () => {
    if (typeof window === 'undefined') return

    const draft = {
      id: 'preview',
      title: title || 'Preview title',
      excerpt: excerpt || 'Preview excerpt',
      category: category || 'Preview',
      image:
        imageUrl ||
        'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1600',
      contentHtml,
    }

    // Lưu tạm dữ liệu preview vào sessionStorage
    window.sessionStorage.setItem('postPreview', JSON.stringify(draft))
    // Mở trang bài viết preview trong tab mới, dùng layout post/[id]/page.tsx
    window.open('/post/preview', '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            New Post
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
          Back to posts
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[380px,minmax(0,1fr)] gap-8 items-start">
        {/* Left: meta fields */}
        <div className="space-y-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="Short summary shown on cards"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="https://..."
            />
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Preview
            </button>
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
            >
              Save Post
            </button>
          </div>
        </div>

        {/* Right: Lexical editor component */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Post content</h2>
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
    </div>
  )
}


