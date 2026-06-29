import InquiriesTable from '@/components/dashboard/support/InquiriesTable';

export default function DashboardSupportPage() {
  return (
    <div className='flex w-full flex-col items-center px-4 py-6 md:px-8 md:py-8 2xl:px-[45px] 2xl:py-[36px] bg-white'>
      <InquiriesTable />
    </div>
  );
}
