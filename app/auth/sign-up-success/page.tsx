import type { Metadata } from "next"
import Link from "next/link"
import { MailCheck } from "lucide-react"
import { AuthShell } from "@/components/mausam/auth-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Check your email · Mausam AI",
  description: "Confirm your email address to finish creating your Mausam AI account.",
}

export default function SignUpSuccessPage() {
  return (
    <AuthShell>
      <Card className="glass-card w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MailCheck className="size-5" />
          </span>
          <CardTitle className="text-2xl font-semibold tracking-tight">Check your inbox</CardTitle>
          <CardDescription>
            {
              "We've sent you a confirmation link. Click it to verify your email address, then sign in to reach your dashboard."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="h-11 w-full text-sm font-medium">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
