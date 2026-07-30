'use client';

import BrowsingHistorySection from '@/components/product-detail/BrowsingHistorySection';
import CustomerReviewsSection from '@/components/product-detail/CustomerReviewsSection';
import ProductCard from '@/components/shared/ProductCard';
import SignUpBanner from '@/components/shared/SignUpBanner';
import { useRelatedProducts } from '@/hooks/api/useProduct';
import type { Product, ProductVariant } from '@/lib/api/product';
import { ExternalLink, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

export default function PublicProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const related = useRelatedProducts(product.slug);
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
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
        <div className='mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-5 sm:py-8 lg:px-10 xl:px-20 xl:py-[50px]'>
          <div className='flex flex-col items-start gap-8 xl:flex-row xl:gap-14'>
            <div className='flex min-w-0 flex-1 flex-col gap-8 md:flex-row xl:gap-12'>
              <div className='flex w-full shrink-0 flex-col gap-6 md:w-[56%] xl:w-[700px]'>
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
                        selectedImage === image ? 'outline outline-1 outline-[#686F7D]' : ''
                      }`}
                    >
                      <Image src={imageUrl(image)} alt='' fill unoptimized className='object-cover' />
                    </button>
                  ))}
                </div>
              </div>

              <div className='flex min-w-0 flex-1 flex-col gap-4'>
                <div className='flex flex-col gap-2 border-b border-[#E5E5E6] pb-[18px]'>
                  <div className='flex items-start gap-[7px] text-[16px] leading-[1.2] text-[#165DD0]'>
                    <span>Brand: {product.brand || '—'}</span>
                    <ExternalLink size={18} strokeWidth={1.6} />
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

                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2 font-[Arial] text-[#42454D]'>
                      <span className='text-[28px] leading-[1.2]'>{money(price)}</span>
                      {price < originalPrice && (
                        <span className='text-[24px] leading-[1.2] line-through'>{money(originalPrice)}</span>
                      )}
                    </div>
                    <p className='text-[14px] leading-[1.3] text-[#848995]'>
                      {product.shippingFeeType === 'FREE'
                        ? 'Free Shipping'
                        : `${money(product.shippingCost || 0)} Shipping & Import Charges`}
                    </p>
                  </div>

                  <div className='flex items-center gap-1 text-[16px] text-black'>
                    <strong className='font-semibold'>Size:</strong>
                    <span>{selectedVariant?.size || '—'}</span>
                  </div>

                  {(product.availableColors.length > 0 || product.variants.some((variant) => variant.color)) && (
                    <div className='flex flex-col gap-4'>
                      <div className='flex items-center gap-1 text-[16px] text-black'>
                        <strong className='font-semibold'>Color:</strong>
                        <span>{selectedVariant?.color || product.availableColors[0] || '—'}</span>
                      </div>
                      <div className='grid grid-cols-7 gap-1.5'>
                        {(product.variants.length
                          ? product.variants.filter((variant) => variant.color)
                          : product.availableColors.map((color) => ({ color, id: color } as ProductVariant))
                        ).map((variant) => (
                          <button
                            key={variant.id || variant.sku || variant.color}
                            type='button'
                            onClick={() => {
                              if (variant.id) setSelectedVariantId(variant.id);
                              if (variant.image) setSelectedImage(variant.image);
                            }}
                            className={`aspect-square border p-0.5 ${
                              selectedVariant?.id === variant.id ? 'border-[#686F7D]' : 'border-transparent'
                            }`}
                            aria-label={`Select ${variant.color}`}
                          >
                            <span className='block size-full' style={{ backgroundColor: variant.color || '#f2f2f3' }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-4 text-black'>
                  <h2 className='text-[22px] leading-[1.2]'>Product details</h2>
                  <dl className='flex flex-col gap-2 text-[16px]'>
                    <div className='flex gap-1'><dt className='font-semibold'>Brand:</dt><dd>{product.brand || '—'}</dd></div>
                    {specifications.map((item) => (
                      <div key={item.id || item.name} className='flex gap-1'>
                        <dt className='font-semibold'>{item.name}:</dt><dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className='flex flex-col gap-4 text-black'>
                  <h2 className='text-[22px] leading-[1.2]'>About this item</h2>
                  {features.length ? (
                    <ul className='list-disc pl-[21px] text-[14px] leading-[1.3]'>
                      {features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  ) : (
                    <p className='text-[14px] leading-[1.3]'>{product.shortDescription}</p>
                  )}
                  {features.length > 5 && <span className='text-[12px] leading-[1.3] text-[#165DD0]'>See More</span>}
                </div>
              </div>
            </div>

            <aside className='flex w-full shrink-0 flex-col gap-6 border border-[#E5E5E6] bg-[#F2F2F3] p-6 xl:w-[453.75px]'>
              <p className='font-[Arial] text-[28px] leading-[1.2] text-[#42454D]'>{money(price)}</p>
              <div className='flex flex-col gap-3'>
                <p className='text-[18px] leading-[1.2] text-black'>
                  Expected delivery : {product.minDeliveryDays}-{product.maxDeliveryDays} days.
                </p>
                <div className='flex flex-wrap items-center gap-2'>
                  <MapPin size={24} strokeWidth={1.6} />
                  <span className='text-[18px] leading-[1.2]'>Delivery location</span>
                  <span className='text-[16px] leading-[1.2] text-[#165DD0]'>Change location</span>
                </div>
              </div>
              <div className='flex flex-col gap-6'>
                <dl className='flex flex-col gap-3 text-[18px] leading-[1.2]'>
                  <div className='flex justify-between gap-4'><dt>Ships from</dt><dd className='text-[#42454D]'>{product.shipsFrom}</dd></div>
                  <div className='flex justify-between gap-4'><dt>Sold by</dt><dd className='text-[#165DD0]'>{seller}</dd></div>
                </dl>
                <div className='flex flex-col gap-4'>
                  <button type='button' className='h-12 rounded-[2px] border border-[#DEC33A] bg-[#DEC33A] text-[16px]'>Buy Now</button>
                  <button type='button' className='h-12 rounded-[2px] border border-[#686F7D] text-[16px]'>Add to Cart</button>
                </div>
              </div>
            </aside>
          </div>

          <div className='mt-8 flex flex-col gap-4 text-[#171717] xl:mt-[86px]'>
            <h2 className='border-b border-[#E5E5E6] pb-2.5 text-[22px] leading-[1.2]'>Item description from the seller</h2>
            <p className='whitespace-pre-line text-[14px] leading-[1.3]'>
              {plainText(product.detailedDescription) || product.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {(related.data?.length ?? 0) > 0 && (
        <section className='w-full px-4 py-[50px] sm:px-5 lg:px-10 xl:px-20'>
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
