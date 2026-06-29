import CourierPartners from '@/components/dashboard/shipping/CourierPartners';
import ShippingZones from '@/components/dashboard/shipping/ShippingZones';

export default function ShippingPage() {
  return (
    <div className='flex flex-col gap-6  md:p-6  mx-auto w-full'>
      <CourierPartners />
      <ShippingZones />
    </div>
  );
}
