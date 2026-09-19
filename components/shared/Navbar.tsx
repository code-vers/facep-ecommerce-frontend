'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/contexts/CartContext";
import {
  useProducts,
  formatProductImageUrl,
  formatPriceCurrency,
  calculateProductPrice,
} from "@/hooks/api/useProduct";

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

function AccountBlock() {
  const [isOpen, setIsOpen] = useState(false);
  const { session, logout } = useAuth();
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === 'ADMIN';
  const isVendor = session?.user?.role === 'VENDOR';

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex shrink-0 flex-col items-start gap-1 text-left cursor-pointer"
      >
        <span className="text-[13px] leading-[1.3] text-[#a9acb2] xl:text-[14px]">
          {isLoggedIn ? (session?.user?.name ? `Hello, ${session.user.name.split(' ')[0]}` : 'Hello,') : 'Hello, sign in'}
        </span>
        <span className="flex items-center gap-1 text-[15px] leading-[1.2] font-bold text-white xl:text-[16px]">
          Account
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5 z-50">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-[14px] text-black hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 text-[14px] text-black hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {isAdmin || isVendor ? (
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-[14px] text-black hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-[14px] text-black hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
              )}
              <button
                type="button"
                className="block w-full text-left px-4 py-2 text-[14px] text-[#cb1b1b] hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NavbarSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasQuery = debouncedQuery.length > 0;
  const searchResults = useProducts(
    { search: debouncedQuery, limit: 10 },
    hasQuery,
  );

  const products = searchResults.data?.data ?? [];
  const totalCount = searchResults.data?.meta?.total ?? 0;
  const isLoading = searchResults.isLoading || searchResults.isFetching;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    router.push(`/products/${slug}`);
  };

  const handleSeeMore = () => {
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div ref={searchContainerRef} className="relative order-2 flex min-w-0 w-full lg:order-1 lg:max-w-190 lg:flex-1 xl:max-w-none">
      <form onSubmit={handleSubmit} className="flex min-w-0 w-full items-center">
        <button
          type="button"
          className="hidden h-11 shrink-0 items-center gap-0.5 rounded-l-sm bg-[#cacace] px-3 text-[14px] leading-[1.2] text-[#42454d] sm:flex"
        >
          <span>All</span>
          <ChevronDownIcon />
        </button>

        <div className="flex h-11 min-w-0 flex-1 items-center rounded-l-sm bg-white px-3 sm:rounded-none">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!isOpen && e.target.value.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) {
                setIsOpen(true);
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
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="flex h-11 shrink-0 items-center justify-center rounded-r-sm bg-[#dec33a] px-4 text-black hover:bg-[#c9b034] transition-colors cursor-pointer"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && searchQuery.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 rounded-md bg-white text-black shadow-2xl border border-[#e5e5e6] z-50 overflow-hidden max-h-115 flex flex-col">
          {isLoading && !products.length ? (
            <div className="flex items-center justify-center gap-2 p-6 text-[14px] text-gray-500">
              <span className="h-4 w-4 border-2 border-[#dec33a] border-t-transparent rounded-full animate-spin" />
              Searching products...
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                {products.map((product) => {
                  const effective = calculateProductPrice(product);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
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
                })}
              </div>

              {/* See more button */}
              <button
                type="button"
                onClick={handleSeeMore}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-gray-50 hover:bg-[#dec33a]/20 border-t border-gray-200 text-[13px] font-semibold text-[#165DD0] transition-colors cursor-pointer"
              >
                <span>See more results for &ldquo;{searchQuery.trim()}&rdquo;</span>
                {totalCount > 0 && <span className="text-gray-500 font-normal">({totalCount} found)</span>}
                <span>→</span>
              </button>
            </>
          ) : (
            <div className="p-6 text-center text-[14px] text-gray-500">
              No products found for &ldquo;<span className="font-semibold text-black">{searchQuery.trim()}</span>&rdquo;
            </div>
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
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-4 px-4 py-4 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:gap-6 lg:px-10 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between gap-4 lg:shrink-0">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90" aria-label="Facep home">
            <div className="relative h-9 w-14 sm:h-10 sm:w-16 overflow-hidden rounded bg-black">
              <Image
                src="/logo.jpg"
                alt="Facep"
                fill
                priority
                className="object-cover"
              />
            </div>
            {/* <span className="font-[Arial] text-[22px] sm:text-[26px] xl:text-[28px] leading-[1.2] font-bold text-white tracking-tight">
              Facep
            </span> */}
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

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 xl:gap-8">
          <NavbarSearch />

          <div className="order-1 hidden shrink-0 items-center gap-5 lg:order-2 lg:flex xl:gap-7">
            <AccountBlock />
            <Link href="/orders" className="shrink-0 text-[15px] leading-[1.2] font-bold text-white xl:text-[16px] hover:text-[#dec33a] transition-all">
              Returns &amp; Orders
            </Link>

            <Link href="/cart" className="flex shrink-0 items-center justify-center gap-1 text-white hover:text-[#dec33a] transition-all">
              <CartIcon />
              <span className="hidden text-[15px] leading-[1.2] font-bold xl:inline xl:text-[16px]">Cart</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-[10px] bg-[#dec33a] px-1.5 py-0.75 text-[12px] leading-[1.3] font-normal text-black">
                {cartItemsCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
