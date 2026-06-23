import Image from "next/image";

const steps = [
  {
    number: "1",
    title: "Create your account",
    description: "Sign up in minutes with basic business information",
  },
  {
    number: "2",
    title: "List your products",
    description: "Add products one at a time or in bulk with easy-to-use tools",
  },
  {
    number: "3",
    title: "Start selling",
    description: "Receive orders and get paid directly to your bank account",
  },
];

export default function SellerGettingStarted() {
  return (
    <section className="w-full bg-[#f2f2f3]">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col items-center gap-10 px-4 py-12 sm:px-6 md:px-8 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-10 lg:py-18 xl:gap-20 xl:px-16 xl:py-25 2xl:gap-24 2xl:px-20">
        <div className="flex w-full flex-col items-start gap-10 xl:max-w-167.5 xl:gap-16">
          <h2 className="w-full font-[Arial] text-[32px] leading-[1.1] font-bold tracking-[-0.6px] text-[#0a0a0a] sm:text-[40px] md:text-[44px] xl:text-[48px] xl:tracking-[-0.96px]">
            Easy to create an account and start selling
          </h2>

          <div className="flex w-full flex-col items-start justify-center gap-7 xl:gap-9">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4 sm:gap-6 xl:gap-9">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#ede7de] sm:h-12.5 sm:w-12.5">
                  <span className="font-[Arial] text-[28px] leading-[1.2] font-bold text-[#f09000] sm:text-[36px]">
                    {step.number}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5 sm:gap-3 leading-[1.2] xl:max-w-93.25">
                  <h3 className="w-full font-[Arial] text-[21px] text-[#0a0a0a] sm:text-[24px]">{step.title}</h3>
                  <p className="w-full font-sans text-[16px] leading-[1.45] text-[#4a5565] sm:text-[18px] sm:leading-[1.35]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-75 w-full overflow-hidden rounded-xl sm:min-h-95 lg:min-h-140 xl:min-h-175">
          <div className="absolute inset-0 rounded-xl bg-white" />
          <Image
            src={"/public/seller/selling.svg"}
            alt="Seller working on a laptop at a wooden table"
            fill
            unoptimized
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
