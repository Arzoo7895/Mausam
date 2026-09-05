import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Handles the OAuth / email-confirmation redirect from Supabase by exchanging
// the one-time `code` for a session, then forwarding the user into the app.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // No code or exchange failed — send the user back to sign-in with a hint.
  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
