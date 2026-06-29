'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Stepper from './Stepper';
import ProductBasics from './ProductBasics';
import MediaAndVariants from './MediaAndVariants';
import PricingAndInventory from './PricingAndInventory';
import PlaceholderStep from './PlaceholderStep';

export default function AddNewProductFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
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
        return <PlaceholderStep stepName="Shipping" />;
      case 5:
        return <PlaceholderStep stepName="Product Details" />;
      case 6:
        return <PlaceholderStep stepName="Review & Submit" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-[24px] items-end justify-end p-4 md:px-6 xl:px-[45px] xl:py-[36px] relative size-full bg-white">
      <div className="flex flex-col items-start w-full">
        <Stepper currentStep={currentStep} />
      </div>
      
      {/* Form Content */}
      <div className="w-full">
        {renderStep()}
      </div>

      <div className="flex gap-[16px] items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="bg-white border-[0.75px] border-[#686f7d] flex items-center justify-center min-w-[80px] px-[16px] py-[12px] rounded-[2px] disabled:opacity-50"
        >
          <ArrowLeft size={24} className="text-[#686f7d]" />
        </button>
        <button
          onClick={handleNext}
          className="bg-[#f09000] border border-[#f09000] flex items-center justify-center min-w-[80px] px-[16px] py-[12px] rounded-[2px]"
        >
          <ArrowRight size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}
