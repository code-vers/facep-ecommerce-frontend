/**
 * @fileoverview Address management section of the User Profile Page.
 * Renders multiple shipping locations, edit/delete actions, and default selectors.
 *
 * @module components/profile/ProfileAddresses
 */

import React, { useState } from 'react';
import { MapPin, Phone, Edit2, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { UserAddress } from '@/lib/profile-data';

interface ProfileAddressesProps {
  initialAddresses: UserAddress[];
  onUpdateAddresses: (addresses: UserAddress[]) => Promise<void>;
}

/**
 * ProfileAddresses component.
 */
export default function ProfileAddresses({
  initialAddresses,
  onUpdateAddresses,
}: ProfileAddressesProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // Track loader on action

  // Input states for form (both Add and Edit)
  const [formLabel, setFormLabel] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormLabel('');
    setFormAddress('');
    setFormPhone('');
    setFormError('');
  };

  const handleSetDefault = async (id: string) => {
    setIsUpdating(id);
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    try {
      await onUpdateAddresses(updated);
      setAddresses(updated);
    } catch {
      alert('Failed to set default address.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    const toDelete = addresses.find((a) => a.id === id);
    if (!toDelete) return;
    if (toDelete.isDefault && addresses.length > 1) {
      alert('You cannot delete the default address. Please set another as default first.');
      return;
    }

    if (!confirm('Are you sure you want to delete this address?')) return;

    setIsUpdating(id);
    const updated = addresses.filter((addr) => addr.id !== id);
    // If we deleted default and there's a card left, make it default
    if (toDelete.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    try {
      await onUpdateAddresses(updated);
      setAddresses(updated);
    } catch {
      alert('Failed to delete address.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formAddress.trim() || !formPhone.trim()) {
      setFormError('All fields are required');
      return;
    }

    setIsUpdating('add');
    const newAddress: UserAddress = {
      id: `addr-${Date.now()}`,
      label: formLabel,
      addressLine: formAddress,
      phone: formPhone,
      isDefault: addresses.length === 0, // Make default if first address
    };

    const updated = [...addresses, newAddress];
    try {
      await onUpdateAddresses(updated);
      setAddresses(updated);
      setShowAddForm(false);
      resetForm();
    } catch {
      setFormError('Failed to add address.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleStartEdit = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setFormLabel(addr.label);
    setFormAddress(addr.addressLine);
    setFormPhone(addr.phone);
  };

  const handleEditSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!formLabel.trim() || !formAddress.trim() || !formPhone.trim()) {
      setFormError('All fields are required');
      return;
    }

    setIsUpdating(id);
    const updated = addresses.map((addr) => {
      if (addr.id === id) {
        return {
          ...addr,
          label: formLabel,
          addressLine: formAddress,
          phone: formPhone,
        };
      }
      return addr;
    });

    try {
      await onUpdateAddresses(updated);
      setAddresses(updated);
      setEditingAddressId(null);
      resetForm();
    } catch {
      setFormError('Failed to update address.');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="w-full border border-[#e5e5e6] rounded bg-white p-6 space-y-6">
      {/* Header section with add button */}
      <div className="flex justify-between items-center border-b border-[#e5e5e6] pb-3 text-left">
        <h2 className="text-[20px] font-semibold text-black tracking-tight">
          Address
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingAddressId(null);
            setShowAddForm(!showAddForm);
            resetForm();
          }}
          className="text-[16px] text-[#165dd0] font-normal hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Address +</span>
        </button>
      </div>

      {/* Add New Address Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="border border-dashed border-[#dec33a] bg-[#fcfcfc] rounded p-5 space-y-4 text-left">
          <h4 className="text-[16px] font-semibold text-black">New Address Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="addrLabel" className="text-[14px] text-black">Label (e.g. Home, Office)</label>
              <input
                id="addrLabel"
                type="text"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="Home"
                className="w-full bg-white border border-[#e5e5e6] rounded px-3 py-2 text-[14px] text-black focus:outline-none focus:border-[#dec33a]"
              />
            </div>
            
            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="addrLine" className="text-[14px] text-black">Full Address</label>
              <input
                id="addrLine"
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="123 Main Road, Rampura, Dhaka"
                className="w-full bg-white border border-[#e5e5e6] rounded px-3 py-2 text-[14px] text-black focus:outline-none focus:border-[#dec33a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="addrPhone" className="text-[14px] text-black">Phone Number</label>
              <input
                id="addrPhone"
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="01245876233"
                className="w-full bg-white border border-[#e5e5e6] rounded px-3 py-2 text-[14px] text-black focus:outline-none focus:border-[#dec33a]"
              />
            </div>
            
            <div className="flex items-end justify-end gap-2.5 pt-2">
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
                  <span>Save Address</span>
                )}
              </button>
            </div>
          </div>
          {formError && <p className="text-[12px] text-red-600 font-medium">{formError}</p>}
        </form>
      )}

      {/* Address Cards List */}
      <div className="space-y-4 text-left">
        {addresses.map((addr) => {
          const isEditing = editingAddressId === addr.id;

          if (isEditing) {
            return (
              <form
                key={addr.id}
                onSubmit={(e) => handleEditSubmit(e, addr.id)}
                className="border border-[#dec33a] bg-[#fcfcfc] rounded p-5 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-[16px] font-semibold text-black">Edit Address Details</h4>
                  <button type="button" onClick={() => setEditingAddressId(null)} className="text-gray-400 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] text-black">Label</label>
                    <input
                      type="text"
                      value={formLabel}
                      onChange={(e) => setFormLabel(e.target.value)}
                      className="w-full bg-white border border-[#dec33a] rounded px-3 py-2 text-[14px] text-black focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[14px] text-black">Address</label>
                    <input
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full bg-white border border-[#dec33a] rounded px-3 py-2 text-[14px] text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] text-black">Phone Number</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-white border border-[#dec33a] rounded px-3 py-2 text-[14px] text-black focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex items-end justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingAddressId(null)}
                      className="px-4 py-2 text-[14px] text-gray-500 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating === addr.id}
                      className="px-4 py-2 bg-[#dec33a] hover:bg-[#c9b030] text-black text-[14px] font-semibold rounded flex items-center gap-1 cursor-pointer"
                    >
                      {isUpdating === addr.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Save</span>
                      )}
                    </button>
                  </div>
                </div>
                {formError && <p className="text-[12px] text-red-600 font-medium">{formError}</p>}
              </form>
            );
          }

          return (
            <div
              key={addr.id}
              className={`border rounded p-6 flex flex-col gap-4 relative transition-all ${
                addr.isDefault
                  ? 'border-[#dec33a] bg-[#fdfdfb]'
                  : 'border-[#e5e5e6] hover:border-gray-300'
              }`}
            >
              {/* Header inside card */}
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                  <span className="text-[22px] font-normal text-black leading-none">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="bg-[#ede7de] border border-[#dec33a] text-[#dec33a] text-[12px] px-2.5 py-1 rounded-xs font-normal">
                      Default
                    </span>
                  )}
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex gap-3 items-center text-gray-400">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(addr)}
                    className="hover:text-black transition-all cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit2 className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="hover:text-red-600 transition-all cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>

              {/* Card content address + phone */}
              <div className="flex items-end justify-between w-full flex-wrap gap-4">
                <div className="flex flex-col gap-3 items-start max-w-xl">
                  {/* Address line */}
                  <div className="flex gap-4.5 items-start text-black">
                    <MapPin className="w-[20px] h-[20px] text-gray-500 shrink-0 mt-1" />
                    <p className="text-[16px] leading-relaxed text-black font-normal">
                      {addr.addressLine}
                    </p>
                  </div>
                  {/* Phone line */}
                  <div className="flex gap-4.5 items-center text-black">
                    <Phone className="w-[20px] h-[20px] text-gray-500 shrink-0" />
                    <p className="text-[16px] font-normal text-black">
                      {addr.phone}
                    </p>
                  </div>
                </div>

                {/* Set as Default button at bottom-right */}
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={isUpdating !== null}
                    className="ml-auto bg-[#dec33a] hover:bg-[#c9b030] border border-[#dec33a] hover:border-[#c9b030] text-black text-[15px] font-semibold py-2 px-4 rounded transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {isUpdating === addr.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Set As Default'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
