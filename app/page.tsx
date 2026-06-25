/**
 * @fileoverview Homepage — Universal ProductCard component showcase.
 * @module app/page
 */

'use client';

import ProductCard from '@/components/shared/ProductCard';

const IMG = 'http://localhost:3845/assets/b253b57946a2618040d5a77f7371f8c00e754a22.png';

export default function Home() {
  return (
    <main className='min-h-screen bg-[#F4F4F5] px-4 py-12 sm:px-6 lg:px-10'>
      <div className='mx-auto max-w-[1760px] space-y-14'>
        <div>
          <h1 className='mb-2 text-[28px] font-bold text-black'>ProductCard — Universal Component Showcase</h1>
          <p className='text-[14px] text-[#42454D]'>All variants from Figma nodes 2093:4415 and 2064:148.</p>
        </div>
        <section aria-labelledby='v1'>
          <h2 id='v1' className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'>Variant 1 — Standard (Offer Text + Add To Cart)</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            {['Gaming Setup','Office Chair','Mechanical Keyboard','Monitor Stand','Gaming Mouse','Headset with Microphone','Webcam'].map((title, i) => (
              <ProductCard key={i} imageSrc={IMG} imageAlt={title} title={title} rating={4.5} reviewCount='624+' price='$299.99' offerText='Up to 30% off' shippingText='$36 Shipping' buttonVariant='add-to-cart' onAddToCart={() => console.log('add')} />
            ))}
          </div>
        </section>
        <section aria-labelledby='v2'>
          <h2 id='v2' className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'>Variant 2 — Flash Deal (Badge + Add To Cart)</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            {Array.from({ length: 7 }, (_, i) => (
              <ProductCard key={i} imageSrc={IMG} imageAlt='Gaming Setup' title='Gaming Setup' rating={4.5} reviewCount='624+' price='$299.99' badgeText='46% off' badgeLabel='Limited time offer' shippingText='$36 Shipping' buttonVariant='add-to-cart' />
            ))}
          </div>
        </section>
        <section aria-labelledby='v3'>
          <h2 id='v3' className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'>Variant 3 — See Options Button</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCard key={i} imageSrc={IMG} imageAlt='Gaming Setup' title='Gaming Setup' rating={4.5} reviewCount='624+' price='$299.99' offerText='No offers Right now' shippingText='$36 Shipping' buttonVariant='see-options' />
            ))}
          </div>
        </section>
        <section aria-labelledby='v4'>
          <h2 id='v4' className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'>Variant 4 — Hot Deal (Badge + Dual Price, No Button)</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
            {['VR Headset','Ergonomic Mouse','Smart Watch','Gaming Keyboard','Curved Monitor','Wireless Mouse','Gaming Laptop','Gaming PC'].map((title, i) => (
              <ProductCard key={i} imageSrc={IMG} imageAlt={title} title={title} badgeText='25% off' badgeLabel='Offer Expires Soon' price='$249.99' originalPrice='$399.99' buttonVariant='none' />
            ))}
          </div>
        </section>
        <section aria-labelledby='v5'>
          <h2 id='v5' className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'>Variant 5 — Product Listing (Badge + Dual Price + &quot;Explore More →&quot;)</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            {Array.from({ length: 7 }, (_, i) => (
              <ProductCard key={i} imageSrc={IMG} imageAlt='Gaming Setup' title='Gaming Setup' badgeText='46% off' badgeLabel='Limited time offer' rating={4.5} reviewCount='624+' price='$199.99' originalPrice='$299.99' buttonVariant='explore-more' />
            ))}
          </div>
        </section>
        <section aria-labelledby='v6'>
          <h2 id='v6' className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'>Variant 6 — Browsing History (Stars + Offer, No Button)</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
            {['Gaming Setup','Office Chair','Mechanical Keyboard','Monitor Stand','Gaming Mouse'].map((title, i) => (
              <ProductCard key={i} imageSrc={IMG} imageAlt={title} title={title} rating={4.5} reviewCount='624+' price='$299.99' offerText='Up to 30% off' shippingText='$36 Shipping' buttonVariant='none' />
            ))}
          </div>
        </section>
        <section aria-labelledby='v7'>
          <h2 id='v7' className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'>Variant 7 — Category Tile (Title + Arrow, No Button)</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
            {['Suits & Blazers','Gaming controller','T-Shirts','Jeans','Sneakers','Wallets','Belts','Hats'].map((title, i) => (
              <ProductCard key={i} imageSrc={IMG} imageAlt={title} title={title} showArrow buttonVariant='none' />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
