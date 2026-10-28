'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  // useEffect,
  useTransition,
} from 'react';
import type { Product } from '@/lib/api/product';
import { getProductBySlug } from '@/lib/api/product';
import type { CarouselProduct } from '@/lib/homepage-data';

export interface ProductModalContextType {
  isOpen: boolean;
  slug: string | null;
  product: Product | null;
  previewData: Partial<CarouselProduct> | null;
  isLoading: boolean;
  openProductModal: (target: Product | CarouselProduct | string) => void;
  closeProductModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

// Helper to synthesize a full Product if backend doesn't have the mock product
function synthesizeFallbackProduct(preview: Partial<CarouselProduct>, slug: string): Product {
  const numericPrice = typeof preview.price === 'string'
    ? parseFloat(preview.price.replace(/[^0-9.]/g, '')) || 99.99
    : typeof preview.price === 'number'
    ? preview.price
    : 99.99;

  const originalPrice = preview.originalPrice
    ? parseFloat(preview.originalPrice.replace(/[^0-9.]/g, '')) || numericPrice * 1.25
    : numericPrice * 1.25;

  return {
    id: preview.id || `mock-${slug}`,
    name: preview.title || 'Product Details',
    slug: slug,
    sku: `SKU-${slug.toUpperCase().slice(0, 8)}`,
    isActive: true,
    publishedAt: new Date().toISOString(),
    brand: 'Facep Verified Brand',
    productType: 'Standard',
    shortDescription: preview.offerText || 'Premium quality product with guaranteed authentic performance and durability.',
    categoryId: 'general',
    category: { id: 'general', name: 'General Merchandise' } as unknown,
    tags: ['Trending', 'Top Rated', 'Featured'],
    condition: 'NEW',
    availableColors: ['#121212', '#F09000', '#1F8394'],
    thumbnail: preview.imageSrc || '/placeholder.png',
    previewImages: preview.imageSrc ? [preview.imageSrc] : [],
    hasVariants: false,
    variants: [
      {
        id: `var-${slug}-1`,
        sku: `SKU-${slug}-BLK`,
        price: numericPrice,
        stock: 25,
        color: '#121212',
        image: preview.imageSrc || '/placeholder.png',
      },
    ],
    specifications: [
      { id: '1', name: 'Brand', value: 'Facep Verified' },
      { id: '2', name: 'Condition', value: 'Brand New (Sealed)' },
      { id: '3', name: 'Warranty', value: '1 Year Manufacturer Warranty' },
      { id: '4', name: 'Ships From', value: 'Official Warehouse' },
    ],
    basePrice: originalPrice,
    oldPrice: originalPrice,
    discountType: 'PERCENTAGE',
    discountValue: Math.round(((originalPrice - numericPrice) / originalPrice) * 100),
    dealBadgeText: preview.badgeText || (originalPrice > numericPrice ? 'Limited Time Deal' : null),
    shipsFrom: 'Facep Global Logistics',
    minDeliveryDays: 3,
    maxDeliveryDays: 7,
    shippingFeeType: preview.shippingText?.toLowerCase().includes('free') ? 'FREE' : 'STANDARD',
    shippingCost: preview.shippingText?.toLowerCase().includes('free') ? 0 : 5.99,
  } as unknown as Product;
}

export function ProductModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [previewData, setPreviewData] = useState<Partial<CarouselProduct> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  const closeProductModal = useCallback(() => {
    setIsOpen(false);
    // Delay clearing product slightly so close animation doesn't flash empty
    setTimeout(() => {
      setProduct(null);
      setPreviewData(null);
      setSlug(null);
      setIsLoading(false);
    }, 250);
  }, []);

  const openProductModal = useCallback((target: Product | CarouselProduct | string) => {
    let targetSlug = '';
    let initialPreview: Partial<CarouselProduct> | null = null;
    let fullProduct: Product | null = null;

    if (typeof target === 'string') {
      targetSlug = target.trim();
    } else if ('variants' in target && 'basePrice' in target) {
      // It's a full API Product
      fullProduct = target as Product;
      targetSlug = fullProduct.slug || fullProduct.id;
      initialPreview = {
        id: fullProduct.id,
        slug: fullProduct.slug,
        title: fullProduct.name,
        imageSrc: fullProduct.thumbnail,
        price: `$${Number(fullProduct.basePrice).toFixed(2)}`,
      };
    } else {
      // It's a CarouselProduct
      const carouselItem = target as CarouselProduct;
      targetSlug = carouselItem.slug || carouselItem.id || '';
      initialPreview = carouselItem;
    }

    if (!targetSlug) return;

    setSlug(targetSlug);
    setPreviewData(initialPreview);
    setIsOpen(true);

    if (fullProduct) {
      setProduct(fullProduct);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch product by slug
    setIsLoading(true);
    startTransition(async () => {
      try {
        const fetched = await getProductBySlug(targetSlug);
        if (fetched) {
          setProduct(fetched);
        } else if (initialPreview) {
          setProduct(synthesizeFallbackProduct(initialPreview, targetSlug));
        }
      } catch (err) {
        console.warn(`[ProductModal] Fallback used for "${targetSlug}":`, err);
        if (initialPreview) {
          setProduct(synthesizeFallbackProduct(initialPreview, targetSlug));
        } else {
          setProduct(synthesizeFallbackProduct({ title: targetSlug }, targetSlug));
        }
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  // Global link interception: When user clicks any link to /products/[slug], open the modal
  // (Commented out: disabled to restore previous product details page navigation)
  /*
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Don't intercept if modifier keys held (Ctrl, Cmd, Shift, Alt)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      // Don't intercept if target="_blank"
      if (anchor.target === '_blank') return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Match /products/:slug or /product/:category/:id, excluding /products root & catalog query params
      const isProductDetailUrl =
        (href.startsWith('/products/') && href !== '/products' && href !== '/products/' && !href.startsWith('/products?')) ||
        href.startsWith('/product/');

      if (isProductDetailUrl) {
        e.preventDefault();
        e.stopPropagation();

        let extractedSlug = '';
        if (href.startsWith('/products/')) {
          extractedSlug = href.replace('/products/', '').split('?')[0].split('#')[0];
        } else if (href.startsWith('/product/')) {
          const parts = href.replace('/product/', '').split('/');
          extractedSlug = parts[parts.length - 1].split('?')[0].split('#')[0];
        }

        if (extractedSlug) {
          // Look for thumbnail image and title inside clicked card to use as instant preview
          const cardImg = anchor.querySelector('img');
          const cardTitle = anchor.querySelector('h1, h2, h3, h4, p, span')?.textContent;
          let imgSrc = cardImg?.currentSrc || cardImg?.getAttribute('src') || undefined;
          if (imgSrc && imgSrc.includes('_next/image?url=')) {
            try {
              const urlParam = new URL(imgSrc, window.location.origin).searchParams.get('url');
              if (urlParam) imgSrc = decodeURIComponent(urlParam);
            } catch {}
          }
          const preview: Partial<CarouselProduct> = {
            slug: extractedSlug,
            title: cardTitle || extractedSlug,
            imageSrc: imgSrc,
          };
          openProductModal(preview as CarouselProduct);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [openProductModal]);
  */

  return (
    <ProductModalContext.Provider
      value={{
        isOpen,
        slug,
        product,
        previewData,
        isLoading,
        openProductModal,
        closeProductModal,
      }}
    >
      {children}
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within a ProductModalProvider');
  }
  return context;
}
