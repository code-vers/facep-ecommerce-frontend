/**
 * @fileoverview Forgot Password page — `/forgot-password`.
 *
 * Implements Figma node 2237-7128.
 *
 * Layout inside card:
 *   1. "Forget Password" heading (matches Figma spelling exactly)
 *   2. "Enter your registered email address" label + email field
 *   3. Yellow "Send Reset Link" CTA button
 *   4. Divider
 *   5. "Don't have an account? Create One" outlined button
 *   6. "You are a Vendor? Create a Vendor Account" text block
 *
 * On submit: navigates to `/verify-otp` passing the email via query param
 * (simulating an OTP email send — localStorage-based, no real email sent).
 *
 * @module app/(auth)/forgot-password/page
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { findUserByEmail } from '@/lib/auth/auth.utils';

// ─────────────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

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

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setGeneralError('');

    // Simulate an async "send email" delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user = findUserByEmail(email.trim());
    if (!user) {
      /*
       * For security, we don't reveal whether an email is registered.
       * We silently proceed to the OTP screen. The OTP page will handle
       * the "email not found" case gracefully.
       */
    }

    setIsLoading(false);
    router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}&flow=reset`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-6">
          {/* Heading — "Forget Password" matches Figma text exactly */}
          <h1
            className="text-[32px] font-bold leading-[1.2] text-black"
            style={{ fontFamily: 'Arial' }}
          >
            Forget Password
          </h1>

          {/* Email field */}
          <div className="flex flex-col gap-6">
            <AuthInput
              id="forgot-email"
              name="email"
              label="Enter your registered email address"
              type="email"
              placeholder="alexander@domain.com"
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
              <p className="rounded-[2px] bg-red-50 px-3 py-2 text-[13px] text-red-600">
                {generalError}
              </p>
            )}

            {/* CTA */}
            <AuthButton type="submit" variant="primary" isLoading={isLoading}>
              Send Reset Link
            </AuthButton>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#E5E5E6]" aria-hidden="true" />

          {/* "Don't have an account?" outlined button */}
          <AuthButton
            variant="secondary"
            onClick={() => router.push('/register')}
          >
            <span className="text-black">{"Don't have an account?  "}</span>
            <span className="text-[#165DD0] underline">Create One</span>
          </AuthButton>

          {/* Vendor CTA */}
          <div style={{ fontFamily: 'Open Sans' }}>
            <p className="text-[16px] font-bold leading-[1.2] text-black">
              You are a Vendor?
            </p>
            <Link
              href="/register/vendor"
              className="text-[16px] font-normal leading-[1.2] text-[#165DD0] underline"
            >
              Create a Vendor Account
            </Link>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}
