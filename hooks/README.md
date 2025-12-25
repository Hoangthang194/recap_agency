# useCategories Hook

Custom React hook để quản lý categories và cities từ API.

## Cài đặt

Hook đã được tạo sẵn trong `hooks/useCategories.ts`. Import và sử dụng:

```tsx
import { useCategories } from '@/hooks/useCategories'
```

## API

### `useCategories(options?)`

#### Parameters

```typescript
interface UseCategoriesOptions {
  isCity?: boolean        // Filter chỉ cities
  areaId?: string         // Filter theo area ID
  countryId?: string      // Filter theo country ID
  autoFetch?: boolean     // Tự động fetch khi mount (chưa implement)
}
```

#### Returns

```typescript
interface UseCategoriesReturn {
  // Data
  categories: Category[]           // Danh sách categories
  category: Category | null       // Category đơn lẻ (khi getById)
  
  // Loading states
  loading: boolean                 // Đang fetch categories
  creating: boolean               // Đang tạo category
  
  // Error states
  error: string | null            // Error message
  
  // Actions
  fetchCategories: (options?) => Promise<void>
  createCategory: (input) => Promise<Category | null>
  getCategoryById: (id) => Promise<Category | null>
  
  // Utilities
  clearError: () => void
}
```

## Ví dụ sử dụng

### 1. Fetch tất cả categories

```tsx
'use client'

import { useEffect } from 'react'
import { useCategories } from '@/hooks/useCategories'

export function CategoriesList() {
  const { categories, loading, error, fetchCategories } = useCategories()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Categories ({categories.length})</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 2. Fetch chỉ cities

```tsx
const { categories, loading, error, fetchCategories } = useCategories()

useEffect(() => {
  fetchCategories({ isCity: true })
}, [fetchCategories])
```

### 3. Fetch categories theo area

```tsx
useEffect(() => {
  fetchCategories({ areaId: 'southeast-asia' })
}, [fetchCategories])
```

### 4. Tạo category mới

```tsx
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
    console.log('Created:', newCategory)
    // Category đã được tự động thêm vào danh sách
  }
}

return (
  <button onClick={handleCreate} disabled={creating}>
    {creating ? 'Creating...' : 'Create Category'}
  </button>
)
```

### 5. Tạo city category

```tsx
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
  }
}
```

### 6. Lấy category theo ID

```tsx
const { category, loading, error, getCategoryById } = useCategories()

useEffect(() => {
  getCategoryById('hanoi').then(cat => {
    if (cat) {
      console.log('Found category:', cat)
    }
  })
}, [getCategoryById])
```

### 7. Xử lý error

```tsx
const { error, clearError } = useCategories()

return (
  <div>
    {error && (
      <div className="error">
        {error}
        <button onClick={clearError}>Dismiss</button>
      </div>
    )}
  </div>
)
```

## TypeScript Types

Hook sử dụng các types từ `@/types`:

```typescript
interface Category {
  id: string
  name: string
  icon: string
  image: string
  colorClass: string
  description?: string
  isCity?: boolean
  areaId?: string
  countryId?: string
}
```

## Lưu ý

1. Hook tự động transform dữ liệu từ database format (`color_class`, `is_city`, `area_id`) sang frontend format (`colorClass`, `isCity`, `areaId`)

2. Khi tạo category mới, nó sẽ tự động được thêm vào danh sách `categories` trong state

3. Hook sử dụng `'use client'` directive, chỉ sử dụng trong Client Components

4. Tất cả API calls đều sử dụng relative paths (`/api/categories`), đảm bảo Next.js dev server đang chạy

## Xem thêm

- File ví dụ: `hooks/useCategories.example.tsx`
- API Route: `app/api/categories/route.ts`
- Types: `types.ts`

