'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, X, Shield, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type GuestAuthModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  featureName?: string
}

export function GuestAuthModal({
  open,
  onClose,
  title = 'Create an account to unlock this feature',
  description = 'Personalized weather intelligence, custom profiles, alert notification preferences, and saved locations are available with a free account.',
  featureName,
}: GuestAuthModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          {featureName && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Shield size={12} className="text-primary" /> {featureName}
            </span>
          )}
          <h2 id="guest-modal-title" className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <Button
            nativeButton={false}
            className="h-11 w-full justify-center gap-2 font-medium"
            render={<Link href="/auth/sign-up" />}
          >
            <UserPlus size={16} /> Sign Up
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            className="h-11 w-full justify-center gap-2 font-medium"
            render={<Link href="/login" />}
          >
            <LogIn size={16} /> Log In
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 w-full justify-center text-xs text-muted-foreground hover:text-foreground"
          >
            Close / Continue Exploring
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GuestAuthModal
