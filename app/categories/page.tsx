import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { categories } from '@/data'

export default function CategoriesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900">Categories</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 tracking-tight">
          Categories
        </h1>

        {/* Display categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <div key={category.id} className="group">
              <Link href={`/${category.id}`} className="block">
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 mb-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                  />
                  <div className={`absolute inset-0 ${category.colorClass} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`}></div>
                  
                  {/* Icon overlay */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="material-icons-outlined text-gray-800">{category.icon}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2 mb-4">
                  <span className="material-icons-outlined text-gray-400 group-hover:text-primary transition-colors">{category.icon}</span>
                  <div>
                    <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors block">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.description}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Newsletter />
    </div>
  )
}

