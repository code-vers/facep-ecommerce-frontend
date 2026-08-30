'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 text-center border border-[#e5e5e6]">
        <div className="mx-auto w-16 h-16 bg-[#fef2f2] rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-[#ef4444]" />
        </div>

        <h2 className="text-[24px] font-bold text-black mb-2">Payment Cancelled</h2>
        <p className="text-[14px] text-[#848995] mb-6">
          You have cancelled the checkout process. Your order has not been placed.
        </p>

        <div className="flex justify-center">
          <Link
            href="/checkout"
            className="w-full sm:w-auto bg-[#dec33a] hover:bg-[#c9b030] text-black text-[15px] font-semibold py-3 px-8 rounded transition-all text-center flex items-center justify-center cursor-pointer"
          >
            Return to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
