"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, TriangleAlert } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const err = params.get("error")
      if (err) {
        if (err === "auth_callback") {
          setError("Authentication could not be completed. Please try signing in again.")
        } else {
          setError(decodeURIComponent(err))
        }
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setLoading(false)
        const msg = signInError.message.toLowerCase()
        if (msg.includes("email not confirmed")) {
          setError("Please verify your email before signing in. Check your inbox for the confirmation link.")
        } else if (signInError.status === 429) {
          setError("Too many attempts. Please wait a moment and try again.")
        } else if (msg.includes("invalid login credentials") || msg.includes("invalid user") || msg.includes("invalid grant")) {
          setError("Email or password is incorrect.")
        } else if (msg.includes("api key") || msg.includes("jwt")) {
          setError("Authentication service configuration error. Please contact support or check Supabase settings.")
        } else {
          setError(signInError.message || "Something went wrong. Please try again.")
        }
        return
      }

      // Self-heal profile and preferences from user_metadata upon successful login
      if (signInData?.user) {
        const meta = signInData.user.user_metadata || {}
        const metaName = (
          meta.full_name?.trim() ||
          meta.name?.trim() ||
          meta.fullName?.trim() ||
          meta.display_name?.trim() ||
          ''
        )

        try {
          // Check existing profile
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', signInData.user.id)
            .maybeSingle()

          // If profile missing or empty, and we have name from signup, write it to public.profiles
          if ((!existingProfile || !existingProfile.full_name?.trim()) && metaName) {
            await supabase.from('profiles').upsert({
              id: signInData.user.id,
              full_name: metaName,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })
          }

          // Ensure default preferences exist
          const { data: existingPref } = await supabase
            .from('user_preferences')
            .select('user_id')
            .eq('user_id', signInData.user.id)
            .maybeSingle()

          if (!existingPref) {
            await supabase.from('user_preferences').upsert({
              user_id: signInData.user.id,
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
        } catch {
          // Non-blocking: background sync failure should not prevent login navigation
        }
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setLoading(false)
      setError("Unable to reach the authentication service. Please check your connection and try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 px-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="mt-1 h-11 w-full text-sm font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
