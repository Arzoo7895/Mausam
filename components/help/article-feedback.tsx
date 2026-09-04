'use client'

import { Check, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'comment' | 'done'

export function ArticleFeedback({ slug }: { slug: string }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [helpful, setHelpful] = useState<boolean | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(value: boolean, note?: string) {
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('article_feedback').insert({
        article_slug: slug,
        helpful: value,
        comment: note?.trim() ? note.trim() : null,
      })
      if (error) throw error
      setPhase('done')
      toast.success('Thanks for your feedback!')
    } catch {
      toast.error('Could not send feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function onVote(value: boolean) {
    setHelpful(value)
    // Record the vote immediately; comment is an optional follow-up.
    void submit(value)
    setPhase('comment')
  }

  if (phase === 'done') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success/25 bg-success/5 p-5">
        <span className="flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Thank you — your feedback was recorded.
          </p>
          <p className="text-sm text-muted-foreground">
            It helps us improve every article.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">
          Was this article helpful?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => onVote(true)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60',
              helpful === true
                ? 'border-success/40 bg-success/10 text-success'
                : 'border-border text-muted-foreground hover:border-success/40 hover:text-foreground',
            )}
            aria-pressed={helpful === true}
          >
            <ThumbsUp className="size-4" aria-hidden="true" />
            Yes
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onVote(false)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60',
              helpful === false
                ? 'border-warning/40 bg-warning/10 text-warning'
                : 'border-border text-muted-foreground hover:border-warning/40 hover:text-foreground',
            )}
            aria-pressed={helpful === false}
          >
            <ThumbsDown className="size-4" aria-hidden="true" />
            No
          </button>
        </div>
      </div>

      {phase === 'comment' && (
        <form
          className="mt-4 border-t border-border pt-4 animate-in fade-in-0 slide-in-from-top-1"
          onSubmit={(e) => {
            e.preventDefault()
            if (helpful === null) return
            void submit(helpful, comment)
          }}
        >
          <label
            htmlFor="feedback-comment"
            className="text-sm text-muted-foreground"
          >
            {helpful
              ? 'Great! Anything we could add? (optional)'
              : 'Sorry about that. What were you looking for? (optional)'}
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            placeholder="Share a detail to help us improve…"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPhase('done')}
            >
              Skip
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              Send comment
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
