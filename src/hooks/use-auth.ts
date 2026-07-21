'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useChatStore } from '@/store/chat-store'
import type { Profile } from '@/types'

const PROFILES_TABLE = 'my_portfolio.vc_profiles'

export function useAuth() {
  const { user, setUser } = useChatStore()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from(PROFILES_TABLE)
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) setUser(profile as Profile)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from(PROFILES_TABLE)
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) setUser(profile as Profile)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      await supabase.from(PROFILES_TABLE).insert({
        id: data.user.id,
        username,
        avatar_url: null,
        status: 'online',
      })
    }

    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, signIn, signUp, signOut }
}
