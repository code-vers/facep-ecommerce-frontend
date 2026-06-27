/**
 * @fileoverview Payment Methods management section of the User Profile Page.
 * Supports toggling COD vs Credit Card, listing saved cards, deleting cards,
 * setting a card as default, and adding new cards inline.
 *
 * @module components/profile/ProfilePaymentMethods
 */

import React, { useState } from 'react';
import { CreditCard, Package, Calendar, Trash2, Plus, Loader2 } from 'lucide-react';
import { UserSavedCard } from '@/lib/profile-data';

interface ProfilePaymentMethodsProps {
  initialCards: UserSavedCard[];
  initialPaymentMethod: 'COD' | 'CARD';
  onUpdateCards: (cards: UserSavedCard[]) => Promise<void>;
  onUpdatePaymentMethod: (method: 'COD' | 'CARD') => Promise<void>;
}

// Inline SVGs for credit card logos for reliable loading
const VisaLogo = () => (
  <svg className="h-6 w-12 shrink-0" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.4 0.2L3.1 7.8H5L3.3 0.2H1.4ZM8.8 0.2H5.8L4.2 6.8C4.1 7.1 3.8 7.5 3.3 7.6L5.1 7.8C5.2 7.7 5.6 7.4 5.7 7.0L6.7 2.9C6.8 2.6 7.1 2.2 7.6 2.2H8.8L8.8 0.2ZM12.7 2.1C11.5 1.5 10.1 1.7 9.8 2.9L9.3 4.8C8.9 6.2 10.3 6.4 11.2 6.9C11.9 7.2 12.8 6.9 13.0 6.0L13.5 4.1C13.8 2.9 13.5 2.5 12.7 2.1ZM22.6 0.2H20.9L16.2 5.5L15.3 0.2H13.6L15.6 7.8H17.4L22.6 0.2Z"
      fill="#1A1F71"
    />
  </svg>
);

const MastercardLogo = () => (
  <svg className="h-8 w-12 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="12" r="7" fill="#EB001B" fillOpacity="0.8" />
    <circle cx="15" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" />
    <path
      d="M12 12C12 9.6 12.9 7.4 14.5 5.8C12.9 4.2 10.7 3.3 8.3 3.3C3.7 3.3 0 7 0 11.7C0 16.3 3.7 20 8.3 20C10.7 20 12.9 19.1 14.5 17.5C12.9 15.9 12 13.7 12 12Z"
      fill="#EB001B"
    />
    <path
      d="M24 11.7C24 7 20.3 3.3 15.7 3.3C13.3 3.3 11.1 4.2 9.5 5.8C11.1 7.4 12 9.6 12 12C12 14.4 11.1 16.6 9.5 18.2C11.1 19.8 13.3 20.7 15.7 20.7C20.3 20.7 24 17 24 11.7Z"
      fill="#F79E1B"
    />
  </svg>
);

/**
 * ProfilePaymentMethods component.
 */
export default function ProfilePaymentMethods({
  initialCards,
  initialPaymentMethod,
  onUpdateCards,
  onUpdatePaymentMethod,
}: ProfilePaymentMethodsProps) {
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>(initialPaymentMethod);
  const [cards, setCards] = useState<UserSavedCard[]>(initialCards);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // New Card input state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setCardNumber('');
    setCardExpiry('');
    setCardHolder('');
    setCardCvv('');
    setFormError('');
  };

  const handleMethodChange = async (method: 'COD' | 'CARD') => {
    setIsUpdating(method);
    try {
      await onUpdatePaymentMethod(method);
      setPaymentMethod(method);
    } catch {
      alert('Failed to change payment method.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSetDefaultCard = async (id: string) => {
    setIsUpdating(id);
    const updated = cards.map((c) => ({
      ...c,
      isDefault: c.id === id,
    }));
    try {
      await onUpdateCards(updated);
      setCards(updated);
    } catch {
      alert('Failed to update default card.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteCard = async (id: string) => {
    const cardToDelete = cards.find((c) => c.id === id);
    if (!cardToDelete) return;
    if (cardToDelete.isDefault && cards.length > 1) {
      alert('You cannot delete the default card. Set another default card first.');
      return;
    }

    if (!confirm('Are you sure you want to remove this card?')) return;

    setIsUpdating(id);
    const updated = cards.filter((c) => c.id !== id);
    if (cardToDelete.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }

    try {
      await onUpdateCards(updated);
      setCards(updated);
    } catch {
      alert('Failed to remove card.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim() || !cardExpiry.trim() || !cardHolder.trim() || !cardCvv.trim()) {
      setFormError('All card fields are required');
      return;
    }

    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanNumber)) {
      setFormError('Card number must be 16 digits');
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
      setFormError('Expiry must be in MM/YY format');
      return;
    }

    if (!/^\d{3,4}$/.test(cardCvv)) {
      setFormError('CVV must be 3 or 4 digits');
      return;
    }

    setIsUpdating('add');
    const newCard: UserSavedCard = {
      id: `pcard-${Date.now()}`,
      label: `Card ${cards.length + 1}`,
      brand: cleanNumber.startsWith('5') ? 'Mastercard' : 'Visa',
      last4: cleanNumber.slice(-4),
      expiry: cardExpiry,
      isDefault: cards.length === 0,
    };

    const updated = [...cards, newCard];
    try {
      await onUpdateCards(updated);
      setCards(updated);
      setShowAddForm(false);
      resetForm();
    } catch {
      setFormError('Failed to add payment card.');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="w-full border border-[#e5e5e6] rounded bg-white p-6 space-y-6">
      {/* Title */}
      <div className="border-b border-[#e5e5e6] pb-3 text-left">
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          Payment Details
        </h2>
      </div>

      {/* Payment Method Option Selection */}
      <div className="space-y-4 text-left">
        <label className="text-[16px] text-black font-normal block">
          Payment Method
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* COD Option */}
          <div
            onClick={() => handleMethodChange('COD')}
            className={`border rounded p-4 flex items-center justify-between cursor-pointer transition-all ${
              paymentMethod === 'COD'
                ? 'border-black ring-1 ring-black bg-[#fcfcfc]'
                : 'border-[#e5e5e6] hover:border-gray-400'
            }`}
          >
            <div className="flex gap-4 items-center">
              <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border border-gray-100 rounded text-gray-700">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[16px] font-semibold text-black leading-tight">COD</span>
                <span className="text-[12px] text-[#42454d]">Cash on delivery</span>
              </div>
            </div>
            {/* Custom Radio check */}
            <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center p-0.5">
              {paymentMethod === 'COD' && (
                <div className="w-full h-full bg-black rounded-full" />
              )}
            </div>
          </div>

          {/* Credit Card Option */}
          <div
            onClick={() => handleMethodChange('CARD')}
            className={`border rounded p-4 flex items-center justify-between cursor-pointer transition-all ${
              paymentMethod === 'CARD'
                ? 'border-black ring-1 ring-black bg-[#fcfcfc]'
                : 'border-[#e5e5e6] hover:border-gray-400'
            }`}
          >
            <div className="flex gap-4 items-center">
              <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border border-gray-100 rounded text-gray-700">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[16px] font-semibold text-black leading-tight">Credit / Debit Card</span>
                <span className="text-[12px] text-[#42454d]">Choose your card</span>
              </div>
            </div>
            {/* Custom Radio check */}
            <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center p-0.5">
              {paymentMethod === 'CARD' && (
                <div className="w-full h-full bg-black rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Cards list - only displayed if credit/debit card is active */}
      {paymentMethod === 'CARD' && (
        <div className="space-y-6 pt-2 transition-all duration-300">
          <div className="flex justify-between items-center text-left">
            <label className="text-[16px] text-black font-normal">
              Card Details
            </label>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(!showAddForm);
                resetForm();
              }}
              className="text-[16px] text-[#165dd0] font-normal hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Card +</span>
            </button>
          </div>

          {/* Inline Add Card Form */}
          {showAddForm && (
            <form onSubmit={handleAddCardSubmit} className="border border-dashed border-[#dec33a] bg-[#fcfcfc] rounded p-5 space-y-4 text-left">
              <h4 className="text-[16px] font-semibold text-black">Add New Credit Card</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="pcardNumber" className="text-[14px] text-black">Card Number</label>
                  <input
                    id="pcardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter 16-digit card number"
                    maxLength={19}
                    className="w-full bg-white border border-[#e5e5e6] rounded px-3 py-2 text-[14px] text-black focus:outline-none focus:border-[#dec33a]"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label htmlFor="pcardExpiry" className="text-[14px] text-black">Expiration Date</label>
                  <div className="relative w-full">
                    <input
                      id="pcardExpiry"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-white border border-[#e5e5e6] rounded pl-9 pr-3 py-2 text-[14px] text-black focus:outline-none focus:border-[#dec33a]"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label htmlFor="pcardHolder" className="text-[14px] text-black">Cardholder Name</label>
                  <input
                    id="pcardHolder"
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Enter cardholder name"
                    className="w-full bg-white border border-[#e5e5e6] rounded px-3 py-2 text-[14px] text-black focus:outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label htmlFor="pcardCvv" className="text-[14px] text-black">CVV</label>
                  <input
                    id="pcardCvv"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    maxLength={4}
                    className="w-full bg-white border border-[#e5e5e6] rounded px-3 py-2 text-[14px] text-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-[14px] text-gray-500 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating === 'add'}
                  className="px-4 py-2 bg-[#dec33a] hover:bg-[#c9b030] text-black text-[14px] font-semibold rounded flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating === 'add' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save Card</span>
                  )}
                </button>
              </div>
              {formError && <p className="text-[12px] text-red-600 font-medium">{formError}</p>}
            </form>
          )}

          {/* Cards List Display */}
          <div className="space-y-4 text-left">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`border rounded p-6 flex flex-col gap-4 relative transition-all ${
                  card.isDefault
                    ? 'border-[#dec33a] bg-[#fdfdfb]'
                    : 'border-[#e5e5e6] hover:border-gray-300'
                }`}
              >
                {/* Card header */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-3 items-center">
                    <span className="text-[22px] font-normal text-black leading-none">
                      {card.label}
                    </span>
                    {card.isDefault && (
                      <span className="bg-[#ede7de] border border-[#dec33a] text-[#dec33a] text-[12px] px-2.5 py-1 rounded-xs font-normal">
                        Default
                    </span>
                    )}
                  </div>

                  {/* Actions inside card */}
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-gray-400 hover:text-red-600 transition-all cursor-pointer"
                    title="Remove Card"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>

                {/* Card details */}
                <div className="flex items-end justify-between w-full flex-wrap gap-4">
                  <div className="flex gap-4 items-center">
                    {/* Brand logo image wrapper */}
                    <div className="w-12 h-8 border border-gray-100 rounded bg-white overflow-hidden p-1 shrink-0 flex items-center justify-center">
                      {card.brand === 'Visa' ? <VisaLogo /> : <MastercardLogo />}
                    </div>
                    {/* Expiry / last4 details */}
                    <div className="flex flex-col text-left">
                      <span className="text-[18px] font-medium text-black leading-tight">
                        •••• •••• •••• {card.last4}
                      </span>
                      <span className="text-[12px] text-[#42454d]">Expires {card.expiry}</span>
                    </div>
                  </div>

                  {/* Set default option */}
                  {!card.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultCard(card.id)}
                      disabled={isUpdating !== null}
                      className="ml-auto bg-[#dec33a] hover:bg-[#c9b030] border border-[#dec33a] hover:border-[#c9b030] text-black text-[15px] font-semibold py-2 px-4 rounded transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      {isUpdating === card.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Set As Default'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
