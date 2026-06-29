import CmsTabs from '@/components/dashboard/cms/CmsTabs';
import FaqTable from '@/components/dashboard/cms/FaqTable';

export default function FaqPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CmsTabs activeTab='FAQ' />
      <FaqTable />
    </div>
  );
}
