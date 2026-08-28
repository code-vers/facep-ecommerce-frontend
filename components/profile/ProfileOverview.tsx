/**
 * @fileoverview Profile Overview section of the User Profile Page.
 * Displays details like avatar, name, email, contact info, and home address.
 *
 * @module components/profile/ProfileOverview
 */

import React, { useState, useRef } from 'react';
import { Camera, Loader2, Save } from 'lucide-react';
import { profileAssetUrl } from '@/lib/api/profile';

interface UserProfileData {
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  avatarUrl: string;
}

interface ProfileOverviewProps {
  initialData: UserProfileData;
  onSave: (updated: UserProfileData) => Promise<void>;
  onAvatarUpload?: (file: File) => Promise<string>;
}

/**
 * ProfileOverview component.
 */
export default function ProfileOverview({
  initialData,
  onSave,
  onAvatarUpload,
}: ProfileOverviewProps) {
  const [formData, setFormData] = useState<UserProfileData>(initialData);
  const [avatar, setAvatar] = useState(initialData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onAvatarUpload) {
        setIsSaving(true);
        try {
          const result = await onAvatarUpload(file);
          setAvatar(result);
          setFormData((prev) => ({ ...prev, avatarUrl: result }));
        } catch {
          setErrors({ general: 'Failed to upload profile picture.' });
        } finally {
          setIsSaving(false);
        }
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Primary address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setSuccessMessage('');
    try {
      await onSave({ ...formData, avatarUrl: avatar });
      setSuccessMessage('Profile details updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full border border-[#e5e5e6] rounded bg-white p-6 space-y-6">
      {/* Header Label */}
      <div className="border-b border-[#e5e5e6] pb-3 text-left">
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          Profile Overview
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Selection Area */}
        <div className="flex flex-col gap-3 items-start relative">
          <div className="relative w-[86px] h-[86px] rounded-full overflow-hidden border border-[#e5e5e6] bg-gray-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profileAssetUrl(avatar)}
              alt="User Avatar"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Camera overlay icon */}
          <button
            type="button"
            onClick={handleCameraClick}
            className="absolute left-[61px] top-[61px] w-[25px] h-[25px] rounded-full bg-[#dec33a] hover:bg-[#c9b030] text-black border border-white flex items-center justify-center shadow cursor-pointer transition-all"
            title="Upload Profile Picture"
          >
            <Camera className="w-[14px] h-[14px]" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="text-left">
            <p className="text-[16px] text-black font-semibold">
              {formData.fullName || 'Afiah Rahman'}
            </p>
            <p className="text-[13px] text-[#848995] font-normal">
              Click camera icon to change photo
            </p>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
          {/* Full Name */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="profName" className="text-[16px] text-black font-normal">
              Full Name
            </label>
            <input
              id="profName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="e.g. Alexander von Berg"
              className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
            />
            {errors.fullName && (
              <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.fullName}</p>
            )}
          </div>

          {/* Email (Read-Only Primary Identifier) */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="profEmail" className="text-[16px] text-black font-normal">
              Email
            </label>
            <input
              id="profEmail"
              type="email"
              readOnly
              value={formData.email}
              title="Email address is read-only"
              placeholder="alexander@domain.com"
              className="w-full bg-gray-50 border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="profContact" className="text-[16px] text-black font-normal">
              Contact Number
            </label>
            <input
              id="profContact"
              type="tel"
              required
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              placeholder="+41 00 000 00 00"
              className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
            />
            {errors.contactNumber && (
              <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.contactNumber}</p>
            )}
          </div>

          {/* Primary Address */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="profAddress" className="text-[16px] text-black font-normal">
              Address
            </label>
            <input
              id="profAddress"
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Edelweiss Strasse, Zurich"
              className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
            />
            {errors.address && (
              <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Status Messages & Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-4">
          <div className="text-left w-full sm:w-auto">
            {successMessage && (
              <p className="text-[14px] text-green-600 font-medium">{successMessage}</p>
            )}
            {errors.general && (
              <p className="text-[14px] text-red-600 font-medium">{errors.general}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#dec33a] hover:bg-[#c9b030] text-black font-semibold text-[15px] py-2.5 px-6 rounded transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
