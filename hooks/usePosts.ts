'use client'

import { useState, useCallback, useRef } from 'react'
import { Post, Author, SidebarBanner } from '@/types'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

interface CreatePostInput {
  id: string
  title: string
  excerpt: string
  image: string
  thumbnail: string
  category: string
  author: Author | string // Can be Author object or author ID
  date: string
  readTime?: string
  slug: string
  content?: string
  sidebarBanner?: SidebarBanner
}

export interface UsePostsOptions {
  categoryId?: string
  authorId?: string | number
  limit?: number
  offset?: number
  autoFetch?: boolean
}

export interface UsePostsReturn {
  // Data
  posts: Post[]
  post: Post | null
  
  // Loading states
  loading: boolean
  creating: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchPosts: (options?: UsePostsOptions) => Promise<void>
  createPost: (input: CreatePostInput) => Promise<Post | null>
  updatePost: (id: string, input: CreatePostInput) => Promise<Post | null>
  deletePost: (id: string) => Promise<boolean>
  getPostById: (id: string) => Promise<Post | null>
  getPostBySlug: (slug: string) => Promise<Post | null>
  
  // Utilities
  clearError: () => void
}

export function usePosts(initialOptions?: UsePostsOptions): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([])
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Build query string from options
  const buildQueryString = useCallback((options?: UsePostsOptions): string => {
    const params = new URLSearchParams()
    
    if (options?.categoryId) {
      params.append('categoryId', options.categoryId)
    }
    if (options?.authorId) {
      params.append('authorId', String(options.authorId))
    }
    if (options?.limit) {
      params.append('limit', String(options.limit))
    }
    if (options?.offset) {
      params.append('offset', String(options.offset))
    }
    
    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
  }, [])

  // Transform database post to Post type
  const transformPost = useCallback((dbPost: any): Post => {
    // Parse sidebar_banner JSON if it exists
    let sidebarBanner: SidebarBanner | undefined
    if (dbPost.sidebar_banner) {
      try {
        sidebarBanner = typeof dbPost.sidebar_banner === 'string' 
          ? JSON.parse(dbPost.sidebar_banner)
          : dbPost.sidebar_banner
      } catch (e) {
        console.error('Error parsing sidebar_banner:', e)
      }
    }

    // Build author object with id
    const author: Author = {
      id: String(dbPost.author_id || ''),
      name: dbPost.author_name || '',
      avatar: dbPost.author_avatar || '',
    }

    return {
      id: String(dbPost.id || ''),
      title: dbPost.title,
      excerpt: dbPost.excerpt,
      image: dbPost.image,
      thumbnail: dbPost.thumbnail,
      category: String(dbPost.category_id || ''),
      author,
      date: dbPost.date,
      readTime: dbPost.read_time || dbPost.readTime,
      slug: dbPost.slug,
      content: dbPost.content,
      sidebarBanner,
    }
  }, [])

  // Track if a fetch is in progress to prevent duplicate calls
  const fetchingRef = useRef(false)
  
  // Fetch posts with debouncing to prevent too many requests
  const fetchPosts = useCallback(async (options?: UsePostsOptions) => {
    // Prevent multiple simultaneous fetches
    if (loading || fetchingRef.current) {
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      const queryString = buildQueryString(options || initialOptions)
      const response = await fetch(`/api/posts${queryString}`, {
        cache: 'no-store', // Prevent caching issues
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText || `HTTP ${response.status}` }
        }
        throw new Error(errorData.error || 'Failed to fetch posts')
      }
      
      const result: ApiResponse<Post[]> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch posts')
      }
      
      const transformedPosts = (result.data || []).map(transformPost)
      setPosts(transformedPosts)
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching posts'
      setError(errorMessage)
      console.error('Error fetching posts:', err)
      // Don't clear posts on error, keep existing data
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [buildQueryString, transformPost, initialOptions])

  // Create post
  const createPost = useCallback(async (input: CreatePostInput): Promise<Post | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Post> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create post')
      }
      
      const newPost = transformPost(result.data!)
      
      // Add to local state
      setPosts(prev => [newPost, ...prev])
      
      return newPost
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating post'
      setError(errorMessage)
      console.error('Error creating post:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformPost])

  // Get post by ID
  const getPostById = useCallback(async (id: string): Promise<Post | null> => {
    // Ensure id is a string
    const stringId = String(id || '').trim()
    
    if (!stringId || stringId === 'undefined' || stringId === 'null' || stringId.includes('[object')) {
      console.error('❌ Invalid post ID in getPostById:', id, 'converted to:', stringId)
      setError('Invalid post ID')
      return null
    }
    
    console.log('=== DEBUG: getPostById ===')
    console.log('Fetching post with ID:', stringId, 'type:', typeof stringId)
    console.log('URL:', `/api/posts/${stringId}`)
    
    setLoading(true)
    setError(null)
    
    try {
      const url = `/api/posts/${encodeURIComponent(stringId)}`
      console.log('Fetching from URL:', url)
      const response = await fetch(url)
      const result: ApiResponse<Post> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch post')
      }
      
      if (result.data) {
        const transformed = transformPost(result.data)
        setPost(transformed)
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching post'
      setError(errorMessage)
      console.error('❌ Error fetching post:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [transformPost])

  // Get post by slug
  const getPostBySlug = useCallback(async (slug: string): Promise<Post | null> => {
    setLoading(true)
    setError(null)
    
    try {
      // Encode slug for URL (handle special characters)
      const encodedSlug = encodeURIComponent(slug)
      const url = `/api/posts/slug/${encodedSlug}`
    
      
      const response = await fetch(url, {
        cache: 'no-store', // Prevent caching issues
      })
      
      const result: ApiResponse<Post> = await response.json()
      
      if (!response.ok || !result.success) {
        console.error('❌ API Error:', {
          status: response.status,
          error: result.error,
          slug
        })
        throw new Error(result.error || 'Failed to fetch post')
      }
      
      if (result.data) {
        const transformed = transformPost(result.data)
        setPost(transformed)
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching post'
      setError(errorMessage)
      console.error('❌ Error fetching post by slug:', {
        error: err,
        slug,
        message: errorMessage
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [transformPost])

  // Update post
  const updatePost = useCallback(async (id: string, input: CreatePostInput): Promise<Post | null> => {
    setCreating(true)
    setError(null)
    
    try {
      // Clean input: convert undefined to null for all fields
      const cleanedInput = {
        ...input,
        content: input.content !== undefined ? input.content : null,
        sidebarBanner: input.sidebarBanner !== undefined ? input.sidebarBanner : null,
        readTime: input.readTime !== undefined ? input.readTime : null,
      }
      
      console.log('=== DEBUG: updatePost ===')
      console.log('Input:', input)
      console.log('Cleaned input:', cleanedInput)
      
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedInput),
      })
      
      const result: ApiResponse<Post> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update post')
      }
      
      const updatedPost = transformPost(result.data!)
      
      // Update in local state
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p))
      if (post?.id === id) {
        setPost(updatedPost)
      }
      
      return updatedPost
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating post'
      setError(errorMessage)
      console.error('Error updating post:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformPost, post])

  // Delete post
  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete post')
      }
      
      // Remove from local state
      setPosts(prev => prev.filter(p => p.id !== id))
      if (post?.id === id) {
        setPost(null)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting post'
      setError(errorMessage)
      console.error('Error deleting post:', err)
      return false
    } finally {
      setCreating(false)
    }
  }, [post])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    posts,
    post,
    loading,
    creating,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    getPostBySlug,
    clearError,
  }
}

