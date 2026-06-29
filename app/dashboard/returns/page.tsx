import ReturnsTable from '@/components/dashboard/returns/ReturnsTable';

export default function ReturnsPage() {
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full max-w-[1500px]'>
      <ReturnsTable />
    </div>
  );
}
