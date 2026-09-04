'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Enter a valid email address.'),
  topic: z.enum(['account', 'forecasts', 'alerts', 'billing', 'other']),
  subject: z.string().min(4, 'Add a short subject.'),
  message: z.string().min(20, 'Please describe your issue in a bit more detail.'),
})

type FormValues = z.infer<typeof schema>

const TOPICS: { value: FormValues['topic']; label: string }[] = [
  { value: 'account', label: 'Account & profile' },
  { value: 'forecasts', label: 'Forecasts & maps' },
  { value: 'alerts', label: 'Notifications & alerts' },
  { value: 'billing', label: 'Billing' },
  { value: 'other', label: 'Something else' },
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: 'account' },
  })

  async function onSubmit(_values: FormValues) {
    // Simulate a network round-trip; wire to a real endpoint later.
    await new Promise((r) => setTimeout(r, 900))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-success/20 bg-success/5 p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15">
          <Check className="size-6 text-success" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          Message sent
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thanks for reaching out. Our support team typically replies within one
          business day. A confirmation has been sent to your email.
        </p>
      </div>
    )
  }

  const labelClass =
    'mb-1.5 block text-sm font-medium text-foreground'
  const errorClass = 'mt-1.5 text-xs text-destructive'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="topic" className={labelClass}>
          Topic
        </label>
        <select
          id="topic"
          {...register('topic')}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <Input
          id="subject"
          {...register('subject')}
          aria-invalid={!!errors.subject}
        />
        {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          How can we help?
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          aria-invalid={!!errors.message}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
