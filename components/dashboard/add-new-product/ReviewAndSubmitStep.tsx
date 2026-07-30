'use client';

import Image from 'next/image';
import { useProductFormStore } from '../../../store/useProductFormStore';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value: string) =>
  value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;

export default function ReviewAndSubmitStep({
  onEditStep,
}: {
  onEditStep: (step: number) => void;
}) {
  const store = useProductFormStore();
  const sections = [
    {
      title: 'Basic Product Information',
      step: 1,
      rows: [
        ['Product Name', store.name],
        ['Store / Brand', store.brand || '—'],
        ['Product Type', store.productType || '—'],
        ['Short Summary', store.shortDescription || '—'],
        ['Condition', store.condition],
        ['Tags', store.tags.join(', ') || '—'],
        ['Colors', store.availableColors.join(', ') || '—'],
      ],
    },
    {
      title: 'Media & Variants',
      step: 2,
      rows: [
        ['Preview Images', String(store.previewImages.length)],
        ['Has Variants', store.hasVariants ? 'Yes' : 'No'],
        ['Variants', String(store.variants.length)],
      ],
    },
    {
      title: 'Pricing',
      step: 3,
      rows: [
        ['Base Price', String(store.basePrice)],
        ['Old Price', store.oldPrice === '' ? '—' : String(store.oldPrice)],
        ['Discount', store.discountType ? `${store.discountValue} ${store.discountType}` : '—'],
      ],
    },
    {
      title: 'Shipping',
      step: 4,
      rows: [
        ['Ships From', store.shipsFrom],
        ['Delivery', `${store.minDeliveryDays}–${store.maxDeliveryDays} days`],
        ['Fee Type', store.shippingFeeType],
      ],
    },
    {
      title: 'Details & Inventory',
      step: 5,
      rows: [
        ['SKU', store.sku],
        ['Stock', String(store.stockQuantity)],
        ['Stock Status', store.stockStatus],
        ['Specifications', String(store.specifications.length)],
        ['Order Range', `${store.minOrderQuantity}–${store.maxOrderQuantity}`],
      ],
    },
  ];

  return (
    <div className='border border-[#e5e5e6] border-solid flex flex-col items-start w-full relative shrink-0 rounded-[4px] bg-white'>
      <div className='flex flex-col gap-6 items-start p-[24px] w-full relative shrink-0'>
        <div className='flex items-start gap-4'>
          {store.thumbnail && (
            <div className='relative size-20 overflow-hidden rounded-[2px] border border-[#e5e5e6]'>
              <Image src={imageUrl(store.thumbnail)} alt={store.name} fill unoptimized className='object-cover' />
            </div>
          )}
          <div>
            <p className='font-semibold text-[20px] text-black'>{store.name}</p>
            <p className='text-[14px] text-[#686f7d]'>Review all product details before submission.</p>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
          {sections.map((section) => (
            <section key={section.title} className='border border-[#e5e5e6] rounded-[2px] p-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='font-semibold text-[16px] text-black'>{section.title}</h3>
                <button
                  type='button'
                  onClick={() => onEditStep(section.step)}
                  className='text-[13px] text-[#165dd0] hover:underline'
                >
                  Edit
                </button>
              </div>
              <dl className='space-y-2'>
                {section.rows.map(([label, value]) => (
                  <div key={label} className='flex justify-between gap-4 text-[13px]'>
                    <dt className='text-[#686f7d]'>{label}</dt>
                    <dd className='text-black text-right break-words'>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
