/**
 * @fileoverview Buyer Profile page mock data.
 * Declares interfaces and structures representing addresses and saved payment details.
 *
 * @module lib/profile-data
 */

export interface UserAddress {
  id: string;
  label: string; // 'Home', 'Office', etc.
  addressLine: string;
  phone: string;
  isDefault: boolean;
}

export interface UserSavedCard {
  id: string;
  label: string; // 'Card 1', 'Card 2', etc.
  brand: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

// ── 1. Mock Addresses ────────────────────────────────────────────────────────
export const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    addressLine: '123 Main Road Rampura, Dhaka 1205, Bangladesh',
    phone: '01245876233213',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    addressLine: '123 Main Road Rampura, Dhaka 1205, Bangladesh',
    phone: '01245876233213',
    isDefault: false,
  },
];

// ── 2. Mock Saved Cards ─────────────────────────────────────────────────────
export const INITIAL_CARDS: UserSavedCard[] = [
  {
    id: 'pcard-1',
    label: 'Card 1',
    brand: 'Visa',
    last4: '4846',
    expiry: '12/26',
    isDefault: true,
  },
  {
    id: 'pcard-2',
    label: 'Card 2',
    brand: 'Visa',
    last4: '4846',
    expiry: '12/26',
    isDefault: false,
  },
  {
    id: 'pcard-3',
    label: 'Card 3',
    brand: 'Visa',
    last4: '4846',
    expiry: '12/26',
    isDefault: false,
  },
];
