// app/categories/page.tsx
import { Suspense } from 'react'
import CategoriesClient from './CategoriesClient'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CategoriesClient />
    </Suspense>
  )
}
