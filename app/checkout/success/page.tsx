'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useCartStore } from '@/contexts/CartContext';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || 'Order Confirmed';
  const { selectedItems, removeFromCart, clearSelection } = useCartStore();

  useEffect(() => {
    if (selectedItems.length > 0) {
      selectedItems.forEach(cartItemId => {
        removeFromCart(cartItemId);
      });
      clearSelection();
    }
  }, [selectedItems, removeFromCart, clearSelection]);

  return (
    <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 text-center border border-[#e5e5e6]">
      <div className="mx-auto w-16 h-16 bg-[#eefcf3] rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-[#22c55e]" />
      </div>

      <h2 className="text-[24px] font-bold text-black mb-2">Order Placed Successfully!</h2>
      <p className="text-[14px] text-[#848995] mb-6">
        Thank you for shopping with us. Your order{' '}
        <span className="font-semibold text-black">{orderId}</span> has been confirmed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/products"
          className="w-full bg-[#dec33a] hover:bg-[#c9b030] text-black text-[15px] font-semibold py-3 px-4 rounded transition-all text-center flex items-center justify-center cursor-pointer"
        >
          Continue Shopping
        </Link>
        <button
          type="button"
          onClick={() => router.push('/orders')}
          className="w-full border border-[#686f7d] hover:bg-[#686f7d]/5 text-black text-[15px] font-medium py-3 px-4 rounded transition-all text-center flex items-center justify-center cursor-pointer"
        >
          View Orders
        </button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
