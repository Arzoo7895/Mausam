import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/mausam/auth-shell'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Confirm your email',
  description: 'Your Mausam AI account was created. Confirm your email to continue.',
}

export default function SignUpSuccessPage() {
  return (
    <AuthShell>
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="size-7" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Confirm your email
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          We&apos;ve sent a confirmation link to your inbox. Click it to activate your
          Mausam AI account, then sign in to reach your dashboard.
        </p>
        <Button
          nativeButton={false}
          className="mt-8 h-11 px-5 text-sm font-semibold"
          render={<Link href="/login" />}
        >
          Continue to sign in
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </AuthShell>
  )
}
