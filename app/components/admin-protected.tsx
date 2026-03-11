'use client'

import { useAuth } from '@/app/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

export function AdminProtected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
