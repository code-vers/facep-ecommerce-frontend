import OrderStats from '@/components/dashboard/orders/OrderStats';
import OrdersTable from '@/components/dashboard/orders/OrdersTable';
import Pagination from '@/components/dashboard/orders/Pagination';

export default function DashboardOrdersPage() {
  return (
    <div className='flex w-full flex-col items-center gap-[24px] px-4 py-6 md:px-8 md:py-8 2xl:px-[45px] 2xl:py-[36px] bg-white'>
      <OrderStats />
      <OrdersTable />
      <Pagination />
    </div>
  );
}
