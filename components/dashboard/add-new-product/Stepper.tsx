'use client';

import React from 'react';
import { Box, Images, Coins, Truck, FileBox, FileCheck } from 'lucide-react';

const steps = [
  { id: 1, name: 'Product Basics', icon: Box, iconLeft: 0, textLeft: 0 },
  { id: 2, name: 'Media & Variants', icon: Images, iconLeft: 218.5, textLeft: 198 },
  { id: 3, name: 'Pricing & Inventory', icon: Coins, iconLeft: 445, textLeft: 486, textCenter: true },
  { id: 4, name: 'Shipping', icon: Truck, iconLeft: 689, textLeft: 699 },
  { id: 5, name: 'Product Details', icon: FileBox, iconLeft: 914, textLeft: 907 },
  { id: 6, name: 'Review & Submit', icon: FileCheck, iconLeft: 1137, textLeft: 1124 },
];

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="h-[70px] relative shrink-0 w-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Container for icons, shifted by 19px as in Figma */}
      <div className="absolute h-[40px] left-[19px] top-0 w-[1529px]">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              {/* Icon Circle */}
              <div
                className={`absolute rounded-full size-[40px] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] z-10 top-0 flex items-center justify-center ${
                  isActive || isCompleted
                    ? 'bg-[#f09000] border border-[#f09000] text-white'
                    : 'bg-white border border-[#e5e5e6] text-black'
                }`}
                style={{ left: step.iconLeft }}
              >
                <Icon size={20} strokeWidth={1.5} />
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className="absolute h-[1px] top-[20px]"
                  style={{ 
                    left: step.iconLeft + 40 + 19, // 19px gap to start line
                    width: steps[index + 1].iconLeft - (step.iconLeft + 40 + 19) - 20, // 20px gap to end line
                  }}
                >
                  <div className={`h-[1px] w-full ${isCompleted ? 'bg-[#f09000]' : 'bg-[#e5e5e6]'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Container for labels, left-0 as in Figma */}
      <div className="absolute h-[18px] left-0 top-[52px] w-[1548px]">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <p
              key={step.id}
              className={`absolute font-['Open_Sans'] font-normal leading-[1.3] text-[14px] whitespace-nowrap ${
                isActive || isCompleted ? 'text-black' : 'text-[#42454d]'
              } ${step.textCenter ? '-translate-x-1/2' : ''}`}
              style={{ left: step.textLeft }}
            >
              {step.name}
            </p>
          );
        })}
      </div>
    </div>
  );
}
