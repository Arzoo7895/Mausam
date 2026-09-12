'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(1, 'Name is required').max(100),
  homeLocation: z.string().trim().max(150).optional(),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z.string().optional(),
  persona: z.string().optional(),
  units: z.enum(['metric', 'imperial']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().max(10).optional(),
  alerts: z.boolean().optional(),
  dailyBrief: z.boolean().optional(),
  severeWeather: z.boolean().optional(),
  email: z.string().email('Please enter a valid email address').optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

export type ProfileActionResult = {
  success: boolean
  error?: string
  emailChangePending?: boolean
}

export async function getProfileServer() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null

    const [profileRes, prefRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle(),
    ])

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      profile: profileRes.data ?? null,
      preferences: prefRes.data ?? null,
    }
  } catch {
    return null
  }
}

export async function updateUserProfile(input: ProfileUpdateInput): Promise<ProfileActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'You must be signed in to save profile changes.' }
    }

    const parsed = profileUpdateSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid profile data.' }
    }

    const { fullName, homeLocation, bio, avatarUrl, persona, units, theme, language, alerts, dailyBrief, severeWeather, email } = parsed.data

    // 1. Update public.profiles using authenticated user.id
    const profilePayload: Record<string, any> = {
      id: user.id,
      full_name: fullName,
      home_location: homeLocation ? homeLocation : null,
      bio: bio ? bio : null,
      updated_at: new Date().toISOString(),
    }
    if (avatarUrl !== undefined) {
      profilePayload.avatar_url = avatarUrl || null
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload)

    if (profileError) {
      return { success: false, error: `Could not save profile: ${profileError.message}` }
    }

    // 2. Update public.user_preferences
    const prefPayload: Record<string, any> = {
      user_id: user.id,
      temperature_unit: units === 'imperial' ? 'fahrenheit' : 'celsius',
      wind_unit: units === 'imperial' ? 'mph' : 'kmh',
      theme: theme ?? 'system',
      language: language ?? 'en',
      alerts: alerts ?? true,
      daily_brief: dailyBrief ?? true,
      severe_weather: severeWeather ?? true,
      updated_at: new Date().toISOString(),
    }
    if (persona) {
      prefPayload.persona = persona
    }

    const { error: prefError } = await supabase
      .from('user_preferences')
      .upsert(prefPayload)

    if (prefError) {
      return { success: false, error: `Profile saved, but preferences could not be updated: ${prefError.message}` }
    }

    // 3. Keep auth.user_metadata synced for compatibility
    let emailChangePending = false
    const metadataUpdates: Record<string, any> = {}
    if (user.user_metadata?.full_name !== fullName) {
      metadataUpdates.full_name = fullName
    }
    if (avatarUrl !== undefined && user.user_metadata?.avatar_url !== avatarUrl) {
      metadataUpdates.avatar_url = avatarUrl
    }

    const authUpdates: { email?: string; data?: Record<string, any> } = {}
    if (Object.keys(metadataUpdates).length > 0) {
      authUpdates.data = metadataUpdates
    }

    if (email && user.email && email.toLowerCase() !== user.email.toLowerCase()) {
      authUpdates.email = email
      emailChangePending = true
    }

    if (authUpdates.email || authUpdates.data) {
      const { error: authUpdateError } = await supabase.auth.updateUser(authUpdates)
      if (authUpdateError) {
        if (authUpdates.email) {
          return {
            success: true,
            emailChangePending: false,
            error: `Profile saved, but email update request failed: ${authUpdateError.message}`,
          }
        }
      }
    }

    // 4. Revalidate pages displaying profile information
    revalidatePath('/dashboard')
    revalidatePath('/user-profile-and-setting')
    revalidatePath('/alerts')
    revalidatePath('/ai-recommendations')

    return { success: true, emailChangePending }
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'An unexpected error occurred while saving.' }
  }
}
