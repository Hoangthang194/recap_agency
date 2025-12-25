/**
 * Ví dụ sử dụng useCategories hook
 * 
 * Hook này cung cấp các chức năng để:
 * - Fetch danh sách categories
 * - Tạo category mới
 * - Lấy category theo ID
 * - Filter categories (isCity, areaId, countryId)
 */

'use client'

import { useEffect } from 'react'
import { useCategories } from './useCategories'

// Example 1: Fetch tất cả categories
export function CategoriesListExample() {
  const { categories, loading, error, fetchCategories } = useCategories()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>All Categories ({categories.length})</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  )
}

// Example 2: Fetch chỉ cities
export function CitiesListExample() {
  const { categories, loading, error, fetchCategories } = useCategories({
    isCity: true,
    autoFetch: true
  })

  useEffect(() => {
    fetchCategories({ isCity: true })
  }, [fetchCategories])

  if (loading) return <div>Loading cities...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Cities ({categories.length})</h2>
      <ul>
        {categories.map(city => (
          <li key={city.id}>
            {city.name} - {city.areaId} - {city.countryId}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Example 3: Tạo category mới
export function CreateCategoryExample() {
  const { createCategory, creating, error } = useCategories()

  const handleCreate = async () => {
    const newCategory = await createCategory({
      id: 'new-category-1',
      name: 'New Category',
      icon: 'folder',
      image: 'https://example.com/image.jpg',
      colorClass: 'bg-blue-500/20',
      description: 'A new category',
    })

    if (newCategory) {
      console.log('Category created:', newCategory)
      alert('Category created successfully!')
    }
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={creating}>
        {creating ? 'Creating...' : 'Create Category'}
      </button>
      {error && <div className="error">Error: {error}</div>}
    </div>
  )
}

// Example 4: Tạo city category
export function CreateCityExample() {
  const { createCategory, creating, error } = useCategories()

  const handleCreateCity = async () => {
    const newCity = await createCategory({
      id: 'new-city-1',
      name: 'New City',
      icon: 'location_city',
      image: 'https://example.com/city.jpg',
      colorClass: 'bg-green-500/20',
      description: 'A new city',
      isCity: true,
      areaId: 'southeast-asia',
      countryId: 'vietnam',
    })

    if (newCity) {
      console.log('City created:', newCity)
      alert('City created successfully!')
    }
  }

  return (
    <div>
      <button onClick={handleCreateCity} disabled={creating}>
        {creating ? 'Creating...' : 'Create City'}
      </button>
      {error && <div className="error">Error: {error}</div>}
    </div>
  )
}

// Example 5: Filter theo area
export function CategoriesByAreaExample() {
  const { categories, loading, error, fetchCategories } = useCategories()

  useEffect(() => {
    fetchCategories({ areaId: 'southeast-asia' })
  }, [fetchCategories])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Categories in Southeast Asia ({categories.length})</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  )
}

