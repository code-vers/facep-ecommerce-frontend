import BrowsingHistory from '@/components/product/BrowsingHistory';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import SignUpBanner from '@/components/product/SignUpBanner';
import { ListFilter } from 'lucide-react';

export default function ProductPage() {
  return (
    <div className='flex min-h-screen flex-col bg-white'>
      {/* Main Content Area */}
      <main className='flex-1 pb-20'>
        <div className='mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10'>
          {/* Top Bar */}
          <div className='flex h-[57px] w-full items-center justify-between border-b border-[#E5E5E6] bg-white'>
            <h1 className='text-[16px] text-black'>
              Showing 1-20 of 234 results for <span className='font-bold'>“home”</span>
            </h1>
            <button className='flex h-[33px] items-center gap-2 rounded-[2px] border border-[#E5E5E6] bg-white px-3 transition-colors hover:bg-gray-50'>
              <span className='text-[14px] font-bold text-black'>Sort By</span>
              <ListFilter size={16} className='text-black' />
            </button>
          </div>

          {/* Grid Layout: Sidebar + Results */}
          <div className='mt-[36px] flex gap-6'>
            <FilterSidebar />
            <ProductGrid />
          </div>
        </div>
      </main>

      {/* Browsing History */}
      <BrowsingHistory />

      {/* Sign Up Banner */}
      <SignUpBanner />
    </div>
  );
}
