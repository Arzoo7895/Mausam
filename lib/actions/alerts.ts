'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  type WeatherAlert,
  type AlertType,
  type AlertSeverity,
  buildWeatherAlerts,
  getAlerts,
} from '@/lib/alerts/service'
import { getWeather } from '@/lib/weather/service'
import type { NotificationPreferences } from '@/lib/alerts/preferences'

export type UserAlertRecord = {
  id: string
  user_id: string
  alert_type: string
  title: string
  location_name: string
  detail: string
  timestamp: string
  relative_time: string
  severity: string
  unread: boolean
  favorite: boolean
  archived: boolean
  dismissed: boolean
  expires_at: string | null
  temperature: string | null
  insight: string | null
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
}

function mapRowToWeatherAlert(row: UserAlertRecord): WeatherAlert {
  return {
    id: row.id.includes('_') ? row.id.split('_').slice(1).join('_') : row.id,
    type: row.alert_type as AlertType,
    title: row.title,
    location: row.location_name,
    detail: row.detail,
    timestamp: row.timestamp,
    relativeTime: row.relative_time,
    severity: row.severity as AlertSeverity,
    unread: row.unread,
    favorite: row.favorite,
    archived: row.archived,
    expiresAt: row.expires_at || undefined,
    temperature: row.temperature || undefined,
    insight: row.insight || undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
  }
}

export async function getUserAlertsServer(location?: {
  latitude: number
  longitude: number
  name: string
}): Promise<{
  authenticated: boolean
  alerts: WeatherAlert[]
  location?: { latitude: number; longitude: number; name: string }
  disabled?: boolean
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // Unauthenticated: Fallback to direct weather calculation (or guest client will handle)
    if (authError || !user) {
      if (location) {
        const liveAlerts = await getAlerts(location)
        return { authenticated: false, alerts: liveAlerts, location }
      }
      return { authenticated: false, alerts: [] }
    }

    // 1. Fetch user preferences to check notification rules
    const { data: prefData } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (prefData && prefData.alerts === false) {
      return { authenticated: true, alerts: [], disabled: true }
    }

    // Determine allowed categories
    const allowedCategories: string[] = []
    if (prefData?.notification_settings?.categories && Array.isArray(prefData.notification_settings.categories)) {
      allowedCategories.push(...prefData.notification_settings.categories)
    } else {
      if (prefData?.severe_weather !== false) allowedCategories.push('Severe Weather')
      if (prefData?.daily_brief !== false) allowedCategories.push('Daily Forecast')
      allowedCategories.push('Air Quality', 'Temperature', 'Precipitation')
    }

    // 2. Determine target location
    let targetLoc = location
    if (!targetLoc) {
      const { data: savedLocs } = await supabase
        .from('saved_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1)

      if (savedLocs && savedLocs.length > 0) {
        const first = savedLocs[0]
        targetLoc = {
          name: first.name,
          latitude: first.latitude,
          longitude: first.longitude,
        }
      }
    }

    // If still no location, return existing stored alerts for this user
    if (!targetLoc) {
      const { data: storedRows } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })

      const existingAlerts = (storedRows || []).map((r: UserAlertRecord) => mapRowToWeatherAlert(r))
      return { authenticated: true, alerts: existingAlerts }
    }

    // 3. Fetch weather and generate fresh alerts for this location
    const weather = await getWeather(targetLoc.latitude, targetLoc.longitude)
    const generatedAlerts = buildWeatherAlerts(weather, targetLoc.name, {
      latitude: targetLoc.latitude,
      longitude: targetLoc.longitude,
    })

    // Filter by allowed categories
    const filteredAlerts = generatedAlerts.filter((a) => allowedCategories.includes(a.type))

    // 4. Fetch existing records for this user from public.user_alerts
    const { data: existingRows } = await supabase
      .from('user_alerts')
      .select('*')
      .eq('user_id', user.id)

    const existingMap = new Map<string, UserAlertRecord>()
    for (const row of (existingRows || []) as UserAlertRecord[]) {
      existingMap.set(row.id, row)
      // also index by raw alert ID (without user prefix)
      const rawId = row.id.includes('_') ? row.id.split('_').slice(1).join('_') : row.id
      existingMap.set(rawId, row)
    }

    const finalAlerts: WeatherAlert[] = []
    const newRowsToInsert: any[] = []

    for (const gen of filteredAlerts) {
      const dbId = `${user.id}_${gen.id}`
      const existing = existingMap.get(dbId) || existingMap.get(gen.id)

      if (existing) {
        // If user already dismissed/deleted this alert, do not re-show
        if (existing.dismissed) continue

        // Preserve user state (read, favorite, archive)
        finalAlerts.push({
          ...gen,
          id: gen.id,
          unread: existing.unread,
          favorite: existing.favorite,
          archived: existing.archived,
          timestamp: existing.timestamp || gen.timestamp,
        })
      } else {
        // Brand new alert for today
        finalAlerts.push(gen)
        newRowsToInsert.push({
          id: dbId,
          user_id: user.id,
          alert_type: gen.type,
          title: gen.title,
          location_name: gen.location,
          detail: gen.detail,
          timestamp: gen.timestamp,
          relative_time: gen.relativeTime,
          severity: gen.severity,
          unread: gen.unread,
          favorite: gen.favorite,
          archived: gen.archived,
          dismissed: false,
          expires_at: gen.expiresAt || null,
          temperature: gen.temperature || null,
          insight: gen.insight || null,
          latitude: gen.latitude || null,
          longitude: gen.longitude || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    }

    // 5. Batch insert any new alerts into Supabase
    if (newRowsToInsert.length > 0) {
      await supabase.from('user_alerts').upsert(newRowsToInsert, { onConflict: 'id' })
    }

    // Also include any other saved alerts that user archived or favorited for other locations
    for (const row of (existingRows || []) as UserAlertRecord[]) {
      const rawId = row.id.includes('_') ? row.id.split('_').slice(1).join('_') : row.id
      const alreadyInList = finalAlerts.some((a) => a.id === rawId)
      if (!alreadyInList && !row.dismissed && (row.archived || row.favorite)) {
        finalAlerts.push(mapRowToWeatherAlert(row))
      }
    }

    return {
      authenticated: true,
      alerts: finalAlerts,
      location: targetLoc,
    }
  } catch (err) {
    console.error('getUserAlertsServer error:', err)
    return { authenticated: false, alerts: [] }
  }
}

export async function updateAlertStateServer(
  alertId: string,
  patch: { unread?: boolean; favorite?: boolean; archived?: boolean; dismissed?: boolean },
  context?: Partial<WeatherAlert>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated' }
    }

    const dbId = alertId.startsWith(`${user.id}_`) ? alertId : `${user.id}_${alertId}`

    // Check if record exists
    const { data: existing } = await supabase
      .from('user_alerts')
      .select('id')
      .eq('user_id', user.id)
      .eq('id', dbId)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('user_alerts')
        .update({
          ...patch,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('id', dbId)

      if (updateError) return { success: false, error: updateError.message }
    } else {
      // Insert new record with patch
      const { error: insertError } = await supabase.from('user_alerts').upsert({
        id: dbId,
        user_id: user.id,
        alert_type: context?.type || 'Daily Forecast',
        title: context?.title || 'Weather Alert',
        location_name: context?.location || 'Saved Location',
        detail: context?.detail || '',
        timestamp: context?.timestamp || new Date().toISOString(),
        relative_time: context?.relativeTime || 'Recent',
        severity: context?.severity || 'low',
        unread: patch.unread !== undefined ? patch.unread : (context?.unread ?? true),
        favorite: patch.favorite !== undefined ? patch.favorite : (context?.favorite ?? false),
        archived: patch.archived !== undefined ? patch.archived : (context?.archived ?? false),
        dismissed: patch.dismissed !== undefined ? patch.dismissed : false,
        expires_at: context?.expiresAt || null,
        temperature: context?.temperature || null,
        insight: context?.insight || null,
        latitude: context?.latitude || null,
        longitude: context?.longitude || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) return { success: false, error: insertError.message }
    }

    revalidatePath('/alerts')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update alert' }
  }
}

export async function markAlertReadServer(alertId: string, unread = false, context?: Partial<WeatherAlert>) {
  return updateAlertStateServer(alertId, { unread }, context)
}

export async function favoriteAlertServer(alertId: string, favorite: boolean, context?: Partial<WeatherAlert>) {
  return updateAlertStateServer(alertId, { favorite }, context)
}

export async function archiveAlertServer(alertId: string, archived: boolean, context?: Partial<WeatherAlert>) {
  return updateAlertStateServer(alertId, { archived }, context)
}

export async function deleteAlertServer(alertId: string, context?: Partial<WeatherAlert>) {
  return updateAlertStateServer(alertId, { dismissed: true }, context)
}

export async function saveAlertPreferencesServer(preferences: NotificationPreferences): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated' }
    }

    const { error } = await supabase.from('user_preferences').upsert({
      user_id: user.id,
      alerts: preferences.categories.length > 0,
      severe_weather: preferences.categories.includes('Severe Weather'),
      daily_brief: preferences.categories.includes('Daily Forecast'),
      notification_settings: preferences,
      updated_at: new Date().toISOString(),
    })

    if (error) return { success: false, error: error.message }

    revalidatePath('/alerts')
    revalidatePath('/user-profile-and-setting')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save alert preferences' }
  }
}

export async function getAlertPreferencesServer(): Promise<{
  authenticated: boolean
  preferences?: NotificationPreferences
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { authenticated: false }
    }

    const { data: prefData } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!prefData) return { authenticated: true }

    if (prefData.notification_settings) {
      return {
        authenticated: true,
        preferences: prefData.notification_settings as NotificationPreferences,
      }
    }

    const categories: string[] = []
    if (prefData.severe_weather !== false) categories.push('Severe Weather')
    if (prefData.daily_brief !== false) categories.push('Daily Forecast')
    categories.push('Air Quality', 'Temperature', 'Precipitation')

    return {
      authenticated: true,
      preferences: {
        email: true,
        push: true,
        categories,
      },
    }
  } catch {
    return { authenticated: false }
  }
}
