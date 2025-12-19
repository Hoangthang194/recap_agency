'use client'

import { useState, useCallback, useRef } from 'react'
import { Category } from '@/types'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

interface CreateCategoryInput {
  id: string
  name: string
  icon: string
  image: string
  colorClass: string
  description?: string
  isCity?: boolean
  areaId?: string | null
  countryId?: string | null
}

export interface UseCategoriesOptions {
  isCity?: boolean
  areaId?: string
  countryId?: string
  autoFetch?: boolean // Tự động fetch khi mount
}

export interface UseCategoriesReturn {
  // Data
  categories: Category[]
  category: Category | null
  
  // Loading states
  loading: boolean
  creating: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchCategories: (options?: UseCategoriesOptions) => Promise<void>
  createCategory: (input: CreateCategoryInput) => Promise<Category | null>
  updateCategory: (id: string, input: CreateCategoryInput) => Promise<Category | null>
  deleteCategory: (id: string) => Promise<boolean>
  getCategoryById: (id: string) => Promise<Category | null>
  
  // Utilities
  clearError: () => void
}

export function useCategories(initialOptions?: UseCategoriesOptions): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Build query string from options
  const buildQueryString = useCallback((options?: UseCategoriesOptions): string => {
    const params = new URLSearchParams()
    
    if (options?.isCity !== undefined) {
      params.append('isCity', String(options.isCity))
    }
    if (options?.areaId) {
      params.append('areaId', options.areaId)
    }
    if (options?.countryId) {
      params.append('countryId', options.countryId)
    }
    
    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
  }, [])

  // Transform database category to Category type
  const transformCategory = useCallback((dbCategory: any): Category => {
    return {
      id: dbCategory.id,
      name: dbCategory.name,
      icon: dbCategory.icon,
      image: dbCategory.image,
      colorClass: dbCategory.color_class || dbCategory.colorClass,
      description: dbCategory.description,
      isCity: dbCategory.is_city || dbCategory.isCity || false,
      areaId: dbCategory.area_id || dbCategory.areaId,
      countryId: dbCategory.country_id || dbCategory.countryId,
    }
  }, [])

  // Track if a fetch is in progress to prevent duplicate calls
  const fetchingRef = useRef(false)
  
  // Fetch categories
  const fetchCategories = useCallback(async (options?: UseCategoriesOptions) => {
    // Prevent multiple simultaneous fetches
    if (loading || fetchingRef.current) {
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      const queryString = buildQueryString(options || initialOptions)
      const response = await fetch(`/api/categories${queryString}`)
      const result: ApiResponse<Category[]> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch categories')
      }
      
      const transformedCategories = (result.data || []).map(transformCategory)
      setCategories(transformedCategories)
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching categories'
      setError(errorMessage)
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [buildQueryString, transformCategory, initialOptions])

  // Create category
  const createCategory = useCallback(async (input: CreateCategoryInput): Promise<Category | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Category> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create category')
      }
      
      const newCategory = transformCategory(result.data!)
      
      // Add to local state
      setCategories(prev => [...prev, newCategory])
      
      return newCategory
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating category'
      setError(errorMessage)
      console.error('Error creating category:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformCategory])

  // Get category by ID
  const getCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/categories/${id}`)
      const result: ApiResponse<Category> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch category')
      }
      
      if (result.data) {
        const transformed = transformCategory(result.data)
        setCategory(transformed)
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching category'
      setError(errorMessage)
      console.error('Error fetching category:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [transformCategory])

  // Update category
  const updateCategory = useCallback(async (id: string, input: CreateCategoryInput): Promise<Category | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Category> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update category')
      }
      
      const updatedCategory = transformCategory(result.data!)
      
      // Update in local state
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat))
      if (category?.id === id) {
        setCategory(updatedCategory)
      }
      
      return updatedCategory
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating category'
      setError(errorMessage)
      console.error('Error updating category:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformCategory, category])

  // Delete category
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete category')
      }
      
      // Remove from local state
      setCategories(prev => prev.filter(cat => cat.id !== id))
      if (category?.id === id) {
        setCategory(null)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting category'
      setError(errorMessage)
      console.error('Error deleting category:', err)
      return false
    } finally {
      setCreating(false)
    }
  }, [category])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    categories,
    category,
    loading,
    creating,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    clearError,
  }
}

