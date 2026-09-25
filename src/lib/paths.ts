export function playerPath(slug: string): string {
  return `/tamirchid/${encodeURIComponent(slug)}`;
}

// Route params can arrive still percent-encoded (e.g. "Crawford%20Gregory").
export function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// Keeps admin-entered slugs URL-safe: whitespace becomes "-", reserved URL characters are dropped.
export function sanitizeSlug(slug: string): string {
  return slug
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[/?#%\\]+/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}
