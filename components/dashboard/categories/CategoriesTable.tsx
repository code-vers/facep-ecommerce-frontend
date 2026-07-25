'use client';

import { ChevronDown, Eye, Pencil, PlusCircle, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import AddCategoryModal, { CategoryStatus } from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import ViewCategoryModal from './ViewCategoryModal';

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/api/useCategory';
import { Category } from '@/lib/api/category';

const getStatusStyles = (status: string) => {
  if (status === 'Active') {
    return 'bg-[#E0EBE4] text-[#229A4E]';
  }
  return 'bg-[#FDE2E2] text-[#CB1B1B]';
};

export default function CategoriesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: categoriesData, isLoading } = useCategories(currentPage, itemsPerPage);
  const categories = categoriesData?.data || [];
  const totalPages = categoriesData?.meta?.totalPage || 1;

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleAddCategory = (data: {
    name: string;
    subcategories: number;
    status: CategoryStatus;
    subcategoryNames?: string[];
  }) => {
    createCategoryMutation.mutate(
      {
        name: data.name,
        subcategories: data.subcategoryNames || [],
        isActive: data.status === 'Active',
      },
      {
        onSuccess: () => {
          toast.success(`Category "${data.name}" created successfully!`);
          setIsAddModalOpen(false);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || 'Failed to create category');
        },
      },
    );
  };

  const handleEditCategory = (
    categoryId: string,
    data: {
      name: string;
      subcategories: number;
      status: CategoryStatus;
      subcategoryNames?: string[];
    },
  ) => {
    updateCategoryMutation.mutate(
      {
        id: categoryId,
        name: data.name,
        subcategories: data.subcategoryNames,
        isActive: data.status === 'Active',
      },
      {
        onSuccess: () => {
          toast.success(`Category "${data.name}" updated successfully!`);
          setEditCategory(null);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || 'Failed to update category');
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteCategoryMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Category deleted successfully');
        setCategoryToDelete(null);
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err?.response?.data?.message || 'Failed to delete category');
      },
    });
  };

  return (
    <div className='flex w-full shrink-0 flex-col items-start gap-6 rounded border border-[#E5E5E6] bg-white p-4 md:p-6'>
      {/* Header */}
      <div className='flex w-full shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='whitespace-nowrap text-xl font-semibold leading-[1.2] text-black'>
          Categories
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-3'>
          <div className='flex h-9 w-full sm:w-62.5 shrink-0 items-center overflow-hidden rounded-sm border border-[#E5E5E6] bg-white px-3 py-2.5'>
            <p className='min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-[1.3] text-[#848995]'>
              Filter By Status
            </p>
            <ChevronDown size={16} className='text-[#848995]' />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className='flex h-9 w-full sm:w-auto items-center justify-center gap-2 rounded-sm bg-[#F09000] px-4 transition-colors hover:bg-[#D98200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F09000] focus-visible:ring-offset-1'
          >
            <span className='text-sm font-normal text-black'>Add New Category</span>
            <PlusCircle size={16} className='text-black' />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className='flex w-full shrink-0 flex-col items-start overflow-x-auto'>
        <div className='min-w-250 flex w-full shrink-0 flex-col items-start'>
          {/* Table Header row */}
          <div className='flex h-10 w-full shrink-0 items-center border-y border-[#E5E5E6] bg-[#F2F2F3] px-2'>
            <div className='min-w-37.5 flex-[1.5_0_0] px-2'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Categories
              </p>
            </div>
            <div className='flex-[1_0_0] px-2'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Subcategories
              </p>
            </div>
            <div className='flex-[1_0_0] px-2'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Products
              </p>
            </div>
            <div className='flex-[1_0_0] px-2'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Orders
              </p>
            </div>
            <div className='flex-[1_0_0] px-2'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Sales
              </p>
            </div>
            <div className='w-30 shrink-0 px-2'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Status
              </p>
            </div>
            <div className='w-25 shrink-0 px-2 text-center'>
              <p className='whitespace-nowrap text-[13px] font-normal leading-[1.3] text-black'>
                Action
              </p>
            </div>
          </div>

          {/* Table Body rows */}
          {categories.map((category) => (
            <div
              key={category.id}
              className='flex w-full shrink-0 items-center border-b border-[#E5E5E6] py-4 px-2 transition-colors hover:bg-gray-50'
            >
              <div className='min-w-37.5 flex-[1.5_0_0] px-2'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.name}
                </p>
              </div>
              <div className='flex-[1_0_0] px-2'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.subcategories}
                </p>
              </div>
              <div className='flex-[1_0_0] px-2'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.products}
                </p>
              </div>
              <div className='flex-[1_0_0] px-2'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.orders}
                </p>
              </div>
              <div className='flex-[1_0_0] px-2'>
                <p className='truncate text-[13px] font-normal leading-[1.3] text-[#42454D]'>
                  {category.sales}
                </p>
              </div>
              <div className='w-30 shrink-0 px-2'>
                <button
                  type='button'
                  className={cn(
                    'inline-flex items-center gap-1 rounded-sm px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300',
                    getStatusStyles(category.status),
                  )}
                >
                  <span className='text-xs font-normal leading-[1.3]'>{category.status}</span>
                  <ChevronDown size={12} className='opacity-70' />
                </button>
              </div>
              <div className='w-25 shrink-0 px-2'>
                <div className='flex items-center justify-center gap-3'>
                  <button
                    onClick={() => setViewCategory(category)}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none cursor-pointer'
                    aria-label='View Category'
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setEditCategory(category)}
                    className='text-[#42454D] transition-colors hover:text-black focus-visible:outline-none cursor-pointer'
                    aria-label='Edit Category'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(category.id)}
                    className='text-[#CB1B1B] transition-colors hover:text-red-700 focus-visible:outline-none cursor-pointer'
                    aria-label='Delete Category'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && !isLoading && (
            <p className='w-full text-center py-4 text-sm text-gray-500'>No categories found</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='w-full flex items-center justify-center gap-2 mt-2'>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className='text-sm text-[#848995] hover:text-black mr-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            &lt; Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm ${
                currentPage === i + 1
                  ? 'bg-[#f2f2f3] text-black font-medium'
                  : 'bg-white text-[#42454d] hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className='text-sm text-black hover:opacity-70 ml-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next &gt;
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {categoryToDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded border border-[#E5E5E6] bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-start justify-between'>
              <h3 className='text-lg font-semibold text-black'>Delete Category</h3>
              <button
                onClick={() => setCategoryToDelete(null)}
                className='text-gray-500 transition-colors hover:text-black focus-visible:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            <p className='mb-6 text-sm text-[#42454D]'>
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setCategoryToDelete(null)}
                className='rounded-sm border border-[#E5E5E6] bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(categoryToDelete)}
                className='rounded-sm bg-[#CB1B1B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-1'
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

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

      {editCategory && (
        <EditCategoryModal
          isOpen={true}
          onClose={() => setEditCategory(null)}
          category={editCategory}
          onEditCategory={handleEditCategory}
        />
      )}
    </div>
  );
}
