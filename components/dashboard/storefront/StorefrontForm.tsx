'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CircleCheck, Loader2, UploadCloud, Store as StoreIcon } from 'lucide-react';
import { toast } from 'sonner';
import { profileAssetUrl } from '@/lib/api/profile';
import { storefrontApi } from '@/lib/api/storefront';
import { useStorefront, useUpdateStorefront } from '@/hooks/api/useStorefront';

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=1400&auto=format&fit=crop';
const DEFAULT_LOGO =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop';

export default function StorefrontForm() {
  const { data, isLoading } = useStorefront();
  const updateMutation = useUpdateStorefront();

  // Form State
  const [storeName, setStoreName] = useState('');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeBanner, setStoreBanner] = useState('');
  const [bannerHeadline, setBannerHeadline] = useState('');
  const [bannerSubheadline, setBannerSubheadline] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');
  const [shippingPolicy, setShippingPolicy] = useState('');
  const [warrantyInformation, setWarrantyInformation] = useState('');

  // Upload loaders
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Hidden file input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when data loads
  useEffect(() => {
    if (data) {
      setStoreName(data.storeName || '');
      setStoreLogo(data.storeLogo || '');
      setStoreBanner(data.storeBanner || DEFAULT_BANNER);
      setBannerHeadline(data.bannerHeadline || 'Buy Your Favorite Plant');
      setBannerSubheadline(data.bannerSubheadline || `From ${data.storeName || 'Plant home'}`);
      setStoreDescription(data.storeDescription || '');
      setContactEmail(data.contactEmail || '');
      setContactPhone(data.contactPhone || '');
      setReturnPolicy(data.returnPolicy || '');
      setShippingPolicy(data.shippingPolicy || '');
      setWarrantyInformation(data.warrantyInformation || '');
    }
  }, [data]);

  // Handle Logo Upload
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      const logoUrl = await storefrontApi.uploadLogo(file);
      setStoreLogo(logoUrl);
      toast.success('Store logo uploaded successfully!');
    } catch {
      toast.error('Failed to upload store logo.');
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Handle Banner Upload
  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingBanner(true);
      const bannerUrl = await storefrontApi.uploadBanner(file);
      setStoreBanner(bannerUrl);
      toast.success('Store banner uploaded successfully!');
    } catch {
      toast.error('Failed to upload store banner.');
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate({
      storeName: storeName.trim(),
      storeLogo,
      storeBanner,
      bannerHeadline: bannerHeadline.trim(),
      bannerSubheadline: bannerSubheadline.trim(),
      storeDescription: storeDescription.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      returnPolicy: returnPolicy.trim(),
      shippingPolicy: shippingPolicy.trim(),
      warrantyInformation: warrantyInformation.trim(),
    });
  };

  const logoDisplaySrc = profileAssetUrl(storeLogo) || DEFAULT_LOGO;
  const bannerDisplaySrc = profileAssetUrl(storeBanner) || DEFAULT_BANNER;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-start border border-[#E5E5E6] bg-white p-4 md:p-6 2xl:p-[24px] rounded-[4px] gap-[24px]"
    >
      {/* Hidden File Inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoFileChange}
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerFileChange}
      />

      {/* Basic Store Information Section */}
      <div className="flex w-full flex-col items-start gap-[18px]">
        <h2 className="text-[20px] font-semibold leading-[1.2] text-black">
          Basic Store Information
        </h2>

        <div className="flex w-full flex-col items-start gap-[18px]">
          {/* Store Logo */}
          <div className="flex w-full flex-col items-start gap-[12px]">
            <label className="text-[16px] font-normal leading-[1.2] text-black">Store Logo</label>
            <div className="flex items-center gap-[16px]">
              <div className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[4px] bg-[#f7f7f8] border border-[#E5E5E6] flex items-center justify-center">
                {isUploadingLogo ? (
                  <Loader2 className="size-6 animate-spin text-[#f09000]" />
                ) : logoDisplaySrc ? (
                  <img
                    src={logoDisplaySrc}
                    alt="Store Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <StoreIcon className="size-8 text-[#848995]" />
                )}
              </div>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo || isLoading}
                className="text-[15px] font-normal leading-[1.2] text-[#165DD0] underline hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                {isUploadingLogo ? 'Uploading...' : 'Change Store Logo'}
              </button>
            </div>
          </div>

          {/* Store Banner & Live Preview */}
          <div className="flex w-full flex-col items-start gap-[8px]">
            <div className="flex items-center gap-[32px]">
              <label className="text-[16px] font-normal leading-[1.2] text-black">
                Store Banner
              </label>
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                disabled={isUploadingBanner || isLoading}
                className="text-[15px] font-normal leading-[1.2] text-[#165DD0] underline hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                {isUploadingBanner ? 'Uploading...' : 'Update Banner'}
              </button>
            </div>

            {/* Banner Preview Box */}
            <div className="flex w-full flex-col items-center rounded-[2px] border border-dashed border-[#E5E5E6] p-3 md:px-[24px] md:py-[12px]">
              <div className="relative h-[220px] sm:h-[300px] 2xl:h-[420px] w-full overflow-hidden rounded-[4px] bg-gray-900">
                <img
                  src={bannerDisplaySrc}
                  alt="Store Banner Preview"
                  className="h-full w-full object-cover opacity-85"
                />

                {/* Dark Gradient Overlay for legible text */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                {/* Live Overlay text */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 md:left-12 xl:left-[80px] flex flex-col items-start gap-2 sm:gap-4 text-white max-w-[80%]">
                  <p className="text-[20px] sm:text-[32px] xl:text-[42px] font-bold leading-[1.1] tracking-tight drop-shadow-sm">
                    {bannerHeadline || 'Buy Your Favorite Plant'}
                  </p>
                  <p className="text-[16px] sm:text-[24px] xl:text-[32px] font-medium leading-tight text-white/90 drop-shadow-sm">
                    {bannerSubheadline || `From ${storeName || 'Your Store'}`}
                  </p>
                </div>

                {isUploadingBanner && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 text-white text-sm">
                    <Loader2 className="size-6 animate-spin text-[#f09000]" />
                    <span>Uploading new banner image...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Editable Banner Overlay Text Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#42454D]">
                  Banner Main Headline
                </label>
                <input
                  type="text"
                  value={bannerHeadline}
                  onChange={(e) => setBannerHeadline(e.target.value)}
                  placeholder="e.g. Buy Your Favorite Plant"
                  className="w-full rounded-[2px] border border-[#E5E5E6] bg-white px-3 py-2 text-sm text-black outline-none focus:border-[#F09000]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#42454D]">
                  Banner Sub-Headline
                </label>
                <input
                  type="text"
                  value={bannerSubheadline}
                  onChange={(e) => setBannerSubheadline(e.target.value)}
                  placeholder="e.g. From Plant home"
                  className="w-full rounded-[2px] border border-[#E5E5E6] bg-white px-3 py-2 text-sm text-black outline-none focus:border-[#F09000]"
                />
              </div>
            </div>
          </div>

          {/* Store Name */}
          <div className="flex w-full flex-col items-start gap-[8px]">
            <label className="text-[16px] font-normal leading-[1.2] text-black">Store Name</label>
            <div className="flex w-full items-center rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] focus-within:border-[#F09000]">
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Store Name"
                className="w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none"
              />
            </div>
          </div>

          {/* Store Description */}
          <div className="flex w-full flex-col items-start gap-[8px]">
            <label className="text-[16px] font-normal leading-[1.2] text-black">
              Store Description
            </label>
            <div className="flex h-[84px] w-full items-start rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] focus-within:border-[#F09000]">
              <textarea
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                placeholder="Brief description of your store and products"
                className="h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none"
              />
            </div>
          </div>

          {/* Contact Email & Phone */}
          <div className="flex w-full flex-col md:flex-row items-start gap-[16px] 2xl:gap-[18px]">
            <div className="flex w-full md:flex-1 flex-col items-start gap-[8px]">
              <label className="text-[16px] font-normal leading-[1.2] text-black">
                Contact Email
              </label>
              <div className="flex w-full items-center rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] focus-within:border-[#F09000]">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@store.com"
                  className="w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none"
                />
              </div>
            </div>
            <div className="flex w-full md:flex-1 flex-col items-start gap-[8px]">
              <label className="text-[16px] font-normal leading-[1.2] text-black">
                Contact Phone
              </label>
              <div className="flex w-full items-center rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] focus-within:border-[#F09000]">
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Policies Section */}
      <div className="flex w-full flex-col items-start gap-[18px]">
        <h2 className="text-[20px] font-semibold leading-[1.2] text-black">Store Policies</h2>

        <div className="flex w-full flex-col items-start gap-[24px]">
          {/* Return Policy */}
          <div className="flex w-full flex-col items-start gap-[8px]">
            <label className="text-[16px] font-normal leading-[1.2] text-black">
              Return Policy
            </label>
            <div className="flex h-[84px] w-full items-start rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] focus-within:border-[#F09000]">
              <textarea
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                placeholder="Detail your return terms, accepted conditions, and refund timeframe..."
                className="h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none"
              />
            </div>
          </div>

          {/* Shipping Policy */}
          <div className="flex w-full flex-col items-start gap-[8px]">
            <label className="text-[16px] font-normal leading-[1.2] text-black">
              Shipping Policy
            </label>
            <div className="flex h-[84px] w-full items-start rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] focus-within:border-[#F09000]">
              <textarea
                value={shippingPolicy}
                onChange={(e) => setShippingPolicy(e.target.value)}
                placeholder="Shipping regions, standard delivery times, and rates..."
                className="h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none"
              />
            </div>
          </div>

          {/* Warranty Information */}
          <div className="flex w-full flex-col items-start gap-[8px]">
            <label className="text-[16px] font-normal leading-[1.2] text-black">
              Warranty Information
            </label>
            <div className="flex h-[84px] w-full items-start rounded-[2px] border border-[#E5E5E6] bg-white px-[12px] py-[10px] focus-within:border-[#F09000]">
              <textarea
                value={warrantyInformation}
                onChange={(e) => setWarrantyInformation(e.target.value)}
                placeholder="Warranty coverage, claims process, and exclusions..."
                className="h-full w-full resize-none bg-transparent text-[14px] font-normal leading-[1.3] text-[#42454D] outline-none"
              />
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="flex w-full justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending || isUploadingLogo || isUploadingBanner}
              className="flex h-[38px] items-center justify-center gap-[6px] rounded-[2px] border border-[#F09000] bg-[#F09000] px-[16px] py-[8px] transition-colors hover:bg-[#d88200] disabled:opacity-50 cursor-pointer"
            >
              {updateMutation.isPending ? (
                <Loader2 size={16} className="animate-spin text-black" />
              ) : (
                <CircleCheck size={16} className="text-black" />
              )}
              <span className="whitespace-nowrap text-[14px] font-medium leading-[1.2] text-black">
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
