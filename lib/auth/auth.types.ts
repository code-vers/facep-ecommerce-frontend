export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN';

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    contactNumber?: string | null;
    address?: string | null;
    avatarUrl?: string | null;
    preferredPaymentMethod?: 'COD' | 'CARD';
    isActive?: boolean;
  };
  token: string;
}

export interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'PASSWORDS_DO_NOT_MATCH'
  | 'UNKNOWN_ERROR';

export class AuthError extends Error {
  public readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}
