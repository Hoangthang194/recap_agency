'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useCategories } from '@/hooks/useCategories'
import { areas, countries } from '@/data'

interface UploadedImage {
  fileName: string
  url: string
  path: string
}

export default function AdminEditCategoryPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const categoryId = params?.id as string
  const { category, loading: loadingCategory, updateCategory, creating, error: updateError, getCategoryById } = useCategories()
  
  const [type, setType] = useState<'category' | 'city'>('category')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [icon, setIcon] = useState('')
  const [colorClass, setColorClass] = useState('')
  const [areaId, setAreaId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load category data
  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId)
    }
  }, [categoryId, getCategoryById])

  // Populate form when category is loaded
  useEffect(() => {
    if (category) {
      setName(category.name || '')
      setDescription(category.description || '')
      setImageUrl(category.image || '')
      setIcon(category.icon || '')
      setColorClass(category.colorClass || '')
      setType(category.isCity ? 'city' : 'category')
      setAreaId(category.areaId || '')
      setCountryId(category.countryId || '')
    }
  }, [category])

  // Load uploaded images
  const loadUploadedImages = async () => {
    setLoadingImages(true)
    try {
      const response = await fetch('/api/upload/list')
      const result = await response.json()
      if (result.success) {
        setUploadedImages(result.data || [])
      }
    } catch (err) {
      console.error('Error loading uploaded images:', err)
    } finally {
      setLoadingImages(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn file ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File không được vượt quá 5MB')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      setImageUrl(result.url)
      setUploadError(null)
      if (showImagePicker) {
        loadUploadedImages()
      }
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi khi upload ảnh')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !imageUrl || !icon || !colorClass) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    if (type === 'city' && (!areaId || !countryId)) {
      toast.error('Vui lòng chọn khu vực và quốc gia cho thành phố')
      return
    }

    const updatedCategory = await updateCategory(categoryId, {
      id: categoryId,
      name,
      icon,
      image: imageUrl,
      colorClass,
      description: description || undefined,
      isCity: type === 'city',
      areaId: type === 'city' ? areaId : null,
      countryId: type === 'city' ? countryId : null,
    })

    if (updatedCategory) {
      toast.success('Cập nhật danh mục/thành phố thành công!')
      router.push('/admin/categories')
    }
  }

  if (loadingCategory) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-sm text-gray-500">Đang tải thông tin danh mục...</div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-sm text-red-600 mb-4">Không tìm thấy danh mục</div>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <span className="material-icons-outlined text-sm">arrow_back</span>
            Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Chỉnh Sửa Danh Mục/Thành Phố
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Chỉnh sửa thông tin danh mục hoặc thành phố.
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
        {/* ID Display (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <input
            type="text"
            value={categoryId}
            disabled
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">ID không thể thay đổi</p>
        </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon *</label>
            <input
              type="text"
              required
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="computer, location_city, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lớp Màu (Tailwind) *</label>
            <input
              type="text"
              required
              value={colorClass}
              onChange={(e) => setColorClass(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
              placeholder="bg-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hình Ảnh *</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                placeholder="URL hình ảnh hoặc chọn từ ảnh đã upload"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <span className="material-icons-outlined text-sm">
                  {uploading ? 'hourglass_empty' : 'upload'}
                </span>
                <span>{uploading ? 'Đang tải...' : 'Upload'}</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowImagePicker(true)
                  loadUploadedImages()
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span className="material-icons-outlined text-sm">image</span>
                <span>Chọn ảnh</span>
              </button>
            </div>
            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}
            {imageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-w-xs">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-32 object-contain"
                />
              </div>
            )}
          </div>
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

        {/* Error Display */}
        {updateError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{updateError}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <button
            type="submit"
            disabled={creating || uploading}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Đang cập nhật...' : 'Cập Nhật'}
          </button>
          <Link
            href="/admin/categories"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Hủy
          </Link>
        </div>
      </form>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowImagePicker(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Chọn Ảnh Đã Upload</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadUploadedImages}
                  disabled={loadingImages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  title="Làm mới danh sách"
                >
                  <span className="material-icons-outlined text-sm">refresh</span>
                  <span>Làm mới</span>
                </button>
                <button
                  onClick={() => setShowImagePicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {loadingImages ? (
                <div className="text-center py-12">
                  <div className="text-sm text-gray-500">Đang tải danh sách ảnh...</div>
                </div>
              ) : uploadedImages.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-icons-outlined text-4xl text-gray-300 mb-2">image</span>
                  <div className="text-sm text-gray-500">Chưa có ảnh nào được upload</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((img) => (
                    <div
                      key={img.fileName}
                      onClick={() => {
                        setImageUrl(img.url)
                        setShowImagePicker(false)
                      }}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        imageUrl === img.url
                          ? 'border-primary ring-2 ring-primary'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={img.url}
                          alt={img.fileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="material-icons-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          check_circle
                        </span>
                      </div>
                      {imageUrl === img.url && (
                        <div className="absolute top-2 right-2">
                          <span className="material-icons-outlined text-primary bg-white rounded-full">
                            check_circle
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">{img.fileName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

