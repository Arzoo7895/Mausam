import type { Metadata } from "next"
import { AuthShell } from "@/components/mausam/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Reset password · Mausam AI",
  description: "Request a password reset link for your Mausam AI account.",
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
