import Link from "next/link";

const navItems = ["Today’s Deal", "Sell", "Customer Service"];

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export default function TopNavLinks() {
  return (
    <section className="w-full bg-[#2b323b] text-white">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
        <nav className="flex h-13 items-center gap-4 overflow-x-auto whitespace-nowrap text-[14px] leading-[1.2] font-bold sm:h-14 sm:gap-6 sm:text-[15px] xl:h-16 xl:gap-9 xl:text-[16px]">
          <button type="button" className="flex shrink-0 items-center gap-1 text-white">
            <MenuIcon />
            <span>All</span>
          </button>

          {navItems.map((item) =>
            item === "Sell" ? (
              <Link key={item} href="/seller" className="shrink-0 text-white">
                {item}
              </Link>
            ) : (
              <button key={item} type="button" className="shrink-0 text-white">
                {item}
              </button>
            ),
          )}
        </nav>
      </div>
    </section>
  );
}
