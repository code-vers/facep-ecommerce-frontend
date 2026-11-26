'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopNavItemProps {
  label: string;
  href?: string;
  isOpen?: boolean;
  hasDropdown?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function TopNavItem({
  label,
  href,
  isOpen = false,
  hasDropdown = false,
  icon: Icon,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TopNavItemProps) {
  // Clickable button without link (e.g. "All" drawer trigger)
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex shrink-0 items-center gap-1.5 text-white hover:text-[#dec33a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[#dec33a]"
        aria-label={label}
      >
        {Icon && <Icon size={18} className="shrink-0" strokeWidth={2.2} />}
        <span>{label}</span>
      </button>
    );
  }

  // Hover dropdown trigger with direct link
  if (hasDropdown && href) {
    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="shrink-0 flex items-center h-full"
      >
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
        >
          {Icon && <Icon size={18} className="shrink-0" strokeWidth={2.2} />}
          <span>{label}</span>
          <ChevronDown
            size={14}
            className={cn(
              'transition-transform duration-200 opacity-80',
              isOpen && 'rotate-180 text-[#dec33a]',
            )}
          />
        </Link>
      </div>
    );
  }

  // Plain link
  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center gap-1.5 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
      >
        {Icon && <Icon size={18} className="shrink-0" strokeWidth={2.2} />}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-1.5 text-white hover:text-[#dec33a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[#dec33a]"
    >
      {Icon && <Icon size={18} className="shrink-0" strokeWidth={2.2} />}
      <span>{label}</span>
    </button>
  );
}
