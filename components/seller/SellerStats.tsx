const stats = [
  { value: "500+", label: "Trusted Sellers" },
  { value: "100+", label: "Regions where we deliver" },
  { value: "100k+", label: "Active Users" },
];

export default function SellerStats() {
  return (
    <section className="w-full bg-[#f2f2f3]">
      <div className="mx-auto w-full max-w-[1760px] px-4 py-12 sm:px-6 md:px-8 lg:px-10 lg:py-18 xl:px-16 xl:py-25 2xl:px-20">
        <div className="grid min-w-0 grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-8 xl:gap-16">
          {stats.map((stat) => (
            <div key={stat.value} className="flex min-w-0 flex-col items-center gap-2">
              <p className="font-[Arial] text-[42px] leading-none font-bold tracking-[-1px] text-[#f09000] sm:text-[52px] md:text-[56px] xl:text-[64px] xl:tracking-[-1.92px]">
                {stat.value}
              </p>
              <p className="max-w-65 font-sans text-[16px] leading-[1.35] text-[#4a5565] sm:text-[18px] sm:leading-[1.2]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
