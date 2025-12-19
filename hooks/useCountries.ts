'use client'

import { useState, useCallback, useRef } from 'react'
import { Country } from '@/types'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

interface CreateCountryInput {
  id: string
  name: string
  region: string
  icon: string
  image: string
  colorClass: string
  description?: string
  areaId?: string | null
}

export interface UseCountriesOptions {
  region?: string
  areaId?: string
  autoFetch?: boolean
}

export interface UseCountriesReturn {
  // Data
  countries: Country[]
  country: Country | null
  
  // Loading states
  loading: boolean
  creating: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchCountries: (options?: UseCountriesOptions) => Promise<void>
  createCountry: (input: CreateCountryInput) => Promise<Country | null>
  updateCountry: (id: string, input: CreateCountryInput) => Promise<Country | null>
  deleteCountry: (id: string) => Promise<boolean>
  getCountryById: (id: string) => Promise<Country | null>
  
  // Utilities
  clearError: () => void
}

export function useCountries(initialOptions?: UseCountriesOptions): UseCountriesReturn {
  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Build query string from options
  const buildQueryString = useCallback((options?: UseCountriesOptions): string => {
    const params = new URLSearchParams()
    
    if (options?.region) {
      params.append('region', options.region)
    }
    if (options?.areaId) {
      params.append('areaId', options.areaId)
    }
    
    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
  }, [])

  // Transform database country to Country type
  const transformCountry = useCallback((dbCountry: any): Country => {
    return {
      id: dbCountry.id,
      name: dbCountry.name,
      region: dbCountry.region,
      icon: dbCountry.icon,
      image: dbCountry.image,
      colorClass: dbCountry.color_class || dbCountry.colorClass,
      description: dbCountry.description || '',
      areaId: dbCountry.area_id || dbCountry.areaId,
      categories: [], // Categories are not included in the API response
    }
  }, [])

  // Track if a fetch is in progress to prevent duplicate calls
  const fetchingRef = useRef(false)
  
  // Fetch countries
  const fetchCountries = useCallback(async (options?: UseCountriesOptions) => {
    // Prevent multiple simultaneous fetches
    if (loading || fetchingRef.current) {
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      const queryString = buildQueryString(options || initialOptions)
      const response = await fetch(`/api/countries${queryString}`)
      const result: ApiResponse<Country[]> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch countries')
      }
      
      const transformedCountries = (result.data || []).map(transformCountry)
      setCountries(transformedCountries)
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching countries'
      setError(errorMessage)
      console.error('Error fetching countries:', err)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [buildQueryString, transformCountry, initialOptions])

  // Create country
  const createCountry = useCallback(async (input: CreateCountryInput): Promise<Country | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/countries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Country> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create country')
      }
      
      const newCountry = transformCountry(result.data!)
      
      // Add to local state
      setCountries(prev => [...prev, newCountry])
      
      return newCountry
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating country'
      setError(errorMessage)
      console.error('Error creating country:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformCountry])

  // Get country by ID
  const getCountryById = useCallback(async (id: string): Promise<Country | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/countries/${id}`)
      const result: ApiResponse<Country> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch country')
      }
      
      if (result.data) {
        const transformed = transformCountry(result.data)
        setCountry(transformed)
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching country'
      setError(errorMessage)
      console.error('Error fetching country:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [transformCountry])

  // Update country
  const updateCountry = useCallback(async (id: string, input: CreateCountryInput): Promise<Country | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/countries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<Country> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update country')
      }
      
      const updatedCountry = transformCountry(result.data!)
      
      // Update in local state
      setCountries(prev => prev.map(c => c.id === id ? updatedCountry : c))
      if (country?.id === id) {
        setCountry(updatedCountry)
      }
      
      return updatedCountry
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating country'
      setError(errorMessage)
      console.error('Error updating country:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformCountry, country])

  // Delete country
  const deleteCountry = useCallback(async (id: string): Promise<boolean> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/countries/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<any> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete country')
      }
      
      // Remove from local state
      setCountries(prev => prev.filter(c => c.id !== id))
      if (country?.id === id) {
        setCountry(null)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting country'
      setError(errorMessage)
      console.error('Error deleting country:', err)
      return false
    } finally {
      setCreating(false)
    }
  }, [country])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    countries,
    country,
    loading,
    creating,
    error,
    fetchCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    getCountryById,
    clearError,
  }
}

