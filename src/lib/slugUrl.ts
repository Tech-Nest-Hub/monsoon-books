// lib/slug.ts
export function slugify(title: string, id: number) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .trim()
    .replace(/\s+/g, "-")            // spaces to dashes
  return `${slug}-${id}`
}

export function extractIdFromSlug(slug: string) {
  const parts = slug.split("-")
  return parseInt(parts[parts.length - 1]) // last part is always the ID
}

// lib/slug.ts — add this
export function bookUrl(title: string, id: number) {
  return `/books/${slugify(title, id)}`
}