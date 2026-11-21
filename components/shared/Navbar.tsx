'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useSyncExternalStore, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/contexts/CartContext";
import { useMyOrders } from "@/hooks/api/useOrder";
import { formatOrderImageUrl, BackendOrder } from "@/lib/api/order";
import { toast } from "sonner";
import {
  RotateCcw,
  ShoppingCart,
  ChevronRight,
  PackageCheck,
  Package,
  LogOut,
} from "lucide-react";
import {
  useProducts,
  formatProductImageUrl,
  formatPriceCurrency,
  calculateProductPrice,
} from "@/hooks/api/useProduct";
import type { Product } from "@/lib/api/product";

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="20" r="1.35" />
      <circle cx="18" cy="20" r="1.35" />
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.75L21 7H7" />
    </svg>
  );
}

interface BuyAgainPreviewItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sellerName: string;
  lastDeliveredDate: string;
}

function AccountBlock() {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { session, logout } = useAuth();
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === 'ADMIN';
  const isVendor = session?.user?.role === 'VENDOR';

  const addToCart = useCartStore((state) => state.addToCart);

  // Fetch delivered orders for the Buy Again left column
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders({
    status: 'Delivered',
    limit: 20,
  });

  const rawOrders: BackendOrder[] = ordersData?.orders || [];

  const buyAgainProducts: BuyAgainPreviewItem[] = useMemo(() => {
    if (!rawOrders || rawOrders.length === 0) return [];
    const itemMap = new Map<string, BuyAgainPreviewItem>();

    rawOrders.forEach((order) => {
      const deliveredDate = order.updatedAt || order.createdAt;

      (order.items || []).forEach((item) => {
        const key = item.productId || item.slug || item.id;
        if (!key) return;

        if (itemMap.has(key)) {
          const existing = itemMap.get(key)!;
          if (new Date(deliveredDate) > new Date(existing.lastDeliveredDate)) {
            existing.lastDeliveredDate = deliveredDate;
            existing.price = Number(item.price) || existing.price;
            if (item.image) existing.image = item.image;
          }
        } else {
          itemMap.set(key, {
            id: key,
            productId: item.productId,
            name: item.productName || 'Product',
            slug: item.slug || item.productId,
            price: Number(item.price) || 0,
            image: item.image || '',
            sellerName: item.vendorName || 'Facep Verified',
            lastDeliveredDate: deliveredDate,
          });
        }
      });
    });

    const items = Array.from(itemMap.values());
    items.sort(
      (a, b) => new Date(b.lastDeliveredDate).getTime() - new Date(a.lastDeliveredDate).getTime()
    );
    return items.slice(0, 5);
  }, [rawOrders]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  const handleQuickReorder = (e: React.MouseEvent, item: BuyAgainPreviewItem) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: item.productId,
      cartItemId: `${item.productId}---`,
      name: item.name,
      slug: item.slug,
      price: item.price,
      quantity: 1,
      image: item.image,
      sellerName: item.sellerName,
    });

    toast.success(`Added "${item.name}" to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex shrink-0 flex-col items-start gap-0.5 text-left cursor-pointer py-1 px-1.5 rounded-xs hover:ring-1 hover:ring-white transition-all select-none"
      >
        <span className="text-[12px] leading-tight text-[#a9acb2] xl:text-[13px] truncate max-w-37.5">
          {isLoggedIn ? (session?.user?.name ? `Hello, ${session.user.name.split(' ')[0]}` : 'Hello,') : 'Hello, sign in'}
        </span>
        <span className="flex items-center gap-1 text-[14px] leading-tight font-bold text-white xl:text-[15px] whitespace-nowrap">
          Account &amp; Lists
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Top Arrow pointing to trigger */}
          <div className="absolute right-8 top-0.5 w-3.5 h-3.5 bg-white border-t border-l border-gray-200 rotate-45 z-20 pointer-events-none" />

          {/* 2-Column Dropdown Container */}
          <div className="w-147.5 sm:w-157.5 rounded-lg bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden flex border border-gray-200 text-left">
            
            {/* ── Column 1 (Left): Buy Again Products (Recent 5) ── */}
            <div className="w-[52%] p-4 bg-[#fafbfc] border-r border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                  <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-1.5">
                    <RotateCcw size={14} className="text-[#dec33a]" />
                    <span>Buy Again</span>
                  </h3>
                  <Link
                    href="/buy-again"
                    onClick={() => setIsOpen(false)}
                    className="text-[12px] font-semibold text-[#165dd0] hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {!isLoggedIn ? (
                  <div className="py-8 flex flex-col items-center text-center justify-center gap-2.5 px-2">
                    <div className="size-11 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                      <PackageCheck size={20} />
                    </div>
                    <span className="text-[13px] font-bold text-gray-900">
                      Your Delivered Purchases
                    </span>
                    <p className="text-[12px] text-gray-500 max-w-52.5 leading-relaxed">
                      Sign in to view your delivered orders and repurchase your favorites with 1 click.
                    </p>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="mt-1 px-4 py-1.5 bg-[#dec33a] hover:bg-[#c9b034] text-black font-bold text-[12px] rounded-xs shadow-2xs transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                ) : ordersLoading ? (
                  <div className="flex flex-col gap-2.5 py-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={`skel-buy-again-${i}`} className="flex items-center gap-2.5 p-1.5 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded shrink-0" />
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="w-3/4 h-3 bg-gray-200 rounded" />
                          <div className="w-1/2 h-2.5 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : buyAgainProducts.length === 0 ? (
                  <div className="py-8 flex flex-col items-center text-center justify-center gap-2.5 px-2">
                    <div className="size-11 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200">
                      <Package size={20} />
                    </div>
                    <span className="text-[13px] font-bold text-gray-900">
                      No Delivered Items Yet
                    </span>
                    <p className="text-[12px] text-gray-500 max-w-52.5 leading-relaxed">
                      Items from your delivered orders will show up right here for convenient reordering.
                    </p>
                    <Link
                      href="/products"
                      onClick={() => setIsOpen(false)}
                      className="mt-1 text-[12px] font-bold text-[#165dd0] hover:underline"
                    >
                      Explore Products →
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {buyAgainProducts.map((item) => {
                      const formattedImg = formatOrderImageUrl(item.image);
                      return (
                        <div
                          key={item.id}
                          className="group/item flex items-center justify-between gap-2.5 p-1.5 rounded-md hover:bg-white hover:shadow-xs transition-all border border-transparent hover:border-gray-200"
                        >
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 flex-1 min-w-0"
                          >
                            <div className="relative w-12 h-12 rounded border border-gray-200 bg-white shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                              <Image
                                src={formattedImg}
                                alt={item.name}
                                fill
                                unoptimized
                                className="object-contain p-0.5 group-hover/item:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-[12px] font-semibold text-gray-900 group-hover/item:text-[#165dd0] line-clamp-1 leading-snug transition-colors">
                                {item.name}
                              </span>
                              <span className="text-[12px] font-bold text-gray-950">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleQuickReorder(e, item)}
                            title="Add to cart"
                            className="px-2.5 py-1 text-[11px] font-bold bg-[#dec33a] hover:bg-[#c9b034] active:bg-[#b49a2e] text-black rounded-xs shrink-0 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                          >
                            <ShoppingCart size={11} />
                            <span>Buy</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Left Column Bottom Link */}
              <div className="pt-2.5 mt-2 border-t border-gray-200">
                <Link
                  href="/buy-again"
                  onClick={() => setIsOpen(false)}
                  className="text-[12px] font-semibold text-[#165dd0] hover:underline flex items-center justify-center gap-1"
                >
                  <span>Explore all Buy Again items</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>

            {/* ── Column 2 (Right): Your Account ── */}
            <div className="w-[48%] p-4 bg-white flex flex-col justify-between">
              <div>
                {/* Sign-in / Greeting Box */}
                {!isLoggedIn ? (
                  <div className="pb-3.5 mb-3 border-b border-gray-100 flex flex-col items-center text-center">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2 bg-[#dec33a] hover:bg-[#c9b034] active:bg-[#b49a2e] text-black font-bold text-[13px] rounded-xs transition-colors shadow-2xs text-center cursor-pointer"
                    >
                      Sign In
                    </Link>
                    <span className="text-[11px] text-gray-500 mt-2">
                      New customer?{' '}
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="text-[#165dd0] hover:underline font-semibold"
                      >
                        Start here.
                      </Link>
                    </span>
                  </div>
                ) : (
                  <div className="pb-3.5 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-[#dec33a]/20 text-black font-bold flex items-center justify-center text-sm border border-[#dec33a]/40 shrink-0">
                        {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-gray-900 truncate">
                          {session?.user?.name || 'Valued Customer'}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-1 px-2 text-center text-[12px] font-semibold border border-gray-200 hover:bg-gray-50 rounded-xs text-gray-800 transition-colors"
                      >
                        Profile
                      </Link>
                      {(isAdmin || isVendor) && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex-1 py-1 px-2 text-center text-[12px] font-semibold bg-[#2b323b] text-white hover:bg-black rounded-xs transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Section Heading */}
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">
                  Your Account
                </h3>

                {/* Navigation links */}
                <div className="flex flex-col gap-1 text-[13px]">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Your Orders
                  </Link>
                  <Link
                    href="/buy-again"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Buy Again
                  </Link>
                  <Link
                    href="/coupons"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Coupons
                  </Link>
                  <Link
                    href="/special-products"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Special Products
                  </Link>
                  <Link
                    href="/early-deals"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Early Deals
                  </Link>
                  <Link
                    href="/holiday-deals"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Holiday Deals
                  </Link>
                  <Link
                    href="/customer-service"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                  >
                    Customer Service
                  </Link>
                  {(isAdmin || isVendor) && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-700 hover:text-[#dec33a] hover:translate-x-0.5 transition-all py-0.5"
                    >
                      {isAdmin ? 'Admin Dashboard' : 'Vendor Dashboard'}
                    </Link>
                  )}
                </div>
              </div>

              {/* Sign Out at bottom if logged in */}
              {isLoggedIn && (
                <div className="pt-2.5 mt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left text-[12px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function DropdownProductItem({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (slug: string) => void;
}) {
  const effective = calculateProductPrice(product);
  return (
    <div
      onClick={() => onSelect(product.slug)}
      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
        <Image
          src={formatProductImageUrl(product.thumbnail)}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-gray-900 truncate">
          {product.name}
        </p>
        <p className="text-[12px] text-gray-500 truncate">
          {product.category?.name || product.brand || 'Product'}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[14px] font-bold text-black">
          {formatPriceCurrency(effective)}
        </p>
        {Number(product.oldPrice || product.basePrice) > effective && (
          <p className="text-[11px] text-gray-400 line-through">
            {formatPriceCurrency(product.oldPrice || product.basePrice)}
          </p>
        )}
      </div>
    </div>
  );
}

function NavbarSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAllOpen, setIsAllOpen] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsAllOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAllOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const hasQuery = debouncedQuery.length > 0;
  const searchResults = useProducts(
    { search: debouncedQuery, limit: 10 },
    hasQuery,
  );

  const allProductsQuery = useProducts(
    { limit: 20 },
    isAllOpen,
  );

  const searchProducts = searchResults.data?.data ?? [];
  const searchTotalCount = searchResults.data?.meta?.total ?? 0;
  const isSearchLoading = searchResults.isLoading || searchResults.isFetching;

  const allProducts = allProductsQuery.data?.data ?? [];
  const allTotalCount = allProductsQuery.data?.meta?.total ?? 0;
  const isAllLoading = allProductsQuery.isLoading || allProductsQuery.isFetching;

  const showSearchDropdown = isSearchOpen && searchQuery.trim().length > 0;
  const showAllDropdown = isAllOpen && searchQuery.trim().length === 0;
  const isDropdownOpen = showSearchDropdown || showAllDropdown;

  const handleToggleAll = () => {
    if (isAllOpen) {
      setIsAllOpen(false);
    } else {
      setIsSearchOpen(false);
      setSearchQuery('');
      setDebouncedQuery('');
      setIsAllOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    setIsAllOpen(false);
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    setIsAllOpen(false);
    router.push(`/products/${slug}`);
  };

  const handleSeeMoreSearch = () => {
    setIsSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleViewAllProducts = () => {
    setIsAllOpen(false);
    router.push('/products');
  };

  return (
    <div ref={searchContainerRef} className="relative order-2 flex min-w-0 w-full lg:order-1 lg:flex-1">
      <form onSubmit={handleSubmit} className="flex min-w-0 w-full items-center">
        <button
          type="button"
          onClick={handleToggleAll}
          aria-expanded={isAllOpen}
          aria-label="Toggle all products menu"
          className={`h-9.5 sm:h-10 shrink-0 items-center gap-1 rounded-l-sm px-2.5 sm:px-3 text-[13px] sm:text-[14px] leading-[1.2] transition-colors cursor-pointer select-none flex ${
            isAllOpen
              ? 'bg-[#b8b8bd] text-black font-semibold'
              : 'bg-[#cacace] text-[#42454d] hover:bg-[#b8b8bd]'
          }`}
        >
          <span>All</span>
          <span className={`transition-transform duration-200 ${isAllOpen ? 'rotate-180' : ''}`}>
            <ChevronDownIcon />
          </span>
        </button>

        <div className="flex h-9.5 sm:h-10 min-w-0 flex-1 items-center bg-white px-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim().length > 0) {
                setIsAllOpen(false);
                setIsSearchOpen(true);
              } else {
                setIsSearchOpen(false);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) {
                setIsAllOpen(false);
                setIsSearchOpen(true);
              }
            }}
            placeholder="Search products..."
            className="h-5 min-w-0 flex-1 bg-transparent text-[14px] leading-[1.2] text-[#42454d] outline-none placeholder:text-[#42454d]/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDebouncedQuery('');
                setIsSearchOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="flex h-9.5 sm:h-10 shrink-0 items-center justify-center rounded-r-sm bg-[#dec33a] px-3.5 sm:px-4 text-black hover:bg-[#c9b034] transition-colors cursor-pointer"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </form>

      {/* Dropdown for Search or All Products */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 rounded-md bg-white text-black shadow-2xl border border-[#e5e5e6] z-50 overflow-hidden max-h-115 flex flex-col">
          {showAllDropdown && (
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-50 border-b border-gray-200/80 text-[12px] text-gray-600 font-medium">
              <span className="font-semibold text-gray-800">
                Explore Products {allProducts.length > 0 ? `(Top ${allProducts.length})` : ''}
              </span>
              <button
                type="button"
                onClick={handleViewAllProducts}
                className="text-[#165DD0] hover:underline font-semibold text-[12px] cursor-pointer"
              >
                View all products →
              </button>
            </div>
          )}

          {showAllDropdown ? (
            isAllLoading && !allProducts.length ? (
              <div className="flex items-center justify-center gap-2 p-6 text-[14px] text-gray-500">
                <span className="h-4 w-4 border-2 border-[#dec33a] border-t-transparent rounded-full animate-spin" />
                Loading products...
              </div>
            ) : allProducts.length > 0 ? (
              <>
                <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                  {allProducts.map((product) => (
                    <DropdownProductItem
                      key={product.id}
                      product={product}
                      onSelect={handleSelectProduct}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleViewAllProducts}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-gray-50 hover:bg-[#dec33a]/20 border-t border-gray-200 text-[13px] font-semibold text-[#165DD0] transition-colors cursor-pointer"
                >
                  <span>View all products</span>
                  {allTotalCount > 0 && (
                    <span className="text-gray-500 font-normal">({allTotalCount} total)</span>
                  )}
                  <span>→</span>
                </button>
              </>
            ) : (
              <div className="p-6 text-center text-[14px] text-gray-500">
                No products available.
              </div>
            )
          ) : (
            isSearchLoading && !searchProducts.length ? (
              <div className="flex items-center justify-center gap-2 p-6 text-[14px] text-gray-500">
                <span className="h-4 w-4 border-2 border-[#dec33a] border-t-transparent rounded-full animate-spin" />
                Searching products...
              </div>
            ) : searchProducts.length > 0 ? (
              <>
                <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                  {searchProducts.map((product) => (
                    <DropdownProductItem
                      key={product.id}
                      product={product}
                      onSelect={handleSelectProduct}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSeeMoreSearch}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-gray-50 hover:bg-[#dec33a]/20 border-t border-gray-200 text-[13px] font-semibold text-[#165DD0] transition-colors cursor-pointer"
                >
                  <span>See more results for &ldquo;{searchQuery.trim()}&rdquo;</span>
                  {searchTotalCount > 0 && (
                    <span className="text-gray-500 font-normal">({searchTotalCount} found)</span>
                  )}
                  <span>→</span>
                </button>
              </>
            ) : (
              <div className="p-6 text-center text-[14px] text-gray-500">
                No products found for &ldquo;<span className="font-semibold text-black">{searchQuery.trim()}</span>&rdquo;
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}


const emptySubscribe = () => () => {};

export default function Navbar() {
  const { items } = useCartStore();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const cartItemsCount = isClient ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="w-full bg-black text-white">
      <div className="flex w-full flex-col gap-2.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 md:px-4 lg:flex-row lg:items-center lg:gap-4 xl:gap-6">
        <div className="flex items-center justify-between gap-4 lg:shrink-0">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90" aria-label="Facep home">
            <div className="relative h-9.5 w-28 sm:h-10.5 sm:w-31 md:h-11.5 md:w-34 xl:h-12 xl:w-35 overflow-hidden rounded-md p-1 shadow-xs">
              <Image
                src="/logo.png"
                alt="Facep"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/cart" className="flex items-center gap-1 text-white hover:text-[#dec33a] transition-all">
              <CartIcon />
              <span className="flex h-5 min-w-5 items-center justify-center rounded-[10px] bg-[#dec33a] px-1.5 text-[12px] leading-[1.3] font-normal text-black">
                {cartItemsCount}
              </span>
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 xl:gap-8">
          <NavbarSearch />

          <div className="order-1 hidden shrink-0 items-center gap-4 lg:order-2 lg:flex xl:gap-6">
            <AccountBlock />
            <Link href="/orders" className="shrink-0 text-[14px] leading-[1.2] font-bold text-white xl:text-[15px] hover:text-[#dec33a] transition-all">
              Returns &amp; Orders
            </Link>

            <Link href="/cart" className="flex shrink-0 items-center justify-center gap-1 text-white hover:text-[#dec33a] transition-all">
              <CartIcon />
              <span className="hidden text-[14px] leading-[1.2] font-bold xl:inline xl:text-[15px]">Cart</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-[10px] bg-[#dec33a] px-1.5 py-0.5 text-[12px] leading-[1.3] font-normal text-black">
                {cartItemsCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
