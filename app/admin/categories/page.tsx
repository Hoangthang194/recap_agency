'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { categories, areas, countries } from '@/data'

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'category' | 'city'>('all')

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        !search ||
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description?.toLowerCase().includes(search.toLowerCase())
      
      const matchesType = 
        filterType === 'all' ||
        (filterType === 'category' && !cat.isCity) ||
        (filterType === 'city' && cat.isCity)
      
      return matchesSearch && matchesType
    })
  }, [search, filterType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo only - log to console
    console.log('Create category/city')
    alert('Demo only: Tạo category/city mới. Gắn API để lưu thực tế.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Quản Lý Danh Mục & Thành Phố
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh mục và thành phố. (Chỉ demo front-end, không có ghi thực tế.)
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
        >
          <span className="material-icons-outlined text-sm">add</span>
          <span>Danh Mục/Thành Phố Mới</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative md:w-80">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              filterType === 'all'
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterType('category')}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              filterType === 'category'
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            Danh Mục
          </button>
          <button
            onClick={() => setFilterType('city')}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
              filterType === 'city'
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            Thành Phố
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 pr-4 font-medium">Tên</th>
                <th className="py-2 pr-4 font-medium">Loại</th>
                <th className="py-2 pr-4 font-medium hidden md:table-cell">Mô tả</th>
                <th className="py-2 pr-4 font-medium hidden lg:table-cell">ID</th>
                <th className="py-2 pr-2 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-4 text-gray-900 font-medium">{cat.name}</td>
                  <td className="py-2 pr-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      cat.isCity 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {cat.isCity ? 'Thành Phố' : 'Danh Mục'}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-gray-500 hidden md:table-cell max-w-xs">
                    <span className="line-clamp-2">{cat.description || '-'}</span>
                  </td>
                  <td className="py-2 pr-4 text-gray-400 font-mono text-xs hidden lg:table-cell">{cat.id}</td>
                  <td className="py-2 pr-2 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:border-primary hover:text-primary">
                        Sửa
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-gray-500">
                    Không có danh mục/thành phố nào khớp với bộ lọc của bạn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

