'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileAddresses from '@/components/profile/ProfileAddresses';
import ProfilePaymentMethods from '@/components/profile/ProfilePaymentMethods';
import { INITIAL_ADDRESSES, INITIAL_CARDS, UserAddress, UserSavedCard } from '@/lib/profile-data';

export default function ProfilePage() {
  const { session } = useAuth();
  
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);
  const [cards, setCards] = useState<UserSavedCard[]>(INITIAL_CARDS);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');

  const [profileData, setProfileData] = useState({
    fullName: session?.fullName || '',
    email: session?.email || '',
    contactNumber: '+41 00 000 00 00',
    address: '123 Edelweiss Strasse, Zurich',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  });

  const handleSaveProfile = async (updated: typeof profileData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfileData(updated);
  };

  const handleUpdateAddresses = async (updatedAddresses: UserAddress[]) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setAddresses(updatedAddresses);
  };

  const handleUpdateCards = async (updatedCards: UserSavedCard[]) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCards(updatedCards);
  };

  const handleUpdatePaymentMethod = async (method: 'COD' | 'CARD') => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPaymentMethod(method);
  };

  if (!session) return null; // Loading/Auth states are handled by layout.tsx

  return (
    <div className="space-y-8 w-full text-left">
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
  );
}
