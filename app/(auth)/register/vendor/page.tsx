'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { AuthError } from '@/lib/auth/auth.types';

// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function VendorRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Please enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'VENDOR',
      });
      router.push('/login?registered=vendor');
    } catch (err) {
      if (err instanceof AuthError) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-50/50 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='w-full max-w-5xl overflow-hidden'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          
          {/* Left Half: Big Logo + Title */}
          <div className='flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-[#CACBCE]/60 bg-linear-to-b from-gray-50/80 via-white to-gray-50/40 text-center'>
            <Link
              href='/'
              className='group flex flex-col items-center transition-transform hover:scale-[1.02]'
              aria-label='Facep home'
            >
              {/* Big Logo */}
              <div className='relative w-48 h-36 sm:w-60 sm:h-44 md:w-72 md:h-52 lg:w-80 lg:h-56 shrink-0 overflow-hidden p-3'>
                <Image
                  src='/logo.jpg'
                  alt='Facep logo'
                  fill
                  priority
                  className='object-contain'
                />
              </div>

              {/* Title below logo */}
              <h1
                className='mt-6 text-[32px] sm:text-[36px] lg:text-[42px] font-bold text-black tracking-tight leading-tight'
                style={{ fontFamily: 'Arial' }}
              >
                Vendor Registration
              </h1>
            </Link>

            <p className='mt-3 max-w-sm text-[14px] sm:text-[15px] text-gray-500 leading-relaxed font-normal'>
              Partner with Facep! Sell to thousands of customers, manage inventory, and grow your business.
            </p>
          </div>

          {/* Right Half: Form & Input Fields */}
          <div className='flex flex-col justify-center p-6 sm:p-10 lg:p-12'>
            <form onSubmit={handleSubmit} noValidate>
              <div className='flex flex-col gap-5 sm:gap-6'>
                {/* Form Subheader */}
                <div className='flex flex-col gap-1'>
                  <h2 className='text-[22px] sm:text-[24px] font-bold text-black'>
                    Create Vendor Account
                  </h2>
                  <p className='text-[13px] sm:text-[14px] text-gray-500'>
                    Enter your information to set up your store and start selling.
                  </p>
                </div>

                {/* Fields */}
                <div className='flex flex-col gap-5'>
                  <AuthInput
                    id='vendor-fullname'
                    name='fullName'
                    label='Full Name'
                    placeholder='alexander'
                    value={form.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    required
                  />
                  <AuthInput
                    id='vendor-email'
                    name='email'
                    label='Your Email'
                    type='email'
                    placeholder='alexander@domain.com'
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <AuthInput
                    id='vendor-password'
                    name='password'
                    label='Password'
                    type='password'
                    placeholder='••••••••••'
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                  />
                  <AuthInput
                    id='vendor-confirm-password'
                    name='confirmPassword'
                    label='Confirm Password'
                    type='password'
                    placeholder='••••••••••'
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    required
                  />

                  {/* General error */}
                  {errors.general && (
                    <p className='rounded-xs bg-red-50 px-3 py-2 text-[13px] text-red-600'>
                      {errors.general}
                    </p>
                  )}

                  {/* CTA — orange for vendor */}
                  <AuthButton type='submit' variant='vendor' isLoading={isLoading}>
                    Create Vendor Account
                  </AuthButton>

                  {/* Legal text */}
                  <p
                    className='text-[13px] sm:text-[14px] font-normal leading-[1.3] text-gray-600'
                    style={{ fontFamily: 'Open Sans' }}
                  >
                    By continuing, you agree to{' '}
                    <a href='#' className='text-[#165DD0] underline'>
                      Our Conditions of Use
                    </a>{' '}
                    and{' '}
                    <a href='#' className='text-[#165DD0] underline'>
                      Privacy Notice.
                    </a>
                  </p>
                </div>

                {/* Divider */}
                <div className='h-px w-full bg-[#E5E5E6]' aria-hidden='true' />

                {/* "Already have an account?" outlined button */}
                <AuthButton variant='secondary' onClick={() => router.push('/login')}>
                  <span className='text-black'>{'Already have an account?  '}</span>
                  <span className='text-[#165DD0] underline'>Login</span>
                </AuthButton>

                {/* Customer CTA */}
                <div style={{ fontFamily: 'Open Sans' }} className='text-center sm:text-left pt-1'>
                  <p className='text-[15px] font-bold leading-[1.2] text-black'>Looking to buy instead?</p>
                  <Link
                    href='/register'
                    className='text-[15px] font-normal leading-[1.2] text-[#165DD0] underline hover:text-blue-800'
                  >
                    Create a Customer Account
                  </Link>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
