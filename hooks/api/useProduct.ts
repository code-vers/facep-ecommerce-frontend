import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProductFacets,
  getProducts,
  getRelatedProducts,
  getVendorProductById,
  getVendorProducts,
  getAdminProducts,
  getVendorProductStats,
  updateProduct,
  updateProductPromotion,
  updateProductStatus,
  removeProductPromotion,
  type Product,
  type ProductQueryParams,
} from '@/lib/api/product';
import type { CarouselProduct } from '@/lib/homepage-data';
import { getRecentlyViewedSlugs, RECENTLY_VIEWED_EVENT } from '@/lib/view-history';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useSyncExternalStore } from 'react';

export const useProducts = (params?: ProductQueryParams, enabled: boolean = true) =>
  useQuery({
    queryKey: ['products', 'public', params],
    queryFn: () => getProducts(params),
    enabled,
  });

export const useVendorProducts = (params?: ProductQueryParams, enabled: boolean = true) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    // Vendor product data belongs to the logged-in vendor, not just the route.
    queryKey: ['products', 'vendor', userId, params],
    queryFn: () => getVendorProducts(params),
    enabled: enabled && Boolean(userId),
  });
};

export const useAdminProducts = (params?: ProductQueryParams, enabled: boolean = true) =>
  useQuery({
    queryKey: ['products', 'admin', params],
    queryFn: () => getAdminProducts(params),
    enabled,
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['products', 'detail', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });

export const useVendorProduct = (id: string) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['products', 'vendor-detail', userId, id],
    queryFn: () => getVendorProductById(id),
    enabled: Boolean(userId && id),
  });
};

export const useRelatedProducts = (slug: string) =>
  useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: () => getRelatedProducts(slug),
    enabled: Boolean(slug),
  });

export const useProductFacets = () =>
  useQuery({ queryKey: ['products', 'facets'], queryFn: getProductFacets });

export const useVendorProductStats = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['products', 'vendor-stats', userId],
    queryFn: getVendorProductStats,
    enabled: Boolean(userId),
  });
};

const useProductMutation = <TVariables,>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useCreateProduct = () => useProductMutation(createProduct);
export const useUpdateProduct = () => useProductMutation(updateProduct);
export const useUpdateProductStatus = () => useProductMutation(updateProductStatus);
export const useUpdateProductPromotion = () => useProductMutation(updateProductPromotion);
export const useRemoveProductPromotion = () => useProductMutation(removeProductPromotion);
export const useDeleteProduct = () => useProductMutation(deleteProduct);

// ─────────────────────────────────────────────────────────────────────────────
// Carousel Mapping & Homepage Hooks
// ─────────────────────────────────────────────────────────────────────────────

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);

export const formatProductImageUrl = (value?: string | null): string => {
  if (!value) return '/banner.png';
  return value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
};

export const formatPriceCurrency = (value: number | string): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

export const calculateProductPrice = (product: Product): number => {
  const base = Number(product.basePrice);
  const discount = Number(product.discountValue ?? 0);
  if (!product.discountType || !discount) return base;
  const now = Date.now();
  if (product.dealStartDate && now < new Date(product.dealStartDate).getTime()) return base;
  if (product.dealEndDate && now > new Date(product.dealEndDate).getTime()) return base;
  return product.discountType === 'PERCENTAGE'
    ? Math.max(0, base - (base * discount) / 100)
    : Math.max(0, base - discount);
};

export const mapProductToCarousel = (product: Product): CarouselProduct => {
  const activePrice = calculateProductPrice(product);
  const basePrice = Number(product.basePrice);
  const hasDiscount = activePrice < basePrice;

  const pseudoRating = 4.3 + ((product.name.length % 7) * 0.1);
  const pseudoReviews = `${((product.name.length * 17) % 500) + 50}+`;

  return {
    id: product.id,
    slug: product.slug,
    href: `/products/${product.slug}`,
    title: product.name,
    imageSrc: formatProductImageUrl(product.thumbnail),
    imageAlt: product.name,
    price: formatPriceCurrency(activePrice),
    originalPrice: hasDiscount ? formatPriceCurrency(basePrice) : undefined,
    badgeText: hasDiscount
      ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : ''} off`
      : undefined,
    badgeLabel: hasDiscount ? 'Deal' : undefined,
    offerText: product.dealBadgeText || undefined,
    shippingText:
      product.shippingFeeType === 'FREE'
        ? 'Free Shipping'
        : product.shippingCost
          ? `${formatPriceCurrency(product.shippingCost)} Shipping`
          : 'Shipping available',
    rating: Math.min(5, Number(pseudoRating.toFixed(1))),
    reviewCount: pseudoReviews,
  };
};

function subscribeToViewedHistory(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(RECENTLY_VIEWED_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(RECENTLY_VIEWED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getLatestSlugSnapshot(): string {
  const slugs = getRecentlyViewedSlugs();
  return slugs[0] || '';
}

function getServerSnapshot(): string {
  return '';
}

export const useRelatedToViewedProducts = (targetCount: number = 10) => {
  const latestSlug = useSyncExternalStore(
    subscribeToViewedHistory,
    getLatestSlugSnapshot,
    getServerSnapshot,
  );

  // 1. Fetch related products if we have a viewed slug
  const relatedQuery = useRelatedProducts(latestSlug);

  // 2. Always fetch newest products from catalog so the carousel is always fully populated with 10 products
  const recentQuery = useProducts({ limit: targetCount, sort: 'newest' });

  const products: CarouselProduct[] = useMemo(() => {
    const relatedList = relatedQuery.data ?? [];
    const recentList = recentQuery.data?.data ?? [];

    const seenIds = new Set<string>();
    const combined: Product[] = [];

    // Prioritize products related to the viewed item
    for (const p of relatedList) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        combined.push(p);
      }
    }

    // Seamlessly backfill with recent products up to targetCount
    for (const p of recentList) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        combined.push(p);
      }
    }

    return combined.slice(0, targetCount).map(mapProductToCarousel);
  }, [relatedQuery.data, recentQuery.data, targetCount]);

  const isLoading = latestSlug
    ? relatedQuery.isLoading && recentQuery.isLoading
    : recentQuery.isLoading;
  const hasData = products.length > 0;

  return {
    products,
    isLoading,
    hasData,
    isPersonalized: (relatedQuery.data?.length ?? 0) > 0,
    basedOnSlug: (relatedQuery.data?.length ?? 0) > 0 ? latestSlug : null,
  };
};
