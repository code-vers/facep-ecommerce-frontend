import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IVariant {
  id: string; // temporary id for frontend mapping
  sku: string;
  image?: string;
  color?: string;
  size?: string;
  material?: string;
  storage?: string;
  price: number;
  stock: number;
}

export interface ISpecification {
  id: string; // temporary id
  name: string;
  value: string;
}

export interface ProductFormState {
  // Step 1: Basics
  sku: string;
  brand: string;
  productType: string;
  shortDescription: string;
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  condition: 'NEW' | 'RENEWED' | 'USED';
  availableColors: string[];

  // Step 2: Media & Variants
  thumbnail: string;
  previewImages: string[];
  hasVariants: boolean;
  variants: IVariant[];

  // Step 3: Pricing & Inventory
  basePrice: number | '';
  oldPrice: number | '';
  discountType: 'PERCENTAGE' | 'FIXED' | '';
  discountValue: number | '';
  dealBadgeText: string;
  dealStartDate: string;
  dealEndDate: string;
  taxAmount: number | '';
  vatGst: number | '';
  importCharges: number | '';
  handlingFee: number | '';

  // Step 4: Shipping
  shipsFrom: string;
  minDeliveryDays: number | '';
  maxDeliveryDays: number | '';
  shippingFeeType: 'FREE' | 'STANDARD' | 'PREDEFINED';
  shippingCost: number | '';
  shippingZoneId: string;
  courierId: string;
  deliveryStandard: boolean;
  deliveryCod: boolean;
  deliveryExpress: boolean;
  deliveryReturnPickup: boolean;

  // Step 5: Details & Inventory
  specifications: ISpecification[];
  keyFeatures: string;
  detailedDescription: string;
  returnPolicy: string;
  returnTerms: string;
  
  stockQuantity: number | '';
  stockStatus: 'AVAILABLE' | 'OUT_OF_STOCK';
  lowStockAlertQuantity: number | '';
  minOrderQuantity: number | '';
  maxOrderQuantity: number | '';
  inventoryManagedBy: string;
  warehouseLocation: string;
}

interface ProductFormStore extends ProductFormState {
  setField: <K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => void;
  resetForm: () => void;
}

const initialState: ProductFormState = {
  sku: '',
  brand: '',
  productType: '',
  shortDescription: '',
  categoryId: '',
  subcategoryId: '',
  tags: [],
  condition: 'NEW',
  availableColors: [],

  thumbnail: '',
  previewImages: [],
  hasVariants: false,
  variants: [],

  basePrice: '',
  oldPrice: '',
  discountType: '',
  discountValue: '',
  dealBadgeText: '',
  dealStartDate: '',
  dealEndDate: '',
  taxAmount: '',
  vatGst: '',
  importCharges: '',
  handlingFee: '',

  shipsFrom: '',
  minDeliveryDays: '',
  maxDeliveryDays: '',
  shippingFeeType: 'FREE',
  shippingCost: '',
  shippingZoneId: '',
  courierId: '',
  deliveryStandard: false,
  deliveryCod: false,
  deliveryExpress: false,
  deliveryReturnPickup: false,

  specifications: [],
  keyFeatures: '',
  detailedDescription: '',
  returnPolicy: '',
  returnTerms: '',
  
  stockQuantity: '',
  stockStatus: 'AVAILABLE',
  lowStockAlertQuantity: '',
  minOrderQuantity: 1,
  maxOrderQuantity: 10,
  inventoryManagedBy: '',
  warehouseLocation: '',
};

export const useProductFormStore = create<ProductFormStore>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      resetForm: () => set(initialState),
    }),
    {
      name: 'add-new-product-draft', // localStorage key
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => typeof state[key as keyof ProductFormState] !== 'function')
      ),
    }
  )
);
