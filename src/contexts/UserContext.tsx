// contexts/UserContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {  User } from '@/lib/prisma'


interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  refetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        setUser(null)
        return
      }

      // Fetch user from your database
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      
      if (data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      setError('Failed to fetch user')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    
    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser()
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, error, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}