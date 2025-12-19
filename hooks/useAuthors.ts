'use client'

import { useState, useCallback, useRef } from 'react'
import { Author } from '@/types'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

interface CreateAuthorInput {
  name: string
  avatar: string
}

export interface UseAuthorsOptions {
  autoFetch?: boolean // Tự động fetch khi mount
}

export interface UseAuthorsReturn {
  // Data
  authors: Author[]
  author: Author | null
  
  // Loading states
  loading: boolean
  creating: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchAuthors: () => Promise<void>
  createAuthor: (input: CreateAuthorInput) => Promise<Author | null>
  updateAuthor: (id: string, input: CreateAuthorInput) => Promise<Author | null>
  deleteAuthor: (id: string) => Promise<boolean>
  getAuthorById: (id: string) => Promise<Author | null>
  
  // Utilities
  clearError: () => void
}

export function useAuthors(initialOptions?: UseAuthorsOptions): UseAuthorsReturn {
  const [authors, setAuthors] = useState<Author[]>([])
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Transform database author to Author type
  const transformAuthor = useCallback((dbAuthor: any): Author => {
    return {
      id: String(dbAuthor.id), // Convert to string for consistency
      name: dbAuthor.name,
      avatar: dbAuthor.avatar,
    }
  }, [])

  // Track if a fetch is in progress to prevent duplicate calls
  const fetchingRef = useRef(false)
  
  // Fetch authors
  const fetchAuthors = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (loading || fetchingRef.current) {
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/authors')
      const result: ApiResponse<Author[]> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch authors')
      }
      
      if (result.data) {
        const transformed = result.data.map(transformAuthor)
        setAuthors(transformed)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching authors'
      setError(errorMessage)
      console.error('Error fetching authors:', err)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [transformAuthor])

  // Create author
  const createAuthor = useCallback(async (input: CreateAuthorInput): Promise<Author | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Author> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create author')
      }
      
      if (result.data) {
        const transformed = transformAuthor(result.data)
        setAuthors(prev => [...prev, transformed])
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating author'
      setError(errorMessage)
      console.error('Error creating author:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformAuthor])

  // Update author
  const updateAuthor = useCallback(async (id: string, input: CreateAuthorInput): Promise<Author | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Author> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update author')
      }
      
      if (result.data) {
        const transformed = transformAuthor(result.data)
        setAuthors(prev => prev.map(a => a.id === id ? transformed : a))
        if (author?.id === id) {
          setAuthor(transformed)
        }
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating author'
      setError(errorMessage)
      console.error('Error updating author:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformAuthor, author])

  // Delete author
  const deleteAuthor = useCallback(async (id: string): Promise<boolean> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete author')
      }
      
      setAuthors(prev => prev.filter(a => a.id !== id))
      if (author?.id === id) {
        setAuthor(null)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting author'
      setError(errorMessage)
      console.error('Error deleting author:', err)
      return false
    } finally {
      setCreating(false)
    }
  }, [author])

  // Get author by ID
  const getAuthorById = useCallback(async (id: string): Promise<Author | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/authors/${id}`)
      const result: ApiResponse<Author> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch author')
      }
      
      if (result.data) {
        const transformed = transformAuthor(result.data)
        setAuthor(transformed)
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching author'
      setError(errorMessage)
      console.error('Error fetching author:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [transformAuthor])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Auto-fetch on mount if enabled
  if (initialOptions?.autoFetch !== false) {
    // This will be handled by useEffect in the component using the hook
  }

  return {
    authors,
    author,
    loading,
    creating,
    error,
    fetchAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getAuthorById,
    clearError,
  }
}

