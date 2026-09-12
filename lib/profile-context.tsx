'use client'

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateUserProfile, type ProfileActionResult } from '@/lib/actions/profile'

export type UserProfile = {
  fullName: string
  email: string
  homeLocation: string
  bio: string
  avatarUrl?: string
}

export type UserPreferences = {
  units: 'metric' | 'imperial'
  theme: 'light' | 'dark' | 'system'
  language: string
  persona: string
  alerts: boolean
  dailyBrief: boolean
  severeWeather: boolean
}

export type ProfileContextValue = {
  user: { id: string; email?: string } | null
  profile: UserProfile
  preferences: UserPreferences
  initials: string
  displayName: string
  greetingName: string
  isGuest: boolean
  loading: boolean
  saveProfile: (patch: Partial<UserProfile & UserPreferences>) => Promise<ProfileActionResult>
  refreshProfile: () => Promise<void>
}

const GUEST_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  homeLocation: '',
  bio: '',
}

const GUEST_PREFERENCES: UserPreferences = {
  units: 'metric',
  theme: 'system',
  language: 'en',
  persona: 'traveler',
  alerts: true,
  dailyBrief: true,
  severeWeather: true,
}

export function computeInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase()
  }
  return ''
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [profile, setProfile] = useState<UserProfile>(GUEST_PROFILE)
  const [preferences, setPreferences] = useState<UserPreferences>(GUEST_PREFERENCES)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        setUser(null)
        // Guest mode must never read or display an authenticated user's profile name
        setProfile(GUEST_PROFILE)
        try {
          const local = window.localStorage.getItem('mausam-guest-profile')
          if (local) {
            const parsed = JSON.parse(local)
            setPreferences(parsed.preferences ?? GUEST_PREFERENCES)
          } else {
            setPreferences(GUEST_PREFERENCES)
          }
        } catch {
          setPreferences(GUEST_PREFERENCES)
        }
        setLoading(false)
        return
      }

      setUser({ id: authUser.id, email: authUser.email })

      // Fetch from Supabase profiles & user_preferences in parallel
      const [profileRes, prefRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
        supabase.from('user_preferences').select('*').eq('user_id', authUser.id).maybeSingle(),
      ])

      const pData = profileRes.data
      const prefData = prefRes.data

      // public.profiles is the primary source of truth for the user's name
      const resolvedName = (pData?.full_name !== undefined && pData?.full_name !== null && pData.full_name.trim() !== '')
        ? pData.full_name.trim()
        : (authUser.user_metadata?.full_name?.trim() || '')

      const loadedProfile: UserProfile = {
        fullName: resolvedName,
        email: authUser.email || '',
        homeLocation: pData?.home_location || '',
        bio: pData?.bio || '',
        avatarUrl: pData?.avatar_url || authUser.user_metadata?.avatar_url || '',
      }

      const loadedPreferences: UserPreferences = {
        units: prefData?.temperature_unit === 'fahrenheit' ? 'imperial' : 'metric',
        theme: (prefData?.theme as UserPreferences['theme']) || 'system',
        language: prefData?.language || 'en',
        persona: prefData?.persona || 'traveler',
        alerts: prefData?.alerts ?? true,
        dailyBrief: prefData?.daily_brief ?? true,
        severeWeather: prefData?.severe_weather ?? true,
      }

      setProfile(loadedProfile)
      setPreferences(loadedPreferences)
    } catch {
      // Keep existing state on transient failure
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return
    }

    try {
      const supabase = createClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          loadProfile()
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch {
      // Ignore client init errors during pre-rendering/static-generation
    }
  }, [loadProfile])

  const saveProfile = useCallback(
    async (patch: Partial<UserProfile & UserPreferences>): Promise<ProfileActionResult> => {
      // Optimistic update
      const prevProfile = profile
      const prevPreferences = preferences

      const nextProfile: UserProfile = {
        fullName: patch.fullName !== undefined ? patch.fullName : profile.fullName,
        email: patch.email !== undefined ? patch.email : profile.email,
        homeLocation: patch.homeLocation !== undefined ? patch.homeLocation : profile.homeLocation,
        bio: patch.bio !== undefined ? patch.bio : profile.bio,
        avatarUrl: patch.avatarUrl !== undefined ? patch.avatarUrl : profile.avatarUrl,
      }

      const nextPreferences: UserPreferences = {
        units: patch.units !== undefined ? patch.units : preferences.units,
        theme: patch.theme !== undefined ? patch.theme : preferences.theme,
        language: patch.language !== undefined ? patch.language : preferences.language,
        persona: patch.persona !== undefined ? patch.persona : preferences.persona,
        alerts: patch.alerts !== undefined ? patch.alerts : preferences.alerts,
        dailyBrief: patch.dailyBrief !== undefined ? patch.dailyBrief : preferences.dailyBrief,
        severeWeather: patch.severeWeather !== undefined ? patch.severeWeather : preferences.severeWeather,
      }

      setProfile(nextProfile)
      setPreferences(nextPreferences)

      // If guest user, persist locally
      if (!user) {
        try {
          window.localStorage.setItem(
            'mausam-guest-profile',
            JSON.stringify({ profile: nextProfile, preferences: nextPreferences })
          )
        } catch {}
        return { success: true }
      }

      // If authenticated user, call Server Action
      const result = await updateUserProfile({
        fullName: nextProfile.fullName,
        homeLocation: nextProfile.homeLocation,
        bio: nextProfile.bio,
        units: nextPreferences.units,
        theme: nextPreferences.theme,
        language: nextPreferences.language,
        alerts: nextPreferences.alerts,
        dailyBrief: nextPreferences.dailyBrief,
        severeWeather: nextPreferences.severeWeather,
        email: nextProfile.email,
      })

      if (!result.success) {
        // Rollback on failure
        setProfile(prevProfile)
        setPreferences(prevPreferences)
        return result
      }

      // Re-fetch to ensure complete sync with database
      await loadProfile()
      return result
    },
    [profile, preferences, user, loadProfile]
  )

  const initials = useMemo(() => {
    if (!user) return ''
    return computeInitials(profile.fullName, user.email)
  }, [profile.fullName, user])

  const displayName = useMemo(
    () => (user ? (profile.fullName.trim() || (user.email ? user.email.split('@')[0] : 'Account')) : 'Guest'),
    [profile.fullName, user]
  )

  const greetingName = useMemo(() => {
    if (!user) return ''
    if (profile.fullName && profile.fullName.trim()) {
      return profile.fullName.trim()
    }
    if (user.email) {
      return user.email.split('@')[0]
    }
    return ''
  }, [profile.fullName, user])

  const value: ProfileContextValue = useMemo(
    () => ({
      user,
      profile,
      preferences,
      initials,
      displayName,
      greetingName,
      isGuest: !user,
      loading,
      saveProfile,
      refreshProfile: loadProfile,
    }),
    [user, profile, preferences, initials, displayName, greetingName, loading, saveProfile, loadProfile]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
