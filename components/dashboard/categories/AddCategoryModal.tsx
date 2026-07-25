"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type CategoryStatus = "Active" | "Disable";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (categoryData: {
    name: string;
    subcategories: number;
    status: CategoryStatus;
    subcategoryNames?: string[];
  }) => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAddCategory,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<CategoryStatus>("Active");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<string[]>([
    "jeans",
    "cargo",
    "shirt",
  ]);

  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim()) {
      setSubcategories([...subcategories, newSubcategoryName.trim()]);
      setNewSubcategoryName("");
      setIsAddingSubcategory(false);
    }
  };

  const handleRemoveSubcategory = (subcatToRemove: string) => {
    setSubcategories(
      subcategories.filter((subcat) => subcat !== subcatToRemove),
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    onAddCategory({
      name: name.trim(),
      subcategories: subcategories.length,
      status,
      subcategoryNames: subcategories,
    });

    // Reset state
    setName("");
    setStatus("Active");
    setSubcategories(["jeans", "cargo", "shirt"]);
    setIsAddingSubcategory(false);
    setNewSubcategoryName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-[#e5e5e6] w-full max-w-200 rounded-md flex flex-col p-10 relative max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Close Button Overlay */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border border-[#e5e5e6] flex flex-col gap-6 p-6">
          {/* Header */}
          <div className="border-b border-[#e5e5e6] flex items-center justify-between pb-2 w-full">
            <h2 className="font-['Open_Sans'] font-normal text-lg text-black leading-[1.2]">
              Add New Category
            </h2>

            {/* Status Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={cn(
                  "border flex gap-2 items-center justify-center px-2.5 py-1 rounded-sm transition-colors",
                  status === "Active"
                    ? "bg-[#f0f4f2] border-[#e0ebe4] text-[#229a4e]"
                    : "bg-[#FDE2E2] border-[#FAD4D4] text-[#CB1B1B]",
                )}
              >
                <span className="font-['Open_Sans'] font-normal text-xs leading-[1.3]">
                  {status}
                </span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 top-[110%] bg-white border border-[#e5e5e6] shadow-md rounded-sm w-25 overflow-hidden z-10">
                  <button
                    onClick={() => {
                      setStatus("Active");
                      setIsStatusDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-[#229a4e]"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setStatus("Disable");
                      setIsStatusDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-[#CB1B1B]"
                  >
                    Disable
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full">
            {/* Category Name Input */}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-['Open_Sans'] font-normal text-base text-black leading-[1.2]">
                Category name
              </label>
              <div className="bg-white border border-[#e5e5e6] rounded-sm px-3 py-2.5 w-full focus-within:border-[#F09000] transition-colors">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full font-['Open_Sans'] font-normal text-sm text-black placeholder:text-[#848995] focus:outline-none"
                />
              </div>
            </div>

            {/* Subcategories Display */}
            {subcategories.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center w-full">
                {subcategories.map((subcat) => (
                  <div
                    key={subcat}
                    className="flex gap-3 items-center cursor-pointer group"
                    onClick={() => handleRemoveSubcategory(subcat)}
                  >
                    <div className="relative shrink-0 size-4">
                      <div className="absolute inset-0 bg-[#f09000] border border-[#f09000] rounded flex items-center justify-center transition-colors group-hover:bg-[#d98200]">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    </div>
                    <span className="font-['Open_Sans'] font-normal text-sm text-[#344054] leading-[1.3]">
                      {subcat}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subcategory Trigger */}
            <button
              onClick={() => setIsAddingSubcategory(true)}
              className="text-[#165dd0] font-['Open_Sans'] font-normal text-base leading-[1.2] w-max hover:underline text-left"
            >
              Add subcategory +
            </button>

            {/* Add Subcategory Input */}
            {isAddingSubcategory && (
              <div className="flex flex-col gap-2 w-full mt-2">
                <label className="font-['Open_Sans'] font-normal text-base text-black leading-[1.2]">
                  Subcategory name
                </label>
                <div className="bg-white border border-[#e5e5e6] rounded-sm pl-3 pr-3 py-2.5 w-full flex items-center focus-within:border-[#F09000] transition-colors">
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Enter subcategory name"
                    className="flex-1 font-['Open_Sans'] font-normal text-sm text-black placeholder:text-[#848995] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubcategory();
                    }}
                  />
                  <button
                    onClick={handleAddSubcategory}
                    className="text-[#165dd0] hover:text-[#0f46a3] transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end w-full mt-4">
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="bg-[#f09000] hover:bg-[#d98200] disabled:opacity-50 disabled:cursor-not-allowed border border-[#f09000] text-black font-['Open_Sans'] font-normal text-sm leading-[1.2] px-3 py-2 rounded-sm transition-colors flex items-center gap-2"
              >
                Add Category
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
