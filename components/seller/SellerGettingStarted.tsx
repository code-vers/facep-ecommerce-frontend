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
      <div className="flex w-full items-center justify-center gap-60 px-20 py-25">
        <div className="flex w-167.5 shrink-0 flex-col items-start gap-16">
          <h2 className="w-full font-[Arial] text-[48px] leading-[1.1] font-bold tracking-[-0.96px] text-[#0a0a0a]">
            Easy to create an account and start selling
          </h2>

          <div className="flex flex-col items-start justify-center gap-9">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-9">
                <div className="flex h-12.5 w-12.5 shrink-0 items-center justify-center rounded-sm bg-[#ede7de]">
                  <span className="font-[Arial] text-[36px] leading-[1.2] font-bold text-[#f09000]">{step.number}</span>
                </div>
                <div className="flex w-93.25 shrink-0 flex-col items-start gap-3 leading-[1.2]">
                  <h3 className="w-full font-[Arial] text-[24px] text-[#0a0a0a]">{step.title}</h3>
                  <p className="w-full font-sans text-[18px] text-[#4a5565]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-175 min-w-0 flex-1 overflow-hidden rounded-xl">
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
