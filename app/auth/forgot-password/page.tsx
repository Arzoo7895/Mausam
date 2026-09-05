import type { Metadata } from "next"
import { AuthShell } from "@/components/mausam/auth-shell"
import { ForgotPasswordForm } from "@/components/mausam/forgot-password-form"

export const metadata: Metadata = {
  title: "Reset password · Mausam AI",
  description: "Reset your Mausam AI account password.",
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
