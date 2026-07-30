import type { ProductFormState } from '@/store/useProductFormStore';

export const PRODUCT_STEP_BY_FIELD: Record<string, number> = {
  name: 1,
  brand: 1,
  productType: 1,
  shortDescription: 1,
  categoryId: 1,
  subcategoryId: 1,
  tags: 1,
  condition: 1,
  availableColors: 1,
  thumbnail: 2,
  previewImages: 2,
  variants: 2,
  basePrice: 3,
  oldPrice: 3,
  discountType: 3,
  discountValue: 3,
  dealStartDate: 3,
  dealEndDate: 3,
  shipsFrom: 4,
  minDeliveryDays: 4,
  maxDeliveryDays: 4,
  shippingFeeType: 4,
  shippingCost: 4,
  shippingZoneId: 4,
  courierId: 4,
  specifications: 5,
  sku: 5,
  stockQuantity: 5,
  stockStatus: 5,
  lowStockAlertQuantity: 5,
  minOrderQuantity: 5,
  maxOrderQuantity: 5,
};

export const validateProductStep = (state: ProductFormState, step: number): string | null => {
  if (step === 1) {
    if (state.name.trim().length < 2) return 'Enter a product name with at least 2 characters.';
    if (!state.categoryId) return 'Select a main category.';
  }
  if (step === 2) {
    if (!state.thumbnail) return 'Upload a product thumbnail.';
    if (state.previewImages.length > 10) return 'A product can have at most 10 preview images.';
    if (state.hasVariants) {
      if (!state.variants.length) return 'Add at least one product variant.';
      const skus = state.variants.map((variant) => variant.sku.trim().toLowerCase());
      if (skus.some((sku) => !sku)) return 'Every variant requires an SKU.';
      if (new Set(skus).size !== skus.length) return 'Variant SKUs must be unique.';
      if (state.variants.some((variant) => variant.price < 0 || variant.stock < 0)) {
        return 'Variant price and stock cannot be negative.';
      }
    }
  }
  if (step === 3) {
    if (state.basePrice === '' || state.basePrice < 0) return 'Enter a valid base price.';
    if (state.oldPrice !== '' && state.oldPrice < Number(state.basePrice)) {
      return 'Old price cannot be lower than base price.';
    }
    if (Boolean(state.discountType) !== (state.discountValue !== '')) {
      return 'Choose both a discount type and discount value.';
    }
    if (state.discountType === 'PERCENTAGE' && Number(state.discountValue) > 100) {
      return 'Percentage discount cannot exceed 100%.';
    }
    if (state.discountType === 'FIXED' && Number(state.discountValue) > Number(state.basePrice)) {
      return 'Fixed discount cannot exceed the base price.';
    }
    if (
      state.dealStartDate &&
      state.dealEndDate &&
      new Date(state.dealEndDate) <= new Date(state.dealStartDate)
    ) {
      return 'Deal end date must be after the start date.';
    }
  }
  if (step === 4) {
    if (!state.shipsFrom.trim()) return 'Enter the shipping origin.';
    if (state.minDeliveryDays === '' || state.maxDeliveryDays === '') {
      return 'Enter minimum and maximum delivery days.';
    }
    if (state.maxDeliveryDays < state.minDeliveryDays) {
      return 'Maximum delivery days cannot be lower than minimum delivery days.';
    }
    if (state.shippingFeeType === 'STANDARD' && state.shippingCost === '') {
      return 'Enter the standard shipping cost.';
    }
    if (
      state.shippingFeeType === 'PREDEFINED' &&
      !state.shippingZoneId &&
      !state.courierId
    ) {
      return 'Select a shipping zone or courier.';
    }
  }
  if (step === 5) {
    if (!state.sku.trim()) return 'Enter a product SKU.';
    if (state.stockQuantity === '' || state.stockQuantity < 0) return 'Enter a valid stock quantity.';
    if (state.lowStockAlertQuantity === '' || state.lowStockAlertQuantity < 0) {
      return 'Enter a valid low-stock alert quantity.';
    }
    if (state.minOrderQuantity === '' || state.minOrderQuantity < 1) {
      return 'Minimum order quantity must be at least 1.';
    }
    if (
      state.maxOrderQuantity === '' ||
      state.maxOrderQuantity < Number(state.minOrderQuantity)
    ) {
      return 'Maximum order quantity cannot be lower than minimum order quantity.';
    }
    if (state.stockStatus === 'OUT_OF_STOCK' && Number(state.stockQuantity) > 0) {
      return 'A product with stock must be marked available.';
    }
    if (state.specifications.some((spec) => !spec.name.trim() || !spec.value.trim())) {
      return 'Complete or remove empty specification rows.';
    }
  }
  return null;
};

export const buildProductPayload = (state: ProductFormState) => ({
  name: state.name.trim(),
  brand: state.brand.trim() || undefined,
  shortDescription: state.shortDescription.trim() || undefined,
  productType: state.productType.trim() || undefined,
  categoryId: state.categoryId,
  subcategoryId: state.subcategoryId || undefined,
  tags: state.tags,
  condition: state.condition,
  availableColors: state.availableColors,
  thumbnail: state.thumbnail,
  previewImages: state.previewImages,
  hasVariants: state.hasVariants,
  variants: state.hasVariants
    ? state.variants.map((variant) => ({
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        image: variant.image || undefined,
        color: variant.color || undefined,
        size: variant.size || undefined,
        material: variant.material || undefined,
        storage: variant.storage || undefined,
      }))
    : [],
  basePrice: Number(state.basePrice),
  oldPrice: state.oldPrice === '' ? undefined : Number(state.oldPrice),
  discountType: state.discountType || undefined,
  discountValue: state.discountValue === '' ? undefined : Number(state.discountValue),
  dealBadgeText: state.dealBadgeText.trim() || undefined,
  dealStartDate: state.dealStartDate ? new Date(state.dealStartDate).toISOString() : undefined,
  dealEndDate: state.dealEndDate ? new Date(state.dealEndDate).toISOString() : undefined,
  taxAmount: state.taxAmount === '' ? undefined : Number(state.taxAmount),
  vatGst: state.vatGst === '' ? undefined : Number(state.vatGst),
  importCharges: state.importCharges === '' ? undefined : Number(state.importCharges),
  handlingFee: state.handlingFee === '' ? undefined : Number(state.handlingFee),
  shipsFrom: state.shipsFrom.trim(),
  minDeliveryDays: Number(state.minDeliveryDays),
  maxDeliveryDays: Number(state.maxDeliveryDays),
  shippingFeeType: state.shippingFeeType,
  shippingCost:
    state.shippingFeeType === 'STANDARD' ? Number(state.shippingCost) : undefined,
  shippingZoneId:
    state.shippingFeeType === 'PREDEFINED' ? state.shippingZoneId || undefined : undefined,
  courierId: state.shippingFeeType === 'PREDEFINED' ? state.courierId || undefined : undefined,
  deliveryStandard: state.deliveryStandard,
  deliveryCod: state.deliveryCod,
  deliveryExpress: state.deliveryExpress,
  deliveryReturnPickup: state.deliveryReturnPickup,
  specifications: state.specifications.map((specification) => ({
    name: specification.name,
    value: specification.value,
  })),
  keyFeatures: state.keyFeatures || undefined,
  detailedDescription: state.detailedDescription || undefined,
  returnPolicy: state.returnPolicy || undefined,
  returnTerms: state.returnTerms || undefined,
  sku: state.sku.trim(),
  stockQuantity: Number(state.stockQuantity),
  stockStatus: state.stockStatus,
  lowStockAlertQuantity: Number(state.lowStockAlertQuantity),
  minOrderQuantity: Number(state.minOrderQuantity),
  maxOrderQuantity: Number(state.maxOrderQuantity),
  inventoryManagedBy: state.inventoryManagedBy.trim() || undefined,
  warehouseLocation: state.warehouseLocation.trim() || undefined,
});
