"use client";

import Image from "next/image";

const canadaFlag = "https://www.figma.com/api/mcp/asset/0859158b-4418-4d80-b7d7-f869e43f0c98";

const footerColumns = [
  {
    title: "Get to know Us",
    links: ["About Us", "Careers", "Press Releases"],
  },
  {
    title: "Make Money with Us",
    links: ["Sell with us", "Supply to us", "Advertise Your Products"],
  },
  {
    title: "Let Us Help You",
    links: ["Your Account", "Returns Center", "100% Purchase Protection", "Help"],
  },
];

function ArrowUpIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 sm:h-4.5 sm:w-4.5" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M15 8h-2a2 2 0 0 0-2 2v2h4l-.5 4H11v5" />
      <path d="M9 21h6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M4 4 20 20" />
      <path d="M20 4 4 20" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="white" stroke="none" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#f2f2f3" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#f2f2f3" strokeWidth="1.8">
      <path d="M12 3v18" />
      <path d="M16 7.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5 1.8 2.5 4 2.5 4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5" />
    </svg>
  );
}

function FooterPill({
  label,
  trailing,
}: {
  label: string;
  trailing: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex min-w-27.5 items-center justify-center gap-1.5 rounded-xs border border-[#cacbce] px-3 py-2 text-[13px] leading-[1.2] text-[#f2f2f3] sm:text-[14px]"
    >
      <span>{label}</span>
      {trailing}
    </button>
  );
}

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="flex w-full flex-col items-start">
      <button
        type="button"
        onClick={handleBackToTop}
        className="flex w-full items-center justify-center gap-1 bg-[#2b323b] px-4 py-4 text-[14px] leading-[1.2] font-bold text-white sm:px-6 sm:text-[15px] lg:px-10 xl:px-16 xl:py-5 xl:text-[16px] 2xl:px-20"
      >
        <span>Back to top</span>
        <ArrowUpIcon />
      </button>

      <div className="flex w-full flex-col bg-black">
        <div className="mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-10 px-4 py-12 text-white sm:grid-cols-2 sm:px-6 md:px-8 lg:grid-cols-4 lg:px-10 xl:px-16 xl:py-15 2xl:px-20">
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col items-start gap-2">
              <p className="text-[17px] leading-[1.2] sm:text-[18px]">{column.title}</p>
              {column.links.map((link) => (
                <p key={link} className="text-[14px] leading-[1.4]">
                  {link}
                </p>
              ))}
            </div>
          ))}

          <div className="flex flex-col items-start gap-2">
            <p className="text-[17px] leading-[1.2] text-white sm:text-[18px]">Connect with Us</p>
            <div className="flex items-center gap-6">
              <FacebookIcon />
              <XIcon />
              <InstagramIcon />
            </div>
          </div>
        </div>

        <div className="border-t border-[#686f7d]">
          <div className="mx-auto flex w-full max-w-[1760px] flex-col items-center justify-center gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:flex-row xl:gap-16 xl:px-16 xl:py-9 2xl:px-20">
            <p className="font-[Arial] text-[30px] leading-[1.2] font-bold text-white sm:text-[34px] xl:text-[36px]">Logo</p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <FooterPill
                label="Canada"
                trailing={<Image src={canadaFlag} alt="Canada flag" width={24} height={16} unoptimized className="h-4 w-6" />}
              />
              <FooterPill label="English" trailing={<GlobeIcon />} />
              <FooterPill label="USD" trailing={<DollarIcon />} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
