import { searchIndex, type SearchDoc } from '@/lib/help-content'

export function searchArticles(query: string, limit = 6): SearchDoc[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const terms = q.split(/\s+/).filter(Boolean)

  const scored = searchIndex
    .map((doc) => {
      const haystack = [
        doc.title,
        doc.summary,
        doc.categoryTitle,
        doc.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()

      let score = 0
      for (const term of terms) {
        if (!haystack.includes(term)) {
          // require every term to appear somewhere
          return { doc, score: -1 }
        }
        if (doc.title.toLowerCase().includes(term)) score += 5
        if (doc.tags.some((t) => t.toLowerCase().includes(term))) score += 3
        if (doc.summary.toLowerCase().includes(term)) score += 2
        if (doc.categoryTitle.toLowerCase().includes(term)) score += 1
      }
      // exact title prefix boost
      if (doc.title.toLowerCase().startsWith(q)) score += 4
      return { doc, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.doc)

  return scored
}
