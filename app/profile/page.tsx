/**
 * @fileoverview Buyer Profile Page controller — `/profile`.
 * Coordinates personal details form, addresses, payment cards, and sidebar tabs.
 *
 * @module app/profile/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ChevronRight, ShoppingBag, Heart, ArrowLeftRight, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileAddresses from '@/components/profile/ProfileAddresses';
import ProfilePaymentMethods from '@/components/profile/ProfilePaymentMethods';
import { INITIAL_ADDRESSES, INITIAL_CARDS, UserAddress, UserSavedCard } from '@/lib/profile-data';
import type { AuthSession } from '@/lib/auth/auth.types';

interface ProfileFormProps {
  session: AuthSession;
  onLogout: () => void;
}

/**
 * ProfileForm component.
 * Renders once session is established.
 */
function ProfileForm({ session, onLogout }: ProfileFormProps) {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'shops' | 'refunds'>('profile');

  // Local state for addresses & cards
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);
  const [cards, setCards] = useState<UserSavedCard[]>(INITIAL_CARDS);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');

  // Profile data state initialized from session
  const [profileData, setProfileData] = useState({
    fullName: session.fullName || '',
    email: session.email || '',
    contactNumber: '+41 00 000 00 00',
    address: '123 Edelweiss Strasse, Zurich',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  });

  // Handle saving details (Simulated delay)
  const handleSaveProfile = async (updated: typeof profileData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfileData(updated);
  };

  // Handle addresses update (Simulated delay)
  const handleUpdateAddresses = async (updatedAddresses: UserAddress[]) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setAddresses(updatedAddresses);
  };

  // Handle cards update (Simulated delay)
  const handleUpdateCards = async (updatedCards: UserSavedCard[]) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCards(updatedCards);
  };

  // Handle payment method toggle (Simulated delay)
  const handleUpdatePaymentMethod = async (method: 'COD' | 'CARD') => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPaymentMethod(method);
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* ── 1. Page Breadcrumbs & Title ── */}
      <div className="w-full border-b border-[#e5e5e6]">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-5 text-left flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[14px] text-[#848995] mb-2 font-normal">
              <Link href="/" className="hover:text-black flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-black font-medium">My Account</span>
            </div>
            <h1 className="text-[28px] font-semibold text-black leading-tight tracking-tight">
              My Profile
            </h1>
          </div>

          {/* User Role Badge */}
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-full px-4 py-1.5 shadow-xs">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-[13px] font-medium text-gray-700 capitalize">
              Role: <strong className="text-black">{session.role}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Sidebar + Main Content Grid Layout ── */}
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between w-full">
          {/* Sidebar */}
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={onLogout}
          />

          {/* Main Tab Panel Display */}
          <div className="flex-1 w-full">
            {/* TAB: PROFILE PANEL */}
            {activeTab === 'profile' && (
              <div className="space-y-8 w-full">
                <ProfileOverview
                  initialData={profileData}
                  onSave={handleSaveProfile}
                />
                
                <ProfileAddresses
                  initialAddresses={addresses}
                  onUpdateAddresses={handleUpdateAddresses}
                />

                <ProfilePaymentMethods
                  initialCards={cards}
                  initialPaymentMethod={paymentMethod}
                  onUpdateCards={handleUpdateCards}
                  onUpdatePaymentMethod={handleUpdatePaymentMethod}
                />
              </div>
            )}

            {/* TAB: ORDERS PANEL */}
            {activeTab === 'orders' && (
              <div className="border border-[#e5e5e6] rounded bg-white p-6 space-y-6 text-left">
                <div className="border-b border-[#e5e5e6] pb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-black" />
                  <h2 className="text-[20px] font-semibold text-black tracking-tight">
                    My Orders
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* Order Card 1 */}
                  <div className="border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-all flex flex-col gap-4">
                    <div className="flex justify-between items-center flex-wrap gap-2 text-[14px]">
                      <p className="text-gray-500">Order ID: <span className="font-semibold text-black">#FCP-748923</span></p>
                      <span className="bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1 rounded-full text-[12px] font-semibold">
                        On the way
                      </span>
                    </div>
                    <div className="flex gap-4 items-center border-t border-b border-gray-50 py-3.5">
                      <div className="w-16 h-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=150" alt="S25 Ultra" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[16px] text-black font-semibold">Samsung Galaxy S25 Ultra</h4>
                        <p className="text-[13px] text-gray-500">Quantity: 1 • Color: Titanium Gray</p>
                      </div>
                      <p className="text-[18px] text-black font-bold">$1,649.99</p>
                    </div>
                    <div className="flex justify-between items-center text-[14px] flex-wrap gap-2">
                      <span className="text-gray-400">Placed on June 26, 2026</span>
                      <Link href="/orders" className="text-[#165dd0] hover:underline font-medium">Track Order</Link>
                    </div>
                  </div>

                  {/* Order Card 2 */}
                  <div className="border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-all flex flex-col gap-4">
                    <div className="flex justify-between items-center flex-wrap gap-2 text-[14px]">
                      <p className="text-gray-500">Order ID: <span className="font-semibold text-black">#FCP-528347</span></p>
                      <span className="bg-green-50 border border-green-200 text-green-600 px-3 py-1 rounded-full text-[12px] font-semibold">
                        Delivered
                      </span>
                    </div>
                    <div className="flex gap-4 items-center border-t border-b border-gray-50 py-3.5">
                      <div className="w-16 h-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=150" alt="Plant" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[16px] text-black font-semibold">Plant (White Vase)</h4>
                        <p className="text-[13px] text-gray-500">Quantity: 2 • Size: Medium</p>
                      </div>
                      <p className="text-[18px] text-black font-bold">$59.98</p>
                    </div>
                    <div className="flex justify-between items-center text-[14px] flex-wrap gap-2">
                      <span className="text-gray-400">Placed on June 15, 2026</span>
                      <button type="button" className="text-[#dec33a] hover:underline font-medium cursor-pointer">Write a Review</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SHOPS PANEL */}
            {activeTab === 'shops' && (
              <div className="border border-[#e5e5e6] rounded bg-white p-6 space-y-6 text-left">
                <div className="border-b border-[#e5e5e6] pb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-black" />
                  <h2 className="text-[20px] font-semibold text-black tracking-tight">
                    Favourite Shops
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shop 1 */}
                  <div className="border border-gray-150 rounded-lg p-5 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-black text-white font-bold flex items-center justify-center text-[18px]">
                        E
                      </div>
                      <div>
                        <h4 className="text-[16px] text-black font-semibold">ElectroLand</h4>
                        <p className="text-[13px] text-gray-500">Computers & Tech Gadgets</p>
                        <p className="text-[12px] text-[#dec33a] font-medium">★ 4.9 (1.2k reviews)</p>
                      </div>
                    </div>
                    <button type="button" className="border border-[#686f7d] px-3.5 py-1.5 rounded text-[13px] font-semibold text-black hover:bg-gray-50 cursor-pointer">
                      Visit Shop
                    </button>
                  </div>

                  {/* Shop 2 */}
                  <div className="border border-gray-150 rounded-lg p-5 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-[#4a8] text-white font-bold flex items-center justify-center text-[18px]">
                        G
                      </div>
                      <div>
                        <h4 className="text-[16px] text-black font-semibold">GreenHouse</h4>
                        <p className="text-[13px] text-gray-500">Home Flowers & Plants</p>
                        <p className="text-[12px] text-[#dec33a] font-medium">★ 4.8 (850 reviews)</p>
                      </div>
                    </div>
                    <button type="button" className="border border-[#686f7d] px-3.5 py-1.5 rounded text-[13px] font-semibold text-black hover:bg-gray-50 cursor-pointer">
                      Visit Shop
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REFUNDS PANEL */}
            {activeTab === 'refunds' && (
              <div className="border border-[#e5e5e6] rounded bg-white p-6 space-y-6 text-left">
                <div className="border-b border-[#e5e5e6] pb-3 flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-black" />
                  <h2 className="text-[20px] font-semibold text-black tracking-tight">
                    Returns & Refunds
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* Refund Item */}
                  <div className="border border-gray-100 rounded-lg p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center flex-wrap gap-2 text-[14px]">
                      <p className="text-gray-500">Return ID: <span className="font-semibold text-black">#RET-482937</span></p>
                      <div className="flex items-center gap-1 text-[#22c55e] bg-green-50 border border-green-200 px-3 py-1 rounded-full text-[12px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Refund Processed</span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center border-t border-b border-gray-50 py-3.5">
                      <div className="w-16 h-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=150" alt="Plant" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[16px] text-black font-semibold">Plant (Glass Vase)</h4>
                        <p className="text-[13px] text-gray-500">Refund Amount: $49.99</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-semibold text-black">Returned June 10, 2026</p>
                        <p className="text-[12px] text-gray-400">Via original card</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Main Profile page controller component.
 * Verifies user authentication and hydrates form.
 */
export default function ProfilePage() {
  const { session, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if user session is absent
  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [session, isLoading, router]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#dec33a] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[16px] font-medium">Loading account...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return <ProfileForm key={session.userId} session={session} onLogout={handleLogout} />;
}
