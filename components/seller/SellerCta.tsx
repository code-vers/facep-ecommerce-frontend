import Image from "next/image";
import Link from "next/link";

export default function SellerCta() {
  return (
    <section className="w-full bg-[#ede7de]">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col items-center gap-10 px-4 py-12 sm:px-6 md:px-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:px-10 lg:py-18 xl:gap-24 xl:px-16 xl:py-25 2xl:px-20">
        <div className="relative order-2 min-h-75 w-full overflow-hidden rounded-xl shadow-[0px_24.552px_30.691px_-6.138px_rgba(0,0,0,0.1),0px_9.821px_12.276px_-7.366px_rgba(0,0,0,0.1)] sm:min-h-95 lg:order-1 lg:min-h-130 xl:min-h-175">
          <Image
            src={"/public/seller/cta.svg"}
            alt="Seller preparing packages beside a laptop"
            fill
            unoptimized
            className="object-cover object-[53%_50%]"
          />
          <div className="absolute inset-0 rounded-xl bg-[rgba(240,144,0,0.15)]" />
        </div>

        <div className="order-1 flex min-w-0 flex-col items-center gap-4 text-center sm:gap-5 lg:order-2 xl:gap-6">
          <h2 className="font-[Arial] text-[32px] leading-[1.1] font-bold tracking-[-0.6px] text-black sm:text-[40px] md:text-[44px] xl:text-[48px] xl:tracking-[-0.96px]">
            Ready to get started?
          </h2>
          <p className="max-w-175 font-[Arial] text-[18px] leading-[1.35] text-[#42454d] sm:text-[20px] md:text-[22px] xl:text-[24px] xl:leading-[1.2]">
            Join millions of entrepreneurs who have built successful businesses with us
          </p>
          <Link
            href="/register/vendor"
            className="mt-2 flex h-12 w-full max-w-52.75 items-center justify-center rounded-xs border border-[#f09000] bg-[#f09000] px-4 py-3 font-sans text-[16px] leading-[1.2] text-black"
          >
            Start selling today
          </Link>
        </div>
      </div>
    </section>
  );
}
