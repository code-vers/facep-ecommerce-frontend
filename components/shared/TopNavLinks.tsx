import Link from "next/link";

const navItems = ["Today’s Deal", "Sell", "Customer Service"];

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export default function TopNavLinks() {
  return (
    <section className="w-full bg-[#2b323b] text-white">
      <div className="flex h-16 w-full items-center px-5 2xl:px-20">
        <nav className="flex items-center gap-9 text-[16px] leading-[1.2] font-bold">
          <button type="button" className="flex items-center gap-1 text-white">
            <MenuIcon />
            <span>All</span>
          </button>
          {navItems.map((item) =>
            item === "Sell" ? (
              <Link key={item} href="/seller" className="text-white">
                {item}
              </Link>
            ) : (
              <button key={item} type="button" className="text-white">
                {item}
              </button>
            ),
          )}
        </nav>
      </div>
    </section>
  );
}
