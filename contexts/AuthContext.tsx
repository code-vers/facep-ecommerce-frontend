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
import { getApiErrorMessage } from '@/lib/api/axios';
import { AuthError, type AuthContextValue, type AuthSession, type RegisterPayload } from '@/lib/auth/auth.types';

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
        .catch((error) => {
          // Only remove token if the backend explicitly rejects it (e.g. expired/invalid)
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('accessToken');
          }
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

  useEffect(() => {
    const handleUnauthorized = () => setSession(null);
    window.addEventListener('facep:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('facep:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthSession> => {
    try {
      const response = await authApi.login({ email, password });
      const newSession = { user: response.data.user, token: response.data.accessToken };
      localStorage.setItem('accessToken', response.data.accessToken);
      setSession(newSession);
      return newSession;
    } catch (error) {
      throw new AuthError('INVALID_CREDENTIALS', getApiErrorMessage(error, 'Unable to log in.'));
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    try {
      await authApi.register(payload);
    } catch (error) {
      throw new AuthError('UNKNOWN_ERROR', getApiErrorMessage(error, 'Unable to register.'));
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const response = await authApi.getProfile();
    setSession({ user: response.data, token });
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem('accessToken');
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, isLoading, login, register, refreshProfile, logout }),
    [session, isLoading, login, register, refreshProfile, logout],
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
