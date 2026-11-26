'use client';

import React from 'react';

interface NavPopoverWrapperProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

export default function NavPopoverWrapper({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  children,
}: NavPopoverWrapperProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 right-0 top-full z-50 w-full animate-in fade-in slide-in-from-top-1 duration-150 text-left"
    >
      <div className="w-full bg-white shadow-2xl border-b border-gray-200 px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-black">
        {children}
      </div>
    </div>
  );
}
