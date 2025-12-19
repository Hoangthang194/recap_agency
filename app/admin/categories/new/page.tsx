'use client'

import { useState } from 'react'
import Link from 'next/link'
import { areas, countries } from '@/data'

export default function AdminNewCategoryPage() {
  const [type, setType] = useState<'category' | 'city'>('category')
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [colorClass, setColorClass] = useState('')
  const [areaId, setAreaId] = useState('')
  const [countryId, setCountryId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const categoryData = {
      type,
      name,
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      description,
      icon,
      image: imageUrl,
      colorClass,
      ...(type === 'city' && { isCity: true, areaId, countryId })
    }
    console.log('Create category/city', categoryData)
    alert('Demo only: Dữ liệu đã log ra console. Gắn API để lưu thực tế.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Tạo Danh Mục/Thành Phố Mới
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tạo danh mục hoặc thành phố mới cho blog.
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"
        >
          <span className="material-icons-outlined text-sm">arrow_back</span>
          Quay lại danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'category' | 'city')}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary"
          >
            <option value="category">Danh Mục</option>
            <option value="city">Thành Phố</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="Tên danh mục hoặc thành phố"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID (tự động tạo nếu để trống)</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="category-id hoặc city-id"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
            placeholder="Mô tả"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Tên Material Icons)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="computer, location_city, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình Ảnh</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lớp Màu (Tailwind)</label>
          <input
            type="text"
            value={colorClass}
            onChange={(e) => setColorClass(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
            placeholder="bg-blue-500/20"
          />
        </div>

        {/* City-specific fields */}
        {type === 'city' && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khu Vực</label>
              <select
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary"
              >
                <option value="">Chọn khu vực</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quốc Gia</label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-primary focus:border-primary"
              >
                <option value="">Chọn quốc gia</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
          >
            Tạo Mới
          </button>
          <Link
            href="/admin/categories"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}

