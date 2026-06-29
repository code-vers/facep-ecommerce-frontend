'use client';

import React from 'react';

export default function PlaceholderStep({ stepName }: { stepName: string }) {
  return (
    <div className="border border-[#e5e5e6] bg-white rounded-md p-6 flex flex-col items-center justify-center min-h-[400px] w-full">
      <p className="font-semibold text-[20px] text-black mb-2">
        {stepName}
      </p>
      <p className="text-[14px] text-[#42454d] text-center max-w-md">
        This step is currently a placeholder. The specific fields and components for this section will be implemented later.
      </p>
    </div>
  );
}
