'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { useCategories } from '@/hooks/useCategories'
import { useCountries } from '@/hooks/useCountries'

export default function CategoriesClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
  const { countries, loading: countriesLoading, fetchCountries } = useCountries()
  
  // Get countryId from URL
  const countryId = searchParams.get('country')
  
  // State for dropdown and search
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch countries on mount
  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])
  
  // Fetch categories for the selected country when countryId or countries change
  useEffect(() => {
    if (countries.length > 0) {
      const targetCountryId = countryId || countries[0].id
      if (targetCountryId) {
        fetchCategories({ countryId: targetCountryId })
      }
    }
  }, [countryId, countries.length, fetchCategories])

  // Get current country from countries list
  const currentCountry = useMemo(() => {
    if (!countryId && countries.length > 0) {
      return countries[0]
    }
    return countries.find((c) => c.id === countryId) || countries[0]
  }, [countryId, countries])
  
  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries
    }
    const query = searchQuery.toLowerCase()
    return countries.filter(country => 
      country.name.toLowerCase().includes(query) ||
      country.description?.toLowerCase().includes(query)
    )
  }, [countries, searchQuery])
  
  const loading = categoriesLoading || countriesLoading
  
  // Handle country selection
  const handleCountrySelect = (selectedCountryId: string) => {
    router.push(`/categories?country=${selectedCountryId}`)
    setIsDropdownOpen(false)
    setSearchQuery('')
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-sm text-gray-500">Đang tải danh sách danh mục...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900">Categories</span>
        </nav>

        {/* Country selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
              {currentCountry?.name || 'Categories'}
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              {currentCountry ? `Select a category in ${currentCountry.name} to explore stories.` : 'Select a category to explore stories.'}
            </p>
          </div>
          
          {/* Country Dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-auto inline-flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <div className="flex items-center gap-2">
                {currentCountry && (
                  <>
                    <span className="material-icons-outlined text-base text-gray-400">
                      {currentCountry.icon}
                    </span>
                    <span>{currentCountry.name}</span>
                  </>
                )}
                {!currentCountry && countriesLoading && (
                  <span className="text-gray-500">Đang tải...</span>
                )}
                {!currentCountry && !countriesLoading && (
                  <span className="text-gray-500">Chọn quốc gia</span>
                )}
              </div>
              <span className={`material-icons-outlined text-base transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-full md:w-80 z-20 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 flex flex-col">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-base">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Tìm kiếm quốc gia..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  
                  {/* Countries List */}
                  <div className="flex-1 overflow-y-auto max-h-64">
                    {countriesLoading ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Đang tải...
                      </div>
                    ) : filteredCountries.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Không tìm thấy quốc gia nào
                      </div>
                    ) : (
                      <div className="py-1">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.id}
                            type="button"
                            onClick={() => handleCountrySelect(country.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                              country.id === currentCountry?.id ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700'
                            }`}
                          >
                            <span className="material-icons-outlined text-base text-gray-400">
                              {country.icon}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium">{country.name}</div>
                              {country.description && (
                                <div className="text-xs text-gray-500 line-clamp-1">
                                  {country.description}
                                </div>
                              )}
                            </div>
                            {country.id === currentCountry?.id && (
                              <span className="material-icons-outlined text-primary text-base">
                                check
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Categories for selected country */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {currentCountry ? `Chưa có danh mục nào cho ${currentCountry.name}.` : 'Chưa có danh mục nào.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => (
            <Link key={category.id} href={`/${category.id}`} className="group">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 mb-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div
                  className={`absolute inset-0 ${category.colorClass} mix-blend-multiply opacity-60 group-hover:opacity-40 transition-opacity`}
                ></div>

                {/* Icon overlay */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="material-icons-outlined text-gray-800">{category.icon}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mb-4">
                <span className="material-icons-outlined text-gray-400 group-hover:text-primary transition-colors">
                  {category.icon}
                </span>
                <div>
                  <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors block">
                    {category.name}
                    {category.isCity && (
                      <span className="ml-2 text-xs font-normal text-gray-500">(City)</span>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">{category.description}</span>
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
      </div>
      <Newsletter />
    </div>
  )
}

