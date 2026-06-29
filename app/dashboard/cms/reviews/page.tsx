import CmsTabs from '@/components/dashboard/cms/CmsTabs';
import ReviewsTable from '@/components/dashboard/cms/ReviewsTable';

export default function ReviewsPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CmsTabs activeTab='Reviews' />
      <ReviewsTable />
    </div>
  );
}
