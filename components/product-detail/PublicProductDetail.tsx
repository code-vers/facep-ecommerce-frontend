'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  MapPin,
  Heart,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lock,
  Share2,
  Maximize2,
  X,
  Tag,
  ShieldCheck,
  Check,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckWishlistStatus, useToggleWishlist } from '@/hooks/api/useWishlist';
import { useRelatedProducts } from '@/hooks/api/useProduct';
import type { Product, ProductVariant } from '@/lib/api/product';
import { recordProductView } from '@/lib/view-history';
import ProductCard from '@/components/shared/ProductCard';
import CustomerReviewsSection from '@/components/product-detail/CustomerReviewsSection';
import BrowsingHistorySection from '@/components/product-detail/BrowsingHistorySection';
import SignUpBanner from '@/components/shared/SignUpBanner';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);

const imageUrl = (value?: string | null) => {
  if (!value) return '/placeholder.png';
  if (value.startsWith('http')) return value;
  return `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
};

const activePrice = (product: Product, variant?: ProductVariant) => {
  const base = Number(variant?.price ?? product.basePrice);
  const discount = Number(product.discountValue ?? 0);
  const now = Date.now();
  if (!product.discountType || !discount) return base;
  if (product.dealStartDate && now < new Date(product.dealStartDate).getTime()) return base;
  if (product.dealEndDate && now > new Date(product.dealEndDate).getTime()) return base;
  return product.discountType === 'PERCENTAGE'
    ? Math.max(0, base - (base * discount) / 100)
    : Math.max(0, base - discount);
};

const colorNameMap: Record<string, string> = {
  '#F09000': 'Yellow/Orange',
  '#1F8394': 'Teal',
  '#EAB308': 'Yellow',
  '#29941F': 'Green',
  '#941F21': 'Red',
  '#86941F': 'Olive',
  '#231F94': 'Blue',
  '#121212': 'True Black',
  '#FBFEFF': 'White',
  '#A45496': 'Purple',
  '#989A98': 'Silver',
  '#3DC4C4': 'Cyan',
  '#BF97CF': 'Lavender',
  '#8B8AA4': 'Slate',
  '#HGT68D': 'Space Gray',
  '#862HN8': 'Midnight',
};

const extractFeatures = (
  keyFeatures?: string | null,
  detailedDescription?: string | null,
  shortDescription?: string | null,
): string[] => {
  const rawText = keyFeatures || detailedDescription || shortDescription || '';
  if (!rawText) return [];

  if (rawText.includes('<li') || rawText.includes('</li>')) {
    if (typeof window !== 'undefined') {
      const parserDoc = new DOMParser().parseFromString(rawText, 'text/html');
      const lis = Array.from(parserDoc.querySelectorAll('li'))
        .map((el) => el.textContent?.trim() || '')
        .filter(Boolean);
      if (lis.length > 0) return lis;
    }
  }

  const clean = rawText
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  const splitItems = clean
    .split(/\s*[\u2022\u25cf\u25aa\u25fe\u2219]\s*|\s*;\s*|\n+/)
    .map((s) => s.trim().replace(/^[-–]\s*/, ''))
    .filter((s) => s.length > 5);

  if (splitItems.length > 1) return splitItems;

  const sentences = clean.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);
  return sentences.length > 1 ? sentences : [clean];
};

const sanitizeDescriptionHtml = (html?: string | null) => {
  if (!html) return '';
  return html
    .replace(/style\s*=\s*"[^"]*"/gi, '')
    .replace(/style\s*=\s*'[^']*'/gi, '')
    .replace(/<h[1-6]>/gi, '<p>')
    .replace(/<\/h[1-6]>/gi, '</p>')
    .replace(/<b>/gi, '<span>')
    .replace(/<\/b>/gi, '</span>')
    .replace(/<strong>/gi, '<span>')
    .replace(/<\/strong>/gi, '</span>');
};

const getEstimatedDeliveryDate = (minDays: number = 3, maxDays: number = 7) => {
  const now = new Date();
  const minDate = new Date(now);
  minDate.setDate(now.getDate() + minDays);
  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + maxDays);

  const format = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${format(minDate)} - ${format(maxDate)}`;
};

const formatBulletPoint = (text: string) => {
  const match = text.match(/^([A-Z0-9\s/&+–-]+?\.)\s*(.+)$/i);
  if (match && match[1].length < 40) {
    return (
      <>
        <strong className='font-bold text-[#0F1111]'>{match[1]}</strong> {match[2]}
      </>
    );
  }
  return text;
};

export default function PublicProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0.5, y: 0.5 });
  const [lensPos, setLensPos] = useState({ left: 0, top: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setZoomPos({ x, y });

    const lensSize = 144;
    const left = Math.max(0, Math.min(rect.width - lensSize, e.clientX - rect.left - lensSize / 2));
    const top = Math.max(0, Math.min(rect.height - lensSize, e.clientY - rect.top - lensSize / 2));

    setLensPos({ left, top });
  };

  const router = useRouter();
  const { addToCart } = useCartStore();
  const { session } = useAuth();
  const { data: wishlistStatus } = useCheckWishlistStatus(product.id);
  const toggleWishlistMutation = useToggleWishlist();
  const isWishlisted = Boolean(wishlistStatus?.isWishlisted);

  useEffect(() => {
    if (product?.slug) {
      recordProductView(product.slug);
    }
  }, [product?.slug]);

  const related = useRelatedProducts(product.slug);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId),
    [product.variants, selectedVariantId],
  );

  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[],
    [product.variants],
  );
  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[],
    [product.variants],
  );
  const materials = useMemo(
    () => [...new Set(product.variants.map((v) => v.material).filter(Boolean))] as string[],
    [product.variants],
  );
  const storages = useMemo(
    () => [...new Set(product.variants.map((v) => v.storage).filter(Boolean))] as string[],
    [product.variants],
  );

  const images = useMemo(
    () =>
      [
        ...new Set([
          product.thumbnail,
          ...product.previewImages,
          ...product.variants.map((v) => v.image).filter(Boolean),
        ]),
      ].filter(Boolean) as string[],
    [product],
  );

  const handleSelectVariant = (key: 'size' | 'color' | 'material' | 'storage', value: string) => {
    const current = selectedVariant || product.variants[0];
    const target =
      product.variants.find(
        (v) => v[key] === value && (key === 'color' ? true : v.color === current?.color),
      ) || product.variants.find((v) => v[key] === value);

    if (target) {
      setSelectedVariantId(target.id!);
      if (target.image) setSelectedImage(target.image);
    }
  };

  const handleSelectThumbnail = (img: string) => {
    setSelectedImage(img);
    const matchingVariant = product.variants.find((v) => v.image === img);
    if (matchingVariant?.id) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  const activeMainImage = selectedImage || selectedVariant?.image || product.thumbnail;

  const isOutOfStock =
    product.stockStatus === 'OUT_OF_STOCK' ||
    product.stockQuantity <= 0 ||
    (selectedVariant && selectedVariant.stock <= 0);

  const price = activePrice(product, selectedVariant);
  const originalPrice = Number(selectedVariant?.price ?? product.oldPrice ?? product.basePrice);
  const discountPercent =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const dollars = Math.floor(price);
  const cents = Math.round((price - dollars) * 100)
    .toString()
    .padStart(2, '0');

  const brandDisplayName =
    product.vendor?.storefront?.storeName ||
    product.brand ||
    product.vendor?.name ||
    'Generic Brand';

  const brandVendorId = product.vendorId || product.vendor?.id;

  const features = useMemo(
    () => extractFeatures(product.keyFeatures, product.detailedDescription, product.shortDescription),
    [product.keyFeatures, product.detailedDescription, product.shortDescription],
  );

  const displayedFeatures = showAllFeatures ? features : features.slice(0, 6);

  const handleToggleWishlist = async () => {
    if (!session) {
      toast.error('Please log in first', {
        description: 'You need an account to save items to your wishlist.',
      });
      return;
    }

    try {
      const res = await toggleWishlistMutation.mutateAsync(product.id);
      if (res.isWishlisted) {
        toast.success('Added to Wishlist', {
          description: `${product.name} saved to your wishlist.`,
        });
      } else {
        toast.info('Removed from Wishlist', {
          description: `${product.name} removed from your wishlist.`,
        });
      }
    } catch {
      toast.error('Wishlist Action Failed', {
        description: 'Unable to update wishlist. Please try again.',
      });
    }
  };

  const handleAddToCart = (redirect: boolean) => {
    if (isOutOfStock) return;

    addToCart({
      id: product.id,
      cartItemId: `${product.id}-${selectedVariant?.color || ''}-${selectedVariant?.size || ''}-${selectedVariant?.storage || ''}-${selectedVariant?.material || ''}`,
      name: product.name,
      slug: product.slug,
      price: price,
      quantity: quantity,
      image: selectedVariant?.image || selectedImage || product.thumbnail,
      sellerName: brandDisplayName,
      color: selectedVariant?.color || undefined,
      size: selectedVariant?.size || undefined,
      storage: selectedVariant?.storage || undefined,
      material: selectedVariant?.material || undefined,
      availableVariants: product.variants,
      availableColors: product.availableColors,
      taxAmount: Number(product.taxAmount) || 0,
      vatGst: Number(product.vatGst) || 0,
      importCharges: Number(product.importCharges) || 0,
      handlingFee: Number(product.handlingFee) || 0,
      shippingCost: product.shippingFeeType === 'FREE' ? 0 : Number(product.shippingCost) || 0,
    });

    if (redirect) {
      router.push('/cart');
    } else {
      toast.success('Added to Cart', {
        description: `${quantity}x ${product.name} added to your shopping cart.`,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link Copied', { description: 'Product link copied to clipboard!' });
    }
  };

  return (
    <div className='min-h-screen bg-white font-sans text-[#0F1111] antialiased selection:bg-[#E77600]/20'>
      {/* Amazon Breadcrumb Top Bar */}
      <nav aria-label="Breadcrumb" className='sticky top-[96px] z-30 border-b border-gray-200 bg-white/95 backdrop-blur-xs py-2 px-4 sm:px-6 lg:px-8 text-xs text-[#565959] shadow-2xs transition-shadow'>
        <div className='mx-auto max-w-[1500px] flex flex-wrap items-center gap-1.5'>
          <Link href='/' className='hover:text-[#C45500] hover:underline'>
            Home
          </Link>
          <span>›</span>
          {product.category && (
            <>
              <Link
                href={`/category/${product.category.id || product.category.name}`}
                className='hover:text-[#C45500] hover:underline'
              >
                {product.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          {product.subcategory && (
            <>
              <span className='hover:text-[#C45500] cursor-pointer hover:underline'>
                {product.subcategory.name}
              </span>
              <span>›</span>
            </>
          )}
          <span className='truncate max-w-[250px] sm:max-w-md text-gray-500 font-normal'>
            {product.name}
          </span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className='mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0 max-w-full'>
          {/* Left Column: Vertical Thumbnails + Main Image Showcase */}
          <section aria-label="Product Images" className='lg:col-span-5 flex flex-col-reverse md:flex-row gap-3 items-start sticky top-[144px] self-start min-w-0 max-w-full z-10'>
            {/* Vertical Thumbnails Column */}
            {images.length > 1 && (
              <div className='flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[540px] scrollbar-none py-1 shrink-0 w-full md:w-auto'>
                {images.map((img, idx) => {
                  const isActive = activeMainImage === img;
                  return (
                    <button
                      key={img + idx}
                      type='button'
                      onClick={() => handleSelectThumbnail(img)}
                      onMouseEnter={() => handleSelectThumbnail(img)}
                      className={`relative h-13 w-13 sm:h-14 sm:w-14 rounded-sm border overflow-hidden transition-all bg-white shrink-0 ${
                        isActive
                          ? 'border-[#007185] ring-2 ring-[#007185]/40 shadow-xs'
                          : 'border-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <Image
                        src={imageUrl(img)}
                        alt={`${product.name} preview thumbnail ${idx + 1}`}
                        fill
                        unoptimized
                        className='object-contain p-0.5'
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Showcase Image Box with Amazon Hover Lens Magnifier */}
            <div
              className='relative flex-1 aspect-square w-full bg-white border border-gray-200 rounded-sm flex items-center justify-center p-4 cursor-crosshair group'
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={imageUrl(activeMainImage)}
                alt={product.name}
                fill
                priority
                unoptimized
                className='object-contain p-2'
              />

              {/* Amazon Semi-Transparent Lens Grid Box */}
              {isZooming && (
                <div
                  className='absolute z-20 pointer-events-none w-36 h-36 bg-[#007185]/20 border border-[#007185]/60 rounded-xs shadow-xs hidden md:block'
                  style={{
                    left: `${lensPos.left}px`,
                    top: `${lensPos.top}px`,
                  }}
                />
              )}

              {/* Floating Magnified Zoom Window */}
              {isZooming && (
                <div className='absolute left-[102%] top-0 z-50 w-[560px] h-[560px] bg-white border border-gray-300 shadow-2xl rounded-md overflow-hidden pointer-events-none hidden lg:block'>
                  <div
                    className='w-full h-full relative'
                    style={{
                      backgroundImage: `url(${imageUrl(activeMainImage)})`,
                      backgroundPosition: `${zoomPos.x * 100}% ${zoomPos.y * 100}%`,
                      backgroundSize: '280%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              )}

              {/* Share & Zoom Lightbox Overlay */}
              <div className='absolute top-3 right-3 flex flex-col gap-2 z-10'>
                <button
                  type='button'
                  onClick={handleShare}
                  className='p-2 rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors'
                  title='Share product'
                >
                  <Share2 size={16} />
                </button>
                <button
                  type='button'
                  onClick={() => setLightboxOpen(true)}
                  className='p-2 rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors'
                  title='View full resolution image'
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              <div className='absolute bottom-3 left-3 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded border border-gray-200 pointer-events-none'>
                Hover to zoom | Click for full view
              </div>
            </div>
          </section>

          {/* Center Column: Product Specs, Rating, Deal & Bullet Points */}
          <section aria-label="Product Specifications" className='lg:col-span-4 flex flex-col gap-4 border-b lg:border-b-0 border-gray-200 pb-6 lg:pb-0 min-w-0 max-w-full overflow-hidden break-words'>
            {/* Store & Title */}
            <div>
              {brandVendorId ? (
                <Link
                  href={`/brand/${brandVendorId}`}
                  className='text-xs sm:text-sm font-medium text-[#007185] hover:text-[#C45500] hover:underline flex items-center gap-1'
                >
                  Visit the {brandDisplayName} Store
                  <ExternalLink size={12} />
                </Link>
              ) : (
                <span className='text-xs sm:text-sm font-medium text-[#007185]'>
                  Brand: {brandDisplayName}
                </span>
              )}

              <h1 className='text-xl sm:text-2xl font-normal text-[#0F1111] leading-snug tracking-tight mt-1'>
                {product.name}
              </h1>
            </div>

            {/* Rating Row & Review Link */}
            <div className='flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 text-xs sm:text-sm'>
              <div className='flex items-center gap-1 group cursor-pointer'>
                <span className='font-semibold text-sm text-[#0F1111]'>4.7</span>
                <div className='flex items-center text-[#FFA41C]'>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < 4
                          ? 'fill-[#FFA41C] text-[#FFA41C]'
                          : 'fill-[#FFA41C] text-[#FFA41C] opacity-80'
                      }
                    />
                  ))}
                </div>
                <ChevronDown size={12} className='text-gray-500 group-hover:text-[#C45500]' />
              </div>
              <span className='text-gray-300'>|</span>
              <a href='#customer-reviews' className='text-[#007185] hover:text-[#C45500] hover:underline font-normal'>
                4,470 ratings
              </a>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium'>
                {product.condition || 'NEW'}
              </span>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-700 font-medium text-xs'>
                1K+ bought in past month
              </span>
            </div>

            {/* Amazon Deal Badge */}
            {(product.dealBadgeText || discountPercent > 0) && (
              <div className='flex items-center gap-2'>
                <span className='bg-[#CC0C39] text-white text-xs font-bold px-2.5 py-1 rounded-2xs inline-flex items-center gap-1 shadow-2xs'>
                  <Tag size={12} />
                  {product.dealBadgeText || 'Limited time deal'}
                </span>
              </div>
            )}

            {/* Price Box */}
            <div className='flex flex-col gap-1 border-b border-gray-200 pb-4'>
              <div className='flex items-baseline gap-2'>
                {discountPercent > 0 && (
                  <span className='text-3xl font-light text-[#CC0C39] mr-1'>
                    -{discountPercent}%
                  </span>
                )}
                <div className='flex items-baseline font-sans text-[#0F1111]'>
                  <span className='text-sm font-normal align-super mr-0.5 mt-0.5'>$</span>
                  <span className='text-3xl sm:text-4xl font-normal leading-none tracking-tight'>
                    {dollars}
                  </span>
                  <span className='text-sm font-normal align-super ml-0.5'>{cents}</span>
                </div>
              </div>

              {originalPrice > price && (
                <div className='text-xs sm:text-sm text-[#565959]'>
                  List Price:{' '}
                  <span className='line-through'>
                    ${originalPrice.toFixed(2)}
                  </span>
                </div>
              )}

              <div className='text-xs sm:text-sm text-[#565959] mt-1 flex flex-col gap-1'>
                <div>
                  {product.shippingFeeType === 'FREE' ? (
                    <span className='font-semibold text-[#007600]'>FREE Shipping &amp; Import Charges to Bangladesh</span>
                  ) : (
                    <span>
                      ${Number(product.shippingCost || 0).toFixed(2)} Shipping &amp; Import Charges to Bangladesh
                    </span>
                  )}
                  <span className='text-[#007185] hover:underline cursor-pointer ml-1'>Details ▾</span>
                </div>
              </div>
            </div>

            {/* Amazon Color Swatch Cards Grid */}
            {(colors.length > 0 || product.availableColors.length > 0) && (
              <div className='flex flex-col gap-2 border-b border-gray-200 pb-4'>
                <div className='text-xs sm:text-sm text-[#0F1111]'>
                  <span className='text-gray-600'>Color:</span>{' '}
                  <span className='font-bold text-[#0F1111]'>
                    {colorNameMap[selectedVariant?.color || product.availableColors[0]] ||
                      selectedVariant?.color ||
                      product.availableColors[0] ||
                      '—'}
                  </span>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                  {(colors.length ? colors : product.availableColors).map((col) => {
                    const isSelected =
                      selectedVariant?.color === col ||
                      (!selectedVariant && product.availableColors[0] === col);
                    const matchingVariant = product.variants.find((v) => v.color === col);
                    const colPrice = matchingVariant ? activePrice(product, matchingVariant) : price;
                    return (
                      <button
                        key={col}
                        type='button'
                        onClick={() => handleSelectVariant('color', col)}
                        className={`group relative flex flex-col items-start p-2 rounded-md border text-left transition-all ${
                          isSelected
                            ? 'border-[#007185] ring-2 ring-[#007185]/30 bg-blue-50/20'
                            : 'border-gray-300 hover:border-gray-500 bg-white'
                        }`}
                      >
                        <div className='h-12 w-full rounded overflow-hidden relative mb-1.5 bg-gray-50 flex items-center justify-center'>
                          {matchingVariant?.image ? (
                            <Image
                              src={imageUrl(matchingVariant.image)}
                              alt={col}
                              fill
                              unoptimized
                              className='object-contain p-1'
                            />
                          ) : (
                            <span
                              className='block size-full rounded-xs'
                              style={{ backgroundColor: col || '#f2f2f3' }}
                            />
                          )}
                        </div>
                        <span className='text-xs font-semibold text-[#0F1111] truncate w-full'>
                          {colorNameMap[col] || col}
                        </span>
                        <span className='text-xs font-normal text-[#0F1111] mt-0.5'>
                          ${colPrice.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size / Storage / Material Options */}
            {sizes.length > 0 && (
              <div className='flex flex-col gap-2 border-b border-gray-200 pb-4'>
                <div className='text-xs sm:text-sm text-[#0F1111]'>
                  <span className='text-gray-600'>Size:</span>{' '}
                  <span className='font-bold'>{selectedVariant?.size || sizes[0]}</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {sizes.map((sz) => {
                    const isSelected = selectedVariant?.size === sz;
                    return (
                      <button
                        key={sz}
                        type='button'
                        onClick={() => handleSelectVariant('size', sz)}
                        className={`border rounded-md px-3.5 py-1.5 text-xs sm:text-sm transition-colors ${
                          isSelected
                            ? 'border-[#007185] ring-2 ring-[#007185]/30 bg-blue-50/20 font-bold text-[#0F1111]'
                            : 'border-gray-300 hover:border-gray-600 text-gray-800 bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Specifications Key Table */}
            <div className='flex flex-col gap-2 border-b border-gray-200 pb-4'>
              <h2 className='text-sm sm:text-base font-bold text-[#0F1111]'>Technical Specs</h2>
              <dl className='grid grid-cols-1 gap-y-2 text-xs sm:text-sm max-w-full'>
                <div className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1.5'>
                  <dt className='font-bold text-gray-700 col-span-1'>Brand</dt>
                  <dd className='text-gray-900 col-span-2'>{brandDisplayName}</dd>
                </div>
                <div className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1.5'>
                  <dt className='font-bold text-gray-700 col-span-1'>Color</dt>
                  <dd className='text-gray-900 col-span-2'>
                    {colorNameMap[selectedVariant?.color || product.availableColors[0]] ||
                      selectedVariant?.color ||
                      'True Black'}
                  </dd>
                </div>
                {product.sku && (
                  <div className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1.5'>
                    <dt className='font-bold text-gray-700 col-span-1'>Model / SKU</dt>
                    <dd className='text-gray-900 col-span-2'>{product.sku}</dd>
                  </div>
                )}
                {product.specifications?.map((spec) => (
                  <div key={spec.id || spec.name} className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1.5'>
                    <dt className='font-bold text-gray-700 col-span-1 capitalize'>{spec.name}</dt>
                    <dd className='text-gray-900 col-span-2 capitalize'>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Bullet List: About This Item */}
            <div className='flex flex-col gap-2.5 min-w-0 max-w-full overflow-hidden break-words'>
              <h2 className='text-base sm:text-lg font-bold text-[#0F1111]'>About this item</h2>
              {features.length > 0 ? (
                <ul className='list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#0F1111] leading-relaxed min-w-0 max-w-full overflow-hidden break-words [&_li]:break-words [&_li]:overflow-hidden [&_li]:max-w-full'>
                  {displayedFeatures.map((feat, idx) => (
                    <li key={idx} className='break-words max-w-full overflow-hidden'>{formatBulletPoint(feat)}</li>
                  ))}
                </ul>
              ) : (
                <p className='text-xs sm:text-sm text-[#0F1111] leading-relaxed break-words overflow-hidden max-w-full'>
                  {product.shortDescription || 'No additional details available.'}
                </p>
              )}

              {features.length > 6 && (
                <button
                  type='button'
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className='text-xs sm:text-sm font-medium text-[#007185] hover:text-[#C45500] hover:underline flex items-center gap-1 mt-1 w-fit cursor-pointer'
                >
                  {showAllFeatures ? (
                    <>
                      Show less <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown size={14} />
                    </>
                  )}
                </button>
              )}

              <div className='flex items-center gap-1.5 text-xs text-[#007185] hover:underline cursor-pointer mt-2'>

              </div>
            </div>
          </section>

          {/* Right Column: Amazon Buy Box Sidebar */}
          <aside aria-label="Purchase details" className='lg:col-span-3 sticky top-[144px] self-start min-w-0 max-w-full shrink-0 z-10'>
            <div className='border border-[#D5D9D9] rounded-lg p-4 bg-white shadow-2xs flex flex-col gap-3 text-xs sm:text-sm text-[#0F1111]'>
              {/* Buy Box Price */}
              <div className='flex items-baseline font-sans text-[#0F1111] border-b border-gray-100 pb-2'>
                <span className='text-sm font-normal align-super mr-0.5 mt-0.5'>$</span>
                <span className='text-3xl font-normal leading-none tracking-tight'>
                  {dollars}
                </span>
                <span className='text-sm font-normal align-super ml-0.5'>{cents}</span>
              </div>

              {/* Delivery info */}
              <div className='flex flex-col gap-2'>
                <div className='text-[#565959] text-xs sm:text-sm'>
                  {product.shippingFeeType === 'FREE' ? (
                    <span className='font-bold text-[#007600]'>FREE Delivery</span>
                  ) : (
                    <span>
                      ${Number(product.shippingCost || 0).toFixed(2)} Delivery &amp; Import Charges to Bangladesh
                    </span>
                  )}
                </div>

                <div className='text-[#0F1111] font-normal leading-normal text-xs sm:text-sm'>
                  Estimated delivery:{' '}
                  <span className='font-bold text-[#0F1111]'>
                    {getEstimatedDeliveryDate(product.minDeliveryDays, product.maxDeliveryDays)}
                  </span>
                </div>

                <div className='flex items-center gap-1 text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer pt-0.5 text-xs sm:text-sm'>
                  <MapPin size={15} className='text-gray-600 shrink-0' />
                  <span className='truncate'>
                    Deliver to Bangladesh
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div>
                {isOutOfStock ? (
                  <span className='text-base font-bold text-[#B12704]'>
                    Currently Unavailable.
                  </span>
                ) : product.stockQuantity > 0 && product.stockQuantity <= (product.lowStockAlertQuantity || 5) ? (
                  <span className='text-sm font-bold text-[#B12704]'>
                    Only {product.stockQuantity} left in stock - order soon.
                  </span>
                ) : (
                  <span className='text-lg font-medium text-[#007600]'>
                    In Stock
                  </span>
                )}
              </div>

              {/* Quantity dropdown */}
              {!isOutOfStock && (
                <div className='flex items-center gap-2 my-1'>
                  <label htmlFor='qty-select' className='text-xs sm:text-sm text-gray-700 font-medium'>
                    Quantity:
                  </label>
                  <select
                    id='qty-select'
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className='border border-gray-300 rounded-md bg-gray-100 px-3 py-1 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#E77600] focus:outline-hidden cursor-pointer shadow-2xs'
                  >
                    {Array.from({ length: Math.min(10, product.stockQuantity || 10) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex flex-col gap-2 mt-1'>
                <button
                  type='button'
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(false)}
                  className={`w-full py-2.5 px-4 rounded-full text-sm font-normal text-[#0F1111] shadow-2xs transition-colors cursor-pointer border text-center ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] border-[#FCD200]'
                  }`}
                >
                  Add to Cart
                </button>

                <button
                  type='button'
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(true)}
                  className={`w-full py-2.5 px-4 rounded-full text-sm font-normal text-[#0F1111] shadow-2xs transition-colors cursor-pointer border text-center ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-[#FFA41C] hover:bg-[#FF8F00] active:bg-[#E07E00] border-[#FF8F00]'
                  }`}
                >
                  Buy Now
                </button>
              </div>

              {/* Merchant / Dispatcher Info */}
              <dl className='grid grid-cols-3 gap-y-1.5 text-xs text-[#565959] border-t border-gray-200 pt-3 mt-1'>
                <dt className='col-span-1 text-gray-500'>Ships from</dt>
                <dd className='col-span-2 text-[#0F1111] font-medium truncate'>
                  {product.shipsFrom || 'Amazon.com'}
                </dd>

                <dt className='col-span-1 text-gray-500'>Sold by</dt>
                <dd className='col-span-2 text-[#007185] hover:underline cursor-pointer font-medium truncate'>
                  {brandDisplayName}
                </dd>

                <dt className='col-span-1 text-gray-500'>Returns</dt>
                <dd className='col-span-2 text-[#007185] hover:underline cursor-pointer leading-tight'>
                  {product.returnPolicy || '30-day refund / replacement'}
                </dd>

                <dt className='col-span-1 text-gray-500'>Payment</dt>
                <dd className='col-span-2 text-[#007185] hover:underline cursor-pointer flex items-center gap-1'>
                  <Lock size={12} className='text-gray-600' />
                  Secure transaction
                </dd>
              </dl>

              {/* Wishlist Button */}
              <div className='border-t border-gray-200 pt-3 mt-1'>
                <button
                  type='button'
                  disabled={toggleWishlistMutation.isPending}
                  onClick={handleToggleWishlist}
                  className={`w-full border border-[#D5D9D9] rounded-lg py-1.5 px-3 text-xs sm:text-sm font-normal transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isWishlisted
                      ? 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100'
                      : 'bg-gray-100 text-[#0F1111] hover:bg-gray-200'
                  }`}
                >
                  {toggleWishlistMutation.isPending ? (
                    <Loader2 size={15} className='animate-spin text-current' />
                  ) : (
                    <Heart
                      size={15}
                      className={isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'}
                    />
                  )}
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to List'}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Detailed Seller Item Description */}
        <section className='mt-12 border-t border-gray-200 pt-8'>
          <h2 className='text-xl sm:text-2xl font-bold text-[#0F1111] mb-4'>Product Description</h2>
          <div className='bg-gray-50/60 p-6 rounded-lg border border-gray-200 text-sm sm:text-base font-normal text-[#0F1111] leading-relaxed break-words overflow-hidden max-w-full [&_*]:!font-normal [&_*]:!bg-transparent [&_*]:!color-inherit [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5'>
            {product.detailedDescription ? (
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeDescriptionHtml(product.detailedDescription) }}
                className='space-y-4 font-normal'
              />
            ) : (
              <p className='font-normal'>{product.shortDescription || 'No seller description provided for this product.'}</p>
            )}
          </div>
        </section>

        {/* Related Products Carousel / Grid */}
        {(related.data?.length ?? 0) > 0 && (
          <section className='mt-12 border-t border-gray-200 pt-8'>
            <h2 className='text-xl sm:text-2xl font-bold text-[#0F1111] mb-6'>Deals on Related Products</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
              {related.data?.slice(0, 6).map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`}>
                  <ProductCard
                    imageSrc={imageUrl(item.thumbnail)}
                    imageAlt={item.name}
                    title={item.name}
                    price={`$${Number(activePrice(item)).toFixed(2)}`}
                    shippingText={
                      item.shippingFeeType === 'FREE' ? 'FREE Delivery' : 'Shipping available'
                    }
                    buttonVariant='none'
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <div id='customer-reviews' className='mt-12 border-t border-gray-200 pt-8'>
          <CustomerReviewsSection />
        </div>

        {/* Browsing History */}
        <div className='mt-8'>
          <BrowsingHistorySection />
        </div>

        {/* Sign Up Banner */}
        <div className='mt-8'>
          <SignUpBanner />
        </div>
      </main>

      {/* Image Lightbox Modal */}
      {lightboxOpen && (
        <div className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs'>
          <div className='relative max-w-4xl w-full aspect-square bg-white rounded-lg p-4 overflow-hidden flex items-center justify-center'>
            <button
              type='button'
              onClick={() => setLightboxOpen(false)}
              className='absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 z-10'
            >
              <X size={20} />
            </button>
            <Image
              src={imageUrl(activeMainImage)}
              alt={product.name}
              fill
              unoptimized
              className='object-contain p-6'
            />
          </div>
        </div>
      )}
    </div>
  );
}
