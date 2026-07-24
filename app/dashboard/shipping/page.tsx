'use client';

import CourierPartners from '@/components/dashboard/shipping/CourierPartners';
import ShippingZones from '@/components/dashboard/shipping/ShippingZones';
import VendorPickups from '@/components/dashboard/shipping/VendorPickups';
import { useAuth } from '@/contexts/AuthContext';

export default function ShippingPage() {
  const { session } = useAuth();

  // Default to true for vendors if they are strictly defined
  const isVendor = session?.user?.role === 'VENDOR';

  if (isVendor) {
    return (
      <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-11.25 2xl:py-9 w-full min-h-screen bg-white'>
        <VendorPickups />
      </div>
    );
  }

  // Admin view (fallback)
  return (
    <div className='flex flex-col gap-6 items-start px-4 py-6 sm:px-6 md:px-8 2xl:px-11.25 2xl:py-9 w-full min-h-screen bg-white'>
      <CourierPartners />
      <ShippingZones />
    </div>
  );
}
