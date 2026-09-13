import type { Metadata } from 'next'
import { ContactContent } from '@/components/help/contact-content'
import { SiteFooter } from '@/components/help/site-footer'
import { SiteHeader } from '@/components/help/site-header'

export const metadata: Metadata = {
  title: 'Contact Support — Mausam AI',
  description:
    'Get in touch with the Mausam AI support team. We typically reply within one business day.',
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <ContactContent />
      <SiteFooter />
    </>
  )
}
