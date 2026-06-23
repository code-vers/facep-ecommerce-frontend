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
      <div className="flex w-full flex-col items-center gap-16 px-20 py-25">
        <div className="flex flex-col items-center gap-6 text-center not-italic">
          <h2 className="font-[Arial] text-[48px] leading-[1.1] font-bold tracking-[-0.96px] text-black">
            Everything You Need to Run Your Store
          </h2>
          <p className="font-[Arial] text-[24px] leading-[1.2] text-[#4a5565]">
            Get a overview of our platform, tools and user experinces
          </p>
        </div>

        <div className="flex w-[1760px] items-center gap-4">
          <div className="flex w-xl shrink-0 flex-col gap-4">
            <Tile
              src={"/public/seller/showcase1.svg"}
              alt="Laptop showing storefront interface"
              className="h-195"
              imageClassName="object-cover object-[54%_50%]"
            />
            <Tile
              src={"/public/seller/showcase5.svg"}
              alt="Courier with yellow delivery backpack"
              className="h-195"
              imageClassName="object-cover"
            />
          </div>

          <div className="grid h-[1576px] w-xl shrink-0 grid-rows-3 gap-4">
            <Tile
              src={"/public/seller/showcase2.svg"}
              alt="Desktop analytics dashboard"
              className="h-full"
              imageClassName="object-cover object-left"
            />
            <Tile
              src={"/public/seller/showcase4.svg"}
              alt="Tablet commerce management screen"
              className="h-full"
              imageClassName="object-cover object-center"
            />
            <Tile
              src={"/public/seller/showcase6.svg"}
              alt="Stacked shipping boxes"
              className="h-full"
              imageClassName="object-cover"
            />
          </div>

          <div className="flex w-xl shrink-0 flex-col gap-4">
            <Tile
              src={"/public/seller/showcase3.svg"}
              alt="Customer receiving package"
              className="h-195"
              imageClassName="object-cover object-[36%_50%]"
            />
            <Tile
              src={"/public/seller/showcase7.svg"}
              alt="Tablet with seller management dashboard"
              className="h-195"
              imageClassName="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
