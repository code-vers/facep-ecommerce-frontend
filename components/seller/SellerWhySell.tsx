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
      <div className="mx-auto flex w-full max-w-[1760px] flex-col items-center gap-10 px-4 py-12 sm:px-6 md:px-8 lg:gap-12 lg:px-10 lg:py-18 xl:gap-16 xl:px-16 xl:py-25 2xl:px-20">
        <div className="flex max-w-141 flex-col items-center gap-4 text-center not-italic sm:gap-5 xl:gap-6">
          <h2 className="w-full font-[Arial] text-[32px] leading-[1.1] font-bold tracking-[-0.6px] text-[#0a0a0a] sm:text-[40px] md:text-[44px] xl:text-[48px] xl:tracking-[-0.96px]">
            Why Sell With Us?
          </h2>
          <p className="w-full font-[Arial] text-[18px] leading-[1.35] text-[#4a5565] sm:text-[20px] md:text-[22px] xl:text-[24px] xl:leading-[1.2]">
            Join millions of sellers reaching customers worldwide
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {sellingBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="flex min-h-60 min-w-0 flex-col items-center gap-4 rounded-sm border border-[#e5e5e6] px-5 py-6 text-center sm:px-6"
            >
              <div className="flex h-12.5 w-12.5 items-center justify-center rounded-sm bg-[#f2f2f2]">
                <BenefitIcon icon={benefit.icon} />
              </div>
              <div className="flex w-full flex-col items-center gap-3 leading-[1.2]">
                <h3 className="w-full font-[Arial] text-[22px] text-[#0a0a0a] sm:text-[24px]">{benefit.title}</h3>
                <p className="w-full font-sans text-[16px] leading-[1.45] text-[#4a5565] sm:text-[18px] sm:leading-[1.35]">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
