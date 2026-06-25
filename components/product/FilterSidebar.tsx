import React from 'react';
import { Star, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
}

const DEALS: FilterOption[] = [
  { id: 'all-discounts', label: 'All Discounts' },
  { id: 'todays-deals', label: "Today's Deals" },
];

const PRICES: FilterOption[] = [
  { id: 'all-price', label: 'All' },
  { id: 'price-1', label: '$100 - $500' },
  { id: 'price-2', label: '$500 - $1000' },
  { id: 'price-3', label: '$1000 - $2000' },
  { id: 'price-4', label: '$2000+' },
];

const COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000',
  '#FFFFFF', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080'
];

const CONDITIONS: FilterOption[] = [
  { id: 'new', label: 'New' },
  { id: 'renewed', label: 'Renewed' },
  { id: 'used', label: 'Used' },
];

const SELLERS: FilterOption[] = [
  { id: 'all-sellers', label: 'All' },
  { id: 'nova', label: 'Nova & Stellar' },
  { id: 'galactic', label: 'Galactic Goods' },
  { id: 'zenith', label: 'Zenith Tech' },
  { id: 'ember', label: 'Ember Home' },
  { id: 'apex', label: 'Apex Outfitters' },
];

const CATEGORIES: FilterOption[] = [
  { id: 'all-cat', label: 'All' },
  { id: 'smart-home', label: 'Smart Home Devices' },
  { id: 'kitchen', label: 'Kitchen Appliances' },
  { id: 'home-ent', label: 'Home Entertainment' },
  { id: 'living', label: 'Living Room Furniture' },
  { id: 'patio', label: 'Patio & Garden' },
];

function RadioOption({ id, label, defaultChecked }: { id: string; label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <input
        type="radio"
        id={id}
        name={id.split('-')[0]} // Group by prefix roughly for dummy functionality
        defaultChecked={defaultChecked}
        className="size-[14px] appearance-none rounded-full border border-black/30 cursor-pointer checked:border-[4px] checked:border-[#165DD0] bg-white"
      />
      <label htmlFor={id} className="cursor-pointer text-[14px] leading-[1.3] text-black">
        {label}
      </label>
    </div>
  );
}

export default function FilterSidebar() {
  return (
    <aside className="w-full shrink-0 space-y-8 pb-10 lg:w-[203px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-black">Filter by</h3>
        <button className="text-[14px] text-[#165DD0]">Clear</button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col lg:gap-8">
        {/* Deals & Discounts */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Deals & Discounts</h4>
        <div className="flex flex-col gap-1">
          {DEALS.map((deal, idx) => (
            <RadioOption key={deal.id} {...deal} defaultChecked={idx === 0} />
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Price</h4>
        <div className="flex flex-col gap-1">
          <RadioOption id={PRICES[0].id} label={PRICES[0].label} defaultChecked />
          <div className="py-2 text-[14px] text-black">$0 - $3000</div>
          {/* Mock Slider */}
          <div className="py-2">
            <div className="relative h-2 w-full rounded-full bg-[#E5E5E6]">
              <div className="absolute left-0 top-0 h-full w-[60%] rounded-full bg-[#165DD0]"></div>
              <div className="absolute left-[60%] top-1/2 size-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[#165DD0] bg-white shadow-sm"></div>
            </div>
          </div>
          {PRICES.slice(1).map((price) => (
            <RadioOption key={price.id} {...price} />
          ))}
        </div>
      </div>

      {/* Customer Review */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Customer review</h4>
        <div className="flex flex-col gap-1">
          <RadioOption id="review-all" label="All" defaultChecked />
          <div className="flex items-center gap-2 py-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <Star key={s} size={16} fill="#F09000" className="text-[#F09000]" />
              ))}
              <Star size={16} className="text-[#F09000]" />
            </div>
            <span className="text-[14px] text-black">& Up</span>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Colors</h4>
        <div className="flex flex-col gap-2">
          <RadioOption id="color-all" label="All" defaultChecked />
          <div className="grid grid-cols-7 gap-2">
            {COLORS.map((color, i) => (
              <button
                key={i}
                className={cn(
                  "size-5 rounded-full border border-black/10",
                  color === '#FFFFFF' && "border-black/30"
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Condition</h4>
        <div className="flex flex-col gap-1">
          {CONDITIONS.map((cond, idx) => (
            <RadioOption key={cond.id} {...cond} defaultChecked={idx === 0} />
          ))}
        </div>
      </div>

      {/* Sellers */}
      <div>
        <h4 className="mb-2 text-[14px] font-bold text-black">Sellers</h4>
        <div className="flex flex-col gap-1">
          {SELLERS.map((seller, idx) => (
            <RadioOption key={seller.id} {...seller} defaultChecked={idx === 0} />
          ))}
          <button className="flex items-center gap-1 py-1 text-[14px] text-[#165DD0]">
            See more <ChevronDown size={14} />
          </button>
        </div>
      </div>

        {/* Category */}
        <div>
          <h4 className="mb-2 text-[14px] font-bold text-black">Category</h4>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((cat, idx) => (
              <RadioOption key={cat.id} {...cat} defaultChecked={idx === 0} />
            ))}
            <button className="flex items-center gap-1 py-1 text-[14px] text-[#165DD0]">
              See more <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
