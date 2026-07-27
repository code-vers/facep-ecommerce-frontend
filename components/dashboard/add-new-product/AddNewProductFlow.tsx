'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '../../../lib/api/axios';
import { useProductFormStore } from '../../../store/useProductFormStore';
import MediaAndVariants from './MediaAndVariants';
import PricingAndInventory from './PricingAndInventory';
import ProductBasics from './ProductBasics';
import ProductDetailsStep from './ProductDetailsStep';
import ReviewAndSubmitStep from './ReviewAndSubmitStep';
import ShippingStep from './ShippingStep';
import Stepper from './Stepper';

export default function AddNewProductFlow() {
  const router = useRouter();
  const store = useProductFormStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [submitError, setSubmitError] = useState('');

  const submitMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post('/products', payload);
      return res.data;
    },
    onSuccess: () => {
      store.resetForm();
      router.push('/dashboard/products'); // Redirect on success
    },
    onError: (error: any) => {
      setSubmitError(error.response?.data?.message || 'Failed to add product');
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      setSubmitError('');

      const payload = {
        name: store.brand, // mapping brand to name, or we can use shortDescription
        shortDescription: store.shortDescription,
        productType: store.productType,
        categoryId: store.categoryId,
        subcategoryId: store.subcategoryId || undefined,
        tags: store.tags,
        condition: store.condition,
        availableColors: store.availableColors,
        thumbnail: store.thumbnail,
        previewImages: store.previewImages,
        hasVariants: store.hasVariants,

        // mapped dynamically for create variants
        variants:
          store.hasVariants && store.variants.length > 0
            ? {
                create: store.variants.map((v) => ({
                  sku: v.sku,
                  image: v.image || undefined,
                  color: v.color || undefined,
                  size: v.size || undefined,
                  price: v.price,
                  stock: v.stock,
                })),
              }
            : undefined,

        basePrice: store.basePrice || 0,
        oldPrice: store.oldPrice || undefined,
        discountType: store.discountType || undefined,
        discountValue: store.discountValue || undefined,
        dealBadgeText: store.dealBadgeText || undefined,
        dealStartDate: store.dealStartDate
          ? new Date(store.dealStartDate).toISOString()
          : undefined,
        dealEndDate: store.dealEndDate ? new Date(store.dealEndDate).toISOString() : undefined,

        taxAmount: store.taxAmount || undefined,
        vatGst: store.vatGst || undefined,
        importCharges: store.importCharges || undefined,
        handlingFee: store.handlingFee || undefined,

        shipsFrom: store.shipsFrom || undefined,
        minDeliveryDays: store.minDeliveryDays || undefined,
        maxDeliveryDays: store.maxDeliveryDays || undefined,
        shippingFeeType: store.shippingFeeType,
        shippingCost: store.shippingFeeType === 'STANDARD' ? store.shippingCost || 0 : 0,
        shippingZoneId:
          store.shippingFeeType === 'PREDEFINED' && store.shippingZoneId
            ? store.shippingZoneId
            : undefined,
        courierId:
          store.shippingFeeType === 'PREDEFINED' && store.courierId ? store.courierId : undefined,

        deliveryStandard: store.deliveryStandard,
        deliveryCod: store.deliveryCod,
        deliveryExpress: store.deliveryExpress,
        deliveryReturnPickup: store.deliveryReturnPickup,

        specifications:
          store.specifications.length > 0
            ? {
                create: store.specifications.map((s) => ({
                  name: s.name,
                  value: s.value,
                })),
              }
            : undefined,

        keyFeatures: store.keyFeatures || undefined,
        detailedDescription: store.detailedDescription || undefined,
        returnPolicy: store.returnPolicy || undefined,
        returnTerms: store.returnTerms || undefined,

        sku: store.sku,
        stockQuantity: store.stockQuantity || 0,
        stockStatus: store.stockStatus,
        lowStockAlertQuantity: store.lowStockAlertQuantity || undefined,
        minOrderQuantity: store.minOrderQuantity || 1,
        maxOrderQuantity: store.maxOrderQuantity || undefined,
        inventoryManagedBy: store.inventoryManagedBy || undefined,
        warehouseLocation: store.warehouseLocation || undefined,
      };

      submitMutation.mutate(payload);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProductBasics onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <MediaAndVariants />;
      case 3:
        return <PricingAndInventory />;
      case 4:
        return <ShippingStep />;
      case 5:
        return <ProductDetailsStep />;
      case 6:
        return <ReviewAndSubmitStep />;
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col gap-[24px] items-end justify-end p-4 md:px-6 xl:px-[45px] xl:py-[36px] relative size-full bg-white'>
      <div className='flex flex-col items-start w-full'>
        <Stepper currentStep={currentStep} />
      </div>

      {/* Form Content */}
      <div className='w-full'>
        {renderStep()}
        {submitError && (
          <div className='mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm w-full'>
            {submitError}
          </div>
        )}
      </div>

      <div className='flex gap-[16px] items-center'>
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || submitMutation.isPending}
          className='bg-white border-[0.75px] border-[#686f7d] flex items-center justify-center min-w-[80px] px-[16px] py-[12px] rounded-[2px] disabled:opacity-50'
        >
          <ArrowLeft size={24} className='text-[#686f7d]' />
        </button>
        <button
          onClick={handleNext}
          disabled={submitMutation.isPending}
          className='bg-[#f09000] border border-[#f09000] flex items-center justify-center min-w-[80px] px-[16px] py-[12px] rounded-[2px] disabled:opacity-50'
        >
          {submitMutation.isPending ? (
            <span className='font-normal text-[16px] text-white'>Submitting...</span>
          ) : currentStep === 6 ? (
            <span className='font-normal text-[16px] text-white'>Submit</span>
          ) : (
            <ArrowRight size={24} className='text-white' />
          )}
        </button>
      </div>
    </div>
  );
}
