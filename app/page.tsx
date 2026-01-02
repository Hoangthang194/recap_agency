'use client'

import { useEffect, useState, useRef } from 'react'
import Newsletter from '@/components/Newsletter'
import PostCard from '@/components/PostCard'
import { usePosts, useCategories } from '@/hooks'
import Link from 'next/link'
import { getPostUrl } from '@/utils/post'

const POSTS_PER_PAGE = 20

export default function Home() {
  const { posts, totalRecord, loading: postsLoading, fetchPosts } = usePosts()
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
  const [currentPage, setCurrentPage] = useState(1)
  
  // Use refs to track if we've already fetched to prevent multiple calls
  const hasFetchedCategories = useRef(false)
  
  // Fetch posts with pagination
  useEffect(() => {
    const offset = (currentPage - 1) * POSTS_PER_PAGE
    fetchPosts({ limit: POSTS_PER_PAGE, offset })
  }, [currentPage, fetchPosts])
  
  // Fetch categories on mount (only once)
  
  useEffect(() => {
    if (!hasFetchedCategories.current && categories.length === 0 && !categoriesLoading) {
      hasFetchedCategories.current = true
      fetchCategories({ isCity: false }) // Only fetch categories, not cities
    }
  }, []) // Empty dependency array - only run once on mount
  
  // Calculate pagination based on totalRecord from API
  const totalPages = Math.ceil(totalRecord / POSTS_PER_PAGE)
  
  // Featured post is distinct - find the post with matching title
  const heroPostData = posts.length > 0 
    ? (posts.find(p => p.title === "Pitching Your Idea: A Guide to Presenting with Impact") || posts[0])
    : null;
  
  const heroPost = heroPostData ? {
    id: heroPostData.id,
    title: heroPostData.title,
    excerpt: heroPostData.excerpt,
    image: heroPostData.thumbnail || heroPostData.image,
    author: heroPostData.author,
    date: heroPostData.date
  } : null;

  const heroSidePosts = posts.slice(0, 4);
  const gridPosts = posts.slice(0, 9);

  // Combined loading state - show full page loader while any API is loading
  const isLoading = postsLoading || categoriesLoading;

  // Full page loading state - show loading when fetching initial data
  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Loading data...</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {postsLoading && categoriesLoading && 'Loading posts and categories...'}
            {postsLoading && !categoriesLoading && 'Loading posts...'}
            {!postsLoading && categoriesLoading && 'Loading categories...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        {heroPostData && heroPost && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
            <Link href={getPostUrl(heroPostData)} className="lg:col-span-7 group relative h-[500px] lg:h-auto rounded-3xl overflow-hidden cursor-pointer block">
              <img 
                src={heroPostData.thumbnail || heroPostData.image} 
                alt="Hero" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-icons-outlined text-white text-sm">sports_soccer</span>
                  <span className="text-white text-sm font-bold uppercase tracking-wider">Sport</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {heroPost.title}
                </h1>
                <p className="text-gray-200 mb-8 line-clamp-2 max-w-xl text-lg">
                  {heroPost.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <img src={heroPost.author.avatar} alt="Author" className="w-12 h-12 rounded-full border-2 border-white/30" />
                  <div>
                    <p className="text-white text-sm font-bold">{heroPost.author.name}</p>
                    <p className="text-gray-300 text-xs">{heroPost.date}</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 content-between">
              {heroSidePosts.slice(0, 2).map((post) => (
                <Link href={getPostUrl(post)} key={post.id} className="flex gap-4 group cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-2xl hover:shadow-lg transition-all duration-300 items-center">
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                    <img src={post.thumbnail || post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase">{post.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{post.date}</span>
                  </div>
                </Link>
              ))}
              {/* More prominent side cards */}
              {heroSidePosts.slice(2, 4).map((post) => (
                <Link href={getPostUrl(post)} key={post.id} className="group relative h-48 rounded-2xl overflow-hidden block">
                  <img src={post.thumbnail || post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <span className="text-[10px] font-bold text-white uppercase bg-primary px-2 py-0.5 rounded mb-2 inline-block">{post.category}</span>
                    <h3 className="text-white font-bold leading-tight line-clamp-2">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-24">
          <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">Read by Category</h2>
          {categoriesLoading ? (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link href={`/${cat.id}`} key={cat.id} className="group block">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className={`absolute inset-0 ${cat.colorClass} mix-blend-multiply transition-opacity group-hover:opacity-80`}></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <span className="material-icons-outlined text-white">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <span className="material-icons-outlined text-sm text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary transition-colors">{cat.icon}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary transition-colors">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-20">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors border border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="material-icons-outlined text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back_ios</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                      currentPage === page
                        ? 'bg-primary text-white shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                )
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <div key={page} className="w-10 h-10 flex items-end justify-center pb-2 text-gray-400 dark:text-gray-500 font-bold tracking-widest">
                    ...
                  </div>
                )
              }
              return null
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors border border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="material-icons-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward_ios</span>
            </button>
          </div>
        )}
      </div>
      
      <Newsletter />
    </div>
  )
}

