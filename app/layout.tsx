'use client';

import { Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import '../public/lexical-playground/src/index.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { usePathname, useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import toast from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const bricolageGrotesque = Bricolage_Grotesque({ 
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdminRoute = pathname.startsWith('/admin')
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return
    
    setLoggingOut(true)
    
    try {
      // Call logout API to clear cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')

      toast.success('Đăng xuất thành công!')
      
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API fails, clear local storage and redirect
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <html lang="en">
      <head>
        <title>Zerra.blog | Reviews Without Limits</title>
        <meta name="description" content="From everyday tools to complex platforms, Zerra.blog reviews topics across countless niches with clarity, independence, and user-first insight." />
        <meta property="og:title" content="Zerra Blog" />
        <meta property="og:description" content="From everyday tools to complex platforms, Zerra.blog reviews topics across countless niches with clarity, independence, and user-first insight." />
        <meta property="og:url" content="https://zerra.blog" />
        <meta property="og:site_name" content="Zerra Blog" />
        <meta property="og:type" content="website" />
        <meta name="google-site-verification" content="google604730c85a229469" />
        <link rel="icon" type="image/png" href="/assets/zerra.png" />
        <link rel="apple-touch-icon" href="/assets/zerra.png" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${bricolageGrotesque.variable}  antialiased font-sans`}>
        {isAdminRoute ? (
          // Admin shell - completely separate from public header/footer
          <div className="min-h-screen flex bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
              <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <span className="text-lg font-black tracking-wide text-gray-900">
                  Zerra <span className="text-primary">Admin</span>
                </span>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
                {/* <a
                  href="/admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/admin' 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-icons-outlined text-base">space_dashboard</span>
                  <span>Tổng Quan</span>
                </a> */}
                <a
                  href="/admin/posts"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname.startsWith('/admin/posts') 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-icons-outlined text-base">article</span>
                  <span>Bài Viết</span>
                </a>
                <a
                  href="/admin/categories"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname.startsWith('/admin/categories') 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-icons-outlined text-base">folder</span>
                  <span>Danh Mục</span>
                </a>
                <a
                  href="/admin/users"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname.startsWith('/admin/users') 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-icons-outlined text-base">group</span>
                  <span>Tài Khoản</span>
                </a>
                <a
                  href="/admin/messages"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname.startsWith('/admin/messages') 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-icons-outlined text-base">email</span>
                  <span>Tin Nhắn</span>
                </a>
              </nav>
              <div className="px-4 py-4 border-t border-gray-200 text-xs text-gray-500">
                Đăng nhập với tư cách <span className="font-semibold text-gray-900">Admin</span>
              </div>
            </aside>

            {/* Main admin content */}
            <main className="flex-1 flex flex-col bg-gray-50">
              {/* Top bar */}
              <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur">
                <div className="flex items-center gap-2 md:hidden">
                  <span className="text-base font-semibold text-gray-900">Zerra Admin</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm">
                  <span className="hidden md:inline text-gray-500">Bảng Điều Khiển</span>
                  <button 
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-icons-outlined text-sm">logout</span>
                    <span>{loggingOut ? 'Đang đăng xuất...' : 'Đăng Xuất'}</span>
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
            </main>
          </div>
        ) : (
          // Public blog shell
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        )}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}

