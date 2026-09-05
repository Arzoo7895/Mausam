"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail, MailCheck, TriangleAlert } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (resetError) throw resetError
      setSent(true)
    } catch {
      // Avoid leaking whether an account exists; show a neutral error only for
      // genuine failures (network, rate limit).
      setError("We couldn't send the reset link right now. Please try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="glass-card w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-3 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="size-6" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl font-semibold tracking-tight">Check your email</CardTitle>
          <CardDescription>
            If an account exists for <span className="font-medium text-foreground">{email}</span>, we&apos;ve sent a
            password reset link. Follow it to choose a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-2xl font-semibold tracking-tight">Forgot your password?</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a link to reset it.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to sign in
          </Link>
        </form>
      </CardContent>
    </Card>
  )
}
