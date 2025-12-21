'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filter === 'read') {
        params.append('isRead', 'true')
      } else if (filter === 'unread') {
        params.append('isRead', 'false')
      }

      const response = await fetch(`/api/contact?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch messages')
      }

      setMessages(data.data || [])
    } catch (err: any) {
      console.error('Error fetching messages:', err)
      setError(err.message || 'Failed to load messages')
      toast.error('Không thể tải danh sách tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const handleToggleRead = async (message: ContactMessage) => {
    try {
      const response = await fetch(`/api/contact/${message.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: !message.is_read }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update message')
      }

      toast.success(message.is_read ? 'Đã đánh dấu là chưa đọc' : 'Đã đánh dấu là đã đọc')
      fetchMessages()
      if (selectedMessage?.id === message.id) {
        setSelectedMessage(data.data)
      }
    } catch (err: any) {
      console.error('Error updating message:', err)
      toast.error('Không thể cập nhật tin nhắn')
    }
  }

  const handleDelete = async (messageId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      return
    }

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete message')
      }

      toast.success('Đã xóa tin nhắn thành công')
      fetchMessages()
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }
    } catch (err: any) {
      console.error('Error deleting message:', err)
      toast.error('Không thể xóa tin nhắn')
    }
  }

  const unreadCount = messages.filter(m => !m.is_read).length
  const readCount = messages.filter(m => m.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Quản Lý Tin Nhắn
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem và quản lý tin nhắn từ form liên hệ.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Chưa đọc</p>
            <p className="text-lg font-bold text-primary">{unreadCount}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Đã đọc</p>
            <p className="text-lg font-bold text-gray-600">{readCount}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tất cả ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Chưa đọc ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === 'read'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Đã đọc ({readCount})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <div className="text-sm text-gray-500">Đang tải...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                Chưa có tin nhắn nào
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : message.is_read
                        ? 'hover:bg-gray-50'
                        : 'bg-blue-50/50 hover:bg-blue-50 border-l-4 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {message.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{message.email}</p>
                      </div>
                      {!message.is_read && (
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1 line-clamp-1">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(message.created_at), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Từ:</span> {selectedMessage.name}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span>{' '}
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(selectedMessage.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedMessage.is_read
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                    title={selectedMessage.is_read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                  >
                    <span className="material-icons-outlined text-lg">
                      {selectedMessage.is_read ? 'mark_email_unread' : 'mark_email_read'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Xóa tin nhắn"
                  >
                    <span className="material-icons-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Nội dung
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
              <span className="material-icons-outlined text-6xl text-gray-300 mb-4 block">
                email
              </span>
              <p className="text-gray-500">Chọn một tin nhắn để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

