/**
 * URL-safe slug from arbitrary text.
 * Normalises accents rather than stripping them, so "Déjà Vu" becomes
 * "deja-vu" instead of "dj-vu".
 */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Guarantees uniqueness within a document by appending a counter to
 * collisions. Heading anchors must be unique or in-page links break silently.
 */
export function uniqueSlug(value: string, taken: Set<string>): string {
  const base = slugify(value) || 'section';
  let candidate = base;
  let counter = 2;

  while (taken.has(candidate)) {
    candidate = `${base}-${counter++}`;
  }

  taken.add(candidate);
  return candidate;
}
