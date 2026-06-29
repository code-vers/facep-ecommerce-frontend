'use client';

import { useAuth } from '@/contexts/AuthContext';
import CourierPartners from '@/components/dashboard/shipping/CourierPartners';
import ShippingZones from '@/components/dashboard/shipping/ShippingZones';
import VendorPickups from '@/components/dashboard/shipping/VendorPickups';

export default function ShippingPage() {
  const { session } = useAuth();
  
  // Default to true for vendors if they are strictly defined
  const isVendor = session?.role === 'vendor';

  if (isVendor) {
    return (
      <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
        <VendorPickups />
      </div>
    );
  }

  // Admin view (fallback)
  return (
    <div className='flex flex-col gap-6 md:p-6 mx-auto w-full'>
      <CourierPartners />
      <ShippingZones />
    </div>
  );
}
