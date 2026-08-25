/**
 * @fileoverview Main Checkout Page component — `/checkout`.
 * Coordinates user, shipping, and payment forms, calculates orders,
 * validates inputs, and renders a checkout completion success modal.
 *
 * @module app/checkout/page
 */

'use client';

import { CheckCircle2, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import CheckoutPaymentDetails from '@/components/checkout/CheckoutPaymentDetails';
import CheckoutShippingDetails from '@/components/checkout/CheckoutShippingDetails';
import CheckoutUserDetails from '@/components/checkout/CheckoutUserDetails';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/contexts/CartContext';
import type { AuthSession } from '@/lib/auth/auth.types';
import { SAVED_CARDS } from '@/lib/checkout-data';

interface CheckoutFormProps {
  session: AuthSession | null;
}

interface CheckoutFormState {
  // User details
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  // Shipping details
  country: string;
  city: string;
  location: string;
  note: string;
  // Payment details
  paymentMethod: 'CARD';
  selectedCardId: string;
  cardNumber: string;
  cardExpiry: string;
  cardHolder: string;
  cardCvv: string;
}

/**
 * CheckoutForm component.
 * Handles the actual checkout actions.
 */
function CheckoutForm({ session }: CheckoutFormProps) {
  const router = useRouter();
  const { items, selectedItems } = useCartStore();

  // Compute selected items
  const selectedItemsData = items.filter((item) => selectedItems.includes(item.cartItemId));

  // Redirect to cart if no items selected
  useEffect(() => {
    if (items.length > 0 && selectedItems.length === 0) {
      router.push('/cart');
    }
  }, [items.length, selectedItems.length, router]);

  // Initial Form State populated directly from session if present
  const [formData, setFormData] = useState<CheckoutFormState>(() => ({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    contactNumber: '',
    address: '',
    country: '',
    city: '',
    location: '',
    note: '',
    paymentMethod: 'CARD',
    selectedCardId: SAVED_CARDS[0]?.id || 'new',
    cardNumber: '',
    cardExpiry: '',
    cardHolder: '',
    cardCvv: '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Generic state updater
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error when editing field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Basic validation rules
  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    // User Details Validation
    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!formData.contactNumber.trim()) nextErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) nextErrors.address = 'Billing address is required';

    // Shipping Details Validation
    if (!formData.country.trim()) nextErrors.country = 'Country is required';
    if (!formData.city.trim()) nextErrors.city = 'City is required';
    if (!formData.location.trim()) nextErrors.location = 'Location (State/Zip) is required';

    // Payment Card details validation
    if (formData.selectedCardId === 'new') {
      if (!formData.cardNumber.trim()) {
        nextErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s+/g, ''))) {
        nextErrors.cardNumber = 'Card number must be 16 digits';
      }

      if (!formData.cardExpiry.trim()) {
        nextErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.cardExpiry)) {
        nextErrors.cardExpiry = 'Expiry must be in MM/YY format';
      }

      if (!formData.cardHolder.trim()) nextErrors.cardHolder = 'Cardholder name is required';

      if (!formData.cardCvv.trim()) {
        nextErrors.cardCvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
        nextErrors.cardCvv = 'CVV must be 3 or 4 digits';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.getElementById(firstErrorKey);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate database placement call
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderId(`FCP-${Math.floor(100000 + Math.random() * 900000)}`);
      setShowSuccessModal(true);
    }, 1500);
  };

  // Compute final pricing summary elements
  const subtotal = selectedItemsData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalShipping = selectedItemsData.reduce((acc, item) => acc + ((item.shippingCost || 0) * item.quantity), 0);
  const totalTax = selectedItemsData.reduce((acc, item) => acc + ((item.taxAmount || 0) * item.quantity), 0);
  const totalVatGst = selectedItemsData.reduce((acc, item) => acc + ((item.vatGst || 0) * item.quantity), 0);
  const totalImportCharges = selectedItemsData.reduce((acc, item) => acc + ((item.importCharges || 0) * item.quantity), 0);
  const totalHandlingFee = selectedItemsData.reduce((acc, item) => acc + ((item.handlingFee || 0) * item.quantity), 0);
  
  const extraFees = totalTax + totalVatGst + totalImportCharges + totalHandlingFee;
  const total = subtotal + totalShipping + extraFees;

  return (
    <main className='min-h-screen bg-white'>
      {/* ── 1. Page Breadcrumbs & Border Title ── */}
      <div className='w-full border-b border-[#e5e5e6]'>
        <div className='max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-5 text-left'>
          {/* Breadcrumbs Navigation */}
          <div className='flex items-center gap-2 text-[14px] text-[#848995] mb-2 font-normal'>
            <Link href='/' className='hover:text-black flex items-center gap-1'>
              <Home className='w-3.5 h-3.5' />
              <span>Home</span>
            </Link>
            <ChevronRight className='w-3.5 h-3.5' />
            <span className='text-black font-medium'>Checkout</span>
          </div>
          {/* Title */}
          <h1 className='text-[28px] font-semibold text-black leading-tight tracking-tight'>
            Checkout
          </h1>
        </div>
      </div>

      {/* ── 2. Two-Column Grid Responsive Layout ── */}
      <div className='max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-10'>
        <div className='flex flex-col lg:flex-row gap-12 items-start justify-between w-full'>
          {/* Left Column: Input Forms */}
          <div className='flex-1 w-full space-y-8'>
            <CheckoutUserDetails
              formData={{
                fullName: formData.fullName,
                email: formData.email,
                contactNumber: formData.contactNumber,
                address: formData.address,
              }}
              onChange={handleFieldChange}
              errors={errors}
            />

            <CheckoutShippingDetails
              formData={{
                country: formData.country,
                city: formData.city,
                location: formData.location,
                note: formData.note,
              }}
              onChange={handleFieldChange}
              errors={errors}
            />

            <CheckoutPaymentDetails
              formData={{
                selectedCardId: formData.selectedCardId,
                cardNumber: formData.cardNumber,
                cardExpiry: formData.cardExpiry,
                cardHolder: formData.cardHolder,
                cardCvv: formData.cardCvv,
              }}
              onChange={handleFieldChange}
              errors={errors}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className='w-full lg:w-auto shrink-0'>
            <CheckoutOrderSummary
              items={selectedItemsData}
              subtotal={subtotal}
              totalShipping={totalShipping}
              extraFees={extraFees}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Success Modal Backdrop Blur Overlay ── */}
      {showSuccessModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto'>
          <div className='bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 text-center animate-in zoom-in-95 duration-200 relative border border-[#e5e5e6]'>
            {/* Animated Success Checkmark Icon */}
            <div className='mx-auto w-16 h-16 bg-[#eefcf3] rounded-full flex items-center justify-center mb-6'>
              <CheckCircle2 className='w-10 h-10 text-[#22c55e]' />
            </div>

            {/* Modal Heading */}
            <h2 className='text-[24px] font-bold text-black mb-2'>Order Placed Successfully!</h2>
            <p className='text-[14px] text-[#848995] mb-6'>
              Thank you for shopping with us. Your order{' '}
              <span className='font-semibold text-black'>{orderId}</span> has been confirmed.
            </p>

            {/* Order Overview Panel */}
            <div className='bg-[#f2f2f3] rounded p-5 mb-8 text-left space-y-4 border border-[#e5e5e6]'>
              <h4 className='text-[14px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-200 pb-2'>
                Order details
              </h4>

              {/* Items loop summary */}
              <div className='max-h-35 overflow-y-auto space-y-2.5 pr-2'>
                {selectedItemsData.map((item) => (
                  <div key={item.id} className='flex justify-between items-center text-[14px]'>
                    <span className='text-[#42454d] truncate max-w-60'>
                      {item.name} <span className='text-gray-400'>x{item.quantity}</span>
                    </span>
                    <span className='text-black font-semibold'>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className='border-t border-gray-200 pt-3 space-y-2 text-[14px]'>
                {/* Delivery Address */}
                <div className='flex justify-between items-start'>
                  <span className='text-gray-500'>Shipping To:</span>
                  <span className='text-black font-medium text-right max-w-50 truncate'>
                    {formData.city}, {formData.country}
                  </span>
                </div>

                {/* Payment method info */}
                <div className='flex justify-between items-center'>
                  <span className='text-gray-500'>Payment:</span>
                  <span className='text-black font-medium'>
                    Credit Card
                  </span>
                </div>

                {/* Final Total */}
                <div className='flex justify-between items-center border-t border-dashed border-gray-200 pt-2 text-[15px] font-bold'>
                  <span className='text-black'>Total Paid:</span>
                  <span className='text-black text-[16px]'>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      total,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Link
                href='/products'
                className='w-full bg-[#dec33a] hover:bg-[#c9b030] text-black text-[15px] font-semibold py-3 px-4 rounded transition-all text-center flex items-center justify-center cursor-pointer'
              >
                Continue Shopping
              </Link>
              <button
                type='button'
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/orders');
                }}
                className='w-full border border-[#686f7d] hover:bg-[#686f7d]/5 text-black text-[15px] font-medium py-3 px-4 rounded transition-all text-center flex items-center justify-center cursor-pointer'
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/**
 * Checkout page controller.
 */
export default function CheckoutPage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white text-black'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-4 border-[#dec33a] border-t-transparent rounded-full animate-spin'></div>
          <span className='text-[16px] font-medium'>Loading checkout...</span>
        </div>
      </div>
    );
  }

  return <CheckoutForm key={session?.user?.id || 'guest'} session={session} />;
}
