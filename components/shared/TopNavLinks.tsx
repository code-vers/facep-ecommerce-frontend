import Link from "next/link";

const navItems = [
  // "Today’s Deal",
  "Sell",
  "Customer Service",
];

export default function TopNavLinks() {
  return (
    <section className="w-full bg-[#2b323b] text-white">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
        <nav className="flex h-9 sm:h-9.5 xl:h-10 items-center gap-4 sm:gap-6 xl:gap-8 overflow-x-auto whitespace-nowrap text-[13px] sm:text-[14px] leading-none font-semibold">
          <Link
            href="/products"
            className="shrink-0 text-white hover:text-[#dec33a] transition-all"
          >
            All
          </Link>

          {navItems.map((item) => {
            if (item === "Sell") {
              return (
                <Link key={item} href="/seller" className="shrink-0 text-white hover:text-[#dec33a] transition-all">
                  {item}
                </Link>
              );
            }
            if (item === "Customer Service") {
              return (
                <Link key={item} href="/customer-service" className="shrink-0 text-white hover:text-[#dec33a] transition-all">
                  {item}
                </Link>
              );
            }
            /*
            if (item === "Today’s Deal") {
              return (
                <Link key={item} href="/todays-deal" className="shrink-0 text-white hover:text-[#dec33a] transition-all">
                  {item}
                </Link>
              );
            }
            */
            return (
              <button key={item} type="button" className="shrink-0 text-white hover:text-[#dec33a] transition-all">
                {item}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
