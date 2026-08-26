/**
 * @fileoverview Main Checkout Page component — `/checkout`.
 * Coordinates user, shipping, and payment forms, calculates orders,
 * validates inputs, and renders a checkout completion success modal.
 *
 * @module app/checkout/page
 */

'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
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

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {})
        },
        body: JSON.stringify({
          items: selectedItemsData,
          formData,
          subtotal,
          shippingCost: totalShipping,
          taxAmount: totalTax,
          vatGst: totalVatGst,
          importCharges: totalImportCharges,
          handlingFee: totalHandlingFee,
          total
        })
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        window.location.assign(result.data.url);
      } else {
        alert(result.message || 'Failed to create checkout session');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
      setIsSubmitting(false);
    }
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
