'use client'

import { useState, useCallback } from 'react'
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

interface UseCategoriesOptions {
  isCity?: boolean
  areaId?: string
  countryId?: string
  autoFetch?: boolean // Tự động fetch khi mount
}

interface UseCategoriesReturn {
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

  // Fetch categories
  const fetchCategories = useCallback(async (options?: UseCategoriesOptions) => {
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
      const response = await fetch(`/api/categories`)
      const result: ApiResponse<Category[]> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch categories')
      }
      
      const foundCategory = (result.data || []).find(cat => cat.id === id)
      
      if (foundCategory) {
        const transformed = transformCategory(foundCategory)
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
    getCategoryById,
    clearError,
  }
}

