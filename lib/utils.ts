import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path?: string | null): string {
  if (!path || typeof path !== 'string' || !path.trim()) {
    return '/placeholder.png';
  }

  const trimmed = path.trim();

  // If already absolute URL (http:// or https://)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a known frontend public asset in /public
  if (
    trimmed.startsWith('/figma/') ||
    trimmed.startsWith('figma/') ||
    trimmed.startsWith('/logo.') ||
    trimmed.startsWith('logo.') ||
    trimmed.startsWith('/banner.') ||
    trimmed.startsWith('banner.') ||
    trimmed.startsWith('/placeholder.') ||
    trimmed.startsWith('placeholder.') ||
    trimmed.startsWith('/ImageWithFallback') ||
    trimmed.startsWith('ImageWithFallback') ||
    trimmed.startsWith('/cart.') ||
    trimmed.startsWith('cart.') ||
    trimmed.startsWith('/customerservice.') ||
    trimmed.startsWith('customerservice.') ||
    trimmed.startsWith('/_next/')
  ) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // Backend static upload or relative path
  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
    /\/api\/v1\/?$/,
    '',
  );
  return `${apiOrigin}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}
