/**
 * @fileoverview Checkout page mock data.
 * Declares interfaces and structures representing checkout form states, saved cards, and cart items.
 *
 * @module lib/checkout-data
 */

export interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

export interface SavedCard {
  id: string;
  brand: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
  imageSrc: string;
}

// ── 1. Mock Cart Items ──────────────────────────────────────────────────────
export const CHECKOUT_ITEMS: CheckoutItem[] = [
  {
    id: "check-1",
    title: "Samsung Galaxy S25 Ultra",
    price: 1649.99,
    quantity: 1,
    imageSrc: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "check-2",
    title: "Plant (White Vase)",
    price: 29.99,
    quantity: 1,
    imageSrc: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "check-3",
    title: "Plant (Glass Vase)",
    price: 49.99,
    quantity: 1,
    imageSrc: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=300&auto=format&fit=crop",
  },
];

// ── 2. Mock Saved Cards ─────────────────────────────────────────────────────
export const SAVED_CARDS: SavedCard[] = [
  {
    id: "card-1",
    brand: "Visa",
    last4: "4846",
    expiry: "12/26",
    imageSrc: "http://localhost:3845/assets/e8717d4418491589dbfffbe8e15cc4ceb395775a.svg",
  },
  {
    id: "card-2",
    brand: "Mastercard",
    last4: "4846",
    expiry: "12/26",
    imageSrc: "http://localhost:3845/assets/cd0311880f48de35ecb5f924fca1a3dfc3b5ab90.svg",
  },
];
