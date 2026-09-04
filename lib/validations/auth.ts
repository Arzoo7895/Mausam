import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Add at least one lowercase letter")
  .regex(/[A-Z]/, "Add at least one uppercase letter")
  .regex(/[0-9]/, "Add at least one number")

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Please enter your full name")
      .max(80, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type SignUpValues = z.infer<typeof signUpSchema>

export interface PasswordStrength {
  score: number // 0-4
  label: string
  checks: { label: string; passed: boolean }[]
}

export function evaluatePassword(password: string): PasswordStrength {
  const checks = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Lowercase letter", passed: /[a-z]/.test(password) },
    { label: "Uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "Number", passed: /[0-9]/.test(password) },
    { label: "Symbol", passed: /[^A-Za-z0-9]/.test(password) },
  ]

  const passedCount = checks.filter((c) => c.passed).length
  const score = Math.min(4, Math.max(0, passedCount - 1))
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"]

  return {
    score,
    label: password.length === 0 ? "" : labels[score],
    checks,
  }
}
