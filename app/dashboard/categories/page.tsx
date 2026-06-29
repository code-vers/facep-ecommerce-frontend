import CategoriesTable from '@/components/dashboard/categories/CategoriesTable';

export default function CategoriesPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CategoriesTable />
    </div>
  );
}
