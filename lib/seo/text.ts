/** Convert CMS content into a compact plain-text snippet for search metadata. */
export function seoDescription(value: string | null | undefined, fallback: string, maxLength = 160) {
  const plainText = (value || '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  const text = plainText || fallback;
  if (text.length <= maxLength) return text;

  const excerpt = text.slice(0, maxLength - 1);
  const lastSpace = excerpt.lastIndexOf(' ');
  return `${excerpt.slice(0, lastSpace > maxLength * 0.65 ? lastSpace : excerpt.length).trimEnd()}…`;
}
