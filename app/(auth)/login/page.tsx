/**
 * @fileoverview Login page — `/login`.
 *
 * Implements Figma node 2227-7470 (Buyer Login screen) pixel-perfectly.
 *
 * Layout (top to bottom inside the card):
 *   1. "Login" heading (Arial Bold 32px)
 *   2. Email field
 *   3. Password field + "Forgot Password" right-aligned link
 *   4. Yellow "Login" CTA button
 *   5. Legal text (terms + privacy)
 *   6. Horizontal divider
 *   7. "Don't have an account? Create One" outlined button
 *   8. "You are a Vendor? Create a Vendor Account" text block
 *
 * Below the card (not in Figma — added per user request):
 *   - Section header "Quick Demo Access"
 *   - Two demo credential cards (Buyer + Vendor)
 *
 * @module app/(auth)/login/page
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import DemoCredentialCard from '@/components/auth/DemoCredentialCard';
import { useAuth } from '@/contexts/AuthContext';
import { AuthError } from '@/lib/auth/auth.types';
import { DEMO_USERS } from '@/lib/auth/auth.constants';
import { ROLE_REDIRECT } from '@/lib/auth/auth.constants';

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

// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoadingId, setDemoLoadingId] = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

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

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const session = await login(form.email.trim(), form.password);
      redirectAfterLogin(session.role);
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

  // ── Demo quick-login ───────────────────────────────────────────────────────

  const handleDemoLogin = async (email: string, password: string, userId: string) => {
    setDemoLoadingId(userId);
    try {
      const session = await login(email, password);
      redirectAfterLogin(session.role);
    } catch {
      setErrors({ general: 'Demo login failed. Please try refreshing the page.' });
    } finally {
      setDemoLoadingId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-[800px] flex-col items-center gap-16">
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        {/*
         * Inlining logo here (not using AuthCard wrapper) because we need
         * to add the demo cards section below the card, outside AuthCard.
         */}
        <div className="flex items-center gap-9">
          {/* Logo icon rendered as an SVG shape matching Figma */}
          <div className="flex size-[60px] shrink-0 items-center justify-center rounded-[8px] bg-black">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M8 6L24 26M8 26L24 6" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span
            className="whitespace-nowrap text-[64px] font-bold capitalize leading-none text-black"
            style={{ fontFamily: 'Arial', letterSpacing: '-1.92px' }}
          >
            Logo
          </span>
        </div>

        {/* ── Main Auth Card ────────────────────────────────────────────── */}
        <div className="w-full rounded-[6px] border border-[#CACBCE] bg-white p-[40px]">
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              {/* Heading */}
              <h1
                className="text-[32px] font-bold leading-[1.2] text-black"
                style={{ fontFamily: 'Arial' }}
              >
                Login
              </h1>

              {/* Fields block */}
              <div className="flex flex-col gap-6">
                {/* Email */}
                <AuthInput
                  id="login-email"
                  name="email"
                  label="Your Email"
                  type="email"
                  placeholder="alexander@domain.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                {/* Password + forgot link */}
                <div className="flex flex-col gap-[6px]">
                  <AuthInput
                    id="login-password"
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••••"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                  />
                  <Link
                    href="/forgot-password"
                    className="text-right text-[12px] font-normal leading-[1.3] text-[#165DD0] underline"
                    style={{ fontFamily: 'Open Sans' }}
                  >
                    Forgot Password
                  </Link>
                </div>

                {/* General error */}
                {errors.general && (
                  <p className="rounded-[2px] bg-red-50 px-3 py-2 text-[13px] text-red-600">
                    {errors.general}
                  </p>
                )}

                {/* Login button */}
                <AuthButton type="submit" variant="primary" isLoading={isLoading}>
                  Login
                </AuthButton>

                {/* Legal text */}
                <p
                  className="text-[16px] font-normal leading-[1.2] text-black"
                  style={{ fontFamily: 'Open Sans' }}
                >
                  By continuing, you agree to{' '}
                  <a href="#" className="text-[#165DD0] underline">
                    Our Conditions of Use
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#165DD0] underline">
                    Privacy Notice.
                  </a>
                </p>
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
        </div>

        {/* ── Demo Credential Cards ─────────────────────────────────────── */}
        {/*
         * Not part of the Figma design — added per user request.
         * Two cards (Buyer + Vendor) allow instant test login.
         */}
        <div className="w-full">
          <p
            className="mb-4 text-center text-[13px] font-semibold uppercase tracking-widest text-[#848995]"
            style={{ fontFamily: 'Open Sans' }}
          >
            ⚡ Quick Demo Access
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {DEMO_USERS.map((demo) => (
              <DemoCredentialCard
                key={demo.id}
                role={demo.role === 'buyer' ? 'Buyer' : demo.role === 'vendor' ? 'Vendor' : 'Admin'}
                email={demo.email}
                password={demo.password}
                isLoading={demoLoadingId === demo.id}
                onSelect={() => handleDemoLogin(demo.email, demo.password, demo.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
