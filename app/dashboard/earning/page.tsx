import EarningsSummary from '@/components/dashboard/earning/EarningsSummary';
import RevenueBreakdown from '@/components/dashboard/earning/RevenueBreakdown';

export default function EarningsPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <EarningsSummary />
      <RevenueBreakdown />
    </div>
  );
}
