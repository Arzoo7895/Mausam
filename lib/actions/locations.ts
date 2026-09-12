'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { GeoLocation } from '@/lib/weather/service'

export type SavedLocationRecord = {
  id: string
  user_id: string
  provider_id: string | null
  name: string
  region: string | null
  country: string | null
  country_code: string | null
  latitude: number
  longitude: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export type SaveLocationResult = {
  success: boolean
  status?: 'added' | 'exists'
  error?: string
  location?: GeoLocation
}

const saveLocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Location name is required').max(150),
  region: z.string().trim().max(100).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  countryCode: z.string().trim().max(10).optional().nullable(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isDefault: z.boolean().optional(),
})

export async function getSavedLocationsServer(): Promise<{
  authenticated: boolean
  locations: GeoLocation[]
  defaultKey?: string
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { authenticated: false, locations: [] }
    }

    const { data, error } = await supabase
      .from('saved_locations')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })

    if (error || !Array.isArray(data)) {
      return { authenticated: true, locations: [] }
    }

    const locations: GeoLocation[] = data.map((row: SavedLocationRecord) => ({
      id: row.provider_id || row.id,
      name: row.name,
      region: row.region || undefined,
      country: row.country || 'India',
      countryCode: row.country_code || 'IN',
      latitude: row.latitude,
      longitude: row.longitude,
      displaySubtitle: [row.region, row.country || 'India'].filter(Boolean).join(', '),
    }))

    const defaultRow = data.find((r: SavedLocationRecord) => r.is_default)
    const defaultKey = defaultRow ? (defaultRow.provider_id || defaultRow.id) : undefined

    return { authenticated: true, locations, defaultKey }
  } catch {
    return { authenticated: false, locations: [] }
  }
}

export async function saveLocationServer(
  input: GeoLocation,
  isDefault = false
): Promise<SaveLocationResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated' }
    }

    const parsed = saveLocationSchema.safeParse({
      id: input.id,
      name: input.name,
      region: input.region || input.state,
      district: input.district,
      country: input.country || 'India',
      countryCode: input.countryCode || 'IN',
      latitude: input.latitude,
      longitude: input.longitude,
      isDefault,
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid location data' }
    }

    const loc = parsed.data
    const roundedLat = Number(loc.latitude.toFixed(2))
    const roundedLng = Number(loc.longitude.toFixed(2))

    // 1. Check for existing location by provider_id or rounded coordinates
    let existingQuery = supabase
      .from('saved_locations')
      .select('id, provider_id, name, latitude, longitude')
      .eq('user_id', user.id)

    if (loc.id && !loc.id.startsWith('coord:')) {
      existingQuery = existingQuery.or(
        `provider_id.eq.${loc.id},and(latitude.gte.${roundedLat - 0.01},latitude.lte.${roundedLat + 0.01},longitude.gte.${roundedLng - 0.01},longitude.lte.${roundedLng + 0.01})`
      )
    } else {
      existingQuery = existingQuery
        .gte('latitude', roundedLat - 0.01)
        .lte('latitude', roundedLat + 0.01)
        .gte('longitude', roundedLng - 0.01)
        .lte('longitude', roundedLng + 0.01)
    }

    const { data: existingRows } = await existingQuery.limit(1)

    if (existingRows && existingRows.length > 0) {
      return {
        success: true,
        status: 'exists',
        location: input,
      }
    }

    // 2. If isDefault is true, unset any existing default for this user
    if (isDefault) {
      await supabase
        .from('saved_locations')
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_default', true)
    }

    // 3. Insert new location
    const providerId = loc.id && !loc.id.startsWith('coord:') ? loc.id : null
    const { data: inserted, error: insertError } = await supabase
      .from('saved_locations')
      .insert({
        user_id: user.id,
        provider_id: providerId,
        name: loc.name,
        region: loc.region,
        country: loc.country ?? 'India',
        country_code: (loc.countryCode ?? 'IN').toUpperCase(),
        latitude: loc.latitude,
        longitude: loc.longitude,
        is_default: isDefault,
        updated_at: new Date().toISOString(),
      })
      .select('id, provider_id, name, region, country, country_code, latitude, longitude')
      .single()

    if (insertError) {
      // If error is unique constraint violation, return exists gracefully
      if (insertError.code === '23505') {
        return { success: true, status: 'exists', location: input }
      }
      return { success: false, error: insertError.message }
    }

    revalidatePath('/dashboard')
    return {
      success: true,
      status: 'added',
      location: {
        id: inserted.provider_id || inserted.id,
        name: inserted.name,
        region: inserted.region || undefined,
        country: inserted.country || 'India',
        countryCode: inserted.country_code || 'IN',
        latitude: inserted.latitude,
        longitude: inserted.longitude,
      },
    }
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Failed to save location' }
  }
}

export async function removeSavedLocationServer(idOrKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated' }
    }

    // Try deleting by provider_id or by id
    const { error: delError } = await supabase
      .from('saved_locations')
      .delete()
      .eq('user_id', user.id)
      .or(`id.eq.${idOrKey},provider_id.eq.${idOrKey}`)

    if (delError) {
      // Also handle case where idOrKey is in format geo:name|lat|lng
      if (idOrKey.startsWith('geo:') || idOrKey.startsWith('id:')) {
        const cleanId = idOrKey.replace(/^(geo|id):/, '')
        await supabase
          .from('saved_locations')
          .delete()
          .eq('user_id', user.id)
          .eq('provider_id', cleanId)
      }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Failed to remove location' }
  }
}

export async function setDefaultLocationServer(idOrKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated' }
    }

    // 1. Unset all defaults
    await supabase
      .from('saved_locations')
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)

    // 2. Set new default
    await supabase
      .from('saved_locations')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .or(`id.eq.${idOrKey},provider_id.eq.${idOrKey}`)

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Failed to set default location' }
  }
}
