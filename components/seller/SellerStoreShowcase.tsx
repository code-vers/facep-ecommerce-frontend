import Image from "next/image";

const showcaseImages = {
  leftTop: "https://www.figma.com/api/mcp/asset/a3c5ed63-be0b-4aed-b90c-1484d137e4e6",
  leftBottom: "https://www.figma.com/api/mcp/asset/55895fef-82ec-4e38-b04c-6d6863d66e63",
  middleTop: "https://www.figma.com/api/mcp/asset/dd7e1b54-3298-4f8f-bdbc-50dcefcdfd30",
  middleCenter: "https://www.figma.com/api/mcp/asset/94c303ea-43cc-4f20-b3c8-22debdbfc18c",
  middleBottom: "https://www.figma.com/api/mcp/asset/74be8842-5e9a-41a5-96bd-47fa7ad6a289",
  rightTop: "https://www.figma.com/api/mcp/asset/18872991-8ce2-4e06-8a55-b3548cf9f515",
  rightBottom: "https://www.figma.com/api/mcp/asset/be03a6f6-537c-43e3-80a7-20c91776c217",
};

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
              src={showcaseImages.leftTop}
              alt="Laptop showing storefront interface"
              className="h-195"
              imageClassName="object-cover object-[54%_50%]"
            />
            <Tile
              src={showcaseImages.leftBottom}
              alt="Courier with yellow delivery backpack"
              className="h-195"
              imageClassName="object-cover"
            />
          </div>

          <div className="grid h-[1576px] w-xl shrink-0 grid-rows-3 gap-4">
            <Tile
              src={showcaseImages.middleTop}
              alt="Desktop analytics dashboard"
              className="h-full"
              imageClassName="object-cover object-left"
            />
            <Tile
              src={showcaseImages.middleCenter}
              alt="Tablet commerce management screen"
              className="h-full"
              imageClassName="object-cover object-center"
            />
            <Tile
              src={showcaseImages.middleBottom}
              alt="Stacked shipping boxes"
              className="h-full"
              imageClassName="object-cover"
            />
          </div>

          <div className="flex w-xl shrink-0 flex-col gap-4">
            <Tile
              src={showcaseImages.rightTop}
              alt="Customer receiving package"
              className="h-195"
              imageClassName="object-cover object-[36%_50%]"
            />
            <Tile
              src={showcaseImages.rightBottom}
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
