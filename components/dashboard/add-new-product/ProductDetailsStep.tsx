'use client';

import React, { useState } from 'react';
import { PenLine, Trash2, Plus, ChevronDown } from 'lucide-react';
import RichTextEditorPlaceholder from './RichTextEditorPlaceholder';
import AdditionalDetailsSection from './AdditionalDetailsSection';
import ProductInventorySection from './ProductInventorySection';

interface SpecRow {
  id: string;
  name: string;
  value: string;
}

export default function ProductDetailsStep() {
  const [specs, setSpecs] = useState<SpecRow[]>([
    { id: '1', name: 'Ear Placement', value: 'Over Ear' },
    { id: '2', name: 'Ear Placement', value: 'Over Ear' },
    { id: '3', name: 'Ear Placement', value: 'Over Ear' },
  ]);

  const addRow = () => {
    const newRow: SpecRow = {
      id: Math.random().toString(36).substring(7),
      name: '',
      value: ''
    };
    setSpecs([...specs, newRow]);
  };

  const removeRow = (id: string) => {
    setSpecs(specs.filter(spec => spec.id !== id));
  };

  const updateRow = (id: string, field: 'name' | 'value', val: string) => {
    setSpecs(specs.map(spec => spec.id === id ? { ...spec, [field]: val } : spec));
  };

  return (
    <div className="border border-[#e5e5e6] border-solid bg-white flex flex-col items-start w-full relative shrink-0 rounded-[4px]">
      <div className="flex flex-col gap-[24px] items-start p-[24px] w-full relative shrink-0">
        
        {/* Product Details Header */}
        <h3 className="font-semibold leading-[1.2] text-[20px] text-black font-sans">
          Product Details
        </h3>
        
        {/* Product Specification Section Wrapper */}
        <div className="border border-[#e5e5e6] border-solid rounded-[4px] flex flex-col gap-[24px] items-start p-[16px] w-full relative shrink-0">
          <div className="flex flex-row items-center justify-between w-full">
            <h4 className="font-semibold leading-[1.2] text-[20px] text-black font-sans">
              Product Specification
            </h4>
            <button 
              onClick={addRow}
              className="font-normal text-[16px] text-[#165dd0] flex items-center hover:underline"
            >
              Add Row <Plus size={16} className="ml-1" />
            </button>
          </div>

          <div className="flex w-full relative shrink-0 overflow-x-auto">
            {/* Table Container */}
            <div className="flex w-full min-w-[600px] border-l border-[#e5e5e6]">
              
              {/* Specification Name Column */}
              <div className="flex flex-col flex-1 border-r border-[#e5e5e6]">
                <div className="bg-[#f2f2f3] border-b-[0.5px] border-t-[0.5px] border-[#e5e5e6] h-[34px] flex items-center justify-start px-[8px] py-[9px]">
                  <span className="font-normal text-[14px] text-black">Specification Name</span>
                </div>
                {specs.map((spec) => (
                  <div key={`name-${spec.id}`} className="border-b-[0.5px] border-[#e5e5e6] h-[48px] flex items-center px-[8px] py-[4px]">
                    <input 
                      type="text" 
                      value={spec.name}
                      onChange={(e) => updateRow(spec.id, 'name', e.target.value)}
                      placeholder="Specification Name"
                      className="w-full bg-transparent text-[12px] text-[#42454d] outline-none placeholder:text-[#848995]"
                    />
                  </div>
                ))}
              </div>

              {/* Specification Value Column */}
              <div className="flex flex-col flex-1 border-r border-[#e5e5e6]">
                <div className="bg-[#f2f2f3] border-b-[0.5px] border-t-[0.5px] border-[#e5e5e6] h-[34px] flex items-center justify-start px-[8px] py-[9px]">
                  <span className="font-normal text-[14px] text-black">Specification Value</span>
                </div>
                {specs.map((spec) => (
                  <div key={`value-${spec.id}`} className="border-b-[0.5px] border-[#e5e5e6] h-[48px] flex items-center px-[8px] py-[4px]">
                    <input 
                      type="text" 
                      value={spec.value}
                      onChange={(e) => updateRow(spec.id, 'value', e.target.value)}
                      placeholder="Specification Value"
                      className="w-full bg-transparent text-[12px] text-[#42454d] outline-none placeholder:text-[#848995]"
                    />
                  </div>
                ))}
              </div>

              {/* Action Column */}
              <div className="flex flex-col w-[134px] border-r border-[#e5e5e6]">
                <div className="bg-[#f2f2f3] border-b-[0.5px] border-t-[0.5px] border-[#e5e5e6] h-[34px] flex items-center justify-center px-[8px] py-[9px]">
                  <span className="font-normal text-[14px] text-black">Action</span>
                </div>
                {specs.map((spec) => (
                  <div key={`action-${spec.id}`} className="border-b-[0.5px] border-[#e5e5e6] h-[48px] flex items-center justify-center gap-[12px] px-[8px] py-[4px]">
                    <button className="text-[#42454d] hover:text-black transition-colors">
                      <PenLine size={16} />
                    </button>
                    <button 
                      onClick={() => removeRow(spec.id)}
                      className="text-[#42454d] hover:text-[#cb1b1b] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charges & Deals Section */}
        <AdditionalDetailsSection />

        {/* About This Item Section */}
        <div className="flex flex-col gap-[8px] w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            About This Item (Key Features)
          </p>
          <RichTextEditorPlaceholder minHeight="150px" placeholder="Enter key features..." />
        </div>

        {/* Detailed Product Description Section */}
        <div className="flex flex-col gap-[8px] w-full">
          <p className="font-normal leading-[1.2] text-[16px] text-black">
            Detailed Product Description
          </p>
          <RichTextEditorPlaceholder minHeight="250px" placeholder="Enter detailed product description..." />
        </div>

        {/* Returns Section */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-[24px] w-full pt-[24px] border-t border-[#e5e5e6]">
          <div className="flex flex-col gap-[8px] flex-[0.33] w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Return Policy
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-center justify-between overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <select
                className="flex-1 bg-transparent outline-none appearance-none font-normal leading-[1.3] text-[14px] text-black cursor-pointer pr-6 w-full"
                defaultValue="30 days"
              >
                <option value="30 days">30 Days Return</option>
                <option value="no return">No Return</option>
              </select>
              <ChevronDown className="size-4 text-[#848995] absolute right-[12px] pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-col gap-[8px] flex-[0.67] w-full">
            <p className="font-normal leading-[1.2] text-[16px] text-black">
              Return terms
            </p>
            <div className="bg-white border border-[#e5e5e6] flex items-start overflow-clip px-[12px] py-[10px] rounded-[2px] relative w-full">
              <textarea
                placeholder="Enter return terms and conditions..."
                className="w-full min-h-[42px] bg-transparent outline-none font-normal leading-[1.3] text-[14px] text-black placeholder:text-[#848995] resize-y"
              />
            </div>
          </div>
        </div>

        {/* Product Inventory Section */}
        <div className="w-full pt-[24px] border-t border-[#e5e5e6]">
          <ProductInventorySection />
        </div>

      </div>
    </div>
  );
}
