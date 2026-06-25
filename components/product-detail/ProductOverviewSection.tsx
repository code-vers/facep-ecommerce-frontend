import Image from 'next/image';
import { ExternalLink, MapPin, Star } from 'lucide-react';

const productImages = [
  {
    src: 'https://www.figma.com/api/mcp/asset/946bd927-c3b6-42f8-808a-61bbd9de78c3',
    alt: 'Oraimo AirBuds Pro 2 featured image',
  },
  {
    src: 'https://www.figma.com/api/mcp/asset/55f60a9b-216d-47f9-8eb8-47da5ed087ab',
    alt: 'Oraimo AirBuds Pro 2 front angle',
  },
  {
    src: 'https://www.figma.com/api/mcp/asset/642113e2-a7db-4cc2-a0f0-d6afc10afecb',
    alt: 'Oraimo AirBuds Pro 2 pink variant',
  },
  {
    src: 'https://www.figma.com/api/mcp/asset/b6690be0-dbae-4933-9703-f265954f48e9',
    alt: 'Oraimo AirBuds Pro 2 folded view',
  },
  {
    src: 'https://www.figma.com/api/mcp/asset/41ee1ea5-da0c-4f69-8891-e3d0fe89813c',
    alt: 'Oraimo AirBuds Pro 2 hanging view',
  },
] as const;

const colorOptions = [
  '#F09000',
  '#1F8394',
  '#EAB308',
  '#29941F',
  '#941F21',
  '#86941F',
  '#231F94',
  '#121212',
  '#FBFEFF',
  '#A45496',
  '#989A98',
  '#3DC4C4',
  '#BF97CF',
  '#8B8AA4',
] as const;

const detailPairs = [
  ['Brand', 'Oraimo'],
  ['Ear Placement', 'Over Ear'],
  ['Form Factor', 'Over Ear'],
  ['Impedance', '16 Ohms'],
] as const;

const aboutItems = [
  '110H Ultra-Long Battery Life. Enjoy up to 110 hours of playback on a single charge (65 hours with ANC on). Get up to 4 hours of playtime from just a 5-minute fast charge. Never stop listening with USB audio for wired listening.',
  'Hi-Res Certified Audio. TALIX H30 wireless bluetooth headphones feature 40mm dynamic drivers that deliver crystal-clear clarity and rich sound.',
  'Bass Boost Mode. Feel the deep, resonant bass with enhanced low-frequency response for richer, punchier sound. Perfect for EDM, hip-hop, and bass-heavy tracks, delivering a more immersive listening experience.',
  'Hybrid Active Noise Cancellation. Powered by advanced ANC technology, the noise-cancelling headphones actively detect and reduce background noise across a wide range of environments, helping filter out up to 90% of ambient sound.',
  'Crystal Clear Calls. Equipped with a 2-mic ENC algorithm, the over-ear headphones accurately capture your voice while reducing background noise so you sound clear and natural on every call.',
  'Lightweight Comfort. Crafted with ultra-soft premium protein leather, slow-rebound memory foam, and an ergonomic design for extended listening sessions.',
] as const;

function ProductGallery() {
  return (
    <div className='flex w-full max-w-175 flex-col gap-6 xl:shrink-0'>
      <div className='relative aspect-square w-full overflow-hidden bg-white'>
        <Image
          src={productImages[0].src}
          alt={productImages[0].alt}
          fill
          unoptimized
          className='object-cover'
          sizes='(max-width: 1279px) 100vw, 700px'
        />
      </div>

      <div className='grid w-full grid-cols-4 gap-3'>
        {productImages.slice(1).map((image) => (
          <div key={image.src} className='relative aspect-square overflow-hidden bg-white'>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              unoptimized
              className='object-cover'
              sizes='(max-width: 1279px) 25vw, 166px'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductMeta() {
  return (
    <div className='flex w-full flex-col gap-4 border-b border-[#E5E5E6] pb-4.5'>
      <div className='flex items-center gap-1.75'>
        <p className='text-[16px] leading-[1.2] text-[#165DD0]'>Brand: Oraimo</p>
        <ExternalLink size={18} strokeWidth={1.8} className='text-black' />
      </div>

      <h1 className='font-[Arial] text-[28px] leading-[1.2] font-normal text-[#42454D]'>
        Oraimo AirBuds Pro 2 Earphones
      </h1>

      <div className='flex items-center gap-1.5'>
        <div className='flex items-center gap-px'>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={16}
              strokeWidth={1.6}
              fill='#DEC33A'
              className='text-[#DEC33A]'
            />
          ))}
        </div>
        <p className='text-[12px] leading-[1.3] text-black'>4.7 (4,470) |</p>
        <p className='text-[12px] leading-[1.3] text-[#165DD0]'>67 reviews</p>
      </div>
    </div>
  );
}

function PriceBlock() {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2 font-[Arial] leading-none text-[#42454D]'>
        <p className='text-[28px] leading-[1.2]'>
          <span className='text-[18.06px]'>$</span>
          <span>26</span>
        </p>
        <p className='text-[24px] leading-[1.2] text-[#686F7D] line-through'>
          <span className='text-[15.48px]'>$</span>
          <span>30</span>
        </p>
      </div>
      <p className='text-[14px] leading-[1.3] text-[#848995]'>
        $491.42 Shipping &amp; Import Charges
      </p>
    </div>
  );
}

function ColorPalette() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex items-center gap-[4.831px] text-[16px] text-black'>
        <p className='font-semibold leading-[1.3]'>Color:</p>
        <p className='leading-[1.2]'>Yellow</p>
      </div>

      <div className='flex w-full flex-col gap-1.5'>
        <div className='grid w-full grid-cols-7 gap-1'>
          {colorOptions.slice(0, 7).map((color, index) => (
            <div key={color} className={index === 2 ? 'border border-[#686F7D] p-0.5' : ''}>
              <div className='aspect-square w-full' style={{ backgroundColor: color }} />
            </div>
          ))}
        </div>

        <div className='grid w-full grid-cols-7 gap-1'>
          {colorOptions.slice(7).map((color) => (
            <div
              key={color}
              className='aspect-square w-full border border-black/5'
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailList() {
  return (
    <div className='flex w-full max-w-[186.831px] flex-col gap-4 text-black'>
      <h2 className='text-[22px] leading-[1.2]'>Product details</h2>

      <div className='flex flex-col gap-2 text-[16px]'>
        {detailPairs.map(([label, value]) => (
          <div key={label} className='flex items-center gap-[4.831px]'>
            <p className='font-semibold leading-[1.3]'>{label}:</p>
            <p className='leading-[1.2]'>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <h2 className='text-[22px] leading-[1.2] text-black'>About this item</h2>

      <div className='flex flex-col gap-1.5'>
        <ul className='list-disc pl-5.25 text-[14px] leading-[1.3] text-black'>
          {aboutItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button type='button' className='w-fit text-[12px] leading-[1.3] text-[#165DD0]'>
          See More
        </button>
      </div>
    </div>
  );
}

function PurchaseCard() {
  return (
    <aside className='flex w-full max-w-[453.75px] flex-col gap-6 border border-[#E5E5E6] bg-[#F2F2F3] p-6 xl:shrink-0'>
      <p className='font-[Arial] text-[28px] leading-[1.2] text-[#42454D]'>
        <span className='text-[18.06px]'>$</span>
        <span>26</span>
      </p>

      <div className='flex flex-col gap-3'>
        <p className='text-[18px] leading-[1.2] text-black'>Expected delivery : 6-9 October.</p>

        <div className='flex items-center gap-2'>
          <MapPin size={24} strokeWidth={1.75} className='text-black' />
          <p className='text-[18px] leading-[1.2] text-black'>Delivery to Canada</p>
          <button type='button' className='text-[16px] leading-[1.2] text-[#165DD0]'>
            Change location
          </button>
        </div>
      </div>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex flex-col gap-3 text-[18px] leading-[1.2]'>
          <div className='flex items-center justify-between gap-4'>
            <p className='text-black'>Ships from</p>
            <p className='text-[#42454D]'>Monatik LLC</p>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <p className='text-black'>Sold by</p>
            <p className='text-[#165DD0]'>Monatik LLC</p>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <button
            type='button'
            className='h-12 rounded-xs border border-[#DEC33A] bg-[#DEC33A] text-[16px] leading-[1.2] text-black'
          >
            Buy Now
          </button>
          <button
            type='button'
            className='h-12 rounded-xs border border-[#686F7D] bg-transparent text-[16px] leading-[1.2] text-black'
          >
            Add to Cart
          </button>
        </div>
      </div>
    </aside>
  );
}

function SellerDescription() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex w-full items-center justify-center pb-2.5'>
        <h2 className='w-full text-[22px] leading-[1.2] text-[#171717]'>
          Item description from the seller
        </h2>
      </div>

      <p className='w-full text-[14px] leading-[1.3] text-[#171717]'>
        Immerse yourself in sound with the AuraBuds Pro. Enjoy crystal-clear audio and deep bass,
        perfect for music, podcasts, and calls. With a comfortable and secure fit, these earbuds are
        designed for all-day wear. The AuraBuds Pro are also IPX7 rated for sweat and water
        resistance, making them ideal for workouts and outdoor activities. Stay connected with
        Bluetooth 5.3 for a stable and reliable connection. Plus, the charging case provides up to
        24 hours of playtime, so you can keep the music going all day long.
        <br />
        <br />
        Immerse yourself in sound with the AuraBuds Pro. Enjoy crystal-clear audio and deep bass,
        perfect for music, podcasts, and calls. With a comfortable and secure fit, these earbuds are
        designed for all-day wear. The AuraBuds Pro are also IPX7 rated for sweat and water
        resistance, making them ideal for workouts and outdoor activities. Stay connected with
        Bluetooth 5.3 for a stable and reliable connection. Plus, the charging case provides up to
        24 hours of playtime, so you can keep the music going all day long.
        <br />
        <br />
        Immerse yourself in sound with the AuraBuds Pro. Enjoy crystal-clear audio and deep bass,
        perfect for music, podcasts, and calls. With a comfortable and secure fit, these earbuds are
        designed for all-day wear. The AuraBuds Pro are also IPX7 rated for sweat and water
        resistance, making them ideal for workouts and outdoor activities. Stay connected with
        Bluetooth 5.3 for a stable and reliable connection. Plus, the charging case provides up to
        24 hours of playtime, so you can keep the music going all day long.
      </p>
    </div>
  );
}

export default function ProductOverviewSection() {
  return (
    <section className='w-full'>
      <div className='mx-auto flex max-w-[1920px] flex-col gap-9 px-5 py-8 lg:px-10 xl:px-20 xl:py-12.5'>
        <div className='flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-14'>
          <div className='flex min-w-0 flex-1 flex-col gap-12 xl:flex-row xl:items-start xl:gap-12'>
            <ProductGallery />

            <div className='flex min-w-0 flex-1 flex-col gap-4'>
              <ProductMeta />

              <div className='flex flex-col gap-3'>
                <PriceBlock />

                <div className='flex items-center gap-[4.831px] text-[16px] text-black'>
                  <p className='font-semibold leading-[1.3]'>Size:</p>
                  <p className='leading-[1.2]'>-</p>
                </div>

                <ColorPalette />
              </div>

              <DetailList />
              <AboutSection />
            </div>
          </div>

          <PurchaseCard />
        </div>

        <SellerDescription />
      </div>
    </section>
  );
}
