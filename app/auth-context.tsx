'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
        setLoading(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (error) throw error
      setIsAdmin(data?.is_admin || false)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const supabase = createClient()
    
    // Get the origin safely in client component
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${origin}/cars`
    
    console.log('[v0] SignUp - Redirect URL:', redirectUrl)
    console.log('[v0] SignUp - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: redirectUrl,
      },
    })

    console.log('[v0] SignUp - Response:', { error, data })

    if (error) {
      console.error('[v0] SignUp - Full error:', error)
      throw new Error(error.message || 'Sign up failed')
    }
    // Note: User profile is auto-created via database trigger
  }

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()
    console.log('[v0] SignIn - Attempting with email:', email)
    
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('[v0] SignIn - Response:', { error, data })
    
    if (error) {
      console.error('[v0] SignIn - Full error:', error)
      throw new Error(error.message || 'Sign in failed')
    }
  }

  const signOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
