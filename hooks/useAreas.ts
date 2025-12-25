'use client'

import { useState, useCallback, useRef } from 'react'
import { Area } from '@/types'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

interface CreateAreaInput {
  id: string
  name: string
  region: string
  icon: string
  image: string
  colorClass: string
  description?: string
}

export interface UseAreasOptions {
  region?: string
  autoFetch?: boolean
}

export interface UseAreasReturn {
  // Data
  areas: Area[]
  area: Area | null
  
  // Loading states
  loading: boolean
  creating: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchAreas: (options?: UseAreasOptions) => Promise<void>
  createArea: (input: CreateAreaInput) => Promise<Area | null>
  updateArea: (id: string, input: CreateAreaInput) => Promise<Area | null>
  deleteArea: (id: string) => Promise<boolean>
  getAreaById: (id: string) => Promise<Area | null>
  
  // Utilities
  clearError: () => void
}

export function useAreas(initialOptions?: UseAreasOptions): UseAreasReturn {
  const [areas, setAreas] = useState<Area[]>([])
  const [area, setArea] = useState<Area | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Build query string from options
  const buildQueryString = useCallback((options?: UseAreasOptions): string => {
    const params = new URLSearchParams()
    
    if (options?.region) {
      params.append('region', options.region)
    }
    
    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
  }, [])

  // Transform database area to Area type
  const transformArea = useCallback((dbArea: any): Area => {
    return {
      id: dbArea.id,
      name: dbArea.name,
      region: dbArea.region,
      icon: dbArea.icon,
      image: dbArea.image,
      colorClass: dbArea.color_class || dbArea.colorClass,
      description: dbArea.description || '',
    }
  }, [])

  // Track if a fetch is in progress to prevent duplicate calls
  const fetchingRef = useRef(false)
  
  // Fetch areas
  const fetchAreas = useCallback(async (options?: UseAreasOptions) => {
    // Prevent multiple simultaneous fetches
    if (loading || fetchingRef.current) {
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      const queryString = buildQueryString(options || initialOptions)
      const response = await fetch(`/api/areas${queryString}`)
      const result: ApiResponse<Area[]> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch areas')
      }
      
      const transformedAreas = (result.data || []).map(transformArea)
      setAreas(transformedAreas)
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching areas'
      setError(errorMessage)
      console.error('Error fetching areas:', err)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [buildQueryString, transformArea, initialOptions])

  // Create area
  const createArea = useCallback(async (input: CreateAreaInput): Promise<Area | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Area> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create area')
      }
      
      const newArea = transformArea(result.data!)
      
      // Add to local state
      setAreas(prev => [...prev, newArea])
      
      return newArea
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating area'
      setError(errorMessage)
      console.error('Error creating area:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformArea])

  // Get area by ID
  const getAreaById = useCallback(async (id: string): Promise<Area | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/areas/${id}`)
      const result: ApiResponse<Area> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch area')
      }
      
      if (result.data) {
        const transformed = transformArea(result.data)
        setArea(transformed)
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching area'
      setError(errorMessage)
      console.error('Error fetching area:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [transformArea])

  // Update area
  const updateArea = useCallback(async (id: string, input: CreateAreaInput): Promise<Area | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/areas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Area> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update area')
      }
      
      const updatedArea = transformArea(result.data!)
      
      // Update in local state
      setAreas(prev => prev.map(a => a.id === id ? updatedArea : a))
      if (area?.id === id) {
        setArea(updatedArea)
      }
      
      return updatedArea
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating area'
      setError(errorMessage)
      console.error('Error updating area:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformArea, area])

  // Delete area
  const deleteArea = useCallback(async (id: string): Promise<boolean> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/areas/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete area')
      }
      
      // Remove from local state
      setAreas(prev => prev.filter(a => a.id !== id))
      if (area?.id === id) {
        setArea(null)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting area'
      setError(errorMessage)
      console.error('Error deleting area:', err)
      return false
    } finally {
      setCreating(false)
    }
  }, [area])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    areas,
    area,
    loading,
    creating,
    error,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    getAreaById,
    clearError,
  }
}

