import React from 'react';
import { ShoppingCart, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const mockCartItems = [
  {
    id: 1,
    price: '$299.99',
    quantity: 2,
    image: '/ImageWithFallback.png',
  },
  {
    id: 2,
    price: '$299.99',
    quantity: 2,
    image: '/ImageWithFallback2.png',
  },
  {
    id: 3,
    price: '$299.99',
    quantity: 2,
    image: '/ImageWithFallback.png',
  },
];

export default function CartSidebar() {
  return (
    <aside className='w-[240px] shrink-0 bg-[#F2F2F3] px-6 py-3 flex flex-col gap-4 h-fit rounded-[8px]'>
      {/* Top Section */}
      <div className='flex flex-col items-center gap-4 w-full'>
        <div className='flex flex-col items-center gap-2'>
          <h3 className='font-semibold text-[16px] leading-[1.3] text-black'>
            Subtotal
          </h3>
          <p className='text-[12px] leading-[1.3] text-[#CB1B1B] font-normal'>
            $2,190.62
          </p>
        </div>

        <Link 
          href='/cart'
          className='flex w-full min-w-[80px] items-center justify-center gap-[6px] rounded-[2px] border-[0.75px] border-[#DEC33A] bg-[#DEC33A] px-3 py-1 hover:bg-[#cbb235] transition-colors'
        >
          <span className='text-[12px] text-black leading-[1.3]'>
            Go to Cart
          </span>
          <ShoppingCart size={18} className='text-black' />
        </Link>
      </div>

      {/* Cart Items List */}
      <div className='flex w-full flex-col items-start gap-6'>
        {mockCartItems.map((item) => (
          <div
            key={item.id}
            className='flex w-full flex-col rounded-[4px] border border-[#E5E5E6] bg-white'
          >
            {/* Image */}
            <div className='relative h-[180px] w-full shrink-0 rounded-t-[4px] overflow-hidden'>
              <Image
                src={item.image}
                alt='Product'
                fill
                className='object-cover pointer-events-none'
              />
            </div>

            {/* Details */}
            <div className='flex w-full flex-col gap-3 p-2'>
              <p className='w-full text-center text-[16px] leading-[1.2] text-black'>
                {item.price}
              </p>

              <div className='flex w-full min-w-[80px] items-center justify-between rounded-[2px] border-[0.75px] border-[#686F7D] px-3 py-1'>
                <button className='text-[#42454D] hover:text-black transition-colors'>
                  <Trash2 size={18} />
                </button>
                <span className='text-[12px] leading-[1.3] text-[#42454D]'>
                  {item.quantity}
                </span>
                <button className='text-[#42454D] hover:text-black transition-colors'>
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
