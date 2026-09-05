"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail, MailCheck, TriangleAlert } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
      })

      if (resetError) {
        if (resetError.status === 429) {
          setError("Too many requests. Please wait a moment and try again.")
        } else {
          setError("We couldn't send the reset link right now. Please try again.")
        }
        setLoading(false)
        return
      }

      // Always show success to avoid revealing whether an account exists.
      setSent(true)
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="glass-card w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MailCheck className="size-5" />
          </span>
          <CardTitle className="text-2xl font-semibold tracking-tight">Check your inbox</CardTitle>
          <CardDescription>
            {"If an account exists for "}
            <span className="font-medium text-foreground">{email}</span>
            {", we've sent a link to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="h-11 w-full text-sm font-medium bg-transparent">
            <Link href="/login">
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-2xl font-semibold tracking-tight">Reset your password</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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

          <Button type="submit" disabled={loading} className="h-11 w-full text-sm font-semibold">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending link…
              </>
            ) : (
              "Send reset link"
            )}
          </Button>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </form>
      </CardContent>
    </Card>
  )
}
