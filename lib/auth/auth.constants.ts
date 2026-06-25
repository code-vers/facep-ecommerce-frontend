/**
 * @fileoverview Auth system constants.
 *
 * Defines localStorage key names and pre-seeded demo users.
 * Import these constants instead of using raw string literals.
 *
 * @module lib/auth/auth.constants
 */

import type { StoredUser } from './auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// localStorage Keys
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Namespaced localStorage keys used by the auth system.
 *
 * - `USERS`   – JSON array of {@link StoredUser} objects.
 * - `SESSION` – JSON-serialised {@link AuthSession} (or absent when logged out).
 */
export const AUTH_KEYS = {
  USERS: 'facep:auth:users',
  SESSION: 'facep:auth:session',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Role-based redirect map
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Destination path after a successful login, keyed by role.
 */
export const ROLE_REDIRECT: Record<string, string> = {
  buyer: '/products',
  vendor: '/seller',
};

// ─────────────────────────────────────────────────────────────────────────────
// Demo / seed users
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pre-seeded demo accounts shown on the Login page quick-access cards.
 * These are written into localStorage on first load by `seedDemoUsers()`.
 */
export const DEMO_USERS: StoredUser[] = [
  {
    id: 'demo-buyer-001',
    fullName: 'Demo Buyer',
    email: 'buyer@demo.com',
    password: 'demo1234',
    role: 'buyer',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-vendor-001',
    fullName: 'Demo Vendor',
    email: 'vendor@demo.com',
    password: 'demo1234',
    role: 'vendor',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];
