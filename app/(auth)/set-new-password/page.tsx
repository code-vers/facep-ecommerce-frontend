'use client';

import AuthButton from '@/components/auth/AuthButton';
import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';
import { authApi } from '@/lib/api/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

interface FormState {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function SetNewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [form, setForm] = useState<FormState>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      await authApi.resetPassword({ resetToken: token, newPassword: form.password });
      setSuccess(true);
      setTimeout(() => router.push('/login?password-reset=1'), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update password. Please try again.';
      setErrors({ general: msg });
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} noValidate>
        <div className='flex flex-col gap-6'>
          {/* Heading */}
          <h1
            className='text-[32px] font-bold leading-[1.2] text-black'
            style={{ fontFamily: 'Arial' }}
          >
            Set new password
          </h1>

          {/* Fields */}
          <div className='flex flex-col gap-6'>
            <AuthInput
              id='new-password'
              name='password'
              label='Type new password'
              type='password'
              placeholder='••••••••••'
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <AuthInput
              id='confirm-new-password'
              name='confirmPassword'
              label='Confirm Password'
              type='password'
              placeholder='••••••••••'
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            {/* Success message */}
            {success && (
              <p className='rounded-xs bg-green-50 px-3 py-2 text-[13px] text-green-700'>
                Password updated successfully! Redirecting to login…
              </p>
            )}

            {/* General error */}
            {errors.general && (
              <p className='rounded-xs bg-red-50 px-3 py-2 text-[13px] text-red-600'>
                {errors.general}
              </p>
            )}

            {/* CTA */}
            <AuthButton type='submit' variant='primary' isLoading={isLoading} disabled={success}>
              Reset Password
            </AuthButton>
          </div>

          {/* Divider */}
          <div className='h-px w-full bg-[#E5E5E6]' aria-hidden='true' />

          {/* Login link */}
          <p
            className='text-[16px] font-normal leading-[1.2] text-black'
            style={{ fontFamily: 'Open Sans' }}
          >
            Already have an account?{' '}
            <Link href='/login' className='text-[#165DD0] underline'>
              Login
            </Link>
          </p>

          {/* Vendor CTA */}
          <div style={{ fontFamily: 'Open Sans' }}>
            <p className='text-[16px] font-bold leading-[1.2] text-black'>You are a Vendor?</p>
            <Link
              href='/register/vendor'
              className='text-[16px] font-normal leading-[1.2] text-[#165DD0] underline'
            >
              Create a Vendor Account
            </Link>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={<div className='flex min-h-screen items-center justify-center' />}>
      <SetNewPasswordContent />
    </Suspense>
  );
}
