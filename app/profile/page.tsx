'use client';

import AccountSecurity from '@/components/profile/AccountSecurity';
import ProfileAddresses from '@/components/profile/ProfileAddresses';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfilePaymentMethods from '@/components/profile/ProfilePaymentMethods';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/api/useProfile';
import { profileApi, type SavedPaymentMethod } from '@/lib/api/profile';
import type { UserAddress, UserSavedCard } from '@/lib/profile-data';
import { toast } from 'sonner';

const toUiCard = (card: SavedPaymentMethod): UserSavedCard => ({
  ...card,
  brand: card.brand === 'VISA' ? 'Visa' : 'Mastercard',
});

export default function ProfilePage() {
  const { refreshProfile } = useAuth();
  const { data: profile, isLoading, refetch } = useProfile();

  if (isLoading) return <div className='p-8 text-center'>Loading profile...</div>;
  if (!profile) return <div className='p-8 text-center text-red-600'>Unable to load profile.</div>;

  const saveProfile = async (data: { fullName: string; email: string; contactNumber: string; address: string; avatarUrl: string }) => {
    await profileApi.updateMe({ name: data.fullName, contactNumber: data.contactNumber || null, address: data.address || null, avatarUrl: data.avatarUrl || null });
    await Promise.all([refetch(), refreshProfile()]);
    toast.success('Profile updated successfully.');
  };

  const syncAddresses = async (next: UserAddress[]) => {
    const current = profile.addresses;
    for (const old of current) if (!next.some((item) => item.id === old.id)) await profileApi.deleteAddress(old.id);
    for (const item of next) {
      const old = current.find((entry) => entry.id === item.id);
      if (!old) await profileApi.createAddress({ label: item.label, addressLine: item.addressLine, phone: item.phone, isDefault: item.isDefault });
      else if (item.isDefault && !old.isDefault) await profileApi.defaultAddress(item.id);
      else if (item.label !== old.label || item.addressLine !== old.addressLine || item.phone !== old.phone) await profileApi.updateAddress(item.id, { label: item.label, addressLine: item.addressLine, phone: item.phone });
    }
    await refetch();
  };

  const syncCards = async (next: UserSavedCard[]) => {
    const current = profile.paymentMethods;
    for (const old of current) if (!next.some((item) => item.id === old.id)) await profileApi.deletePaymentMethod(old.id);
    for (const item of next) {
      const old = current.find((entry) => entry.id === item.id);
      const metadata = { label: item.label, brand: item.brand === 'Visa' ? 'VISA' as const : 'MASTERCARD' as const, last4: item.last4, expiry: item.expiry, isDefault: item.isDefault };
      if (!old) await profileApi.createPaymentMethod(metadata);
      else if (item.isDefault && !old.isDefault) await profileApi.defaultPaymentMethod(item.id);
      else if (item.label !== old.label || item.expiry !== old.expiry) await profileApi.updatePaymentMethod(item.id, metadata);
    }
    await refetch();
  };

  return (
    <div className='w-full space-y-8 text-left'>
      <ProfileOverview key={profile.updatedAt} initialData={{ fullName: profile.name, email: profile.email, contactNumber: profile.contactNumber ?? '', address: profile.address ?? '', avatarUrl: profile.avatarUrl ?? '' }} onSave={saveProfile} onAvatarUpload={profileApi.uploadAvatar} />
      <ProfileAddresses key={`addresses-${profile.addresses.map((item) => item.id).join('-')}`} initialAddresses={profile.addresses} onUpdateAddresses={syncAddresses} />
      <ProfilePaymentMethods key={`payments-${profile.paymentMethods.map((item) => item.id).join('-')}`} initialCards={profile.paymentMethods.map(toUiCard)} initialPaymentMethod={profile.preferredPaymentMethod} onUpdateCards={syncCards} onUpdatePaymentMethod={async (method) => { await profileApi.updatePaymentPreference(method); await refetch(); }} />
      <AccountSecurity />
    </div>
  );
}
