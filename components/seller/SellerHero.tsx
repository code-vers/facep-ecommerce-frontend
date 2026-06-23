import Image from "next/image";

export default function SellerHero() {
  return (
    <section className="w-full bg-[linear-gradient(180deg,#ff9900_0%,#ffcc80_36.84%,#ffffff_100%)]">
      <div className="mx-auto flex min-h-207 w-full items-center justify-center gap-24 px-20 py-25">
        <div className="flex shrink-0 flex-col items-start gap-12">
          <div className="flex flex-col items-start gap-6 not-italic">
            <h1 className="w-173.5 font-[Arial] text-[64px] leading-none font-bold tracking-[-1.92px] text-black">
              Are You a seller?
              <br />
              Create your account,
              <br />
              and start selling
            </h1>
            <p className="font-[Arial] text-[24px] leading-[1.2] text-[#4a5565]">
              Reach millions of customers and grow your business with Amazon
            </p>
          </div>

          <button
            type="button"
            className="flex h-12 w-52.75 items-center justify-center rounded-xs border border-[#f09000] bg-[#f09000] px-4 py-3 text-[16px] leading-[1.2] font-normal text-black"
          >
            Create Account
          </button>
        </div>

        <div className="relative h-191 min-w-0 flex-1 overflow-hidden rounded-xl shadow-[115px_110px_45px_0px_rgba(0,0,0,0),74px_70px_41px_0px_rgba(0,0,0,0.01),41px_40px_34px_0px_rgba(0,0,0,0.05),18px_18px_25px_0px_rgba(0,0,0,0.09),5px_4px_14px_0px_rgba(0,0,0,0.1)]">
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
