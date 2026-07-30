'use client';

import AddNewProductFlow from '@/components/dashboard/add-new-product/AddNewProductFlow';
import { useVendorProduct } from '@/hooks/api/useProduct';
import { useProductFormStore } from '@/store/useProductFormStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const dateInputValue = (value?: string | null) => (value ? value.slice(0, 16) : '');

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useVendorProduct(id);
  const loadProduct = useProductFormStore((state) => state.loadProduct);
  const loadedId = useRef<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!product || loadedId.current === product.id) return;
    loadProduct({
      name: product.name,
      sku: product.sku,
      brand: product.brand ?? '',
      productType: product.productType ?? '',
      shortDescription: product.shortDescription ?? '',
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId ?? '',
      tags: product.tags,
      condition: product.condition,
      availableColors: product.availableColors,
      thumbnail: product.thumbnail,
      previewImages: product.previewImages,
      hasVariants: product.hasVariants,
      variants: product.variants.map((variant) => ({
        id: variant.id ?? crypto.randomUUID(),
        sku: variant.sku,
        image: variant.image ?? undefined,
        color: variant.color ?? undefined,
        size: variant.size ?? undefined,
        material: variant.material ?? undefined,
        storage: variant.storage ?? undefined,
        price: Number(variant.price),
        stock: variant.stock,
      })),
      basePrice: Number(product.basePrice),
      oldPrice: product.oldPrice == null ? '' : Number(product.oldPrice),
      discountType: product.discountType ?? '',
      discountValue: product.discountValue == null ? '' : Number(product.discountValue),
      dealBadgeText: product.dealBadgeText ?? '',
      dealStartDate: dateInputValue(product.dealStartDate),
      dealEndDate: dateInputValue(product.dealEndDate),
      taxAmount: product.taxAmount == null ? '' : Number(product.taxAmount),
      vatGst: product.vatGst == null ? '' : Number(product.vatGst),
      importCharges: product.importCharges == null ? '' : Number(product.importCharges),
      handlingFee: product.handlingFee == null ? '' : Number(product.handlingFee),
      shipsFrom: product.shipsFrom,
      minDeliveryDays: product.minDeliveryDays,
      maxDeliveryDays: product.maxDeliveryDays,
      shippingFeeType: product.shippingFeeType,
      shippingCost: product.shippingCost == null ? '' : Number(product.shippingCost),
      shippingZoneId: product.shippingZoneId ?? '',
      courierId: product.courierId ?? '',
      deliveryStandard: product.deliveryStandard,
      deliveryCod: product.deliveryCod,
      deliveryExpress: product.deliveryExpress,
      deliveryReturnPickup: product.deliveryReturnPickup,
      specifications: product.specifications.map((specification) => ({
        id: specification.id ?? crypto.randomUUID(),
        name: specification.name,
        value: specification.value,
      })),
      keyFeatures: product.keyFeatures ?? '',
      detailedDescription: product.detailedDescription ?? '',
      returnPolicy: product.returnPolicy ?? '',
      returnTerms: product.returnTerms ?? '',
      stockQuantity: product.stockQuantity,
      stockStatus: product.stockStatus,
      lowStockAlertQuantity: product.lowStockAlertQuantity,
      minOrderQuantity: product.minOrderQuantity,
      maxOrderQuantity: product.maxOrderQuantity,
      inventoryManagedBy: product.inventoryManagedBy ?? '',
      warehouseLocation: product.warehouseLocation ?? '',
    });
    loadedId.current = product.id;
    setIsHydrated(true);
  }, [loadProduct, product]);

  if (isError) {
    return <div className='p-8 text-[14px] text-[#cb1b1b]'>Failed to load product.</div>;
  }
  if (isLoading || !product || !isHydrated) {
    return <div className='p-8 text-[14px] text-[#686f7d]'>Loading product...</div>;
  }
  return <AddNewProductFlow productId={id} />;
}
