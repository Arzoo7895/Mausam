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

        if (!profile) {
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Mausam User'

          await supabase.from('profiles').insert({
            id: user.id,
            full_name: fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      } catch (profileErr) {
        console.warn('Profile sync on auth callback error:', profileErr)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
