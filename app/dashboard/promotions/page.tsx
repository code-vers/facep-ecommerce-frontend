import PromotionsTable from '@/components/dashboard/promotions/PromotionsTable';

export default function DashboardPromotionsPage() {
  return (
    <div className='flex w-full flex-col items-center gap-[24px] px-4 py-6 md:px-8 md:py-8 2xl:px-[45px] 2xl:py-[36px] bg-white h-full'>
      <PromotionsTable />
    </div>
  );
}
