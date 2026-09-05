import { createClient } from "@/lib/supabase/client"

/**
 * Signs the current user out of Supabase and returns them to the public
 * landing page. Safe to call from any client component; falls back to a hard
 * redirect if the SPA router is unavailable.
 */
export async function signOut(redirectTo = "/login") {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } finally {
    if (typeof window !== "undefined") {
      window.location.assign(redirectTo)
    }
  }
}
