import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ArticleBody } from '@/components/help/article-body'
import { ArticleFeedback } from '@/components/help/article-feedback'
import { Breadcrumb } from '@/components/help/breadcrumb'
import { SiteFooter } from '@/components/help/site-footer'
import { SiteHeader } from '@/components/help/site-header'
import {
  articles,
  getArticle,
  getCategory,
  relatedArticles,
} from '@/lib/help-content'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Not found — Mausam AI Help' }
  return {
    title: `${article.title} — Mausam AI Help`,
    description: article.summary,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const category = getCategory(article.category)
  const related = relatedArticles(article.related).filter(
    (a) => a.slug !== article.slug,
  )

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Breadcrumb
          items={[
            { label: 'Help Center', href: '/help-center' },
            {
              label: category?.title ?? 'Articles',
              href: category ? `/help-center/categories/${category.slug}` : undefined,
            },
            { label: article.title },
          ]}
        />

        <article className="mt-6">
          <header className="border-b border-border pb-6">
            <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {article.summary}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {article.readMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                Updated {formatDate(article.updated)}
              </span>
            </div>
          </header>

          <div className="mt-8">
            <ArticleBody blocks={article.blocks} />
          </div>

          {article.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Related FAQs
              </h2>
              <Accordion multiple={false} className="mt-3">
                {article.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-[15px] font-medium">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          <div className="mt-12">
            <ArticleFeedback slug={article.slug} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
              Related articles
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/help-center/articles/${a.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {a.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {getCategory(a.category)?.title}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 rounded-2xl border border-border bg-accent/40 p-6 text-center">
          <p className="font-display text-base font-semibold text-foreground">
            Didn&apos;t find what you needed?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Our support team is happy to help with anything else.
          </p>
          <Link
            href="/help-center/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact support
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
