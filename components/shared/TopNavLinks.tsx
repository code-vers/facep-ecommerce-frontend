import Link from "next/link";

interface NavItem {
  label: string;
  href?: string;
}

const navItems: NavItem[] = [
  { label: "All", href: "/products" },
  { label: "Early Deals" },
  { label: "Special Products" },
  { label: "Coupons" },
  { label: "Books" },
  { label: "Order" },
  { label: "Buy Again" },
  { label: "Customer Service", href: "/customer-service" },
  { label: "Sell", href: "/seller" },
];

export default function TopNavLinks() {
  return (
    <section className="w-full bg-[#2b323b] text-white select-none">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
        <nav
          aria-label="Secondary navigation"
          className="flex h-9 sm:h-9.5 xl:h-10 items-center gap-4 sm:gap-5 md:gap-6 xl:gap-8 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[13px] sm:text-[14px] leading-none font-semibold"
        >
          {navItems.map((item) => {
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="shrink-0 text-white hover:text-[#dec33a] transition-colors focus-visible:outline-none focus-visible:text-[#dec33a]"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                className="shrink-0 text-white hover:text-[#dec33a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[#dec33a]"
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
