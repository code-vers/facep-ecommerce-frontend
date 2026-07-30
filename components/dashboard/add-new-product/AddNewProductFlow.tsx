'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { apiClient } from '../../../lib/api/axios';
import {
  buildProductPayload,
  PRODUCT_STEP_BY_FIELD,
  validateProductStep,
} from '../../../lib/product-form';
import { useProductFormStore } from '../../../store/useProductFormStore';
import MediaAndVariants from './MediaAndVariants';
import PricingAndInventory from './PricingAndInventory';
import ProductBasics from './ProductBasics';
import ProductDetailsStep from './ProductDetailsStep';
import ReviewAndSubmitStep from './ReviewAndSubmitStep';
import ShippingStep from './ShippingStep';
import Stepper from './Stepper';

interface AddNewProductFlowProps {
  productId?: string;
}

export default function AddNewProductFlow({ productId }: AddNewProductFlowProps) {
  const router = useRouter();
  const store = useProductFormStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState('');
  const totalSteps = 6;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = buildProductPayload(store);
      const response = productId
        ? await apiClient.patch(`/products/${productId}`, payload)
        : await apiClient.post('/products', payload);
      return response.data;
    },
    onSuccess: () => {
      store.resetForm();
      toast.success(productId ? 'Product updated successfully' : 'Product added successfully');
      router.push('/dashboard/products');
    },
    onError: (error: AxiosError<{ errorSources?: Array<{ path: string; message: string }>; message?: string }>) => {
      const data = error.response?.data;
      const source = data?.errorSources?.[0];
      if (source) {
        const path = String(source.path).split('.').pop() ?? '';
        const targetStep = PRODUCT_STEP_BY_FIELD[path] || 6;
        setSubmitError(source.message);
        setCurrentStep(targetStep);
      } else {
        setSubmitError(data?.message || `Failed to ${productId ? 'update' : 'add'} product`);
      }
    },
  });

  const handleNext = () => {
    setSubmitError('');
    if (currentStep < totalSteps) {
      const error = validateProductStep(store, currentStep);
      if (error) {
        setSubmitError(error);
        return;
      }
      setCurrentStep((step) => step + 1);
      return;
    }
    for (let step = 1; step <= 5; step += 1) {
      const error = validateProductStep(store, step);
      if (error) {
        setSubmitError(error);
        setCurrentStep(step);
        return;
      }
    }
    submitMutation.mutate();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProductBasics onNext={handleNext} onBack={() => undefined} />;
      case 2:
        return <MediaAndVariants />;
      case 3:
        return <PricingAndInventory />;
      case 4:
        return <ShippingStep />;
      case 5:
        return <ProductDetailsStep />;
      case 6:
        return <ReviewAndSubmitStep onEditStep={setCurrentStep} />;
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col gap-[24px] items-end justify-end p-4 md:px-6 xl:px-[45px] xl:py-[36px] relative size-full bg-white'>
      <div className='flex flex-col items-start w-full'>
        <Stepper currentStep={currentStep} />
      </div>
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
          onClick={() => currentStep > 1 && setCurrentStep((step) => step - 1)}
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
            <span className='font-normal text-[16px] text-white'>
              {productId ? 'Update' : 'Submit'}
            </span>
          ) : (
            <ArrowRight size={24} className='text-white' />
          )}
        </button>
      </div>
    </div>
  );
}
