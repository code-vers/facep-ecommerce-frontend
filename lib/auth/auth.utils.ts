/**
 * @fileoverview Pure localStorage auth helper utilities.
 *
 * All functions here are pure I/O helpers — they read from or write to
 * localStorage and return typed results. No side effects on React state.
 * Safe to call from both server-side-rendered components (guarded) and
 * client components.
 *
 * @module lib/auth/auth.utils
 */

import { AUTH_KEYS, DEMO_USERS } from './auth.constants';
import { AuthError } from './auth.types';
import type {
  AuthSession,
  RegisterPayload,
  StoredUser,
} from './auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// Guard — localStorage is browser-only
// ─────────────────────────────────────────────────────────────────────────────

/** Returns `true` when running in a browser environment. */
const isBrowser = (): boolean => typeof window !== 'undefined';

// ─────────────────────────────────────────────────────────────────────────────
// User store helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads and parses the stored users array from localStorage.
 * Returns an empty array when the key is absent or the stored value is corrupt.
 */
export function getStoredUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(AUTH_KEYS.USERS);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

/**
 * Persists the users array to localStorage, replacing the existing value.
 */
export function setStoredUsers(users: StoredUser[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
}

/**
 * Finds a user by email address (case-insensitive).
 */
export function findUserByEmail(email: string): StoredUser | undefined {
  return getStoredUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Session helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads and parses the active session from localStorage.
 * Returns `null` when there is no stored session or the value is corrupt.
 */
export function getStoredSession(): AuthSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(AUTH_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

/**
 * Writes an {@link AuthSession} to localStorage.
 */
export function setStoredSession(session: AuthSession): void {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
}

/**
 * Removes the active session from localStorage.
 */
export function clearStoredSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_KEYS.SESSION);
}

// ─────────────────────────────────────────────────────────────────────────────
// Seeding
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Seeds the demo users into localStorage on first run.
 *
 * Merges demo users into the existing user list so that any users
 * registered by the user during testing are preserved. Demo users are
 * identified by their stable IDs and are never duplicated.
 */
export function seedDemoUsers(): void {
  if (!isBrowser()) return;
  const existing = getStoredUsers();
  const existingIds = new Set(existing.map((u) => u.id));
  const toAdd = DEMO_USERS.filter((d) => !existingIds.has(d.id));
  if (toAdd.length > 0) {
    setStoredUsers([...existing, ...toAdd]);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates credentials against the stored user list.
 *
 * @throws {@link AuthError} with code `INVALID_CREDENTIALS` when
 *   the email is not found or the password does not match.
 * @returns A populated {@link AuthSession} on success.
 */
export function loginWithCredentials(
  email: string,
  password: string,
): AuthSession {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    throw new AuthError(
      'INVALID_CREDENTIALS',
      'Invalid email or password. Please try again.',
    );
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    loginAt: new Date().toISOString(),
  };

  setStoredSession(session);
  return session;
}

/**
 * Registers a new user and persists them to localStorage.
 *
 * @throws {@link AuthError} with code `EMAIL_ALREADY_EXISTS` when the
 *   provided email is already taken.
 */
export function registerUser(payload: RegisterPayload): StoredUser {
  const existing = findUserByEmail(payload.email);
  if (existing) {
    throw new AuthError(
      'EMAIL_ALREADY_EXISTS',
      'An account with this email already exists.',
    );
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    createdAt: new Date().toISOString(),
  };

  const users = getStoredUsers();
  setStoredUsers([...users, newUser]);
  return newUser;
}

/**
 * Updates the password for a user identified by email.
 * Used during the "Set New Password" reset flow.
 */
export function updateUserPassword(email: string, newPassword: string): void {
  const users = getStoredUsers();
  const updated = users.map((u) =>
    u.email.toLowerCase() === email.toLowerCase()
      ? { ...u, password: newPassword }
      : u,
  );
  setStoredUsers(updated);
}
