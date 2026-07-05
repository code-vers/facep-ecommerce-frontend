import Image from "next/image";
import Link from "next/link";

export default function SellerHero() {
  return (
    <section className="w-full bg-[linear-gradient(180deg,#ff9900_0%,#ffcc80_36.84%,#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col-reverse items-center gap-10 px-4 py-12 sm:px-6 md:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:px-10 lg:py-18 xl:gap-24 xl:px-16 xl:py-25 2xl:px-20">
        <div className="flex w-full flex-col items-start gap-8 lg:gap-12">
          <div className="flex flex-col items-start gap-4 sm:gap-5 xl:gap-6 not-italic">
            <h1 className="max-w-175 font-[Arial] text-[34px] leading-[1.02] font-bold tracking-[-1px] text-black sm:text-[46px] sm:tracking-[-1.3px] md:text-[54px] xl:text-[64px] xl:tracking-[-1.92px]">
              Are You a seller?
              <br />
              Create your account,
              <br />
              and start selling
            </h1>
            <p className="max-w-155 font-[Arial] text-[18px] leading-[1.35] text-[#4a5565] sm:text-[20px] md:text-[22px] xl:text-[24px] xl:leading-[1.2]">
              Reach millions of customers and grow your business with Amazon
            </p>
          </div>

          <Link
            href="/register/vendor"
            className="flex h-12 w-full max-w-52.75 items-center justify-center rounded-xs border border-[#f09000] bg-[#f09000] px-4 py-3 text-[16px] leading-[1.2] font-normal text-black"
          >
            Create Account
          </Link>
        </div>

        <div className="relative min-h-70 w-full overflow-hidden rounded-xl shadow-[115px_110px_45px_0px_rgba(0,0,0,0),74px_70px_41px_0px_rgba(0,0,0,0.01),41px_40px_34px_0px_rgba(0,0,0,0.05),18px_18px_25px_0px_rgba(0,0,0,0.09),5px_4px_14px_0px_rgba(0,0,0,0.1)] sm:min-h-90 md:min-h-110 xl:min-h-191">
          <Image
            src={"/public/seller/hero.svg"}
            alt="Seller packing products while using a phone beside a laptop"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
