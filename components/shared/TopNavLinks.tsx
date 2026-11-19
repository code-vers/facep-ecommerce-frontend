'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  History,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { useBrowsingHistory } from "@/lib/view-history";
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
  { label: "All", href: "/products" },
  { label: "Early Deals", href: "/early-deals" },
  { label: "Holiday Deals", href: "/holiday-deals" },
  { label: "Special Products", href: "/special-products" },
  { label: "Coupons", href: "/coupons" },
  { label: "Orders", href: "/orders" },
  { label: "Buy Again", href: "/buy-again" },
  { label: "Browsing History", href: "/browsing-history" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Toys & Games", href: "/toys-and-games" },
  { label: "Groceries", href: "/groceries" },
  { label: "Customer Service", href: "/customer-service" },
  { label: "Sell", href: "/seller" },
];

export default function TopNavLinks() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { products: browsingProducts, isLoading: isBrowsingLoading, clearHistory } =
    useBrowsingHistory(10);

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

  const handleHistoryMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsHistoryOpen(true);
  };

  const handleHistoryMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setIsHistoryOpen(false);
    }, 200);
  };

  const scrollRow = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
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
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
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
    </section>
  );
}
