import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MailCheck } from "lucide-react"
import { AuthShell } from "@/components/mausam/auth-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Check your email · Mausam AI",
  description: "Confirm your email address to finish creating your Mausam AI account.",
}

export default function SignUpSuccessPage() {
  return (
    <AuthShell>
      <Card className="glass-card w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-3 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="size-6" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl font-semibold tracking-tight">Confirm your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a confirmation link to your inbox. Click it to activate your account, then sign in to start
            using Mausam AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go to sign in
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
