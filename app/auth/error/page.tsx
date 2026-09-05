import Link from "next/link"
import { AuthShell } from "@/components/mausam/auth-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  // `error` comes from the URL, so it is attacker-controlled. Render it only
  // when it looks like a Supabase error code, never as free text.
  const code = params?.error
  const isErrorCode = typeof code === "string" && /^[a-z0-9_]{1,64}$/.test(code)

  return (
    <AuthShell>
      <Card className="glass-card w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tracking-tight">Sorry, something went wrong</CardTitle>
          <CardDescription>
            {isErrorCode
              ? `We couldn't complete authentication (code: ${code}).`
              : "We couldn't complete authentication. Please try signing in again."}
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
