const stats = [
  { value: "500+", label: "Trusted Sellers" },
  { value: "100+", label: "Regions where we deliver" },
  { value: "100k+", label: "Active Users" },
];

export default function SellerStats() {
  return (
    <section className="w-full bg-[#f2f2f3]">
      <div className="flex items-center justify-center px-20 py-25">
        <div className="flex min-w-0 flex-1 items-center gap-16 text-center">
          {stats.map((stat) => (
            <div key={stat.value} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <p className="font-[Arial] text-[64px] leading-none font-bold tracking-[-1.92px] text-[#f09000]">
                {stat.value}
              </p>
              <p className="font-sans text-[18px] leading-[1.2] text-[#4a5565]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
