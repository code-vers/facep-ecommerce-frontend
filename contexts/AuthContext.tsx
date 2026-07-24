/**
 * @fileoverview Auth React Context and Provider.
 *
 * Provides global auth state and operations to the entire application
 * via the `useAuth()` hook. Must be mounted once near the root of the
 * component tree (inside `app/layout.tsx`).
 *
 * Usage:
 * ```tsx
 * // Wrapping the app
 * <AuthProvider>{children}</AuthProvider>
 *
 * // Consuming in a component
 * const { session, login, logout } = useAuth();
 * ```
 *
 * @module contexts/AuthContext
 */

'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authApi } from '@/lib/api/auth';
import type { AuthContextValue, AuthSession, RegisterPayload } from '@/lib/auth/auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provides authentication state and operations to the component tree.
 * Seeds demo users on first mount.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first mount: restore any existing session.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authApi
        .getProfile()
        .then((res) => {
          setSession({ user: res.data, token });
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          setSession(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthSession> => {
    const response = await authApi.login({ email, password });
    const newSession = { user: response.data.user, token: response.data.accessToken };
    localStorage.setItem('accessToken', response.data.accessToken);
    setSession(newSession);
    return newSession;
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    await authApi.register(payload);
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem('accessToken');
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, isLoading, login, register, logout }),
    [session, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Provides access to the auth context value.
 *
 * @throws {Error} When called outside of an `<AuthProvider>`.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }
  return ctx;
}
