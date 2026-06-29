'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CmsTabsProps {
  activeTab?: string;
}

const tabs = [
  { name: 'Site Information', href: '/dashboard/cms' },
  { name: 'Banner & Footer', href: '/dashboard/cms/banner' },
  { name: 'Featured Categories', href: '/dashboard/cms/categories' },
  { name: 'FAQ', href: '/dashboard/cms/faq' },
  { name: 'Reviews', href: '/dashboard/cms/reviews' },
  { name: 'Support Contents', href: '/dashboard/cms/support' },
];

export default function CmsTabs({ activeTab = 'Site Information' }: CmsTabsProps) {
  return (
    <div className='flex w-full shrink-0 items-center overflow-x-auto rounded-[4px] border border-[#E5E5E6] bg-white p-[4px]'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              'flex shrink-0 items-center justify-center whitespace-nowrap rounded-[2px] px-[16px] py-[8px] text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300',
              isActive
                ? 'bg-[#F3EFE6] font-medium text-black'
                : 'text-[#42454D] hover:bg-gray-50'
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
