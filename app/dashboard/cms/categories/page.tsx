import CmsTabs from '@/components/dashboard/cms/CmsTabs';
import FeaturedCategories from '@/components/dashboard/cms/FeaturedCategories';

export default function FeaturedCategoriesPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CmsTabs activeTab='Featured Categories' />
      <FeaturedCategories />
    </div>
  );
}
