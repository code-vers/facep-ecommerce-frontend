/**
 * @fileoverview Refund Flow Orchestrator.
 * Orchestrates the 4-step return/refund request flow, managing state
 * between steps and coordinating the step indicator.
 *
 * @module components/profile/refunds/RefundFlow
 */

'use client';

import React, { useState } from 'react';
import RefundStepper, { RefundStep } from './RefundStepper';
import RefundSelectProducts, { ReturnableItem } from './RefundSelectProducts';
import RefundReasonForm, { ReturnReasonData } from './RefundReasonForm';
import RefundPickupMethod, { PickupMethodData } from './RefundPickupMethod';
import RefundReviewSubmit from './RefundReviewSubmit';

// This would normally come from an API / shared data source
const ALL_RETURNABLE_ITEMS: ReturnableItem[] = [
  {
    id: 'item-1',
    orderId: 'ORD-123456',
    name: 'Samsung Galaxy S25 Ultra',
    seller: 'By tech store',
    price: '$1,649.99',
    imageSrc: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: '4,470',
    orderDate: '01.05.26',
  },
  {
    id: 'item-2',
    orderId: 'ORD-789012',
    name: 'Office Chair Pro',
    seller: 'By chair co',
    price: '$199.99',
    imageSrc: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=300&auto=format&fit=crop',
    rating: 4.2,
    reviewCount: '1,230',
    orderDate: '15.04.26',
  },
];

const STEP_ORDER: RefundStep[] = [
  'your-details',
  'reason-for-return',
  'pickup-refund-method',
  'review-submit',
];

/**
 * RefundFlow — top-level component that assembles the complete
 * return/refund wizard.
 */
export default function RefundFlow() {
  const [currentStep, setCurrentStep] = useState<RefundStep>('your-details');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [reasonData, setReasonData] = useState<ReturnReasonData | null>(null);
  const [pickupData, setPickupData] = useState<PickupMethodData | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const goToStep = (step: RefundStep) => setCurrentStep(step);
  const goBack = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  const selectedItems = ALL_RETURNABLE_ITEMS.filter((item) =>
    selectedItemIds.includes(item.id)
  );

  return (
    <div className="flex flex-col gap-9 w-full">
      {/* Step progress indicator */}
      <RefundStepper currentStep={currentStep} />

      {/* Step content */}
      <div className="w-full">
        {currentStep === 'your-details' && (
          <RefundSelectProducts
            onNext={(ids) => {
              setSelectedItemIds(ids);
              goToStep('reason-for-return');
            }}
          />
        )}

        {currentStep === 'reason-for-return' && (
          <RefundReasonForm
            selectedItems={selectedItems}
            onBack={goBack}
            onNext={(data) => {
              setReasonData(data);
              goToStep('pickup-refund-method');
            }}
          />
        )}

        {currentStep === 'pickup-refund-method' && (
          <RefundPickupMethod
            onBack={goBack}
            onNext={(data) => {
              setPickupData(data);
              goToStep('review-submit');
            }}
          />
        )}

        {currentStep === 'review-submit' && reasonData && pickupData && (
          <RefundReviewSubmit
            selectedItems={selectedItems}
            reasonData={reasonData}
            pickupData={pickupData}
            onBack={goBack}
            onSubmit={() => setIsSubmitted(true)}
            isSubmitted={isSubmitted}
          />
        )}
      </div>
    </div>
  );
}
