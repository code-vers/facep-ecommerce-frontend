'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  ChevronLeft,
  Share2,
  ShoppingCart,
  Star,
  MapPin,
  Heart,
  Lock,
  ShieldCheck,
  Tag,
  Loader2,
  ExternalLink,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProductModal } from '@/contexts/ProductModalContext';
import { useCartStore } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckWishlistStatus, useToggleWishlist } from '@/hooks/api/useWishlist';
import type { Product, ProductVariant } from '@/lib/api/product';
import { getImageUrl } from '@/lib/utils';

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

const getEstimatedDeliveryDate = (minDays = 3, maxDays = 7) => {
  const now = new Date();
  const minDate = new Date(now);
  minDate.setDate(now.getDate() + minDays);
  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + maxDays);
  const format = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${format(minDate)} - ${format(maxDate)}`;
};

export default function MobileProductModal() {
  const { isOpen, product, previewData, isLoading, closeProductModal } = useProductModal();
  const router = useRouter();
  const { addToCart, items: cartItems } = useCartStore();
  const { session } = useAuth();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [, setShowAllFeatures] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [failedThumbnails, setFailedThumbnails] = useState<Record<string, boolean>>({});

  // Sync state whenever product changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageError(false);
    setFailedThumbnails({});
    if (product) {
      setSelectedImage(
        product.thumbnail ||
        product.previewImages?.[0] ||
        previewData?.imageSrc ||
        ''
      );
      setSelectedVariantId(product.variants?.[0]?.id || '');
      setQuantity(1);
      setShowAllFeatures(false);
    } else if (previewData?.imageSrc) {
      setSelectedImage(previewData.imageSrc);
    }
  }, [product, previewData]);

  // Reset image error whenever active image changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageError(false);
  }, [selectedImage]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeProductModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeProductModal]);

  // Wishlist hooks
  const productId = product?.id || previewData?.id || '';
  const { data: wishlistStatus } = useCheckWishlistStatus(productId);
  const toggleWishlistMutation = useToggleWishlist();
  const isWishlisted = Boolean(wishlistStatus?.isWishlisted);

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v.id === selectedVariantId),
    [product?.variants, selectedVariantId],
  );

  const sizes = useMemo(
    () => [...new Set(product?.variants?.map((v) => v.size).filter(Boolean))] as string[],
    [product?.variants],
  );
  const colors = useMemo(
    () => [...new Set(product?.variants?.map((v) => v.color).filter(Boolean))] as string[],
    [product?.variants],
  );

  const images = useMemo(() => {
    if (!product) return previewData?.imageSrc ? [previewData.imageSrc] : [];
    const list = [
      product.thumbnail,
      ...(product.previewImages || []),
      ...(product.variants?.map((v) => v.image).filter(Boolean) || []),
    ].filter(Boolean) as string[];
    return [...new Set(list)];
  }, [product, previewData]);

  const activeMainImage = selectedImage || selectedVariant?.image || product?.thumbnail || previewData?.imageSrc || '/placeholder.png';

  const price = product ? activePrice(product, selectedVariant) : parseFloat(String(previewData?.price || '99.99').replace(/[^0-9.]/g, '')) || 99.99;
  const originalPrice = product
    ? Number(selectedVariant?.price ?? product.oldPrice ?? product.basePrice)
    : parseFloat(String(previewData?.originalPrice || '0').replace(/[^0-9.]/g, '')) || price * 1.25;
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const dollars = Math.floor(price);
  const cents = Math.round((price - dollars) * 100)
    .toString()
    .padStart(2, '0');

  const brandDisplayName =
    product?.vendor?.storefront?.storeName ||
    product?.brand ||
    product?.vendor?.name ||
    'Facep Verified Store';

  const handleSelectVariant = (key: 'size' | 'color', value: string) => {
    if (!product) return;
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

  const handleToggleWishlist = async () => {
    if (!session) {
      toast.error('Please log in first', {
        description: 'You need an account to save items to your wishlist.',
      });
      return;
    }
    if (!productId) return;

    try {
      const res = await toggleWishlistMutation.mutateAsync(productId);
      if (res.isWishlisted) {
        toast.success('Added to Wishlist', {
          description: `${product?.name || 'Item'} saved to your wishlist.`,
        });
      } else {
        toast.info('Removed from Wishlist', {
          description: `${product?.name || 'Item'} removed from your wishlist.`,
        });
      }
    } catch {
      toast.error('Wishlist Action Failed', {
        description: 'Unable to update wishlist. Please try again.',
      });
    }
  };

  const handleAddToCart = (redirect: boolean) => {
    const itemToAdd = {
      id: product?.id || `prod-${previewData?.slug || 'item'}`,
      cartItemId: `${product?.id || 'item'}-${selectedVariant?.color || ''}-${selectedVariant?.size || ''}`,
      name: product?.name || previewData?.title || 'Selected Product',
      slug: product?.slug || previewData?.slug || 'product',
      price: price,
      quantity: quantity,
      image: activeMainImage,
      sellerName: brandDisplayName,
      color: selectedVariant?.color || undefined,
      size: selectedVariant?.size || undefined,
      availableVariants: product?.variants || [],
      availableColors: product?.availableColors || [],
      shippingCost: product?.shippingFeeType === 'FREE' ? 0 : Number(product?.shippingCost) || 0,
    };

    addToCart(itemToAdd);

    if (redirect) {
      closeProductModal();
      router.push('/cart');
    } else {
      toast.success('Added to Cart', {
        description: `${quantity}x ${itemToAdd.name} added to your shopping cart.`,
      });
    }
  };

  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/products/${product?.slug || previewData?.slug || ''}` : '';
    if (navigator.share) {
      navigator.share({
        title: product?.name || previewData?.title || 'Facep Product',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link Copied', { description: 'Product link copied to clipboard!' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-100 flex items-center justify-center bg-black/75 backdrop-blur-sm transition-opacity p-0 sm:p-4 md:p-6 animate-in fade-in duration-200'
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProductModal();
      }}
      role='dialog'
      aria-modal='true'
      aria-label='Product Quick View'
    >
      {/* Floating Close Button for Desktop */}
      <button
        type='button'
        onClick={closeProductModal}
        className='hidden sm:flex absolute top-5 right-6 z-110 size-10 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center backdrop-blur-md transition-colors border border-white/20 cursor-pointer shadow-lg'
        title='Close (Esc)'
        aria-label='Close modal'
      >
        <X size={20} />
      </button>

      {/* ── Mobile Phone Frame Container ── */}
      <div className='relative w-full h-dvh sm:h-[92vh] sm:max-h-215 sm:max-w-105 bg-white sm:rounded-[40px] sm:border-8 sm:border-[#1a1c22] shadow-[0_25px_80px_rgba(0,0,0,0.65)] sm:ring-1 sm:ring-white/20 flex flex-col overflow-hidden text-[#0F1111] animate-in zoom-in-95 duration-200'>
        
        {/* Dynamic Island / Top Bezel for phone styling */}
        <div className='hidden sm:flex items-center justify-center pt-2 pb-1 bg-[#1a1c22] w-full shrink-0 select-none'>
          <div className='w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 ring-1 ring-white/10'>
            <div className='size-2 rounded-full bg-[#111] ring-1 ring-white/10' />
            <div className='size-1 rounded-full bg-blue-900/60' />
          </div>
        </div>

        {/* ── Mobile Top App Header ── */}
        <header className='sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-gray-100 bg-white/95 px-3 backdrop-blur-md shrink-0 shadow-2xs'>
          <div className='flex items-center gap-1.5'>
            <button
              type='button'
              onClick={closeProductModal}
              className='flex size-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer'
              aria-label='Go back'
            >
              <ChevronLeft size={24} />
            </button>
            <span className='text-xs font-semibold uppercase tracking-wider text-gray-500 truncate max-w-42.5'>
              {brandDisplayName}
            </span>
          </div>

          <div className='flex items-center gap-1'>
            {/* Share */}
            <button
              type='button'
              onClick={handleShare}
              className='flex size-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer'
              title='Share'
              aria-label='Share product'
            >
              <Share2 size={18} />
            </button>

            {/* Cart with count badge */}
            <button
              type='button'
              onClick={() => {
                closeProductModal();
                router.push('/cart');
              }}
              className='relative flex size-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer'
              title='Shopping Cart'
              aria-label='Shopping cart'
            >
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className='absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#CC0C39] text-[10px] font-bold text-white shadow-xs'>
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Close X */}
            <button
              type='button'
              onClick={closeProductModal}
              className='flex size-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer'
              title='Close'
              aria-label='Close'
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* ── Scrollable Mobile Content ── */}
        <div className='flex-1 overflow-y-auto overscroll-contain pb-28 scrollbar-none'>
          
          {/* Loading Skeleton if no data yet */}
          {isLoading && !product && !previewData ? (
            <div className='flex flex-col gap-4 p-4 animate-pulse'>
              <div className='aspect-square w-full rounded-2xl bg-gray-200' />
              <div className='h-6 w-3/4 rounded bg-gray-200' />
              <div className='h-4 w-1/2 rounded bg-gray-200' />
              <div className='h-10 w-full rounded bg-gray-200' />
            </div>
          ) : (
            <div className='flex flex-col'>
              
              {/* ── 1. Image Showcase Area ── */}
              <div className='relative aspect-square w-full bg-white border-b border-gray-100 flex items-center justify-center p-3'>
                
                {/* Floating Discount Tag */}
                {discountPercent > 0 && (
                  <div className='absolute top-3 left-3 z-10 flex items-center gap-1 rounded-sm bg-[#CC0C39] px-2 py-0.5 text-xs font-bold text-white shadow-xs'>
                    <Tag size={12} />
                    <span>{discountPercent}% OFF</span>
                  </div>
                )}

                {/* Floating Wishlist Heart */}
                <button
                  type='button'
                  onClick={handleToggleWishlist}
                  disabled={toggleWishlistMutation.isPending}
                  className='absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer'
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {toggleWishlistMutation.isPending ? (
                    <Loader2 size={16} className='animate-spin text-gray-600' />
                  ) : (
                    <Heart
                      size={18}
                      className={isWishlisted ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-600'}
                    />
                  )}
                </button>

                {/* Main Product Image */}
                <div className='relative size-full overflow-hidden'>
                  <Image
                    src={imageError ? '/placeholder.png' : getImageUrl(activeMainImage)}
                    alt={product?.name || previewData?.title || 'Product image'}
                    fill
                    unoptimized
                    priority
                    onError={() => setImageError(true)}
                    className='object-contain p-2'
                  />
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className='flex gap-2 overflow-x-auto px-4 py-2 border-b border-gray-100 bg-gray-50/50 scrollbar-none'>
                  {images.map((img, idx) => {
                    const isSelected = activeMainImage === img;
                    return (
                      <button
                        key={idx}
                        type='button'
                        onClick={() => setSelectedImage(img)}
                        className={`relative size-12 rounded-md border shrink-0 overflow-hidden bg-white transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#007185] ring-2 ring-[#007185]/40 shadow-xs'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <Image
                          src={failedThumbnails[img] ? '/placeholder.png' : getImageUrl(img)}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          unoptimized
                          onError={() => setFailedThumbnails((prev) => ({ ...prev, [img]: true }))}
                          className='object-contain p-0.5'
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── 2. Product Information Block ── */}
              <div className='flex flex-col gap-3.5 p-4'>
                
                {/* Store Link & Title */}
                <div>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-semibold text-[#007185] hover:underline flex items-center gap-1 cursor-pointer'>
                      Visit the {brandDisplayName}
                      <ExternalLink size={11} />
                    </span>
                    <span className='text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>
                      {product?.condition || 'NEW'}
                    </span>
                  </div>

                  <h1 className='text-[17px] font-bold text-[#0F1111] leading-snug mt-1'>
                    {product?.name || previewData?.title}
                  </h1>
                </div>

                {/* Ratings Row */}
                <div className='flex items-center gap-2 text-xs'>
                  <div className='flex items-center text-[#FFA41C]'>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < 4 ? 'fill-[#FFA41C] text-[#FFA41C]' : 'fill-[#FFA41C] text-[#FFA41C] opacity-80'}
                      />
                    ))}
                  </div>
                  <span className='font-bold text-gray-800'>4.7</span>
                  <span className='text-gray-400'>•</span>
                  <span className='text-[#007185] font-medium'>
                    {previewData?.reviewCount || '4,470 ratings'}
                  </span>
                  <span className='text-gray-400'>•</span>
                  <span className='text-gray-600 font-medium'>1K+ bought</span>
                </div>

                {/* Price Display */}
                <div className='flex flex-col gap-0.5 rounded-lg bg-gray-50/80 p-3 border border-gray-100'>
                  <div className='flex items-baseline gap-2'>
                    {discountPercent > 0 && (
                      <span className='text-2xl font-light text-[#CC0C39]'>
                        -{discountPercent}%
                      </span>
                    )}
                    <div className='flex items-baseline font-sans text-[#0F1111]'>
                      <span className='text-xs font-normal align-super mr-0.5'>$</span>
                      <span className='text-3xl font-bold leading-none tracking-tight'>{dollars}</span>
                      <span className='text-xs font-normal align-super ml-0.5'>{cents}</span>
                    </div>
                  </div>

                  {originalPrice > price && (
                    <div className='text-xs text-[#565959] mt-0.5'>
                      Typical price: <span className='line-through'>${originalPrice.toFixed(2)}</span>
                    </div>
                  )}

                  <div className='text-xs text-[#007600] font-medium mt-1 flex items-center gap-1'>
                    <Check size={14} />
                    <span>Free Shipping &amp; Returns to Bangladesh</span>
                  </div>
                </div>

                {/* ── 3. Color Swatches (if available) ── */}
                {colors.length > 0 && (
                  <div className='flex flex-col gap-2 pt-1 border-t border-gray-100'>
                    <div className='text-xs text-gray-600'>
                      Color:{' '}
                      <span className='font-bold text-gray-900'>
                        {selectedVariant?.color || colors[0]}
                      </span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {colors.map((col) => {
                        const isSelected = (selectedVariant?.color || colors[0]) === col;
                        const matchingVar = product?.variants?.find((v) => v.color === col);
                        return (
                          <button
                            key={col}
                            type='button'
                            onClick={() => handleSelectVariant('color', col)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#007185] ring-2 ring-[#007185]/30 bg-blue-50/30 text-[#007185]'
                                : 'border-gray-300 hover:border-gray-500 bg-white text-gray-800'
                            }`}
                          >
                            <span
                              className='size-3 rounded-full border border-black/10 shrink-0'
                              style={{ backgroundColor: col }}
                            />
                            <span>{col}</span>
                            {matchingVar?.price && (
                              <span className='text-gray-500 font-normal'>
                                (${Number(matchingVar.price).toFixed(0)})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── 4. Size Options (if available) ── */}
                {sizes.length > 0 && (
                  <div className='flex flex-col gap-2 pt-1 border-t border-gray-100'>
                    <div className='text-xs text-gray-600'>
                      Size:{' '}
                      <span className='font-bold text-gray-900'>
                        {selectedVariant?.size || sizes[0]}
                      </span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {sizes.map((sz) => {
                        const isSelected = (selectedVariant?.size || sizes[0]) === sz;
                        return (
                          <button
                            key={sz}
                            type='button'
                            onClick={() => handleSelectVariant('size', sz)}
                            className={`rounded-md border px-3.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#007185] ring-2 ring-[#007185]/30 bg-blue-50/30 text-[#007185] font-bold'
                                : 'border-gray-300 hover:border-gray-500 bg-white text-gray-800'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── 5. Delivery & Stock Info ── */}
                <div className='flex flex-col gap-1.5 rounded-lg border border-gray-200 p-3 bg-white text-xs'>
                  <div className='flex items-center gap-1.5 text-[#007600] font-bold text-sm'>
                    <ShieldCheck size={16} />
                    <span>In Stock</span>
                  </div>

                  <div className='text-gray-700'>
                    Estimated Delivery:{' '}
                    <span className='font-bold text-gray-900'>
                      {getEstimatedDeliveryDate(product?.minDeliveryDays, product?.maxDeliveryDays)}
                    </span>
                  </div>

                  <div className='flex items-center gap-1 text-[#007185] font-medium pt-0.5'>
                    <MapPin size={14} className='shrink-0' />
                    <span>Deliver to Bangladesh</span>
                  </div>
                </div>

                {/* ── 6. Quantity Selector ── */}
                <div className='flex items-center justify-between border-y border-gray-100 py-3'>
                  <span className='text-xs font-medium text-gray-700'>Quantity:</span>
                  <div className='flex items-center rounded-lg border border-gray-300 bg-gray-50'>
                    <button
                      type='button'
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className='flex size-8 items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-30 rounded-l-lg transition-colors cursor-pointer'
                      aria-label='Decrease quantity'
                    >
                      <Minus size={14} />
                    </button>
                    <span className='w-8 text-center text-xs font-bold text-gray-900'>
                      {quantity}
                    </span>
                    <button
                      type='button'
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      disabled={quantity >= 10}
                      className='flex size-8 items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-30 rounded-r-lg transition-colors cursor-pointer'
                      aria-label='Increase quantity'
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* ── 7. Primary Action Buttons ── */}
                <div className='flex flex-col gap-2.5 pt-1'>
                  <button
                    type='button'
                    onClick={() => handleAddToCart(false)}
                    className='w-full rounded-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] border border-[#FCD200] py-3 text-center text-sm font-semibold text-[#0F1111] shadow-xs transition-colors cursor-pointer'
                  >
                    Add to Cart
                  </button>

                  <button
                    type='button'
                    onClick={() => handleAddToCart(true)}
                    className='w-full rounded-full bg-[#FFA41C] hover:bg-[#FF8F00] active:bg-[#E07E00] border border-[#FF8F00] py-3 text-center text-sm font-semibold text-[#0F1111] shadow-xs transition-colors cursor-pointer'
                  >
                    Buy Now
                  </button>
                </div>

                {/* ── 8. Key Features / About this item ── */}
                <div className='flex flex-col gap-2 pt-3 border-t border-gray-100'>
                  <h2 className='text-sm font-bold text-[#0F1111]'>About this item</h2>
                  <div className='text-xs leading-relaxed text-gray-700 space-y-2'>
                    {product?.keyFeatures ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: product.keyFeatures }}
                        className='prose prose-xs max-w-none'
                      />
                    ) : product?.shortDescription ? (
                      <p>{product.shortDescription}</p>
                    ) : (
                      <ul className='list-disc pl-4 space-y-1.5'>
                        <li>High quality guaranteed authentic materials and precision engineering.</li>
                        <li>Designed for supreme convenience, durability and everyday comfort.</li>
                        <li>Backed by 1-year Facep full replacement and service guarantee.</li>
                        <li>Compatible with standard accessories and universal charging inputs.</li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* ── 9. Technical Specifications ── */}
                <div className='flex flex-col gap-2 pt-3 border-t border-gray-100'>
                  <h2 className='text-sm font-bold text-[#0F1111]'>Product Specifications</h2>
                  <dl className='grid grid-cols-1 gap-y-1.5 text-xs'>
                    <div className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1'>
                      <dt className='font-bold text-gray-500'>Brand</dt>
                      <dd className='col-span-2 text-gray-800 font-medium'>{brandDisplayName}</dd>
                    </div>
                    <div className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1'>
                      <dt className='font-bold text-gray-500'>Condition</dt>
                      <dd className='col-span-2 text-gray-800 font-medium'>{product?.condition || 'New'}</dd>
                    </div>
                    {product?.sku && (
                      <div className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1'>
                        <dt className='font-bold text-gray-500'>SKU / Model</dt>
                        <dd className='col-span-2 text-gray-800 font-medium'>{product.sku}</dd>
                      </div>
                    )}
                    {product?.specifications?.map((spec) => (
                      <div key={spec.id || spec.name} className='grid grid-cols-3 gap-2 border-b border-gray-100 pb-1'>
                        <dt className='font-bold text-gray-500 capitalize'>{spec.name}</dt>
                        <dd className='col-span-2 text-gray-800 font-medium capitalize'>{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* ── 10. Trust & Merchant Breakdown ── */}
                <div className='flex flex-col gap-1.5 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Ships from</span>
                    <span className='font-medium text-gray-900'>{product?.shipsFrom || 'Facep Warehouse'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Sold by</span>
                    <span className='font-medium text-[#007185]'>{brandDisplayName}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Returns</span>
                    <span className='font-medium text-[#007185]'>30-day refund / replacement</span>
                  </div>
                  <div className='flex justify-between items-center pt-1 border-t border-gray-200/60 mt-0.5'>
                    <span className='text-gray-500 flex items-center gap-1'>
                      <Lock size={11} /> Secure transaction
                    </span>
                    <span className='text-[#007600] font-medium'>Encrypted SSL</span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* ── Sticky Mobile Bottom Action Bar (Gold standard e-commerce UI) ── */}
        <div className='absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.06)]'>
          <div className='flex flex-col'>
            <span className='text-[10px] font-semibold uppercase text-gray-500'>Total</span>
            <span className='text-base font-bold text-[#0F1111] leading-none'>
              ${(price * quantity).toFixed(2)}
            </span>
          </div>

          <div className='flex items-center gap-2 flex-1 justify-end'>
            <button
              type='button'
              onClick={() => handleAddToCart(false)}
              className='flex-1 max-w-32.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] border border-[#FCD200] py-2 text-center text-xs font-semibold text-[#0F1111] shadow-2xs transition-colors cursor-pointer'
            >
              Add to Cart
            </button>
            <button
              type='button'
              onClick={() => handleAddToCart(true)}
              className='flex-1 max-w-32.5 rounded-full bg-[#FFA41C] hover:bg-[#FF8F00] active:bg-[#E07E00] border border-[#FF8F00] py-2 text-center text-xs font-semibold text-[#0F1111] shadow-2xs transition-colors cursor-pointer'
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Bottom Home Indicator for phone styling */}
        <div className='hidden sm:flex items-center justify-center py-1 bg-white shrink-0 select-none'>
          <div className='w-32 h-1 bg-gray-300 rounded-full' />
        </div>

      </div>
    </div>
  );
}
