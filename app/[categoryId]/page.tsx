'use client'

import { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { usePosts } from '@/hooks/usePosts'
import { useCategories } from '@/hooks/useCategories'
import { getPostUrl } from '@/utils/post'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params?.categoryId as string
  
  const { posts, loading: postsLoading, fetchPosts } = usePosts()
  const { categories, loading: categoriesLoading, fetchCategories, getCategoryById } = useCategories()
  
  // Fetch all categories and posts on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])
  
  // Fetch category by ID and posts when categoryId changes
  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId)
      fetchPosts({ categoryId })
    }
  }, [categoryId, getCategoryById, fetchPosts])
  
  // Find category by id
  const category = useMemo(() => {
    return categories.find(cat => cat.id === categoryId) || null
  }, [categories, categoryId])
  
  // Filter posts by categoryId
  const categoryPosts = useMemo(() => {
    if (!categoryId) return []
    return posts.filter(post => post.category === categoryId)
  }, [posts, categoryId])
  
  const loading = postsLoading || categoriesLoading
  
  // Show loading state
  if (loading && !category) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-sm text-gray-500">Đang tải...</div>
          </div>
        </div>
      </div>
    )
  }
  
  // If category not found, show 404
  if (!loading && !category) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
            <p className="text-gray-500 mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/" className="text-primary hover:underline">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  const isCity = category?.isCity === true
  const categoryName = category?.name || ''
  const categoryDescription = category?.description || ''
  const categoryImage = category?.image || ''

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex mb-8 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link href={isCity ? "/categories" : "/"} className="hover:text-primary transition-colors">
              {isCity ? "Cities" : "Posts"}
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900">{categoryName}</span>
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">{categoryName}</h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                {categoryDescription}
              </p>
            </div>
            <div className="hidden md:block">
              <img src={categoryImage} alt={categoryName} className="w-20 h-20 rounded-2xl object-cover shadow-lg rotate-3 border-2 border-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {postsLoading ? (
          <div className="text-center py-20">
            <div className="text-sm text-gray-500">Đang tải bài viết...</div>
          </div>
        ) : categoryPosts.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {categoryPosts.map((post, idx) => (
              <div key={post.id} className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group">
                <Link href={getPostUrl(post)}>
                  <img src={post.image} alt={post.title} className="w-full object-cover" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-icons-outlined text-sm text-blue-500">folder_open</span>
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">
                        {category?.name || post.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                      <div className="flex flex-1 justify-between items-center">
                        <span className="text-xs font-bold text-gray-900">{post.author.name}</span>
                        <span className="text-[10px] text-gray-400">{post.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chưa có bài viết nào trong danh mục này.</p>
          </div>
        )}
      </div>
      
      <Newsletter />
    </div>
  )
}


