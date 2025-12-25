'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useUsers } from '@/hooks'

export default function AdminUsersPage() {
  const { users, loading, error, fetchUsers, deleteUser, updateUser, updatePassword } = useUsers()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  
  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr))
        } catch (e) {
          console.error('Error parsing user from localStorage:', e)
        }
      }
    }
    fetchUsers()
  }, [fetchUsers])
  
  const handleDelete = async (userId: string) => {
    const success = await deleteUser(userId)
    if (success) {
      toast.success('Đã vô hiệu hóa người dùng')
      setShowDeleteConfirm(null)
    } else {
      toast.error('Lỗi khi vô hiệu hóa người dùng')
    }
  }
  
  const handleToggleStatus = async (user: typeof users[0]) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    const updated = await updateUser(user.id, { status: newStatus })
    if (updated) {
      toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm dừng'} người dùng`)
    } else {
      toast.error('Lỗi khi cập nhật trạng thái')
    }
  }

  const handleChangePassword = async (userId: string) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ các trường')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận không khớp')
      return
    }

    setChangingPassword(true)
    const success = await updatePassword(userId, currentPassword, newPassword)
    setChangingPassword(false)

    if (success) {
      toast.success('Đã cập nhật mật khẩu thành công')
      setShowPasswordModal(null)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      toast.error('Lỗi khi cập nhật mật khẩu')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Quản Lý Tài Khoản
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem và quản lý tài khoản admin / editor.
          </p>
        </div>
        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(currentUser.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50"
            >
              <span className="material-icons-outlined text-sm">lock</span>
              <span>Đổi mật khẩu</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-sm text-gray-500">Đang tải danh sách người dùng...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-sm text-gray-500">Chưa có người dùng nào</div>
          </div>
        ) : (
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
                        <button 
                          onClick={() => setShowPasswordModal(user.id)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:border-primary hover:text-primary"
                          title="Đổi mật khẩu"
                        >
                          <span className="material-icons-outlined text-sm">lock</span>
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:border-primary hover:text-primary"
                        >
                          {user.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="inline-flex items-center justify-center rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                        >
                          Vô hiệu hóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận vô hiệu hóa</h2>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn vô hiệu hóa người dùng này? Hành động này có thể được hoàn tác sau.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Vô hiệu hóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => {
          setShowPasswordModal(null)
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Đổi Mật Khẩu</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-primary focus:border-primary"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(null)
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                }}
                disabled={changingPassword}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleChangePassword(showPasswordModal)}
                disabled={changingPassword}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {changingPassword ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


