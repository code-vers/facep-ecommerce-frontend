import Link from "next/link";
import { Menu } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
}

const navItems: NavItem[] = [
  { label: "All", href: "/products" },
  { label: "Early Deals", href: "/early-deals" },
  { label: "Special Products", href: "/special-products" },
  { label: "Coupons", href: "/coupons" },
  { label: "Orders", href: "/orders" },
  { label: "Buy Again", href: "/buy-again" },
  { label: "Customer Service", href: "/customer-service" },
  { label: "Sell", href: "/seller" },
];

export default function TopNavLinks() {
  return (
    <section className="w-full bg-[#2b323b] text-white select-none">
      <div className="w-full px-2.5 sm:px-3.5 md:px-4">
        <nav
          aria-label="Secondary navigation"
          className="flex h-10 sm:h-10.5 xl:h-11 items-center gap-4 sm:gap-5 md:gap-6 xl:gap-8 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[14px] sm:text-[15px] xl:text-[16px] leading-none font-semibold"
        >
          {navItems.map((item) => {
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
    </section>
  );
}
