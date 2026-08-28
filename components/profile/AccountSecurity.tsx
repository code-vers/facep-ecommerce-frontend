'use client';

import { useAuth } from '@/contexts/AuthContext';
import { profileApi } from '@/lib/api/profile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AccountSecurity() {
  const { logout } = useAuth();
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deactivationPassword, setDeactivationPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const changePassword = async () => {
    if (!oldPassword) return toast.error('Enter your current password.');
    if (newPassword.length < 8) return toast.error('New password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match.');
    setBusy(true);
    try {
      await profileApi.changePassword({ oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully.');
    } catch {
      toast.error('Could not change password. Check your current password.');
    } finally {
      setBusy(false);
    }
  };

  const deactivate = async () => {
    if (!deactivationPassword) return toast.error('Enter your current password.');
    if (!window.confirm('Deactivate your account? An administrator must reactivate it.')) return;
    setBusy(true);
    try {
      await profileApi.deactivateMe(deactivationPassword);
      logout();
      router.replace('/login');
    } catch {
      toast.error('Could not deactivate the account. Check your password.');
      setBusy(false);
    }
  };

  const inputClass = 'w-full rounded border border-[#e5e5e6] px-3 py-2 text-sm outline-none focus:border-[#dec33a]';
  return (
    <section className='w-full space-y-5 rounded border border-[#e5e5e6] bg-white p-6'>
      <h2 className='text-xl font-semibold'>Account Security</h2>
      <div className='grid gap-4 md:grid-cols-3'>
        <input className={inputClass} type='password' value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} placeholder='Current password' />
        <input className={inputClass} type='password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder='New password' />
        <input className={inputClass} type='password' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder='Confirm new password' />
      </div>
      <button type='button' disabled={busy} onClick={() => void changePassword()} className='rounded bg-[#dec33a] px-4 py-2 text-sm font-semibold disabled:opacity-50'>Change Password</button>
      <div className='space-y-3 border-t border-red-100 pt-5'>
        <h3 className='font-semibold text-red-700'>Deactivate Account</h3>
        <p className='text-sm text-[#848995]'>Your records remain stored, but you cannot log in until an administrator reactivates the account.</p>
        <div className='flex max-w-xl flex-col gap-3 sm:flex-row'>
          <input className={inputClass} type='password' value={deactivationPassword} onChange={(event) => setDeactivationPassword(event.target.value)} placeholder='Current password' />
          <button type='button' disabled={busy} onClick={() => void deactivate()} className='whitespace-nowrap rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50'>Deactivate Account</button>
        </div>
      </div>
    </section>
  );
}
