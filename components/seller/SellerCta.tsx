import Image from "next/image";

export default function SellerCta() {
  return (
    <section className="w-full bg-[#ede7de]">
      <div className="flex w-full items-center gap-24 px-20 py-25">
        <div className="relative h-175 min-w-0 flex-1 overflow-hidden rounded-xl shadow-[0px_24.552px_30.691px_-6.138px_rgba(0,0,0,0.1),0px_9.821px_12.276px_-7.366px_rgba(0,0,0,0.1)]">
          <Image
            src={"/public/seller/cta.svg"}
            alt="Seller preparing packages beside a laptop"
            fill
            unoptimized
            className="object-cover object-[53%_50%]"
          />
          <div className="absolute inset-0 rounded-xl bg-[rgba(240,144,0,0.15)]" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-6">
          <h2 className="text-center font-[Arial] text-[48px] leading-[1.1] font-bold tracking-[-0.96px] text-black">
            Ready to get started?
          </h2>
          <p className="text-center font-[Arial] text-[24px] leading-[1.2] text-[#42454d]">
            Join millions of entrepreneurs who have built successful businesses with us
          </p>
          <button
            type="button"
            className="flex h-12 w-52.75 items-center justify-center rounded-xs border border-[#f09000] bg-[#f09000] px-4 py-3 font-sans text-[16px] leading-[1.2] text-black"
          >
            Start selling today
          </button>
        </div>
      </div>
    </section>
  );
}
