'use client';

import AuthButton from '@/components/auth/AuthButton';
import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';
import { authApi } from '@/lib/api/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      await authApi.forgotPassword({ email: email.trim() });
    } catch {}

    setIsLoading(false);
    router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}&flow=reset`);
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} noValidate>
        <div className='flex flex-col gap-6'>
          <h1
            className='text-[32px] font-bold leading-[1.2] text-black'
            style={{ fontFamily: 'Arial' }}
          >
            Forget Password
          </h1>

          <div className='flex flex-col gap-6'>
            <AuthInput
              id='forgot-email'
              name='email'
              label='Enter your registered email address'
              type='email'
              placeholder='alexander@domain.com'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
                setGeneralError('');
              }}
              error={emailError}
              required
            />

            {generalError && (
              <p className='rounded-xs bg-red-50 px-3 py-2 text-[13px] text-red-600'>
                {generalError}
              </p>
            )}

            <AuthButton type='submit' variant='primary' isLoading={isLoading}>
              Send Reset Link
            </AuthButton>
          </div>

          <div className='h-px w-full bg-[#E5E5E6]' aria-hidden='true' />

          <AuthButton variant='secondary' onClick={() => router.push('/register')}>
            <span className='text-black'>{"Don't have an account?  "}</span>
            <span className='text-[#165DD0] underline'>Create One</span>
          </AuthButton>

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
