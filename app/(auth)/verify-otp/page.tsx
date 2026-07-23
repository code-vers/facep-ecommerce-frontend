'use client';

import AuthButton from '@/components/auth/AuthButton';
import AuthCard from '@/components/auth/AuthCard';
import OtpInput from '@/components/auth/OtpInput';
import { authApi } from '@/lib/api/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(-2);
  return `****${visible}@${domain}`;
}

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const flow = searchParams.get('flow') ?? 'reset';

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const isComplete = otp.every((d) => d !== '');

  const handleResend = async () => {
    setIsLoading(true);
    setResent(false);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setResent(true);
    // Reset OTP boxes
    setOtp(Array(6).fill(''));
  };

  const handleConfirm = async () => {
    if (!isComplete) return;
    setIsLoading(true);

    try {
      if (flow === 'reset') {
        const resetCode = otp.join('');
        const res = await authApi.verifyResetCode({ email, resetCode });
        const resetToken = res.data.resetToken;
        router.push(`/set-new-password?email=${encodeURIComponent(email)}&token=${resetToken}`);
      } else {
        router.push('/login?verified=1');
      }
    } catch {
      alert('Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className='flex flex-col gap-6'>
        {/* Heading */}
        <h1
          className='text-[32px] font-bold leading-[1.2] text-black'
          style={{ fontFamily: 'Arial' }}
        >
          Verify Identity
        </h1>

        {/* Subtitle */}
        <p
          className='text-[16px] font-normal leading-[1.2] text-black'
          style={{ fontFamily: 'Open Sans' }}
        >
          Enter the verification code send to your email{' '}
          <span className='font-semibold'>{maskEmail(email)}</span>
        </p>

        {/* OTP input */}
        <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />

        {/* Resent confirmation */}
        {resent && (
          <p className='text-[13px] text-green-600'>A new code has been sent to your email.</p>
        )}

        {isComplete ? (
          <AuthButton type='button' variant='primary' onClick={handleConfirm} isLoading={isLoading}>
            Confirm
          </AuthButton>
        ) : (
          <AuthButton type='button' variant='primary' onClick={handleResend} isLoading={isLoading}>
            Resend code
          </AuthButton>
        )}

        {/* Divider */}
        <div className='h-px w-full bg-[#E5E5E6]' aria-hidden='true' />

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
    </AuthCard>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className='flex min-h-screen items-center justify-center' />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
