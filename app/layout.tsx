'use client';

import { Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import '../public/lexical-playground/src/index.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

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
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${bricolageGrotesque.variable} antialiased font-sans`}>
        {isAdminRoute ? (
          // Admin shell - completely separate from public header/footer
          <div className="min-h-screen flex bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
              <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <span className="text-lg font-black tracking-wide text-gray-900">
                  Recap <span className="text-primary">Admin</span>
                </span>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
                <a
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <span className="material-icons-outlined text-base">space_dashboard</span>
                  <span>Overview</span>
                </a>
                <a
                  href="/admin/posts"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <span className="material-icons-outlined text-base">article</span>
                  <span>Posts</span>
                </a>
                <a
                  href="/admin/users"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <span className="material-icons-outlined text-base">group</span>
                  <span>Accounts</span>
                </a>
              </nav>
              <div className="px-4 py-4 border-t border-gray-200 text-xs text-gray-500">
                Logged in as <span className="font-semibold text-gray-900">Admin</span>
              </div>
            </aside>

            {/* Main admin content */}
            <main className="flex-1 flex flex-col bg-gray-50">
              {/* Top bar */}
              <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur">
                <div className="flex items-center gap-2 md:hidden">
                  <span className="text-base font-semibold text-gray-900">Recap Admin</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm">
                  <span className="hidden md:inline text-gray-500">Dashboard</span>
                  <button className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100">
                    <span className="material-icons-outlined text-sm">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
            </main>
          </div>
        ) : (
          // Public blog shell
          <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        )}
      </body>
    </html>
  )
}

