import Image from "next/image";

function Tile({
  src,
  alt,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-white ${className}`}>
      <Image src={src} alt={alt} fill unoptimized className={imageClassName ?? "object-cover"} />
    </div>
  );
}

export default function SellerStoreShowcase() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col items-center gap-10 px-4 py-12 sm:px-6 md:px-8 lg:gap-12 lg:px-10 lg:py-18 xl:gap-16 xl:px-16 xl:py-25 2xl:px-20">
        <div className="flex flex-col items-center gap-4 text-center not-italic sm:gap-5 xl:gap-6">
          <h2 className="font-[Arial] text-[32px] leading-[1.1] font-bold tracking-[-0.6px] text-black sm:text-[40px] md:text-[44px] xl:text-[48px] xl:tracking-[-0.96px]">
            Everything You Need to Run Your Store
          </h2>
          <p className="max-w-220 font-[Arial] text-[18px] leading-[1.35] text-[#4a5565] sm:text-[20px] md:text-[22px] xl:text-[24px] xl:leading-[1.2]">
            Get a overview of our platform, tools and user experinces
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Tile
              src={"/public/seller/showcase1.svg"}
              alt="Laptop showing storefront interface"
              className="h-70 sm:h-90 xl:h-195"
              imageClassName="object-cover object-[54%_50%]"
            />
            <Tile
              src={"/public/seller/showcase5.svg"}
              alt="Courier with yellow delivery backpack"
              className="h-70 sm:h-90 xl:h-195"
              imageClassName="object-cover"
            />
          </div>

          <div className="grid gap-4 md:grid-rows-3 xl:h-[1576px]">
            <Tile
              src={"/public/seller/showcase2.svg"}
              alt="Desktop analytics dashboard"
              className="h-70 sm:h-80 md:h-full"
              imageClassName="object-cover object-left"
            />
            <Tile
              src={"/public/seller/showcase4.svg"}
              alt="Tablet commerce management screen"
              className="h-70 sm:h-80 md:h-full"
              imageClassName="object-cover object-center"
            />
            <Tile
              src={"/public/seller/showcase6.svg"}
              alt="Stacked shipping boxes"
              className="h-70 sm:h-80 md:h-full"
              imageClassName="object-cover"
            />
          </div>

          <div className="flex flex-col gap-4 md:col-span-2 xl:col-span-1">
            <Tile
              src={"/public/seller/showcase3.svg"}
              alt="Customer receiving package"
              className="h-70 sm:h-90 xl:h-195"
              imageClassName="object-cover object-[36%_50%]"
            />
            <Tile
              src={"/public/seller/showcase7.svg"}
              alt="Tablet with seller management dashboard"
              className="h-70 sm:h-90 xl:h-195"
              imageClassName="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
