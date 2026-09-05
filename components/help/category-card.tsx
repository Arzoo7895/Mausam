import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { CategoryIcon } from '@/components/help/category-icon'
import { articlesByCategory, type Category } from '@/lib/help-content'

export function CategoryCard({ category }: { category: Category }) {
  const count = articlesByCategory(category.slug).length

  return (
    <Link
      href={`/help-center/categories/${category.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <CategoryIcon name={category.icon} className="size-5" />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-foreground">
        {category.title}
      </h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
        {category.description}
      </p>
      <p className="mt-4 text-xs font-medium text-muted-foreground">
        {count} {count === 1 ? 'article' : 'articles'}
      </p>
    </Link>
  )
}
