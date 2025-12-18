'use client';

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { posts, categories } from '@/data'
import { LexicalEditor } from '@/components/admin/LexicalEditor'

export default function AdminEditPostPage() {
  const params = useParams<{ id: string }>()
  const postId = params?.id as string

  const post = useMemo(() => posts.find((p) => p.id === postId), [postId])

  const [title, setTitle] = useState(post?.title ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [category, setCategory] = useState(post?.category ?? categories[0]?.name ?? '')
  const [imageUrl, setImageUrl] = useState(post?.image ?? '')
  const [contentHtml, setContentHtml] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Tại đây bạn có thể gọi API để cập nhật bài viết.
    console.log('Update post', { id: postId, title, excerpt, category, imageUrl, contentHtml })
    alert('Demo only: dữ liệu đã log ra console. Gắn API để lưu thực tế nếu cần.')
  }

  if (!post) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Post not found</h1>
        <Link href="/admin/posts" className="text-sm text-primary hover:underline">
          ← Back to posts
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Edit Post
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
          Back to posts
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-[380px,minmax(0,1fr)] gap-8 items-start"
      >
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
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
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
          >
            Update Post
          </button>
        </div>

        {/* Right: Lexical editor component */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Post content</h2>
                <p className="text-xs text-gray-500">
                  Chỉnh sửa nội dung chi tiết với Lexical playground.
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
