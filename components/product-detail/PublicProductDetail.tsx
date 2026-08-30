'use client';

import BrowsingHistorySection from '@/components/product-detail/BrowsingHistorySection';
import CustomerReviewsSection from '@/components/product-detail/CustomerReviewsSection';
import ProductCard from '@/components/shared/ProductCard';
import SignUpBanner from '@/components/shared/SignUpBanner';
import { useRelatedProducts } from '@/hooks/api/useProduct';
import type { Product, ProductVariant } from '@/lib/api/product';
import { ExternalLink, MapPin, Star, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckWishlistStatus, useToggleWishlist } from '@/hooks/api/useWishlist';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value: string) =>
  value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
const money = (value: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
const plainText = (value?: string | null) =>
  value?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';

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

const splitFeatures = (value?: string | null) => {
  const text = plainText(value);
  if (!text) return [];
  const parts = text
    .split(/\n+|[•●▪]\s*|(?=\[[^\]]+\])|(?=【[^】]+】)/)
    .map((item) => item.trim().replace(/^[-–]\s*/, ''))
    .filter(Boolean);
  return parts.length > 1 ? parts : [text];
};

const colorNameMap: Record<string, string> = {
  '#F09000': 'Yellow/Orange', '#1F8394': 'Teal', '#EAB308': 'Yellow',
  '#29941F': 'Green', '#941F21': 'Red', '#86941F': 'Olive',
  '#231F94': 'Blue', '#121212': 'Black', '#FBFEFF': 'White',
  '#A45496': 'Purple', '#989A98': 'Gray', '#3DC4C4': 'Cyan',
  '#BF97CF': 'Lavender', '#8B8AA4': 'Slate'
};

export default function PublicProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const related = useRelatedProducts(product.slug);
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
  const sizes = useMemo(() => [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[], [product]);
  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[], [product]);
  const materials = useMemo(() => [...new Set(product.variants.map((v) => v.material).filter(Boolean))] as string[], [product]);
  const storages = useMemo(() => [...new Set(product.variants.map((v) => v.storage).filter(Boolean))] as string[], [product]);

  const handleSelectVariant = (key: 'size' | 'color' | 'material' | 'storage', value: string) => {
    const current = selectedVariant || product.variants[0];
    const target = product.variants.find((v) =>
      v[key] === value &&
      (key === 'color' ? true : v.color === current?.color)
    ) || product.variants.find((v) => v[key] === value);

    if (target) {
      setSelectedVariantId(target.id!);
      if (target.image) setSelectedImage(target.image);
    }
  };

  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK' || product.stockQuantity <= 0 || (selectedVariant && selectedVariant.stock <= 0);

  const router = useRouter();
  const { addToCart } = useCartStore();
  const { session } = useAuth();
  const { data: wishlistStatus, isLoading: isWishlistLoading } = useCheckWishlistStatus(product.id);
  const toggleWishlistMutation = useToggleWishlist();
  const isWishlisted = Boolean(wishlistStatus?.isWishlisted);

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
          description: `${product.name} has been added to your wishlist.`,
        });
      } else {
        toast.info('Removed from Wishlist', {
          description: `${product.name} has been removed from your wishlist.`,
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
      cartItemId: `${product.id}-${selectedVariant?.color||''}-${selectedVariant?.size||''}-${selectedVariant?.storage||''}-${selectedVariant?.material||''}`,
      name: product.name,
      slug: product.slug,
      price: price,
      quantity: 1,
      image: selectedVariant?.image || selectedImage || product.thumbnail,
      sellerName: seller,
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
      shippingCost: product.shippingFeeType === 'FREE' ? 0 : (Number(product.shippingCost) || 0),
    });

    if (redirect) {
      router.push('/cart');
    } else {
      toast.success('Added to Cart', { description: `${product.name} has been added to your cart.` });
    }
  };

  const images = useMemo(
    () =>
      [...new Set([product.thumbnail, ...product.previewImages, ...product.variants.map((v) => v.image).filter(Boolean)])] as string[],
    [product],
  );
  const galleryImages = images.slice(0, 4);
  const price = activePrice(product, selectedVariant);
  const originalPrice = Number(selectedVariant?.price ?? product.oldPrice ?? product.basePrice);
  const seller = product.vendor?.name || product.shipsFrom;
  const specifications = product.specifications.slice(0, 4);
  const features = splitFeatures(product.keyFeatures || product.detailedDescription);

  return (
    <div className='min-h-screen bg-white'>
      <section className='w-full'>
        <div className='mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-5 sm:py-8 lg:px-10 xl:px-20 xl:py-12.5'>
          <div className='flex flex-col items-start gap-8 xl:flex-row xl:gap-14'>
            <div className='flex min-w-0 flex-1 flex-col gap-8 md:flex-row xl:gap-12'>
              <div className='flex w-full shrink-0 flex-col gap-6 md:w-[56%] xl:w-175'>
                <div className='relative aspect-square w-full overflow-hidden bg-white'>
                  <Image
                    src={imageUrl(selectedVariant?.image || selectedImage)}
                    alt={product.name}
                    fill
                    priority
                    unoptimized
                    className='object-cover'
                    sizes='(max-width: 1279px) 56vw, 700px'
                  />
                </div>
                <div className='grid w-full grid-cols-4 gap-3'>
                  {galleryImages.map((image) => (
                    <button
                      key={image}
                      type='button'
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View ${product.name}`}
                      className={`relative aspect-square overflow-hidden bg-white ${
                        selectedImage === image ? 'outline outline-[#686F7D]' : ''
                      }`}
                    >
                      <Image src={imageUrl(image)} alt='' fill unoptimized className='object-cover' />
                    </button>
                  ))}
                </div>
              </div>

              <div className='flex min-w-0 flex-1 flex-col gap-4'>
                <div className='flex flex-col gap-2 border-b border-[#E5E5E6] pb-4.5'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-start gap-1.75 text-[16px] leading-[1.2] text-[#165DD0]'>
                      <span>Brand: {product.brand || '—'}</span>
                      <ExternalLink size={18} strokeWidth={1.6} />
                    </div>
                    <button
                      type='button'
                      onClick={handleToggleWishlist}
                      disabled={toggleWishlistMutation.isPending}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        isWishlisted
                          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      {toggleWishlistMutation.isPending ? (
                        <Loader2 size={15} className='animate-spin text-current' />
                      ) : (
                        <Heart
                          size={15}
                          className={`${isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'}`}
                        />
                      )}
                      <span>
                        {toggleWishlistMutation.isPending
                          ? 'Saving...'
                          : isWishlisted
                          ? 'In Wishlist'
                          : 'Wishlist'}
                      </span>
                    </button>
                  </div>
                  <h1 className='font-[Arial] text-[28px] font-normal leading-[1.2] text-[#42454D]'>
                    {product.name}
                  </h1>
                  <div className='flex items-center gap-1.5'>
                    <div className='flex items-center gap-px'>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} size={16} fill='#DEC33A' className='text-[#DEC33A]' />
                      ))}
                    </div>
                    <span className='text-[12px] leading-[1.3] text-black'>4.7 (4,470) |</span>
                    <span className='text-[12px] leading-[1.3] text-[#165DD0]'>67 reviews</span>
                  </div>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-end gap-3 font-[Arial] text-[#42454D]'>
                      <span className='text-[36px] font-bold leading-[1.2] text-red-600'>{money(price)}</span>
                      {price < originalPrice && (
                        <span className='text-[20px] leading-[1.2] text-gray-500 line-through mb-1'>{money(originalPrice)}</span>
                      )}
                    </div>
                    {product.dealBadgeText && price < originalPrice && (
                       <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded w-max">
                         {product.dealBadgeText}
                       </span>
                    )}
                  </div>

                  {(colors.length > 0 || product.availableColors.length > 0) && (
                    <div className='flex flex-col gap-2'>
                      <strong className='font-semibold text-[16px] text-black'>
                        Color: {colorNameMap[selectedVariant?.color || product.availableColors[0]] || selectedVariant?.color || product.availableColors[0] || '—'}
                      </strong>
                      <div className='flex flex-wrap gap-2'>
                        {(colors.length ? colors : product.availableColors).map((color) => (
                          <button
                            key={color}
                            type='button'
                            onClick={() => handleSelectVariant('color', color)}
                            className={`h-8 w-8 rounded-full border-2 p-0.5 ${
                              selectedVariant?.color === color || (!selectedVariant && product.availableColors[0] === color) ? 'border-[#686F7D]' : 'border-transparent'
                            }`}
                            aria-label={`Select ${color}`}
                          >
                            <span className='block size-full rounded-full border border-gray-200' style={{ backgroundColor: color || '#f2f2f3' }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {sizes.length > 0 && (
                    <div className='flex flex-col gap-2'>
                      <strong className='font-semibold text-[16px] text-black'>Size: {selectedVariant?.size || '—'}</strong>
                      <div className='flex flex-wrap gap-2'>
                        {sizes.map((size) => (
                          <button
                            key={size}
                            type='button'
                            onClick={() => handleSelectVariant('size', size)}
                            className={`border px-3 py-1.5 text-[14px] transition-colors hover:bg-gray-50 ${
                              selectedVariant?.size === size ? 'border-black bg-gray-50 font-medium' : 'border-gray-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {storages.length > 0 && (
                    <div className='flex flex-col gap-2'>
                      <strong className='font-semibold text-[16px] text-black'>Storage: {selectedVariant?.storage || '—'}</strong>
                      <div className='flex flex-wrap gap-2'>
                        {storages.map((storage) => (
                          <button
                            key={storage}
                            type='button'
                            onClick={() => handleSelectVariant('storage', storage)}
                            className={`border px-3 py-1.5 text-[14px] transition-colors hover:bg-gray-50 ${
                              selectedVariant?.storage === storage ? 'border-black bg-gray-50 font-medium' : 'border-gray-300'
                            }`}
                          >
                            {storage}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {materials.length > 0 && (
                    <div className='flex flex-col gap-2'>
                      <strong className='font-semibold text-[16px] text-black'>Material: {selectedVariant?.material || '—'}</strong>
                      <div className='flex flex-wrap gap-2'>
                        {materials.map((material) => (
                          <button
                            key={material}
                            type='button'
                            onClick={() => handleSelectVariant('material', material)}
                            className={`border px-3 py-1.5 text-[14px] transition-colors hover:bg-gray-50 ${
                              selectedVariant?.material === material ? 'border-black bg-gray-50 font-medium' : 'border-gray-300'
                            }`}
                          >
                            {material}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div className='flex flex-col gap-4 text-black mt-4'>
                  <h2 className='text-[22px] leading-[1.2]'>Product details</h2>
                  <dl className='flex flex-col gap-2 text-[16px]'>
                    <div className='flex gap-1'><dt className='font-semibold min-w-30'>Brand:</dt><dd>{product.brand || '—'}</dd></div>
                    {specifications.map((item) => (
                      <div key={item.id || item.name} className='flex gap-1'>
                        <dt className='font-semibold min-w-30'>{item.name}:</dt><dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className='flex flex-col gap-4 text-black mt-2'>
                  <h2 className='text-[22px] leading-[1.2]'>About this item</h2>
                  {features.length ? (
                    <ul className='list-disc pl-5.25 text-[14px] leading-[1.3]'>
                      {features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  ) : (
                    <p className='text-[14px] leading-[1.3]'>{product.shortDescription}</p>
                  )}
                  {features.length > 5 && <span className='text-[12px] leading-[1.3] text-[#165DD0] cursor-pointer'>See More</span>}
                </div>
              </div>
            </div>

            <aside className='flex w-full shrink-0 flex-col gap-6 border border-[#E5E5E6] bg-[#F2F2F3] p-6 xl:w-[453.75px]'>
              <div className='flex flex-col gap-1'>
                <p className='font-[Arial] text-[32px] font-bold leading-[1.2] text-[#42454D]'>{money(price)}</p>
                {price < originalPrice && (
                  <p className='text-[18px] text-gray-500 line-through'>{money(originalPrice)}</p>
                )}
              </div>

              {(Number(product.taxAmount) > 0 || Number(product.vatGst) > 0 || Number(product.importCharges) > 0 || Number(product.handlingFee) > 0) && (
                <div className="flex flex-col gap-1 text-[14px] text-gray-700 bg-white p-3 border border-gray-200 rounded-sm">
                  <strong className="font-semibold text-black mb-1">Additional Charges:</strong>
                  {Number(product.taxAmount) > 0 && <div className="flex justify-between"><span>Tax</span> <span>{money(product.taxAmount!)}</span></div>}
                  {Number(product.vatGst) > 0 && <div className="flex justify-between"><span>VAT/GST</span> <span>{money(product.vatGst!)}</span></div>}
                  {Number(product.importCharges) > 0 && <div className="flex justify-between"><span>Import Charges</span> <span>{money(product.importCharges!)}</span></div>}
                  {Number(product.handlingFee) > 0 && <div className="flex justify-between"><span>Handling Fee</span> <span>{money(product.handlingFee!)}</span></div>}
                </div>
              )}

              <div className='flex flex-col gap-3'>
                <p className='text-[16px] leading-[1.3] text-black'>
                  {product.shippingFeeType === 'FREE' ? (
                    <span className="font-bold text-green-700">Free Shipping</span>
                  ) : (
                    <span>{money(product.shippingCost || 0)} Shipping</span>
                  )}
                </p>
                <p className='text-[16px] leading-[1.2] text-black'>
                  Expected delivery : <span className="font-semibold">{product.minDeliveryDays}-{product.maxDeliveryDays} days</span>.
                </p>
                <div className='flex flex-wrap items-center gap-2 mt-1'>
                  <MapPin size={20} strokeWidth={1.6} />
                  <span className='text-[16px] leading-[1.2]'>Delivery location</span>
                  <span className='text-[14px] leading-[1.2] text-[#165DD0] cursor-pointer hover:underline'>Change location</span>
                </div>
              </div>

              <div className='flex flex-col gap-6'>
                <dl className='flex flex-col gap-3 text-[16px] leading-[1.2]'>
                  <div className='flex justify-between gap-4'><dt className="text-gray-600">Ships from</dt><dd className='font-medium text-[#42454D]'>{product.shipsFrom}</dd></div>
                  <div className='flex justify-between gap-4'><dt className="text-gray-600">Sold by</dt><dd className='font-medium text-[#165DD0]'>{seller}</dd></div>
                </dl>

                <div className='flex flex-col gap-3 text-[14px] text-gray-700 border-t border-[#E5E5E6] pt-4'>
                  <strong className='font-semibold text-black'>Delivery Options:</strong>
                  {product.deliveryStandard && <div className="flex items-center gap-2">✓ Standard Delivery</div>}
                  {product.deliveryExpress && <div className="flex items-center gap-2">⚡ Express Delivery Available</div>}
                  {product.deliveryCod && <div className="flex items-center gap-2">💵 Cash on Delivery Available</div>}
                  {product.deliveryReturnPickup && <div className="flex items-center gap-2">🔄 Return Pickup Available</div>}
                </div>

                {(product.returnPolicy || product.returnTerms) && (
                  <div className='flex flex-col gap-2 text-[14px] text-gray-700 border-t border-[#E5E5E6] pt-4'>
                    <strong className='font-semibold text-black'>Returns:</strong>
                    {product.returnPolicy && <div className="font-medium text-black">{product.returnPolicy}</div>}
                    {product.returnTerms && <div className="text-[13px] text-gray-600 leading-[1.4]">{product.returnTerms}</div>}
                  </div>
                )}

                <div className='flex flex-col gap-3 mt-2'>
                  {isOutOfStock && <div className="text-red-600 font-bold text-center mb-1">Currently Out of Stock</div>}
                  {!isOutOfStock && product.stockQuantity > 0 && product.stockQuantity <= product.lowStockAlertQuantity && (
                     <div className="text-[#DEC33A] font-bold text-center mb-1">Only {product.stockQuantity} left in stock - order soon.</div>
                  )}
                  {product.minOrderQuantity > 1 && (
                     <div className="text-gray-600 text-sm text-center">Minimum order quantity: {product.minOrderQuantity}</div>
                  )}
                  <button
                    type='button'
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(true)}
                    className={`h-12 rounded-xs border text-[16px] font-medium transition-colors ${
                      isOutOfStock ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed' : 'border-[#DEC33A] bg-[#DEC33A] hover:bg-[#c9b135] text-black'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                  </button>
                  <button
                    type='button'
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(false)}
                    className={`h-12 rounded-xs border text-[16px] font-medium transition-colors ${
                      isOutOfStock ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'border-[#686F7D] text-[#42454D] hover:bg-gray-50'
                    }`}
                  >
                    Add to Cart
                  </button>
                  <button
                    type='button'
                    disabled={toggleWishlistMutation.isPending}
                    onClick={handleToggleWishlist}
                    className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-xs border text-[16px] font-medium transition-all duration-200 shadow-xs ${
                      isWishlisted
                        ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-600'
                        : 'border-[#686F7D] bg-white text-[#42454D] hover:bg-gray-50'
                    } ${toggleWishlistMutation.isPending ? 'opacity-85 cursor-wait' : ''}`}
                  >
                    {toggleWishlistMutation.isPending ? (
                      <Loader2 size={20} className='animate-spin text-current' />
                    ) : (
                      <Heart
                        size={20}
                        className={`transition-transform duration-300 ${
                          isWishlisted ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-600'
                        }`}
                      />
                    )}
                    <span>
                      {toggleWishlistMutation.isPending
                        ? isWishlisted
                          ? 'Removing from Wishlist...'
                          : 'Adding to Wishlist...'
                        : isWishlisted
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'}
                    </span>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <div className='mt-8 flex flex-col gap-4 text-[#171717] xl:mt-21.5'>
            <h2 className='border-b border-[#E5E5E6] pb-2.5 text-[22px] leading-[1.2]'>Item description from the seller</h2>
            <p className='whitespace-pre-line text-[14px] leading-[1.3]'>
              {plainText(product.detailedDescription) || product.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {(related.data?.length ?? 0) > 0 && (
        <section className='w-full px-4 py-12.5 sm:px-5 lg:px-10 xl:px-20'>
          <div className='mx-auto max-w-[1920px]'>
            <h2 className='mb-6 text-[22px] leading-[1.2]'>Deals On Related Products</h2>
            <div className='grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
              {related.data?.slice(0, 8).map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`}>
                  <ProductCard
                    imageSrc={imageUrl(item.thumbnail)}
                    imageAlt={item.name}
                    title={item.name}
                    price={money(activePrice(item))}
                    shippingText={item.shippingFeeType === 'FREE' ? 'Free Shipping' : 'Shipping available'}
                    buttonVariant='none'
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CustomerReviewsSection />
      <BrowsingHistorySection />
      <SignUpBanner />
    </div>
  );
}
