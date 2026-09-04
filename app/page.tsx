import { Cta } from '@/components/cta'
import { Faq } from '@/components/faq'
import { Features } from '@/components/features'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { ProductShowcase } from '@/components/product-showcase'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Stats } from '@/components/stats'
import { Testimonials } from '@/components/testimonials'
import { WhyChoose } from '@/components/why-choose'

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <ProductShowcase />
        <Stats />
        <WhyChoose />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}
