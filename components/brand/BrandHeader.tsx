import { useState } from 'react';
import Image from 'next/image';
import { Heart, Search, ChevronDown, ExternalLink, X, Mail, Phone, ShieldCheck } from 'lucide-react';
import { cn, getImageUrl } from '@/lib/utils';
import type { IVendorStorefront } from '@/lib/api/storefront';

interface BrandHeaderProps {
  searchInputValue: string;
  setSearchInputValue: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isFollowed: boolean;
  setIsFollowed: (val: boolean) => void;
  storefront?: IVendorStorefront | null;
}

export default function BrandHeader({
  searchInputValue,
  setSearchInputValue,
  onSearchSubmit,
  isFollowed,
  setIsFollowed,
  storefront,
}: BrandHeaderProps) {
  const [activePolicyModal, setActivePolicyModal] = useState<{ title: string; content: string } | null>(null);

  const storeName = storefront?.storeName || 'Official Storefront';
  const firstLetter = storeName.charAt(0).toUpperCase() || 'S';
  const logoUrl = storefront?.storeLogo ? getImageUrl(storefront.storeLogo) : null;
  const description =
    storefront?.storeDescription ||
    'Welcome to our official store on Facep. Browse authentic products with quality guarantees and reliable delivery.';

  const handleOpenPolicy = (title: string, content?: string) => {
    setActivePolicyModal({
      title,
      content: content || 'No specific policy information provided by this store.',
    });
  };

  return (
    <>
      <section className="bg-white border-b border-[#E5E5E6] py-6 sm:py-8">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 flex flex-col gap-6">
          {/* Logo & Search Bar Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Brand Identity & Follow Button */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-[8px] bg-emerald-800 flex items-center justify-center shadow-md border border-emerald-700">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={storeName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-serif font-bold italic tracking-wider select-none">
                    {firstLetter}
                  </span>
                )}
                <div className="absolute bottom-1 right-1 size-2.5 rounded-full bg-[#dec33a] ring-2 ring-white" />
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-[24px] sm:text-[30px] font-bold leading-none text-black tracking-tight font-sans">
                    {storeName}
                  </h2>
                  <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[13px] text-gray-500">
                  <span className="text-emerald-800 font-medium">Verified Seller</span>
                  {storefront?.contactEmail && (
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <Mail size={12} /> {storefront.contactEmail}
                    </span>
                  )}
                  {storefront?.contactPhone && (
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <Phone size={12} /> {storefront.contactPhone}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFollowed(!isFollowed)}
                className={cn(
                  "flex items-center gap-2 h-10 px-5 rounded-[2px] text-[14px] font-bold transition-all duration-200 cursor-pointer shadow-xs border focus-visible:outline-hidden",
                  isFollowed
                    ? "bg-[#E5E5E6] border-[#CACACE] text-gray-700 hover:bg-gray-200"
                    : "bg-[#dec33a] border-[#dec33a] text-black hover:bg-[#C9B034] hover:border-[#C9B034] active:bg-[#B49A2E]"
                )}
              >
                <Heart size={16} fill={isFollowed ? "currentColor" : "none"} />
                <span>{isFollowed ? "Favourites Added" : "Add to Favourites"}</span>
              </button>
            </div>

            {/* Right: Search Box */}
            <form
              onSubmit={onSearchSubmit}
              className="flex min-w-0 w-full lg:max-w-xl items-center border border-[#CACACE] rounded-[2px] bg-white shadow-xs focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all"
            >
              <div className="hidden sm:flex h-11 shrink-0 items-center gap-1.5 rounded-l-sm bg-gray-100 px-3.5 border-r border-[#CACACE] text-[14px] text-[#42454d]">
                <span>All</span>
                <ChevronDown size={14} />
              </div>
              <div className="flex h-11 min-w-0 flex-1 items-center px-3.5">
                <input
                  type="text"
                  placeholder="Search Products In This Store"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-black outline-hidden placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-sm bg-[#dec33a] hover:bg-[#C9B034] transition-colors text-black cursor-pointer"
                aria-label="Search Store"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Description Copy */}
          <div className="flex flex-col gap-4">
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 max-w-5xl whitespace-pre-line">
              {description}
            </p>

            {/* Policy Row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-1">
              <button
                type="button"
                onClick={() => handleOpenPolicy('Return Policy', storefront?.returnPolicy)}
                className="flex items-center gap-1.5 text-[14px] font-semibold text-[#165DD0] hover:underline cursor-pointer"
              >
                <span>Return Policy</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleOpenPolicy('Shipping Policy', storefront?.shippingPolicy)}
                className="flex items-center gap-1.5 text-[14px] font-semibold text-[#165DD0] hover:underline cursor-pointer"
              >
                <span>Shipping Policy</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleOpenPolicy('Warranty Information', storefront?.warrantyInformation)}
                className="flex items-center gap-1.5 text-[14px] font-semibold text-[#165DD0] hover:underline cursor-pointer"
              >
                <span>Warranty Information</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
          onClick={() => setActivePolicyModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-gray-900">{activePolicyModal.title}</h3>
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 max-h-[60vh] overflow-y-auto text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {activePolicyModal.content}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-black transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
