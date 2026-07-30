'use client';

import { useProductFacets } from '@/hooks/api/useProduct';
import { ChevronDown, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function RadioOption({
  id,
  label,
  param,
  value,
}: {
  id: string;
  label: string;
  param?: string;
  value?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checked = param ? (searchParams.get(param) ?? '') === (value ?? '') : false;

  return (
    <div className='flex items-center gap-1.5 py-1'>
      <input
        type='radio'
        id={id}
        name={param || id.split('-')[0]}
        checked={checked}
        onChange={() => {
          if (!param) return;
          const next = new URLSearchParams(searchParams.toString());
          if (value) next.set(param, value);
          else next.delete(param);
          next.delete('page');
          router.push(`/products?${next}`);
        }}
        className='size-[14px] cursor-pointer appearance-none rounded-full border border-black/60 bg-white checked:border-[4px] checked:border-[#165DD0]'
      />
      <label htmlFor={id} className='cursor-pointer text-[14px] leading-[1.3] text-black'>
        {label}
      </label>
    </div>
  );
}

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useProductFacets();
  const minPrice = Number(data?.price.min ?? 0);
  const maxPrice = Number(data?.price.max ?? 3000);
  const selectedMax = Number(searchParams.get('maxPrice') ?? maxPrice);

  const setParam = (param: string, value?: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(param, value);
    else next.delete(param);
    next.delete('page');
    router.push(`/products?${next}`);
  };

  return (
    <aside className='w-[203px] shrink-0 space-y-6 pb-10'>
      <div className='flex items-center justify-between'>
        <h3 className='text-[16px] font-bold text-black'>Filter by</h3>
        <button type='button' onClick={() => router.push('/products')} className='text-[12px] text-[#CB1B1B]'>
          Clear
        </button>
      </div>

      <div>
        <h4 className='mb-1 text-[14px] font-bold'>Deals &amp; Discounts</h4>
        <RadioOption id='discount-all' label='All Discounts' param='hasDiscount' value='' />
        <RadioOption id='discount-active' label="Today's Deals" param='hasDiscount' value='true' />
      </div>

      <div>
        <h4 className='mb-1 text-[14px] font-bold'>Price</h4>
        <RadioOption id='price-all' label='All' param='maxPrice' value='' />
        <div className='py-1 text-[14px] text-[#DEC33A]'>${minPrice} - ${selectedMax}</div>
        <input
          type='range'
          min={minPrice}
          max={maxPrice}
          value={Math.min(selectedMax, maxPrice)}
          onChange={(event) => setParam('maxPrice', event.target.value)}
          className='mb-1 h-2 w-full cursor-pointer accent-[#DEC33A]'
          aria-label='Maximum price'
        />
        <RadioOption id='price-500' label='$100 - $500' param='maxPrice' value='500' />
        <RadioOption id='price-1000' label='$500 - $1000' param='maxPrice' value='1000' />
        <RadioOption id='price-2000' label='$1000 - $2000' param='maxPrice' value='2000' />
        <RadioOption id='price-over' label='$2000+' param='minPrice' value='2000' />
      </div>

      <div>
        <h4 className='mb-1 text-[14px] font-bold'>Customer review</h4>
        <RadioOption id='review-all' label='All' />
        <div className='flex items-center gap-2 py-1'>
          <div className='flex gap-px'>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={16} fill={index < 4 ? '#DEC33A' : 'white'} className='text-[#DEC33A]' />
            ))}
          </div>
          <span className='text-[14px]'>&amp; Up</span>
        </div>
      </div>

      <div>
        <h4 className='mb-1 text-[14px] font-bold'>Colors</h4>
        <RadioOption id='color-all' label='All' param='color' value='' />
        <div className='grid grid-cols-7 gap-1 pt-1'>
          {(data?.colors ?? []).slice(0, 14).map((color) => (
            <button
              key={color}
              type='button'
              onClick={() => setParam('color', color)}
              className={`aspect-square border ${
                searchParams.get('color') === color ? 'outline outline-1 outline-[#686F7D]' : 'border-black/10'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Filter by ${color}`}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className='mb-1 text-[14px] font-bold'>Condition</h4>
        {(data?.conditions ?? ['NEW', 'RENEWED', 'USED']).map((condition) => (
          <RadioOption
            key={condition}
            id={`condition-${condition}`}
            label={condition.charAt(0) + condition.slice(1).toLowerCase()}
            param='condition'
            value={condition}
          />
        ))}
      </div>

      <div>
        <h4 className='mb-1 text-[14px] font-bold'>Sellers</h4>
        <RadioOption id='seller-all' label='All' />
        {(data?.vendors ?? []).slice(0, 5).map((vendor) => (
          <RadioOption key={vendor.id} id={`seller-${vendor.id}`} label={vendor.name} />
        ))}
        {(data?.vendors.length ?? 0) > 5 && (
          <button type='button' className='flex items-center gap-1 py-1 text-[14px] text-[#165DD0]'>
            See more <ChevronDown size={14} />
          </button>
        )}
      </div>

      <div>
        <h4 className='mb-1 text-[14px] font-bold'>Category</h4>
        <RadioOption id='category-all' label='All' param='category' value='' />
        {(data?.categories ?? []).slice(0, 5).map((category) => (
          <RadioOption
            key={category.id}
            id={`category-${category.id}`}
            label={category.name}
            param='category'
            value={category.id}
          />
        ))}
        {(data?.categories.length ?? 0) > 5 && (
          <button type='button' className='flex items-center gap-1 py-1 text-[14px] text-[#165DD0]'>
            See more <ChevronDown size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
