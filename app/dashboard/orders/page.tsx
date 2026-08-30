import OrderStats from '@/components/dashboard/orders/OrderStats';
import OrdersTable from '@/components/dashboard/orders/OrdersTable';

export default function DashboardOrdersPage() {
  return (
    <div className='flex w-full flex-col items-center gap-6 px-4 py-6 md:px-8 md:py-8 2xl:px-11.25 2xl:py-9 bg-white'>
      <OrderStats />
      <OrdersTable />
    </div>
  );
}
