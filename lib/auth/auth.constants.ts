export const AUTH_KEYS = {
  USERS: 'facep:auth:users',
  SESSION: 'facep:auth:session',
} as const;

export const ROLE_REDIRECT: Record<string, string> = {
  BUYER: '/',
  VENDOR: '/dashboard',
  ADMIN: '/dashboard',
};
