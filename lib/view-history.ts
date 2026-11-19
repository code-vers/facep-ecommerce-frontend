/**
 * @fileoverview Client-side browsing history utility for Facep.
 * Tracks and persists viewed products and slugs in localStorage with real-time reactivity.
 */

'use client';

import { useSyncExternalStore, useMemo, useState, useEffect } from 'react';
import type { Product } from '@/lib/api/product';

const RECENTLY_VIEWED_KEY = 'facep_recently_viewed_slugs';
const RECENTLY_VIEWED_PRODUCTS_KEY = 'facep_recently_viewed_products';
const MAX_HISTORY_ITEMS = 30;
export const RECENTLY_VIEWED_EVENT = 'facep_recently_viewed_changed';

export interface StoredViewedProduct {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  basePrice: number | string;
  discountValue?: string | number | null;
  discountType?: 'PERCENTAGE' | 'FIXED' | null;
  dealBadgeText?: string | null;
  dealStartDate?: string | null;
  dealEndDate?: string | null;
  shippingFeeType?: string | null;
  shippingCost?: number | string | null;
  hasVariants?: boolean;
  vendor?: {
    storefront?: {
      storeName?: string | null;
    } | null;
  } | null;
  viewedAt: number;
}

/**
 * Safely retrieve the list of recently viewed product slugs from localStorage.
 */
export function getRecentlyViewedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
      : [];
  } catch {
    return [];
  }
}

/**
 * Safely retrieve the list of recently viewed products from localStorage.
 */
export function getRecentlyViewedProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_PRODUCTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p) => p && typeof p === 'object' && p.id && p.name && p.slug,
    ) as Product[];
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
 * Record a product as viewed.
 * Accepts either a full Product object or a slug string.
 */
export function recordProductView(item: Product | string): void {
  if (typeof window === 'undefined' || !item) return;

  try {
    const slug = typeof item === 'string' ? item.trim() : item.slug?.trim();
    if (!slug) return;

    // 1. Update slugs list
    const existingSlugs = getRecentlyViewedSlugs();
    const updatedSlugs = [slug, ...existingSlugs.filter((s) => s !== slug)].slice(
      0,
      MAX_HISTORY_ITEMS,
    );
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedSlugs));

    // 2. Update products list if full object provided
    if (typeof item === 'object') {
      const existingProducts = getRecentlyViewedProducts();
      const cleanProduct: StoredViewedProduct = {
        id: item.id,
        name: item.name,
        slug: item.slug,
        thumbnail: item.thumbnail || '',
        basePrice: item.basePrice,
        discountValue: item.discountValue,
        discountType: item.discountType,
        dealBadgeText: item.dealBadgeText,
        dealStartDate: item.dealStartDate,
        dealEndDate: item.dealEndDate,
        shippingFeeType: item.shippingFeeType,
        shippingCost: item.shippingCost,
        hasVariants: item.hasVariants,
        vendor: item.vendor
          ? { storefront: { storeName: item.vendor.storefront?.storeName } }
          : undefined,
        viewedAt: Date.now(),
      };

      const updatedProducts = [
        cleanProduct,
        ...existingProducts.filter((p) => p.id !== item.id && p.slug !== slug),
      ].slice(0, MAX_HISTORY_ITEMS);

      window.localStorage.setItem(
        RECENTLY_VIEWED_PRODUCTS_KEY,
        JSON.stringify(updatedProducts),
      );
    }

    // 3. Dispatch real-time event
    window.dispatchEvent(
      new CustomEvent(RECENTLY_VIEWED_EVENT, { detail: { slug, item } }),
    );
  } catch {
    // Graceful degradation when localStorage is unavailable or full
  }
}

/**
 * Remove a single product from browsing history by its ID or slug.
 */
export function removeRecentlyViewedProduct(idOrSlug: string): void {
  if (typeof window === 'undefined' || !idOrSlug) return;
  try {
    const target = idOrSlug.trim();
    const existingProducts = getRecentlyViewedProducts();
    const updatedProducts = existingProducts.filter(
      (p) => p.id !== target && p.slug !== target,
    );
    window.localStorage.setItem(
      RECENTLY_VIEWED_PRODUCTS_KEY,
      JSON.stringify(updatedProducts),
    );

    const existingSlugs = getRecentlyViewedSlugs();
    const updatedSlugs = existingSlugs.filter((s) => s !== target);
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedSlugs));

    window.dispatchEvent(
      new CustomEvent(RECENTLY_VIEWED_EVENT, { detail: { removed: target } }),
    );
  } catch {
    // Ignore
  }
}

/**
 * Clear all browsing history.
 */
export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(RECENTLY_VIEWED_KEY);
    window.localStorage.removeItem(RECENTLY_VIEWED_PRODUCTS_KEY);
    window.dispatchEvent(
      new CustomEvent(RECENTLY_VIEWED_EVENT, { detail: { cleared: true } }),
    );
  } catch {
    // Ignore
  }
}

function subscribeToBrowsingHistory(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(RECENTLY_VIEWED_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(RECENTLY_VIEWED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getBrowsingHistorySnapshot(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(RECENTLY_VIEWED_PRODUCTS_KEY) || '';
}

function getServerSnapshot(): string {
  return '';
}

/**
 * Reactive hook for browsing history products with real-time updates across tabs & components.
 */
export function useBrowsingHistory(limit: number = 30) {
  const [mounted, setMounted] = useState(false);
  const rawString = useSyncExternalStore(
    subscribeToBrowsingHistory,
    getBrowsingHistorySnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = useMemo<Product[]>(() => {
    if (!mounted || !rawString) return [];
    try {
      const parsed = JSON.parse(rawString);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, limit) as Product[];
      }
      return [];
    } catch {
      return [];
    }
  }, [mounted, rawString, limit]);

  return {
    products,
    isLoading: !mounted,
    isEmpty: mounted && products.length === 0,
    clearHistory: clearRecentlyViewed,
    removeItem: removeRecentlyViewedProduct,
  };
}
