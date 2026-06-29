import CmsTabs from '@/components/dashboard/cms/CmsTabs';
import BannerFooter from '@/components/dashboard/cms/BannerFooter';

export default function BannerFooterPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CmsTabs activeTab='Banner & Footer' />
      <BannerFooter />
    </div>
  );
}
