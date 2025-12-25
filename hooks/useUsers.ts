'use client'

import { useState, useCallback, useRef } from 'react'

// User type matching AdminUser from app/admin/users/page.tsx
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'invited' | 'suspended'
}

// API Response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

interface CreateUserInput {
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status?: 'active' | 'invited' | 'suspended'
}

interface UpdateUserInput {
  name?: string
  email?: string
  role?: 'admin' | 'editor' | 'viewer'
  status?: 'active' | 'invited' | 'suspended'
}

export interface UseUsersOptions {
  autoFetch?: boolean // Tự động fetch khi mount
}

export interface UseUsersReturn {
  // Data
  users: User[]
  user: User | null
  
  // Loading states
  loading: boolean
  creating: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchUsers: (options?: { role?: string; status?: string }) => Promise<void>
  createUser: (input: CreateUserInput) => Promise<User | null>
  updateUser: (id: string, input: UpdateUserInput) => Promise<User | null>
  updatePassword: (id: string, currentPassword: string, newPassword: string) => Promise<boolean>
  deleteUser: (id: string) => Promise<boolean>
  getUserById: (id: string) => Promise<User | null>
  
  // Utilities
  clearError: () => void
}

export function useUsers(initialOptions?: UseUsersOptions): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Transform database user to User type
  const transformUser = useCallback((dbUser: any): User => {
    return {
      id: String(dbUser.id),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      status: dbUser.status,
    }
  }, [])

  // Track if a fetch is in progress to prevent duplicate calls
  const fetchingRef = useRef(false)
  
  // Fetch users
  const fetchUsers = useCallback(async (options?: { role?: string; status?: string }) => {
    // Prevent multiple simultaneous fetches
    if (loading || fetchingRef.current) {
      return
    }
    
    fetchingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (options?.role) params.append('role', options.role)
      if (options?.status) params.append('status', options.status)
      
      const url = `/api/users${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      const result: ApiResponse<User[]> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch users')
      }
      
      if (result.data) {
        const transformed = result.data.map(transformUser)
        setUsers(transformed)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching users'
      setError(errorMessage)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [transformUser])

  // Create user
  const createUser = useCallback(async (input: CreateUserInput): Promise<User | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<User> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create user')
      }
      
      if (result.data) {
        const transformed = transformUser(result.data)
        setUsers(prev => [...prev, transformed])
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating user'
      setError(errorMessage)
      console.error('Error creating user:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformUser])

  // Update user
  const updateUser = useCallback(async (id: string, input: UpdateUserInput): Promise<User | null> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      const result: ApiResponse<User> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update user')
      }
      
      if (result.data) {
        const transformed = transformUser(result.data)
        setUsers(prev => prev.map(u => u.id === id ? transformed : u))
        if (user?.id === id) {
          setUser(transformed)
        }
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating user'
      setError(errorMessage)
      console.error('Error updating user:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [transformUser, user])

  // Update password
  const updatePassword = useCallback(async (id: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update password')
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating password'
      setError(errorMessage)
      console.error('Error updating password:', err)
      return false
    } finally {
      setCreating(false)
    }
  }, [])

  // Delete user
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setCreating(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<void> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete user')
      }
      
      setUsers(prev => prev.filter(u => u.id !== id))
      if (user?.id === id) {
        setUser(null)
      }
      
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting user'
      setError(errorMessage)
      console.error('Error deleting user:', err)
      return false
    } finally {
      setCreating(false)
    }
  }, [user])

  // Get user by ID
  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${id}`)
      const result: ApiResponse<User> = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch user')
      }
      
      if (result.data) {
        const transformed = transformUser(result.data)
        setUser(transformed)
        return transformed
      }
      
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching user'
      setError(errorMessage)
      console.error('Error fetching user:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [transformUser])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    users,
    user,
    loading,
    creating,
    error,
    fetchUsers,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
    getUserById,
    clearError,
  }
}

