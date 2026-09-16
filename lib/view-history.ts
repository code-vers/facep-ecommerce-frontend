/**
 * @fileoverview Client-side browsing history utility for Facep.
 * Tracks and persists viewed product slugs in localStorage (SSR-safe).
 */

const RECENTLY_VIEWED_KEY = 'facep_recently_viewed_slugs';
const MAX_HISTORY_ITEMS = 20;
export const RECENTLY_VIEWED_EVENT = 'facep_recently_viewed_changed';

/**
 * Safely retrieve the list of recently viewed product slugs from localStorage.
 */
export function getRecentlyViewedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : [];
  } catch {
    return [];
  }
}

/**
 * Get the most recently viewed product slug, or null if none exist.
 */
export function getLatestViewedSlug(): string | null {
  const slugs = getRecentlyViewedSlugs();
  return slugs.length > 0 ? slugs[0] : null;
}

/**
 * Record a product slug as viewed.
 * Moves it to the front of the list, removes duplicates, and caps at MAX_HISTORY_ITEMS.
 */
export function recordProductView(slug: string): void {
  if (typeof window === 'undefined' || !slug || typeof slug !== 'string') return;
  const trimmed = slug.trim();
  if (!trimmed) return;

  try {
    const existing = getRecentlyViewedSlugs();
    const updated = [trimmed, ...existing.filter((s) => s !== trimmed)].slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_EVENT, { detail: { slug: trimmed, slugs: updated } }));
  } catch {
    // Graceful degradation when localStorage is unavailable or full
  }
}

/**
 * Clear all browsing history.
 */
export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(RECENTLY_VIEWED_KEY);
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_EVENT, { detail: { slugs: [] } }));
  } catch {
    // Ignore
  }
}
