'use client';

import AccountSecurity from '@/components/profile/AccountSecurity';
import { useAuth } from '@/contexts/AuthContext';
import { usePlatformSettings, useProfile } from '@/hooks/api/useProfile';
import { profileApi, profileAssetUrl, type PlatformSettings, type Profile } from '@/lib/api/profile';
import { Camera, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function SettingsForm({ profile, settings }: { profile: Profile; settings?: PlatformSettings }) {
  const { refreshProfile } = useAuth();
  const [personal, setPersonal] = useState({ name: profile.name, contactNumber: profile.contactNumber ?? '', address: profile.address ?? '', avatarUrl: profile.avatarUrl ?? '' });
  const [platform, setPlatform] = useState(settings ? { ...settings, commissionRate: Number(settings.commissionRate), paymentGatewayFee: Number(settings.paymentGatewayFee) } : null);
  const [busy, setBusy] = useState(false);
  const isAdmin = profile.role === 'ADMIN';
  const inputClass = 'w-full rounded-sm border border-[#E5E5E6] bg-white px-3 py-2.5 text-sm text-[#42454D] outline-none focus:border-[#dec33a]';

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const avatarUrl = await profileApi.uploadAvatar(file);
      setPersonal((value) => ({ ...value, avatarUrl }));
      toast.success('Avatar uploaded. Save changes to update your profile.');
    } catch { toast.error('Avatar upload failed.'); }
    finally { setBusy(false); }
  };

  const save = async () => {
    setBusy(true);
    try {
      await profileApi.updateMe({ ...personal, contactNumber: personal.contactNumber || null, address: personal.address || null, avatarUrl: personal.avatarUrl || null });
      if (isAdmin && platform) {
        await profileApi.updatePlatformSettings({ siteName: platform.siteName, adminEmail: platform.adminEmail || null, supportEmail: platform.supportEmail || null, address: platform.address || null, defaultCurrency: platform.defaultCurrency, defaultTimezone: platform.defaultTimezone, commissionRate: platform.commissionRate, paymentGatewayFee: platform.paymentGatewayFee });
      }
      await refreshProfile();
      toast.success('Profile settings saved.');
    } catch { toast.error('Unable to save profile settings.'); }
    finally { setBusy(false); }
  };

  const field = (label: string, value: string | number, onChange: (value: string) => void, type = 'text', readOnly = false) => (
    <label className='flex flex-col gap-2 text-base text-black'>{label}<input className={`${inputClass} ${readOnly ? 'bg-gray-50 text-gray-500' : ''}`} type={type} value={value} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} /></label>
  );

  return (
    <div className='w-full space-y-8'>
      <section className='space-y-6 rounded-lg border border-[#E5E5E6] bg-white p-6'>
        <h2 className='text-xl font-semibold'>{isAdmin ? 'Profile Settings' : 'Personal Information'}</h2>
        <div className='flex items-center gap-4'>
          <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100'>
            {personal.avatarUrl ? <img src={profileAssetUrl(personal.avatarUrl)} alt={profile.name} className='h-full w-full object-cover' /> : <Camera />}
          </div>
          <label className='cursor-pointer rounded bg-[#dec33a] px-3 py-2 text-sm font-semibold'>Upload avatar<input type='file' accept='image/jpeg,image/png,image/webp' className='hidden' onChange={(e) => void upload(e.target.files?.[0])} /></label>
        </div>
        <div className='grid gap-5 md:grid-cols-2'>
          {field('Full Name', personal.name, (name) => setPersonal((value) => ({ ...value, name })))}
          {field('Email', profile.email, () => undefined, 'email', true)}
          {field('Contact Number', personal.contactNumber, (contactNumber) => setPersonal((value) => ({ ...value, contactNumber })), 'tel')}
          {field('Address', personal.address, (address) => setPersonal((value) => ({ ...value, address })))}
        </div>
        {isAdmin && platform && <div className='space-y-5 border-t pt-6'>
          <h2 className='text-xl font-semibold'>Business Settings</h2>
          <div className='grid gap-5 md:grid-cols-2'>
            {field('Site Name', platform.siteName, (siteName) => setPlatform({ ...platform, siteName }))}
            {field('Admin Email', platform.adminEmail ?? '', (adminEmail) => setPlatform({ ...platform, adminEmail }), 'email')}
            {field('Support Email', platform.supportEmail ?? '', (supportEmail) => setPlatform({ ...platform, supportEmail }), 'email')}
            {field('Business Address', platform.address ?? '', (address) => setPlatform({ ...platform, address }))}
            {field('Default Currency', platform.defaultCurrency, (defaultCurrency) => setPlatform({ ...platform, defaultCurrency: defaultCurrency.toUpperCase() }))}
            {field('Default Timezone', platform.defaultTimezone, (defaultTimezone) => setPlatform({ ...platform, defaultTimezone }))}
            {field('Commission Rate (%)', platform.commissionRate, (commissionRate) => setPlatform({ ...platform, commissionRate: Number(commissionRate) }), 'number')}
            {field('Payment Gateway Fee (%)', platform.paymentGatewayFee, (paymentGatewayFee) => setPlatform({ ...platform, paymentGatewayFee: Number(paymentGatewayFee) }), 'number')}
          </div>
        </div>}
        <div className='flex justify-end'><button onClick={save} disabled={busy} className='flex items-center gap-2 rounded bg-[#F09000] px-4 py-2 text-sm font-semibold disabled:opacity-50'>{busy ? <Loader2 className='animate-spin' size={16} /> : <Save size={16} />}Save Changes</button></div>
      </section>
      <AccountSecurity />
    </div>
  );
}

export default function ProfileSettingsForm() {
  const { session } = useAuth();
  const isAdmin = session?.user.role === 'ADMIN';
  const profile = useProfile();
  const settings = usePlatformSettings(isAdmin);
  if (profile.isLoading || (isAdmin && settings.isLoading)) return <div className='p-8'>Loading profile settings...</div>;
  if (!profile.data) return <div className='p-8 text-red-600'>Unable to load profile.</div>;
  return <SettingsForm key={`${profile.data.updatedAt}-${settings.data?.id ?? ''}`} profile={profile.data} settings={settings.data} />;
}
