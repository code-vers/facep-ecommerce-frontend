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

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearStoredSession,
  getStoredSession,
  loginWithCredentials,
  registerUser,
  seedDemoUsers,
} from '@/lib/auth/auth.utils';
import type {
  AuthContextValue,
  AuthSession,
  RegisterPayload,
} from '@/lib/auth/auth.types';

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

  // On first mount: seed demo users then restore any existing session.
  useEffect(() => {
    seedDemoUsers();
    const restored = getStoredSession();
    setSession(restored);
    setIsLoading(false);
  }, []);

  /**
   * Validates credentials, persists the session, and updates context state.
   * @throws {@link AuthError} on invalid credentials.
   */
  const login = useCallback(
    async (email: string, password: string): Promise<AuthSession> => {
      const newSession = loginWithCredentials(email, password);
      setSession(newSession);
      return newSession;
    },
    [],
  );

  /**
   * Creates a new user account and persists it to localStorage.
   * Does NOT automatically log the user in.
   * @throws {@link AuthError} on duplicate email.
   */
  const register = useCallback(
    async (payload: RegisterPayload): Promise<void> => {
      registerUser(payload);
    },
    [],
  );

  /**
   * Destroys the active session from localStorage and resets context state.
   */
  const logout = useCallback((): void => {
    clearStoredSession();
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
