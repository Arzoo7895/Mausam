'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { faqs } from '@/lib/site-data'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you might want to know before you get started with Mausam AI."
        />

        <ul className="mt-10 space-y-2 sm:mt-12 sm:space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`
            return (
              <li
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? 'border-primary/30 bg-card'
                    : 'border-border bg-card/60'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {faq.question}
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
