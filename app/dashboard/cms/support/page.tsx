import CmsTabs from '@/components/dashboard/cms/CmsTabs';
import SupportContents from '@/components/dashboard/cms/SupportContents';

export default function SupportContentsPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CmsTabs activeTab='Support Contents' />
      <SupportContents />
    </div>
  );
}
