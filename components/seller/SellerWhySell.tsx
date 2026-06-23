const sellingBenefits = [
  {
    title: "Global reach",
    description: "Access millions of customers across North America, Europe, Asia, and beyond",
    icon: "earth",
  },
  {
    title: "Powerful tools",
    description: "Leverage advanced analytics, advertising, and fulfillment services",
    icon: "trending",
  },
  {
    title: "Secure & Fast Payouts",
    description: "Transparent earnings system with reliable withdrawal and payout management.",
    icon: "dollar",
  },
];

function EarthIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#f09000" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#f09000" strokeWidth="1.8">
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#f09000" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15 9.25c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 2 3 2 3 .9 3 2-1.34 2-3 2-3-.9-3-2" />
    </svg>
  );
}

function BenefitIcon({ icon }: { icon: (typeof sellingBenefits)[number]["icon"] }) {
  if (icon === "earth") return <EarthIcon />;
  if (icon === "trending") return <TrendingUpIcon />;
  return <DollarIcon />;
}

export default function SellerWhySell() {
  return (
    <section className="w-full bg-white">
      <div className="flex w-full flex-col items-center gap-16 px-20 py-25">
        <div className="flex h-26.25 w-141 flex-col items-center gap-6 text-center not-italic">
          <h2 className="w-full font-[Arial] text-[48px] leading-[1.1] font-bold tracking-[-0.96px] text-[#0a0a0a]">
            Why Sell With Us?
          </h2>
          <p className="w-full font-[Arial] text-[24px] leading-[1.2] text-[#4a5565]">
            Join millions of sellers reaching customers worldwide
          </p>
        </div>

        <div className="flex w-full items-stretch justify-center gap-6">
          {sellingBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="flex min-h-49.75 min-w-0 flex-1 flex-col items-center gap-4 rounded-sm border border-[#e5e5e6] px-6 py-6 text-center"
            >
              <div className="flex h-12.5 w-12.5 items-center justify-center rounded-sm bg-[#f2f2f2]">
                <BenefitIcon icon={benefit.icon} />
              </div>
              <div className="flex w-full flex-col items-center gap-3 leading-[1.2]">
                <h3 className="w-full font-[Arial] text-[24px] text-[#0a0a0a]">{benefit.title}</h3>
                <p className="w-full font-sans text-[18px] text-[#4a5565]">{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
