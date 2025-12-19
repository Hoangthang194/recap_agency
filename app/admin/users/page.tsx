'use client'

import { useState } from 'react'
import { currentUser } from '@/data'

type AdminUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'invited' | 'suspended'
}

const initialUsers: AdminUser[] = [
  {
    id: '1',
    name: currentUser.name,
    email: 'admin@recap.local',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Content Editor',
    email: 'editor@recap.local',
    role: 'editor',
    status: 'invited',
  },
]

export default function AdminUsersPage() {
  const [users] = useState<AdminUser[]>(initialUsers)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Quản Lý Tài Khoản
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem và quản lý tài khoản admin / editor. (Chỉ demo, không có xác thực thực tế.)
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50">
          <span className="material-icons-outlined text-sm">person_add</span>
          <span>Mời Người Dùng</span>
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 pr-4 font-medium">Tên</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Vai trò</th>
                <th className="py-2 pr-4 font-medium">Trạng thái</th>
                <th className="py-2 pr-2 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-4 text-gray-900">{user.name}</td>
                  <td className="py-2 pr-4 text-gray-700">{user.email}</td>
                  <td className="py-2 pr-4 text-gray-700 capitalize">{user.role}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : user.status === 'invited'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-2 pr-2 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:border-primary hover:text-primary">
                        Sửa
                      </button>
                      <button className="inline-flex items-center justify-center rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">
                        Vô hiệu hóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


