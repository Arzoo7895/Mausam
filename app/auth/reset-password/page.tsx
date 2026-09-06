import type { Metadata } from 'next'
import { AuthShell } from '@/components/mausam/auth-shell'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Set a new password',
  description: 'Choose a new password for your Mausam AI account.',
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <ResetPasswordForm />
    </AuthShell>
  )
}
