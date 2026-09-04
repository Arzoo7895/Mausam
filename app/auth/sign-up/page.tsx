import type { Metadata } from "next"
import { AuthShell } from "@/components/mausam/auth-shell"
import { SignUpForm } from "@/components/mausam/sign-up-form"

export const metadata: Metadata = {
  title: "Create account · Mausam AI",
  description: "Create your Mausam AI account and start turning weather data into intelligence.",
}

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  )
}
