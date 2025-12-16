import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const bricolageGrotesque = Bricolage_Grotesque({ 
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Recap',
  description: 'Your mental filter in a world of constant input',
  icons: {
    icon: [
      { url: '/assets/favicon-150x150.webp', sizes: '150x150', type: 'image/webp' },
      { url: '/assets/favicon-185x185.webp', sizes: '185x185', type: 'image/webp' },
      { url: '/assets/favicon-300x300.webp', sizes: '300x300', type: 'image/webp' },
    ],
    shortcut: '/assets/favicon-150x150.webp',
    apple: '/assets/favicon-185x185.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${bricolageGrotesque.variable} bg-gray-50 text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900 font-sans`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

