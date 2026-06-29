import CmsTabs from '@/components/dashboard/cms/CmsTabs';
import FeaturedCategories from '@/components/dashboard/cms/FeaturedCategories';

export default function FeaturedCategoriesPage() {
  return (
    <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-[45px] 2xl:py-[36px] w-full min-h-screen bg-white'>
      <CmsTabs activeTab='Featured Categories' />
      <FeaturedCategories />
    </div>
  );
}
