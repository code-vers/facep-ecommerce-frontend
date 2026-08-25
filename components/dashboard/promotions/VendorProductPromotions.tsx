'use client';

import {
  useRemoveProductPromotion,
  useUpdateProductPromotion,
  useVendorProducts,
} from '@/hooks/api/useProduct';
import type { Product } from '@/lib/api/product';
import { Edit2, Loader2, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const numberValue = (value: number | string | null | undefined) => Number(value ?? 0);
const dateValue = (value?: string | null) => (value ? value.slice(0, 10) : '');
const money = (value: number | string) => `$${numberValue(value).toFixed(2)}`;

export default function VendorProductPromotions() {
  const { data, isLoading, isError } = useVendorProducts({ page: 1, limit: 100 });
  const updatePromotion = useUpdateProductPromotion();
  const removePromotion = useRemoveProductPromotion();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [badgeText, setBadgeText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const products = data?.data ?? [];

  useEffect(() => {
    if (!editingProduct) return;
    setDiscountType(editingProduct.discountType ?? 'PERCENTAGE');
    setDiscountValue(
      editingProduct.discountValue === null || editingProduct.discountValue === undefined
        ? ''
        : numberValue(editingProduct.discountValue),
    );
    setBadgeText(editingProduct.dealBadgeText ?? '');
    setStartDate(dateValue(editingProduct.dealStartDate));
    setEndDate(dateValue(editingProduct.dealEndDate));
  }, [editingProduct]);

  const openEditor = (product: Product) => setEditingProduct(product);
  const hasPromotion = (product: Product) =>
    product.discountType !== null && product.discountType !== undefined && product.discountValue !== null && product.discountValue !== undefined;

  const savePromotion = async () => {
    if (!editingProduct || discountValue === '' || Number(discountValue) <= 0) {
      toast.error('Enter a discount greater than zero.');
      return;
    }
    if (discountType === 'PERCENTAGE' && Number(discountValue) > 100) {
      toast.error('Percentage discount cannot exceed 100%.');
      return;
    }
    if (discountType === 'FIXED' && Number(discountValue) > numberValue(editingProduct.basePrice)) {
      toast.error('Fixed discount cannot exceed the product price.');
      return;
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      toast.error('End date must be after start date.');
      return;
    }

    try {
      await updatePromotion.mutateAsync({
        id: editingProduct.id,
        discountType,
        discountValue: Number(discountValue),
        dealBadgeText: badgeText.trim() || undefined,
        dealStartDate: startDate ? new Date(startDate).toISOString() : undefined,
        dealEndDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      toast.success('Product promotion saved.');
      setEditingProduct(null);
    } catch {
      toast.error('Unable to save the product promotion.');
    }
  };

  const confirmRemovePromotion = async () => {
    if (!productToRemove) return;
    try {
      await removePromotion.mutateAsync(productToRemove.id);
      toast.success('Product promotion removed.');
      setProductToRemove(null);
    } catch {
      toast.error('Unable to remove the product promotion.');
    }
  };

  return (
    <div className='w-full rounded-sm border border-[#e5e5e6] bg-white'>
      <div className='flex flex-col gap-2 border-b border-[#e5e5e6] p-4 md:px-6 md:py-4'>
        <h2 className='text-[20px] font-semibold text-black'>Product Promotions</h2>
        <p className='text-[13px] text-[#848995]'>Set a separate promotion for any product in your store.</p>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-[860px] w-full border-collapse'>
          <thead>
            <tr className='border-b border-[#e5e5e6] bg-[#f2f2f3] text-left text-[13px] text-[#42454d]'>
              <th className='px-6 py-3 font-semibold'>Product</th>
              <th className='px-4 py-3 font-semibold'>Price</th>
              <th className='px-4 py-3 font-semibold'>Promotion</th>
              <th className='px-4 py-3 font-semibold'>Schedule</th>
              <th className='px-6 py-3 text-center font-semibold'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#e5e5e6]'>
            {isLoading ? (
              <tr><td colSpan={5} className='px-6 py-12 text-center text-[#848995]'><Loader2 className='mx-auto mb-2 animate-spin text-[#f09000]' size={22} />Loading products...</td></tr>
            ) : isError ? (
              <tr><td colSpan={5} className='px-6 py-12 text-center text-[#cb1b1b]'>Unable to load your products.</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className='px-6 py-12 text-center text-[#848995]'>Create a product before adding a product promotion.</td></tr>
            ) : (
              products.map((product) => {
                const active = hasPromotion(product);
                return (
                  <tr key={product.id} className='text-[13px] text-[#42454d] hover:bg-gray-50'>
                    <td className='px-6 py-3'>
                      <p className='font-semibold text-black'>{product.name}</p>
                      <p className='mt-0.5 text-[12px] text-[#848995]'>SKU: {product.sku}</p>
                    </td>
                    <td className='px-4 py-3 font-medium'>{money(product.basePrice)}</td>
                    <td className='px-4 py-3'>
                      {active ? (
                        <div className='flex flex-col gap-1'>
                          <span className='font-semibold text-[#f09000]'>
                            {numberValue(product.discountValue)}{product.discountType === 'PERCENTAGE' ? '%' : ' fixed'} off
                          </span>
                          {product.dealBadgeText && <span className='text-[12px] text-[#848995]'>{product.dealBadgeText}</span>}
                        </div>
                      ) : <span className='text-[#848995]'>No promotion</span>}
                    </td>
                    <td className='px-4 py-3 text-[12px]'>
                      {product.dealStartDate || product.dealEndDate
                        ? `${dateValue(product.dealStartDate) || 'Now'} – ${dateValue(product.dealEndDate) || 'No end date'}`
                        : 'No schedule'}
                    </td>
                    <td className='px-6 py-3'>
                      <div className='flex justify-center gap-3'>
                        <button onClick={() => openEditor(product)} title={active ? 'Edit promotion' : 'Add promotion'} className='rounded p-1 text-[#f09000] hover:bg-orange-50'>
                          {active ? <Edit2 size={16} /> : <Tag size={16} />}
                        </button>
                        {active && <button onClick={() => setProductToRemove(product)} disabled={removePromotion.isPending} title='Remove promotion' className='rounded p-1 text-[#cb1b1b] hover:bg-red-50 disabled:opacity-50'><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
            <div className='mb-5 flex items-start justify-between border-b border-[#e5e5e6] pb-3'>
              <div><h3 className='text-lg font-semibold text-black'>Product Promotion</h3><p className='text-[13px] text-[#848995]'>{editingProduct.name}</p></div>
              <button onClick={() => setEditingProduct(null)} className='p-1 text-[#848995] hover:text-black'><X size={18} /></button>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='text-[13px] text-[#42454d]'>Discount type
                <select value={discountType} onChange={(event) => setDiscountType(event.target.value as 'PERCENTAGE' | 'FIXED')} className='mt-1.5 h-10 w-full rounded border border-[#e5e5e6] px-3 text-black outline-none focus:border-[#f09000]'>
                  <option value='PERCENTAGE'>Percentage (%)</option><option value='FIXED'>Fixed amount ($)</option>
                </select>
              </label>
              <label className='text-[13px] text-[#42454d]'>Discount value
                <input type='number' min='0' step='0.01' value={discountValue} onChange={(event) => setDiscountValue(event.target.value === '' ? '' : Number(event.target.value))} className='mt-1.5 h-10 w-full rounded border border-[#e5e5e6] px-3 text-black outline-none focus:border-[#f09000]' />
              </label>
              <label className='sm:col-span-2 text-[13px] text-[#42454d]'>Badge text (optional)
                <input value={badgeText} onChange={(event) => setBadgeText(event.target.value)} placeholder='e.g. Summer sale' className='mt-1.5 h-10 w-full rounded border border-[#e5e5e6] px-3 text-black outline-none focus:border-[#f09000]' />
              </label>
              <label className='text-[13px] text-[#42454d]'>Start date (optional)
                <input type='date' value={startDate} onChange={(event) => setStartDate(event.target.value)} className='mt-1.5 h-10 w-full rounded border border-[#e5e5e6] px-3 text-black outline-none focus:border-[#f09000]' />
              </label>
              <label className='text-[13px] text-[#42454d]'>End date (optional)
                <input type='date' value={endDate} onChange={(event) => setEndDate(event.target.value)} className='mt-1.5 h-10 w-full rounded border border-[#e5e5e6] px-3 text-black outline-none focus:border-[#f09000]' />
              </label>
            </div>
            <div className='mt-6 flex justify-end gap-3 border-t border-[#e5e5e6] pt-4'>
              <button onClick={() => setEditingProduct(null)} className='h-10 rounded border border-[#e5e5e6] px-4 text-[13px] text-[#42454d] hover:bg-gray-50'>Cancel</button>
              <button onClick={savePromotion} disabled={updatePromotion.isPending} className='h-10 rounded bg-[#f09000] px-4 text-[13px] font-medium text-white hover:bg-[#e08600] disabled:opacity-50'>{updatePromotion.isPending ? 'Saving...' : 'Save promotion'}</button>
            </div>
          </div>
        </div>
      )}

      {productToRemove && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-lg border border-[#e5e5e6] bg-white p-6 shadow-xl'>
            <div className='flex items-start justify-between border-b border-[#e5e5e6] pb-3'>
              <div>
                <h3 className='text-lg font-semibold text-black'>Remove Product Promotion</h3>
                <p className='mt-1 text-[13px] text-[#848995]'>{productToRemove.name}</p>
              </div>
              <button onClick={() => setProductToRemove(null)} className='p-1 text-[#848995] hover:text-black'><X size={18} /></button>
            </div>
            <p className='py-5 text-sm leading-relaxed text-[#42454d]'>
              This will remove only the product&apos;s discount and promotion details. The product, price, stock, and other information will not be deleted.
            </p>
            <div className='flex justify-end gap-3 border-t border-[#e5e5e6] pt-4'>
              <button onClick={() => setProductToRemove(null)} disabled={removePromotion.isPending} className='h-10 rounded border border-[#e5e5e6] px-4 text-[13px] text-[#42454d] hover:bg-gray-50 disabled:opacity-50'>Cancel</button>
              <button onClick={confirmRemovePromotion} disabled={removePromotion.isPending} className='h-10 rounded bg-[#cb1b1b] px-4 text-[13px] font-medium text-white hover:bg-red-700 disabled:opacity-50'>
                {removePromotion.isPending ? 'Removing...' : 'Remove Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
