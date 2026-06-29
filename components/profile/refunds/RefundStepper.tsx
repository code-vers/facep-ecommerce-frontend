/**
 * @fileoverview Refund Flow Step Indicator.
 * Displays a horizontal stepper that matches the Figma design for the
 * Returns & Refunds multi-step flow.
 *
 * @module components/profile/refunds/RefundStepper
 */

'use client';

import React from 'react';
import { ShoppingBag, Undo2, HandCoins, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RefundStep =
  | 'your-details'
  | 'reason-for-return'
  | 'pickup-refund-method'
  | 'review-submit';

interface Step {
  key: RefundStep;
  label: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  { key: 'your-details', label: 'Your details', icon: ShoppingBag },
  { key: 'reason-for-return', label: 'Reason for Return', icon: Undo2 },
  { key: 'pickup-refund-method', label: 'Pickup & Refund Method', icon: HandCoins },
  { key: 'review-submit', label: 'Review & Submit', icon: FileCheck },
];

interface RefundStepperProps {
  currentStep: RefundStep;
}

/**
 * RefundStepper component showing progress through the return/refund flow.
 */
export default function RefundStepper({ currentStep }: RefundStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full flex justify-between">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.key} className="flex flex-col items-center flex-1 relative">
            {/* Step icon bubble */}
            <div className="relative z-10 flex flex-col items-center bg-white px-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border shadow-[0px_1px_1px_rgba(16,24,40,0.05)] transition-all duration-300',
                  isActive
                    ? 'bg-[#dec33a] border-[#dec33a] text-[#42454d]'
                    : 'bg-white border-[#e5e5e6] text-[#42454d]'
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
            </div>

            {/* Label */}
            <span
              className={cn(
                'mt-2 text-[14px] leading-[1.3] text-center max-w-[150px]',
                isActive ? 'text-black' : 'text-[#42454d]'
              )}
            >
              {step.label}
            </span>

            {/* Connector line (points to the right) */}
            {!isLast && (
              <div className="absolute top-5 left-[50%] w-full h-px bg-[#e5e5e6] z-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
