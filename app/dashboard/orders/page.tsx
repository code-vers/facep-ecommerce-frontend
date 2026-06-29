import OrderStats from '@/components/dashboard/orders/OrderStats';
import OrdersTable from '@/components/dashboard/orders/OrdersTable';
import Pagination from '@/components/dashboard/orders/Pagination';

export default function DashboardOrdersPage() {
  return (
    <div className='flex w-full flex-col items-center gap-[24px] px-[45px] py-[36px] bg-white'>
      <OrderStats />
      <OrdersTable />
      <Pagination />
    </div>
  );
}
