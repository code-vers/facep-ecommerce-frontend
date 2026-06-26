/**
 * @fileoverview Payment Details section of the Checkout form.
 * Renders selection of payment method (COD vs Card), saved card list, and manual credit card inputs.
 *
 * @module components/checkout/CheckoutPaymentDetails
 */

import React from 'react';
import { CreditCard, Package, Calendar } from 'lucide-react';
import { SAVED_CARDS } from '@/lib/checkout-data';

interface CheckoutPaymentDetailsProps {
  formData: {
    paymentMethod: 'COD' | 'CARD';
    selectedCardId: string;
    cardNumber: string;
    cardExpiry: string;
    cardHolder: string;
    cardCvv: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

// Inline SVGs for credit card logos for reliable loading
const VisaLogo = () => (
  <svg className="h-6 w-12" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.4 0.2L3.1 7.8H5L3.3 0.2H1.4ZM8.8 0.2H5.8L4.2 6.8C4.1 7.1 3.8 7.5 3.3 7.6L5.1 7.8C5.2 7.7 5.6 7.4 5.7 7.0L6.7 2.9C6.8 2.6 7.1 2.2 7.6 2.2H8.8L8.8 0.2ZM12.7 2.1C11.5 1.5 10.1 1.7 9.8 2.9L9.3 4.8C8.9 6.2 10.3 6.4 11.2 6.9C11.9 7.2 12.8 6.9 13.0 6.0L13.5 4.1C13.8 2.9 13.5 2.5 12.7 2.1ZM22.6 0.2H20.9L16.2 5.5L15.3 0.2H13.6L15.6 7.8H17.4L22.6 0.2Z"
      fill="#1A1F71"
    />
  </svg>
);

const MastercardLogo = () => (
  <svg className="h-8 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
 * CheckoutPaymentDetails component.
 * Manages selecting COD or Card, saved card options, and card data.
 */
export default function CheckoutPaymentDetails({
  formData,
  onChange,
  errors,
}: CheckoutPaymentDetailsProps) {
  const handlePaymentMethodChange = (method: 'COD' | 'CARD') => {
    onChange('paymentMethod', method);
  };

  const handleCardSelection = (cardId: string) => {
    onChange('selectedCardId', cardId);
  };

  return (
    <div className="w-full border border-[#e5e5e6] rounded bg-white p-6 space-y-6">
      {/* Title Header */}
      <div className="border-b border-[#e5e5e6] pb-3">
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          Payment Details
        </h2>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-4">
        <label className="text-[16px] text-black font-normal block">
          Choose Payment Method
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Cash on Delivery (COD) */}
          <div
            onClick={() => handlePaymentMethodChange('COD')}
            className={`border rounded p-4 flex items-center justify-between cursor-pointer transition-all ${
              formData.paymentMethod === 'COD'
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
            {/* Custom Radio Button */}
            <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center p-0.5">
              {formData.paymentMethod === 'COD' && (
                <div className="w-full h-full bg-black rounded-full" />
              )}
            </div>
          </div>

          {/* Credit / Debit Card */}
          <div
            onClick={() => handlePaymentMethodChange('CARD')}
            className={`border rounded p-4 flex items-center justify-between cursor-pointer transition-all ${
              formData.paymentMethod === 'CARD'
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
            {/* Custom Radio Button */}
            <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center p-0.5">
              {formData.paymentMethod === 'CARD' && (
                <div className="w-full h-full bg-black rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Card Options Panel */}
      {formData.paymentMethod === 'CARD' && (
        <div className="space-y-6 pt-2 transition-all duration-300">
          <label className="text-[16px] text-black font-normal block">
            Card Details
          </label>

          {/* Saved Cards List */}
          <div className="space-y-4 w-full">
            {SAVED_CARDS.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardSelection(card.id)}
                className={`border rounded p-4 flex items-center justify-between cursor-pointer transition-all ${
                  formData.selectedCardId === card.id
                    ? 'border-black ring-1 ring-black bg-[#fcfcfc]'
                    : 'border-[#e5e5e6] hover:border-gray-400'
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-8 flex items-center justify-center border border-gray-100 rounded bg-white overflow-hidden p-1 shrink-0">
                    {card.brand === 'Visa' ? <VisaLogo /> : <MastercardLogo />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[16px] font-medium text-black leading-tight">
                      •••• •••• •••• {card.last4}
                    </span>
                    <span className="text-[12px] text-[#42454d]">Expires {card.expiry}</span>
                  </div>
                </div>
                {/* Custom Radio Button */}
                <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center p-0.5">
                  {formData.selectedCardId === card.id && (
                    <div className="w-full h-full bg-black rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* "Add another +" Button */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => handleCardSelection('new')}
              className={`text-[16px] font-medium hover:underline focus:outline-none transition-all ${
                formData.selectedCardId === 'new' ? 'text-black font-bold' : 'text-[#165dd0]'
              }`}
            >
              Add another +
            </button>
          </div>

          {/* Manual Card Fields Form */}
          {formData.selectedCardId === 'new' && (
            <div className="space-y-4 pt-2 border-t border-gray-100 w-full transition-all duration-300 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Card Number */}
                <div className="flex flex-col gap-2 w-full text-left">
                  <label htmlFor="cardNumber" className="text-[16px] text-black font-normal">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => onChange('cardNumber', e.target.value)}
                    placeholder="Enter your card number"
                    className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
                  />
                  {errors.cardNumber && (
                    <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Expiration Date */}
                <div className="flex flex-col gap-2 w-full text-left">
                  <label htmlFor="cardExpiry" className="text-[16px] text-black font-normal">
                    Expiration Date
                  </label>
                  <div className="relative w-full">
                    <input
                      id="cardExpiry"
                      type="text"
                      required
                      value={formData.cardExpiry}
                      onChange={(e) => onChange('cardExpiry', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-white border border-[#e5e5e6] rounded pl-10 pr-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848995] pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  {errors.cardExpiry && (
                    <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.cardExpiry}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Card Holder Name */}
                <div className="flex flex-col gap-2 w-full text-left">
                  <label htmlFor="cardHolder" className="text-[16px] text-black font-normal">
                    Card holder name
                  </label>
                  <input
                    id="cardHolder"
                    type="text"
                    required
                    value={formData.cardHolder}
                    onChange={(e) => onChange('cardHolder', e.target.value)}
                    placeholder="Enter card holder name"
                    className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
                  />
                  {errors.cardHolder && (
                    <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.cardHolder}</p>
                  )}
                </div>

                {/* CVV */}
                <div className="flex flex-col gap-2 w-full text-left">
                  <label htmlFor="cardCvv" className="text-[16px] text-black font-normal">
                    CVV
                  </label>
                  <input
                    id="cardCvv"
                    type="password"
                    required
                    maxLength={4}
                    value={formData.cardCvv}
                    onChange={(e) => onChange('cardCvv', e.target.value)}
                    placeholder="Enter cvv number"
                    className="w-full bg-white border border-[#e5e5e6] rounded px-4 py-2.5 text-[14px] text-black placeholder-[#848995] focus:outline-none focus:border-[#dec33a] focus:ring-1 focus:ring-[#dec33a] transition-all"
                  />
                  {errors.cardCvv && (
                    <p className="text-[12px] text-red-600 font-medium mt-0.5">{errors.cardCvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
