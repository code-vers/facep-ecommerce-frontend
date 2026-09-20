'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_REDIRECT } from '@/lib/auth/auth.constants';
import { AuthError } from '@/lib/auth/auth.types';

// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on edit
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const redirectAfterLogin = (role: string) => {
    router.replace(ROLE_REDIRECT[role] ?? '/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const session = await login(form.email.trim(), form.password);
      redirectAfterLogin(session.user.role);
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
    <div className='flex min-h-screen w-full flex-col items-center justify-center px-4 py-12'>
      <div className='flex w-full max-w-200 flex-col items-center gap-16'>
        <Link
          href='/'
          className='flex items-center gap-4 sm:gap-5 transition-opacity hover:opacity-90'
          aria-label='Facep home'
        >
          <div className='relative h-14 w-22 sm:h-16 sm:w-26 shrink-0 overflow-hidden rounded-lg bg-black shadow-sm'>
            <Image
              src='/logo.jpg'
              alt='Facep logo'
              fill
              priority
              className='object-cover'
            />
          </div>
          {/* <span
            className='whitespace-nowrap text-[36px] sm:text-[44px] font-bold capitalize leading-none text-black'
            style={{ fontFamily: 'Arial', letterSpacing: '-1.5px' }}
          >
            Facep
          </span> */}
        </Link>

        <div className='w-full rounded-[6px] border border-[#CACBCE] bg-white p-10'>
          <form onSubmit={handleSubmit} noValidate>
            <div className='flex flex-col gap-6'>
              {/* Heading */}
              <h1
                className='text-[32px] font-bold leading-[1.2] text-black'
                style={{ fontFamily: 'Arial' }}
              >
                Login
              </h1>

              {/* Fields block */}
              <div className='flex flex-col gap-6'>
                {/* Email */}
                <AuthInput
                  id='login-email'
                  name='email'
                  label='Your Email'
                  type='email'
                  placeholder='alexander@domain.com'
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                {/* Password + forgot link */}
                <div className='flex flex-col gap-1.5'>
                  <AuthInput
                    id='login-password'
                    name='password'
                    label='Password'
                    type='password'
                    placeholder='••••••••••'
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                  />
                  <Link
                    href='/forgot-password'
                    className='text-right text-[12px] font-normal leading-[1.3] text-[#165DD0] underline'
                    style={{ fontFamily: 'Open Sans' }}
                  >
                    Forgot Password
                  </Link>
                </div>

                {/* General error */}
                {errors.general && (
                  <p className='rounded-xs bg-red-50 px-3 py-2 text-[13px] text-red-600'>
                    {errors.general}
                  </p>
                )}

                {/* Login button */}
                <AuthButton type='submit' variant='primary' isLoading={isLoading}>
                  Login
                </AuthButton>

                {/* Legal text */}
                <p
                  className='text-[16px] font-normal leading-[1.2] text-black'
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

              {/* "Don't have an account?" outlined button */}
              <AuthButton variant='secondary' onClick={() => router.push('/register')}>
                <span className='text-black'>{"Don't have an account?  "}</span>
                <span className='text-[#165DD0] underline'>Create One</span>
              </AuthButton>

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
        </div>
      </div>
    </div>
  );
}
