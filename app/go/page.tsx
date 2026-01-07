'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function GoRedirect() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const linkParam = searchParams.get('link')

    if (!linkParam) {
      setError('Link không hợp lệ')
      return
    }

    try {
      // Decode URL
      let originalUrl = decodeURIComponent(linkParam)

      // Add protocol if missing
      if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
        originalUrl = `https://${originalUrl}`
      }

      // Validate URL
      try {
        new URL(originalUrl)
      } catch {
        setError('URL không hợp lệ')
        return
      }

      // Set redirect URL
      setRedirectUrl(originalUrl)

      // Use JavaScript to click the link element
      setTimeout(() => {
        if (linkRef.current) {
          linkRef.current.click()
        }
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    }
  }, [searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lỗi</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  // Show loading/redirecting state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">Đang chuyển hướng...</p>
        {redirectUrl && (
          <>
            {/* Hidden link element that will be clicked programmatically */}
            <a
              ref={linkRef}
              href={redirectUrl}
              style={{ display: 'none' }}
              aria-hidden="true"
            />
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Nếu không tự động chuyển hướng,{' '}
              <a 
                href={redirectUrl} 
                className="text-primary hover:underline"
              >
                click vào đây
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function GoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        </div>
      }
    >
      <GoRedirect />
    </Suspense>
  )
}

