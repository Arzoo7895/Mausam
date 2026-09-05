import { ArrowRight, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/help/breadcrumb'
import { CategoryIcon } from '@/components/help/category-icon'
import { SiteFooter } from '@/components/help/site-footer'
import { SiteHeader } from '@/components/help/site-header'
import {
  articlesByCategory,
  categories,
  getCategory,
} from '@/lib/help-content'

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return { title: 'Not found — Mausam AI Help' }
  return {
    title: `${category.title} — Mausam AI Help`,
    description: category.description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const list = articlesByCategory(slug)

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Breadcrumb
          items={[
            { label: 'Help Center', href: '/help-center' },
            { label: category.title },
          ]}
        />

        <header className="mt-6 flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CategoryIcon name={category.icon} className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {category.title}
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              {category.description}
            </p>
          </div>
        </header>

        <div className="mt-8 space-y-3">
          {list.map((a) => (
            <Link
              key={a.slug}
              href={`/help-center/articles/${a.slug}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="min-w-0">
                <h2 className="font-medium text-foreground">{a.title}</h2>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                  {a.summary}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {a.readMinutes} min read
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>

        {/* Other categories */}
        <section className="mt-14">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Other topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/help-center/categories/${c.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <CategoryIcon name={c.icon} className="size-4" />
                  {c.title}
                </Link>
              ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
