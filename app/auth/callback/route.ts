import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Exchanges the OAuth / email-confirmation / recovery code for a session,
// then redirects to the intended destination.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  if (error) {
    const message = errorDescription || error
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError && data?.user) {
      const user = data.user
      try {
        // Ensure user profile exists in public.profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .maybeSingle()

        const meta = user.user_metadata || {}
        const metaName = (
          meta.full_name?.trim() ||
          meta.name?.trim() ||
          meta.fullName?.trim() ||
          meta.display_name?.trim() ||
          ''
        )

        if ((!profile || !profile.full_name?.trim()) && metaName) {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: metaName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })
        }

        // Ensure user_preferences row exists
        const { data: pref } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!pref) {
          await supabase.from('user_preferences').upsert({
            user_id: user.id,
            temperature_unit: 'celsius',
            wind_unit: 'kmh',
            theme: 'system',
            language: 'en',
            persona: 'traveler',
            alerts: true,
            daily_brief: true,
            severe_weather: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
        }
      } catch (profileErr) {
        console.warn('Profile sync on auth callback error:', profileErr)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
