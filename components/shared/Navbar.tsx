import Image from "next/image";

const canadaFlag = "https://www.figma.com/api/mcp/asset/b672379d-0c27-4040-a593-1da330971f36";

function MapPinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s6-5.333 6-11a6 6 0 1 0-12 0c0 5.667 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.15" />
    </svg>
  );
}

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
  return (
    <button type="button" className="flex shrink-0 flex-col items-start gap-1 text-left">
      <span className="text-[13px] leading-[1.3] text-[#a9acb2] xl:text-[14px]">Hello, sign in</span>
      <span className="flex items-center gap-1 text-[15px] leading-[1.2] font-bold text-white xl:text-[16px]">
        Account
        <ChevronDownIcon />
      </span>
    </button>
  );
}

export default function Navbar() {
  return (
    <header className="w-full bg-black text-white">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-4 px-4 py-4 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:gap-6 lg:px-10 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between gap-4 lg:shrink-0">
          <button type="button" className="shrink-0 text-left" aria-label="Facep home">
            <span className="font-[Arial] text-[28px] leading-[1.2] font-bold text-white sm:text-[32px] xl:text-[36px]">
              Logo
            </span>
          </button>

          <div className="flex items-center gap-3 lg:hidden">
            <button type="button" className="flex items-center gap-1 text-[14px] leading-[1.2] font-bold text-white">
              CA
              <ChevronDownIcon />
            </button>
            <button type="button" className="flex items-center gap-1 text-white">
              <CartIcon />
              <span className="flex h-5 w-5 items-center justify-center rounded-[10px] bg-[#dec33a] text-[12px] leading-[1.3] font-normal text-black">
                0
              </span>
            </button>
          </div>
        </div>

        <div className="hidden shrink-0 items-end gap-1 self-end lg:flex">
          <span className="mb-0.5 text-[#f2f2f3]">
            <MapPinIcon />
          </span>
          <span className="flex w-18 flex-col gap-1 text-left xl:w-19">
            <span className="text-[13px] leading-[1.3] text-[#a9acb2] xl:text-[14px]">Deliver to</span>
            <span className="text-[15px] leading-[1.2] font-bold text-white xl:text-[16px]">Canada</span>
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-end lg:gap-4 xl:gap-7">
          <form className="order-2 flex min-w-0 w-full items-start lg:order-1 lg:max-w-190 lg:flex-1 xl:max-w-none">
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
                placeholder="Search Amazon"
                className="h-5 min-w-0 flex-1 bg-transparent text-[14px] leading-[1.2] text-[#42454d] outline-none placeholder:text-[#42454d]/50"
              />
            </div>
            <button
              type="submit"
              className="flex h-11 shrink-0 items-center justify-center rounded-r-sm bg-[#dec33a] px-4 text-black"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </form>

          <div className="order-1 hidden shrink-0 items-end gap-4 lg:order-2 lg:flex xl:gap-7">
            <div className="flex flex-col items-start justify-end gap-2">
              <Image src={canadaFlag} alt="Canada flag" width={24} height={16} unoptimized className="h-4 w-6" />
              <button type="button" className="flex items-center gap-1 text-[14px] leading-[1.2] font-bold text-white">
                CA
                <ChevronDownIcon />
              </button>
            </div>

            <div className="hidden items-center gap-5 xl:flex xl:gap-7">
              <AccountBlock />
              <button type="button" className="shrink-0 text-[15px] leading-[1.2] font-bold text-white xl:text-[16px]">
                Returns &amp; Orders
              </button>
            </div>

            <button type="button" className="flex shrink-0 items-center justify-center gap-1 text-white">
              <CartIcon />
              <span className="hidden text-[15px] leading-[1.2] font-bold xl:inline xl:text-[16px]">Cart</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-[10px] bg-[#dec33a] px-1.5 py-0.75 text-[12px] leading-[1.3] font-normal text-black">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
