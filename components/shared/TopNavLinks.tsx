'use client';

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  History,
  Sparkles,
  Package,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import AllCategoriesDrawer from "@/components/shared/AllCategoriesDrawer";
import { useBrowsingHistory } from "@/lib/view-history";
import { useSpecialProducts } from "@/hooks/api/useProduct";
import { useMyOrders } from "@/hooks/api/useOrder";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/contexts/CartContext";
import type { Product } from "@/lib/api/product";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/api\/v1\/?$/,
  '',
);
const imageUrl = (value?: string | null) =>
  !value
    ? '/placeholder.png'
    : value.startsWith('http')
      ? value
      : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;

const formatPrice = (value: number | string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));

const effectivePrice = (product: Product) => {
  const base = Number(product.basePrice);
  const value = Number(product.discountValue ?? 0);
  if (!product.discountType || !value) return base;
  const now = Date.now();
  if (product.dealStartDate && now < new Date(product.dealStartDate).getTime()) return base;
  if (product.dealEndDate && now > new Date(product.dealEndDate).getTime()) return base;
  return product.discountType === 'PERCENTAGE'
    ? Math.max(0, base - (base * value) / 100)
    : Math.max(0, base - value);
};

interface NavItem {
  label: string;
  href?: string;
}

const navItems: NavItem[] = [
  { label: "All" },
  { label: "Early Deals", href: "/early-deals" },
  { label: "Holiday Deals", href: "/holiday-deals" },
  { label: "Special Products", href: "/special-products" },
  { label: "Coupons", href: "/coupons" },
  { label: "Orders", href: "/orders" },
  { label: "Buy Again", href: "/buy-again" },
  { label: "Browsing History", href: "/browsing-history" },
  // { label: "Gift Cards", href: "/gift-cards" },
  { label: "Toys & Games", href: "/toys-and-games" },
  { label: "Groceries", href: "/groceries" },
  { label: "Customer Service", href: "/customer-service" },
  { label: "Sell", href: "/seller" },
];

export default function TopNavLinks() {
  const router = useRouter();
  const { session } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSpecialOpen, setIsSpecialOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isBuyAgainOpen, setIsBuyAgainOpen] = useState(false);

  const historyCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const specialCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ordersCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const buyAgainCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const specialScrollRef = useRef<HTMLDivElement>(null);
  const ordersScrollRef = useRef<HTMLDivElement>(null);
  const buyAgainScrollRef = useRef<HTMLDivElement>(null);

  const { products: browsingProducts, isLoading: isBrowsingLoading, clearHistory } =
    useBrowsingHistory(10);

  const { data: specialData, isLoading: isSpecialLoading } = useSpecialProducts({ limit: 10 });
  const specialProducts = specialData?.data || [];

  const { data: ordersData, isLoading: isOrdersLoading } = useMyOrders({ limit: 20 });

  // Extract up to 10 ordered items for Orders popover
  const recentOrderItems = useMemo(() => {
    const list: {
      id: string;
      productId: string;
      name: string;
      slug: string;
      price: number;
      image: string;
      orderNumber: string;
      status: string;
      vendorName: string;
    }[] = [];

    (ordersData?.orders || []).forEach((order) => {
      (order.items || []).forEach((item) => {
        if (list.length < 10) {
          list.push({
            id: `${order.id}-${item.id}`,
            productId: item.productId,
            name: item.productName,
            slug: item.slug,
            price: Number(item.price),
            image: item.image || '',
            orderNumber: order.orderNumber,
            status: order.status,
            vendorName: item.vendorName || 'Facep Store',
          });
        }
      });
    });

    return list;
  }, [ordersData]);

  // Extract up to 10 unique products for Buy Again popover
  const buyAgainItems = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        productId: string;
        name: string;
        slug: string;
        price: number;
        image: string;
        vendorName: string;
        timesPurchased: number;
      }
    >();

    (ordersData?.orders || []).forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productId || item.slug || item.id;
        if (map.has(key)) {
          const ex = map.get(key)!;
          ex.timesPurchased += 1;
        } else if (map.size < 10) {
          map.set(key, {
            id: key,
            productId: item.productId,
            name: item.productName,
            slug: item.slug,
            price: Number(item.price),
            image: item.image || '',
            vendorName: item.vendorName || 'Facep Store',
            timesPurchased: 1,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [ordersData]);

  const handleAddToCart = (product: Product, price: number) => {
    addToCart({
      id: product.id,
      cartItemId: `${product.id}---`,
      name: product.name,
      slug: product.slug,
      price,
      quantity: 1,
      image: imageUrl(product.thumbnail),
      sellerName: product.vendor?.storefront?.storeName || 'Facep Store',
    });
    toast.success(`Added "${product.name}" to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  const clearAllTimers = () => {
    if (historyCloseTimerRef.current) clearTimeout(historyCloseTimerRef.current);
    if (specialCloseTimerRef.current) clearTimeout(specialCloseTimerRef.current);
    if (ordersCloseTimerRef.current) clearTimeout(ordersCloseTimerRef.current);
    if (buyAgainCloseTimerRef.current) clearTimeout(buyAgainCloseTimerRef.current);
    historyCloseTimerRef.current = null;
    specialCloseTimerRef.current = null;
    ordersCloseTimerRef.current = null;
    buyAgainCloseTimerRef.current = null;
  };

  const handleHistoryMouseEnter = () => {
    clearAllTimers();
    setIsSpecialOpen(false);
    setIsOrdersOpen(false);
    setIsBuyAgainOpen(false);
    setIsHistoryOpen(true);
  };

  const handleHistoryMouseLeave = () => {
    if (historyCloseTimerRef.current) clearTimeout(historyCloseTimerRef.current);
    historyCloseTimerRef.current = setTimeout(() => {
      setIsHistoryOpen(false);
    }, 200);
  };

  const handleSpecialMouseEnter = () => {
    clearAllTimers();
    setIsHistoryOpen(false);
    setIsOrdersOpen(false);
    setIsBuyAgainOpen(false);
    setIsSpecialOpen(true);
  };

  const handleSpecialMouseLeave = () => {
    if (specialCloseTimerRef.current) clearTimeout(specialCloseTimerRef.current);
    specialCloseTimerRef.current = setTimeout(() => {
      setIsSpecialOpen(false);
    }, 200);
  };

  const handleOrdersMouseEnter = () => {
    clearAllTimers();
    setIsHistoryOpen(false);
    setIsSpecialOpen(false);
    setIsBuyAgainOpen(false);
    setIsOrdersOpen(true);
  };

  const handleOrdersMouseLeave = () => {
    if (ordersCloseTimerRef.current) clearTimeout(ordersCloseTimerRef.current);
    ordersCloseTimerRef.current = setTimeout(() => {
      setIsOrdersOpen(false);
    }, 200);
  };

  const handleBuyAgainMouseEnter = () => {
    clearAllTimers();
    setIsHistoryOpen(false);
    setIsSpecialOpen(false);
    setIsOrdersOpen(false);
    setIsBuyAgainOpen(true);
  };

  const handleBuyAgainMouseLeave = () => {
    if (buyAgainCloseTimerRef.current) clearTimeout(buyAgainCloseTimerRef.current);
    buyAgainCloseTimerRef.current = setTimeout(() => {
      setIsBuyAgainOpen(false);
    }, 200);
  };

  const scrollRow = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollSpecialRow = (direction: 'left' | 'right') => {
    if (specialScrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      specialScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollOrdersRow = (direction: 'left' | 'right') => {
    if (ordersScrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      ordersScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollBuyAgainRow = (direction: 'left' | 'right') => {
    if (buyAgainScrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      buyAgainScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearHistory();
    toast.success('Browsing history cleared');
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return (
    <section className="relative w-full bg-[#2b323b] text-white select-none">
      <div className="w-full px-2.5 sm:px-3.5 md:px-4">
        <nav
          aria-label="Secondary navigation"
          className="flex h-10 sm:h-10.5 xl:h-11 items-center gap-4 sm:gap-5 md:gap-6 xl:gap-8 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[14px] sm:text-[15px] xl:text-[16px] leading-none font-semibold"
        >
          {navItems.map((item) => {
            // Special handling for All categories drawer trigger
            if (item.label === "All") {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setIsCategoryDrawerOpen(true)}
                  className="flex shrink-0 items-center gap-1.5 text-white hover:text-[#dec33a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[#dec33a]"
                  aria-label="Open All Categories Menu"
                >
                  <Menu size={18} className="shrink-0" strokeWidth={2.2} />
                  <span>{item.label}</span>
                </button>
              );
            }

            // Special handling for Special Products hover popover
            if (item.label === "Special Products") {
              return (
                <div
                  key={item.label}
                  onMouseEnter={handleSpecialMouseEnter}
                  onMouseLeave={handleSpecialMouseLeave}
                  className="shrink-0 flex items-center h-full"
                >
                  <Link
                    href={item.href || "/special-products"}
                    className="flex shrink-0 items-center gap-1 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200 opacity-80",
                        isSpecialOpen && "rotate-180 text-[#dec33a]"
                      )}
                    />
                  </Link>
                </div>
              );
            }

            // Special handling for Orders hover popover
            if (item.label === "Orders") {
              return (
                <div
                  key={item.label}
                  onMouseEnter={handleOrdersMouseEnter}
                  onMouseLeave={handleOrdersMouseLeave}
                  className="shrink-0 flex items-center h-full"
                >
                  <Link
                    href={item.href || "/orders"}
                    className="flex shrink-0 items-center gap-1 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200 opacity-80",
                        isOrdersOpen && "rotate-180 text-[#dec33a]"
                      )}
                    />
                  </Link>
                </div>
              );
            }

            // Special handling for Buy Again hover popover
            if (item.label === "Buy Again") {
              return (
                <div
                  key={item.label}
                  onMouseEnter={handleBuyAgainMouseEnter}
                  onMouseLeave={handleBuyAgainMouseLeave}
                  className="shrink-0 flex items-center h-full"
                >
                  <Link
                    href={item.href || "/buy-again"}
                    className="flex shrink-0 items-center gap-1 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200 opacity-80",
                        isBuyAgainOpen && "rotate-180 text-[#dec33a]"
                      )}
                    />
                  </Link>
                </div>
              );
            }

            // Special handling for Browsing History hover popover
            if (item.label === "Browsing History") {
              return (
                <div
                  key={item.label}
                  onMouseEnter={handleHistoryMouseEnter}
                  onMouseLeave={handleHistoryMouseLeave}
                  className="shrink-0 flex items-center h-full"
                >
                  <Link
                    href={item.href || "/browsing-history"}
                    className="flex shrink-0 items-center gap-1 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200 opacity-80",
                        isHistoryOpen && "rotate-180 text-[#dec33a]"
                      )}
                    />
                  </Link>
                </div>
              );
            }

            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex shrink-0 items-center gap-1.5 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
                >
                  {item.label === "All" && (
                    <Menu size={18} className="shrink-0" strokeWidth={2.2} />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                className="flex shrink-0 items-center gap-1.5 text-white hover:text-[#dec33a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[#dec33a]"
              >
                {item.label === "All" && (
                  <Menu size={18} className="shrink-0" strokeWidth={2.2} />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── 75% Width Browsing History Window (10 Products in 1 Row) ── */}
      {isHistoryOpen && (
        <div
          onMouseEnter={handleHistoryMouseEnter}
          onMouseLeave={handleHistoryMouseLeave}
          className="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 z-50 w-[75vw] max-w-325 min-w-[320px] animate-in fade-in slide-in-from-top-1 duration-150 text-left"
        >
          {/* Main Card */}
          <div className="w-full rounded-xl bg-white shadow-2xl ring-1 ring-black/10 border border-gray-200 p-4 sm:p-5 text-black">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center">
                  <History size={16} className="text-[#9e8316]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    Your Browsing History
                  </h3>
                  <p className="text-[12px] text-gray-500 font-normal">
                    Recent items you viewed on Facep
                  </p>
                </div>
              </div>

              <Link
                href="/browsing-history"
                onClick={() => setIsHistoryOpen(false)}
                className="font-semibold text-[13px] text-[#165dd0] hover:underline flex items-center gap-1"
              >
                <span>View or edit your browsing history</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* 1 Row of 10 Products with Scroll Controls */}
            <div className="relative group/row">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => scrollRow('left')}
                aria-label="Scroll left"
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>

              {/* 1 Row of 10 Items */}
              <div
                ref={scrollRef}
                className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth pb-2 pt-1 px-1 scrollbar-thin [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {isBrowsingLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={`skel-row-${i}`}
                      className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 rounded-lg border border-[#E5E5E6] p-2.5 flex flex-col gap-2 animate-pulse bg-white"
                    >
                      <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                      <div className="w-3/4 h-3.5 bg-gray-200 rounded mt-1" />
                      <div className="w-1/2 h-3 bg-gray-200 rounded" />
                      <div className="w-1/3 h-4 bg-gray-200 rounded" />
                      <div className="w-full h-8 bg-gray-200 rounded-xs mt-3" />
                    </div>
                  ))
                ) : (!browsingProducts || browsingProducts.length === 0) ? (
                  <div className="w-full py-8 text-center text-gray-500 text-[13px]">
                    No recently viewed products yet. Browse our catalog to see recommendations here!
                  </div>
                ) : (
                  browsingProducts.map((product, idx) => {
                    const price = effectivePrice(product);
                    const hasDiscount = price < Number(product.basePrice);

                    return (
                      <div
                        key={product.id || idx}
                        className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 flex flex-col"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => setIsHistoryOpen(false)}
                          className="flex h-full w-full"
                        >
                          <ProductCard
                            imageSrc={imageUrl(product.thumbnail)}
                            imageAlt={product.name}
                            title={product.name}
                            price={formatPrice(price)}
                            originalPrice={hasDiscount ? formatPrice(product.basePrice) : undefined}
                            badgeText={
                              hasDiscount
                                ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : ''} off`
                                : undefined
                            }
                            offerText={product.dealBadgeText || undefined}
                            shippingText={
                              product.shippingFeeType === 'FREE'
                                ? 'Free Shipping'
                                : product.shippingCost
                                  ? `${formatPrice(product.shippingCost)} Shipping`
                                  : 'Shipping available'
                            }
                            buttonVariant={product.hasVariants ? 'see-options' : 'add-to-cart'}
                            onAddToCart={() => handleAddToCart(product, price)}
                          />
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => scrollRow('right')}
                aria-label="Scroll right"
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
            </div>

            {/* Window Footer */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500">
              <span>
                {browsingProducts.length > 0
                  ? `Showing your ${browsingProducts.length} most recent item${browsingProducts.length === 1 ? '' : 's'}`
                  : 'Your browsing history is empty'}
              </span>
              <div className="flex items-center gap-3">
                {browsingProducts.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Clear history
                    </button>
                    <span>•</span>
                  </>
                )}
                <Link
                  href="/browsing-history"
                  onClick={() => setIsHistoryOpen(false)}
                  className="font-bold text-[#165dd0] hover:underline"
                >
                  Manage all history →
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── 75% Width Special Products Window (10 Products in 1 Row) ── */}
      {isSpecialOpen && (
        <div
          onMouseEnter={handleSpecialMouseEnter}
          onMouseLeave={handleSpecialMouseLeave}
          className="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 z-50 w-[75vw] max-w-325 min-w-[320px] animate-in fade-in slide-in-from-top-1 duration-150 text-left"
        >
          {/* Main Card */}
          <div className="w-full rounded-xl bg-white shadow-2xl ring-1 ring-black/10 border border-gray-200 p-4 sm:p-5 text-black">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center">
                  <Sparkles size={16} className="text-[#9e8316]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    Featured Special Products
                  </h3>
                  <p className="text-[12px] text-gray-500 font-normal">
                    Handpicked premier items &amp; signature highlights
                  </p>
                </div>
              </div>

              <Link
                href="/special-products"
                onClick={() => setIsSpecialOpen(false)}
                className="font-semibold text-[13px] text-[#165dd0] hover:underline flex items-center gap-1"
              >
                <span>See all special products</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* 1 Row of 10 Products with Scroll Controls */}
            <div className="relative group/row">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => scrollSpecialRow('left')}
                aria-label="Scroll left"
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>

              {/* 1 Row of 10 Items */}
              <div
                ref={specialScrollRef}
                className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth pb-2 pt-1 px-1 scrollbar-thin [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {isSpecialLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={`skel-special-${i}`}
                      className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 rounded-lg border border-[#E5E5E6] p-2.5 flex flex-col gap-2 animate-pulse bg-white"
                    >
                      <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                      <div className="w-3/4 h-3.5 bg-gray-200 rounded mt-1" />
                      <div className="w-1/2 h-3 bg-gray-200 rounded" />
                      <div className="w-1/3 h-4 bg-gray-200 rounded" />
                      <div className="w-full h-8 bg-gray-200 rounded-xs mt-3" />
                    </div>
                  ))
                ) : (!specialProducts || specialProducts.length === 0) ? (
                  <div className="w-full py-8 text-center text-gray-500 text-[13px]">
                    No special products featured right now. Explore all our collections!
                  </div>
                ) : (
                  specialProducts.map((product, idx) => {
                    const price = effectivePrice(product);
                    const hasDiscount = price < Number(product.basePrice);

                    return (
                      <div
                        key={product.id || idx}
                        className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 flex flex-col"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => setIsSpecialOpen(false)}
                          className="flex h-full w-full"
                        >
                          <ProductCard
                            imageSrc={imageUrl(product.thumbnail)}
                            imageAlt={product.name}
                            title={product.name}
                            price={formatPrice(price)}
                            originalPrice={hasDiscount ? formatPrice(product.basePrice) : undefined}
                            badgeText={
                              hasDiscount
                                ? `${product.discountValue}${product.discountType === 'PERCENTAGE' ? '%' : ''} off`
                                : undefined
                            }
                            offerText={product.dealBadgeText || undefined}
                            shippingText={
                              product.shippingFeeType === 'FREE'
                                ? 'Free Shipping'
                                : product.shippingCost
                                  ? `${formatPrice(product.shippingCost)} Shipping`
                                  : 'Shipping available'
                            }
                            buttonVariant={product.hasVariants ? 'see-options' : 'add-to-cart'}
                            onAddToCart={() => handleAddToCart(product, price)}
                          />
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => scrollSpecialRow('right')}
                aria-label="Scroll right"
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
            </div>

            {/* Window Footer */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500">
              <span>
                {specialProducts.length > 0
                  ? `Showing top ${specialProducts.length} special product${specialProducts.length === 1 ? '' : 's'}`
                  : 'No special products'}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/special-products"
                  onClick={() => setIsSpecialOpen(false)}
                  className="font-bold text-[#165dd0] hover:underline"
                >
                  Explore all special products →
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── 75% Width Orders Window (10 Products in 1 Row) ── */}
      {isOrdersOpen && (
        <div
          onMouseEnter={handleOrdersMouseEnter}
          onMouseLeave={handleOrdersMouseLeave}
          className="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 z-50 w-[75vw] max-w-325 min-w-[320px] animate-in fade-in slide-in-from-top-1 duration-150 text-left"
        >
          {/* Main Card */}
          <div className="w-full rounded-xl bg-white shadow-2xl ring-1 ring-black/10 border border-gray-200 p-4 sm:p-5 text-black">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center">
                  <Package size={16} className="text-[#9e8316]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    Your Orders
                  </h3>
                  <p className="text-[12px] text-gray-500 font-normal">
                    Recent purchases, tracking &amp; order history
                  </p>
                </div>
              </div>

              <Link
                href="/orders"
                onClick={() => setIsOrdersOpen(false)}
                className="font-semibold text-[13px] text-[#165dd0] hover:underline flex items-center gap-1"
              >
                <span>View all orders</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {!session?.user?.id ? (
              /* Guest State */
              <div className="w-full py-9 flex flex-col items-center justify-center text-center gap-2">
                <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                  <Package size={24} />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900">Sign in to track orders &amp; shipments</h4>
                <p className="text-[12px] text-gray-500 max-w-sm">
                  Check delivery progress, view order receipts, or return items from your account.
                </p>
                <Link
                  href="/login"
                  onClick={() => setIsOrdersOpen(false)}
                  className="mt-2 px-5 py-2 bg-[#dec33a] hover:bg-[#c9b034] text-black font-bold text-[13px] rounded-xs shadow-xs transition-colors"
                >
                  Sign In to Facep
                </Link>
              </div>
            ) : (
              /* 1 Row of 10 Products with Scroll Controls */
              <div className="relative group/row">
                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollOrdersRow('left')}
                  aria-label="Scroll left"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
                >
                  <ChevronLeft size={18} className="text-gray-700" />
                </button>

                {/* 1 Row of 10 Items */}
                <div
                  ref={ordersScrollRef}
                  className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth pb-2 pt-1 px-1 scrollbar-thin [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {isOrdersLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`skel-orders-${i}`}
                        className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 rounded-lg border border-[#E5E5E6] p-2.5 flex flex-col gap-2 animate-pulse bg-white"
                      >
                        <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                        <div className="w-3/4 h-3.5 bg-gray-200 rounded mt-1" />
                        <div className="w-1/2 h-3 bg-gray-200 rounded" />
                        <div className="w-1/3 h-4 bg-gray-200 rounded" />
                        <div className="w-full h-8 bg-gray-200 rounded-xs mt-3" />
                      </div>
                    ))
                  ) : (!recentOrderItems || recentOrderItems.length === 0) ? (
                    <div className="w-full py-8 text-center text-gray-500 text-[13px] flex flex-col items-center justify-center gap-2">
                      <Package size={26} className="text-gray-300" />
                      <span>No orders placed yet. Explore top deals and start shopping!</span>
                      <Link
                        href="/products"
                        onClick={() => setIsOrdersOpen(false)}
                        className="text-[12px] font-bold text-[#165dd0] hover:underline"
                      >
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    recentOrderItems.map((item) => (
                      <div
                        key={item.id}
                        className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 flex flex-col"
                      >
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsOrdersOpen(false)}
                          className="flex h-full w-full"
                        >
                          <ProductCard
                            imageSrc={imageUrl(item.image)}
                            imageAlt={item.name}
                            title={item.name}
                            price={formatPrice(item.price)}
                            badgeText={`#${item.orderNumber}`}
                            offerText={item.status ? `Status: ${item.status.replace(/_/g, ' ')}` : undefined}
                            buttonVariant="see-options"
                            onAddToCart={() => router.push(`/products/${item.slug}`)}
                          />
                        </Link>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollOrdersRow('right')}
                  aria-label="Scroll right"
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
                >
                  <ChevronRight size={18} className="text-gray-700" />
                </button>
              </div>
            )}

            {/* Window Footer */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500">
              <span>
                {recentOrderItems.length > 0
                  ? `Showing ${recentOrderItems.length} recent ordered item${recentOrderItems.length === 1 ? '' : 's'}`
                  : 'Track your packages with ease'}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/orders"
                  onClick={() => setIsOrdersOpen(false)}
                  className="font-bold text-[#165dd0] hover:underline"
                >
                  Manage all orders &amp; invoices →
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── 75% Width Buy Again Window (10 Products in 1 Row) ── */}
      {isBuyAgainOpen && (
        <div
          onMouseEnter={handleBuyAgainMouseEnter}
          onMouseLeave={handleBuyAgainMouseLeave}
          className="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 z-50 w-[75vw] max-w-325 min-w-[320px] animate-in fade-in slide-in-from-top-1 duration-150 text-left"
        >
          {/* Main Card */}
          <div className="w-full rounded-xl bg-white shadow-2xl ring-1 ring-black/10 border border-gray-200 p-4 sm:p-5 text-black">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-[#dec33a]/20 text-[#2b323b] flex items-center justify-center">
                  <RotateCcw size={16} className="text-[#9e8316]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    Buy Again
                  </h3>
                  <p className="text-[12px] text-gray-500 font-normal">
                    Reorder your favorite items with 1 click
                  </p>
                </div>
              </div>

              <Link
                href="/buy-again"
                onClick={() => setIsBuyAgainOpen(false)}
                className="font-semibold text-[13px] text-[#165dd0] hover:underline flex items-center gap-1"
              >
                <span>View all past purchases</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {!session?.user?.id ? (
              /* Guest State */
              <div className="w-full py-9 flex flex-col items-center justify-center text-center gap-2">
                <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                  <RotateCcw size={24} />
                </div>
                <h4 className="text-[15px] font-bold text-gray-900">Sign in to buy again</h4>
                <p className="text-[12px] text-gray-500 max-w-sm">
                  Quickly reorder everyday staples and past purchases with 1 click.
                </p>
                <Link
                  href="/login"
                  onClick={() => setIsBuyAgainOpen(false)}
                  className="mt-2 px-5 py-2 bg-[#dec33a] hover:bg-[#c9b034] text-black font-bold text-[13px] rounded-xs shadow-xs transition-colors"
                >
                  Sign In to Facep
                </Link>
              </div>
            ) : (
              /* 1 Row of 10 Products with Scroll Controls */
              <div className="relative group/row">
                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollBuyAgainRow('left')}
                  aria-label="Scroll left"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
                >
                  <ChevronLeft size={18} className="text-gray-700" />
                </button>

                {/* 1 Row of 10 Items */}
                <div
                  ref={buyAgainScrollRef}
                  className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth pb-2 pt-1 px-1 scrollbar-thin [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {isOrdersLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`skel-buyagain-${i}`}
                        className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 rounded-lg border border-[#E5E5E6] p-2.5 flex flex-col gap-2 animate-pulse bg-white"
                      >
                        <div className="w-full h-45 bg-gray-200 rounded-t-lg" />
                        <div className="w-3/4 h-3.5 bg-gray-200 rounded mt-1" />
                        <div className="w-1/2 h-3 bg-gray-200 rounded" />
                        <div className="w-1/3 h-4 bg-gray-200 rounded" />
                        <div className="w-full h-8 bg-gray-200 rounded-xs mt-3" />
                      </div>
                    ))
                  ) : (!buyAgainItems || buyAgainItems.length === 0) ? (
                    <div className="w-full py-8 text-center text-gray-500 text-[13px] flex flex-col items-center justify-center gap-2">
                      <RotateCcw size={26} className="text-gray-300" />
                      <span>No previous purchases to reorder yet.</span>
                      <Link
                        href="/products"
                        onClick={() => setIsBuyAgainOpen(false)}
                        className="text-[12px] font-bold text-[#165dd0] hover:underline"
                      >
                        Browse all products →
                      </Link>
                    </div>
                  ) : (
                    buyAgainItems.map((item) => (
                      <div
                        key={item.id}
                        className="w-46.25 sm:w-48.75 md:w-51.25 shrink-0 flex flex-col"
                      >
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsBuyAgainOpen(false)}
                          className="flex h-full w-full"
                        >
                          <ProductCard
                            imageSrc={imageUrl(item.image)}
                            imageAlt={item.name}
                            title={item.name}
                            price={formatPrice(item.price)}
                            badgeText={item.timesPurchased > 1 ? `Ordered ${item.timesPurchased}x` : 'Purchased'}
                            offerText="Buy Again"
                            buttonVariant="add-to-cart"
                            onAddToCart={() =>
                              handleAddToCart(
                                {
                                  id: item.productId,
                                  name: item.name,
                                  slug: item.slug,
                                  basePrice: item.price,
                                  thumbnail: item.image,
                                  vendor: { storefront: { storeName: item.vendorName } },
                                } as any,
                                item.price
                              )
                            }
                          />
                        </Link>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollBuyAgainRow('right')}
                  aria-label="Scroll right"
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer"
                >
                  <ChevronRight size={18} className="text-gray-700" />
                </button>
              </div>
            )}

            {/* Window Footer */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[12px] text-gray-500">
              <span>
                {buyAgainItems.length > 0
                  ? `Showing ${buyAgainItems.length} item${buyAgainItems.length === 1 ? '' : 's'} available to reorder`
                  : 'Fast 1-click reordering'}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/buy-again"
                  onClick={() => setIsBuyAgainOpen(false)}
                  className="font-bold text-[#165dd0] hover:underline"
                >
                  Visit Buy Again page →
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── All Categories Drawer ── */}
      <AllCategoriesDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />
    </section>
  );
}
