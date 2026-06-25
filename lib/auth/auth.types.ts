/**
 * @fileoverview Auth system type definitions.
 *
 * Single source of truth for all authentication-related TypeScript
 * interfaces, enums, and type aliases used across the Facep platform.
 *
 * @module lib/auth/auth.types
 */

// ─────────────────────────────────────────────────────────────────────────────
// Role
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Platform roles. Determines post-login redirect destination and
 * which features / dashboard sections a user can access.
 *
 * - `buyer`  – Standard shopper. Redirected to `/products` on login.
 * - `vendor` – Seller / merchant. Redirected to `/seller` on login.
 */
export type UserRole = 'buyer' | 'vendor';

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A registered user stored in localStorage.
 * Passwords are stored in plain text intentionally — this is a
 * frontend-only mock for demo / development purposes.
 */
export interface StoredUser {
  /** Unique identifier (generated at registration time). */
  id: string;
  /** User's display name. */
  fullName: string;
  /** Unique email address used as the login key. */
  email: string;
  /** Plain-text password (mock only — never do this in production). */
  password: string;
  /** Platform role assigned at registration. */
  role: UserRole;
  /** ISO timestamp of account creation. */
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Session
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The active user session stored in localStorage under
 * {@link AUTH_KEYS.SESSION}. Contains only the fields required to
 * hydrate the auth context — the full {@link StoredUser} is not
 * duplicated here.
 */
export interface AuthSession {
  /** ID matching a {@link StoredUser}. */
  userId: string;
  /** Denormalised email for quick access. */
  email: string;
  /** Denormalised display name. */
  fullName: string;
  /** Role needed for routing decisions without a separate lookup. */
  role: UserRole;
  /** ISO timestamp of when the session was created. */
  loginAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Context value
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shape of the value exposed by `AuthContext`.
 *
 * Components should consume this via the `useAuth()` hook rather than
 * accessing the context directly.
 */
export interface AuthContextValue {
  /** Current session, or `null` when the user is not logged in. */
  session: AuthSession | null;
  /** `true` while reading localStorage on first render. */
  isLoading: boolean;
  /** Attempts login. Throws `AuthError` on bad credentials. */
  login: (email: string, password: string) => Promise<AuthSession>;
  /** Registers a new user and persists to localStorage. Throws `AuthError` on duplicate email. */
  register: (payload: RegisterPayload) => Promise<void>;
  /** Clears the session from localStorage and resets context state. */
  logout: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Action Payloads
// ─────────────────────────────────────────────────────────────────────────────

/** Payload passed to `AuthContext.register()`. */
export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

// ─────────────────────────────────────────────────────────────────────────────
// Errors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Typed error codes for the auth system.
 * Allows callers to display targeted error messages.
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'PASSWORDS_DO_NOT_MATCH'
  | 'UNKNOWN_ERROR';

/** Custom error class thrown by auth utilities. */
export class AuthError extends Error {
  public readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}
