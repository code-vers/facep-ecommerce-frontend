/**
 * @fileoverview Buyer registration page — `/register`.
 *
 * Implements Figma node 2227-7491 (Create Account — Buyer).
 *
 * Layout inside the card:
 *   1. "Create Account" heading
 *   2. Full Name field
 *   3. Email field
 *   4. Password field (with eye toggle)
 *   5. Confirm Password field (with eye toggle)
 *   6. Yellow "Create Account" CTA button
 *   7. Legal text
 *   8. Divider
 *   9. "Already have an account? Login"
 *  10. "You are a Vendor? Create a Vendor Account"
 *
 * @module app/(auth)/register/page
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthCard from '@/components/auth/AuthCard';
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

export default function RegisterPage() {
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
        role: 'buyer',
      });
      // Redirect to login after successful registration
      router.push('/login?registered=1');
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
    <AuthCard>
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-6">
          {/* Heading */}
          <h1
            className="text-[32px] font-bold leading-[1.2] text-black"
            style={{ fontFamily: 'Arial' }}
          >
            Create Account
          </h1>

          {/* Fields */}
          <div className="flex flex-col gap-6">
            <AuthInput
              id="reg-fullname"
              name="fullName"
              label="Full Name"
              placeholder="alexander"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
            <AuthInput
              id="reg-email"
              name="email"
              label="Your Email"
              type="email"
              placeholder="alexander@domain.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <AuthInput
              id="reg-password"
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <AuthInput
              id="reg-confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            {/* General error */}
            {errors.general && (
              <p className="rounded-[2px] bg-red-50 px-3 py-2 text-[13px] text-red-600">
                {errors.general}
              </p>
            )}

            {/* CTA */}
            <AuthButton type="submit" variant="primary" isLoading={isLoading}>
              Create Account
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

          {/* Login link */}
          <p
            className="text-[16px] font-normal leading-[1.2] text-black"
            style={{ fontFamily: 'Open Sans' }}
          >
            Already have an account?{' '}
            <Link href="/login" className="text-[#165DD0] underline">
              Login
            </Link>
          </p>

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
