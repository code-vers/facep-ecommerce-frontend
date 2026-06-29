import CmsTabs from '@/components/dashboard/cms/CmsTabs';
import SiteInformation from '@/components/dashboard/cms/SiteInformation';

export default function CmsPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CmsTabs activeTab='Site Information' />
      <SiteInformation />
    </div>
  );
}
