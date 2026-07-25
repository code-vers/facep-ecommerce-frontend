"use client";

import React, { useState } from "react";
import { ChevronDown, Eye, Pencil, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/dashboard/orders/Pagination";
import AddCategoryModal, { CategoryStatus } from "./AddCategoryModal";
import ViewCategoryModal from "./ViewCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { cn } from "@/lib/utils";

interface CategoryData {
  id: string;
  name: string;
  subcategories: number;
  products: number;
  orders: number;
  sales: string;
  status: CategoryStatus;
}

const mockCategories: CategoryData[] = [
  {
    id: "1",
    name: "Plant",
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: "$ 200",
    status: "Active",
  },
  {
    id: "2",
    name: "Electronics",
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: "$ 300",
    status: "Active",
  },
  {
    id: "3",
    name: "Electronics",
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: "$ 300",
    status: "Active",
  },
  {
    id: "4",
    name: "Electronics",
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: "$ 300",
    status: "Active",
  },
  {
    id: "5",
    name: "Electronics",
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: "$ 300",
    status: "Disable",
  },
  {
    id: "6",
    name: "Electronics",
    subcategories: 20,
    products: 2200,
    orders: 2000,
    sales: "$ 300",
    status: "Disable",
  },
];

const getStatusStyles = (status: CategoryStatus) => {
  if (status === "Active") {
    return "bg-[#E0EBE4] text-[#229A4E]";
  }
  return "bg-[#FDE2E2] text-[#CB1B1B]";
};

export default function CategoriesTable() {
  const [categories, setCategories] = useState<CategoryData[]>(mockCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<CategoryData | null>(null);
  const [editCategory, setEditCategory] = useState<CategoryData | null>(null);

  const handleAddCategory = (data: {
    name: string;
    subcategories: number;
    status: CategoryStatus;
  }) => {
    const newCategory: CategoryData = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      subcategories: data.subcategories,
      products: 0,
      orders: 0,
      sales: "$ 0",
      status: data.status,
    };
    setCategories([newCategory, ...categories]);
    toast.success(`Category "${data.name}" created successfully!`);
  };

  const handleEditCategory = (
    categoryId: string,
    data: { name: string; subcategories: number; status: CategoryStatus },
  ) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              name: data.name,
              subcategories: data.subcategories,
              status: data.status,
            }
          : cat,
      ),
    );
    toast.success(`Category "${data.name}" updated successfully!`);
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-6 rounded border border-[#E5E5E6] bg-white p-4 md:p-6">
      {/* Header */}
      <div className="flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="whitespace-nowrap text-xl font-semibold leading-[1.2] text-black">
          Categories
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex h-9 w-full sm:w-62.5 shrink-0 items-center overflow-hidden rounded-sm border border-[#E5E5E6] bg-white px-3 py-2.5">
            <p className="min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-[1.3] text-[#848995]">
              Filter By Status
            </p>
            <ChevronDown size={16} className="text-[#848995]" />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex h-9 w-full sm:w-auto items-center justify-center gap-2 rounded-sm bg-[#F09000] px-4 transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1"
          >
            <span className="text-sm font-normal text-black">
              Add New Category
            </span>
            <PlusCircle size={16} className="text-black" />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="flex w-full shrink-0 flex-col items-start overflow-x-auto">
        <div className="min-w-250 flex w-full shrink-0 flex-col items-start">
          {/* Table Header row */}
          <div className="flex h-10 w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-2">
            <div className="min-w-37.5 flex-[1.5_0_0] px-2">
              <p className="whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black">
                Categories
              </p>
            </div>
            <div className="flex-[1_0_0] px-2">
              <p className="whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black">
                Subcategories
              </p>
            </div>
            <div className="flex-[1_0_0] px-2">
              <p className="whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black">
                Products
              </p>
            </div>
            <div className="flex-[1_0_0] px-2">
              <p className="whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black">
                Orders
              </p>
            </div>
            <div className="flex-[1_0_0] px-2">
              <p className="whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black">
                Sales
              </p>
            </div>
            <div className="w-30 shrink-0 px-2">
              <p className="whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black">
                Status
              </p>
            </div>
            <div className="w-25 shrink-0 px-2 text-center">
              <p className="whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black">
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-4 px-2 transition-colors hover:bg-gray-50"
            >
              <div className="min-w-37.5 flex-[1.5_0_0] px-2">
                <p className="truncate text-[13px] font-normal leading-[1.3] text-[#42454D]">
                  {category.name}
                </p>
              </div>
              <div className="flex-[1_0_0] px-2">
                <p className="truncate text-[13px] font-normal leading-[1.3] text-[#42454D]">
                  {category.subcategories}
                </p>
              </div>
              <div className="flex-[1_0_0] px-2">
                <p className="truncate text-[13px] font-normal leading-[1.3] text-[#42454D]">
                  {category.products}
                </p>
              </div>
              <div className="flex-[1_0_0] px-2">
                <p className="truncate text-[13px] font-normal leading-[1.3] text-[#42454D]">
                  {category.orders}
                </p>
              </div>
              <div className="flex-[1_0_0] px-2">
                <p className="truncate text-[13px] font-normal leading-[1.3] text-[#42454D]">
                  {category.sales}
                </p>
              </div>
              <div className="w-30 shrink-0 px-2">
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-sm px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300",
                    getStatusStyles(category.status),
                  )}
                >
                  <span className="text-xs font-normal leading-[1.3]">
                    {category.status}
                  </span>
                  <ChevronDown size={12} className="opacity-70" />
                </button>
              </div>
              <div className="w-25 shrink-0 px-2">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setViewCategory(category)}
                    className="text-[#42454D] transition-colors hover:text-black focus-visible:outline-none cursor-pointer"
                    aria-label="View Category"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setEditCategory(category)}
                    className="text-[#42454D] transition-colors hover:text-black focus-visible:outline-none cursor-pointer"
                    aria-label="Edit Category"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none cursor-pointer"
                    aria-label="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <Pagination />

      {/* Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <ViewCategoryModal
        isOpen={!!viewCategory}
        onClose={() => setViewCategory(null)}
        category={viewCategory}
      />

      <EditCategoryModal
        isOpen={!!editCategory}
        onClose={() => setEditCategory(null)}
        category={editCategory}
        onEditCategory={handleEditCategory}
      />
    </div>
  );
}
