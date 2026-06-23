const tools = [
  {
    title: "Fulfillment by Us",
    description: "Let us pick, pack, ship, and provide customer service for your products",
    icon: "box",
  },
  {
    title: "Advertising",
    description: "Grow your business with our advertising solutions and sponsored products",
    icon: "trending",
  },
  {
    title: "Global selling",
    description: "Expand your reach and sell to customers around the world with us",
    icon: "earth",
  },
  {
    title: "Business reports",
    description: "Track your sales, traffic, and advertising performance with detailed analytics",
    icon: "layout",
  },
  {
    title: "Brand protection",
    description: "Protect your intellectual property and build customer trust with Brand Registry",
    icon: "shield",
  },
  {
    title: "Seller support",
    description: "Get help from our seller support team via email, phone, or chat",
    icon: "headphones",
  },
];

function BoxIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#f09000" strokeWidth="1.6">
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="M4 7.5V16.5L12 21L20 16.5V7.5" />
      <path d="M12 12V21" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#f09000" strokeWidth="1.6">
      <path d="m21 7-8 8-4-4-6 6" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function EarthIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#f09000" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function LayoutPanelTopIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#f09000" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14v4" />
      <path d="M16 14v4" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#f09000" strokeWidth="1.6">
      <path d="M12 3 5 6v6c0 5 3.4 7.8 7 9 3.6-1.2 7-4 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#f09000" strokeWidth="1.6">
      <path d="M4 13a8 8 0 1 1 16 0" />
      <rect x="3" y="13" width="4" height="7" rx="2" />
      <rect x="17" y="13" width="4" height="7" rx="2" />
      <path d="M21 18a3 3 0 0 1-3 3h-2" />
    </svg>
  );
}

function ToolIcon({ icon }: { icon: (typeof tools)[number]["icon"] }) {
  if (icon === "box") return <BoxIcon />;
  if (icon === "trending") return <TrendingUpIcon />;
  if (icon === "earth") return <EarthIcon />;
  if (icon === "layout") return <LayoutPanelTopIcon />;
  if (icon === "shield") return <ShieldCheckIcon />;
  return <HeadphonesIcon />;
}

export default function SellerToolsPrograms() {
  return (
    <section className="w-full bg-white">
      <div className="flex w-full flex-col items-center gap-16 px-20 py-25">
        <div className="flex flex-col items-center gap-6 text-center not-italic">
          <h2 className="font-[Arial] text-[48px] leading-[1.1] font-bold tracking-[-0.96px] text-black">
            Selling Tools And Programs
          </h2>
          <p className="font-[Arial] text-[24px] leading-[1.2] text-[#555765]">Everything you need to succeed</p>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="flex w-full items-center justify-center gap-6">
            {tools.slice(0, 3).map((tool) => (
              <article
                key={tool.title}
                className="flex min-h-43.25 min-w-0 flex-1 flex-col items-center gap-4 rounded-sm border border-[#e5e5e6] bg-[#f2f2f3] px-6 py-6 text-center"
              >
                <ToolIcon icon={tool.icon} />
                <div className="flex w-full flex-col items-center gap-3 leading-[1.2]">
                  <h3 className="w-full font-[Arial] text-[24px] text-[#0a0a0a]">{tool.title}</h3>
                  <p className="w-full font-sans text-[18px] text-[#555765]">{tool.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex w-full items-center justify-center gap-6">
            {tools.slice(3).map((tool) => (
              <article
                key={tool.title}
                className="flex min-h-43.25 min-w-0 flex-1 flex-col items-center gap-4 rounded-sm border border-[#e5e5e6] bg-[#f2f2f3] px-6 py-6 text-center"
              >
                <ToolIcon icon={tool.icon} />
                <div className="flex w-full flex-col items-center gap-3 leading-[1.2]">
                  <h3 className="w-full font-[Arial] text-[24px] text-[#0a0a0a]">{tool.title}</h3>
                  <p className="w-full font-sans text-[18px] text-[#555765]">{tool.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
