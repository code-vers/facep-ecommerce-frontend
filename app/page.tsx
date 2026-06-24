/**
 * @fileoverview Homepage — Universal ProductCard component showcase.
 *
 * Demonstrates every card variant found across the Facep Figma designs:
 *   - (Product Page)
 *   - (Today's Deals Page)
 *
 * Must be a Client Component because it passes event handler callbacks
 * (onAddToCart, onSeeOptions, onExploreMore) to the ProductCard Client
 * Component as props.
 *
 * @module app/page
 */

'use client';

import ProductCard from '@/components/shared/ProductCard';

/** Placeholder image — Figma MCP dev server (development only). */
const IMG = 'http://localhost:3845/assets/b253b57946a2618040d5a77f7371f8c00e754a22.png';

export default function Home() {
  return (
    <main className='min-h-screen bg-[#F4F4F5] px-4 py-12 sm:px-6 lg:px-10'>
      <div className='mx-auto max-w-[1760px] space-y-14'>
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div>
          <h1 className='mb-2 text-[28px] font-bold text-black'>
            ProductCard — Universal Component Showcase
          </h1>
          <p className='text-[14px] text-[#42454D]'>
            All variants from Figma nodes 2093:4415 (Product Page) and 2064:148 (Today's Deals
            Page).
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
         * VARIANT 1 — Standard (Offer Text + "Add To Cart")
         * Source: node 2093-4415, standard product row cards
         * Body: fixed 188px height, button anchored to bottom
         * ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby='v1'>
          <h2
            id='v1'
            className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'
          >
            Variant 1 — Standard (Offer Text + Add To Cart)
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Setup'
              title='Gaming Setup'
              rating={4.5}
              reviewCount='624+'
              price='$299.99'
              offerText='Up to 30% off'
              shippingText='$36 Shipping'
              buttonVariant='add-to-cart'
              onAddToCart={() => console.log('add')}
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Office Chair'
              title='Office Chair'
              rating={4.7}
              reviewCount='320+'
              price='$199.99'
              offerText='Free Shipping on orders over $50'
              shippingText='$36 Shipping'
              buttonVariant='add-to-cart'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Mechanical Keyboard'
              title='Mechanical Keyboard'
              rating={4.8}
              reviewCount='1,200+'
              price='$89.99'
              offerText='20% off for first-time buyers'
              shippingText='$36 Shipping'
              buttonVariant='add-to-cart'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Monitor Stand'
              title='Monitor Stand'
              rating={4.6}
              reviewCount='150+'
              price='$49.99'
              offerText='Buy one, get one 50% off'
              shippingText='$36 Shipping'
              buttonVariant='add-to-cart'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Mouse'
              title='Gaming Mouse'
              rating={4.5}
              reviewCount='500+'
              price='$59.99'
              offerText='10% off with newsletter signup'
              shippingText='$36 Shipping'
              buttonVariant='add-to-cart'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Headset'
              title='Headset with Microphone'
              rating={4.4}
              reviewCount='800+'
              price='$79.99'
              offerText='No offers Right now'
              shippingText='$36 Shipping'
              buttonVariant='add-to-cart'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Webcam'
              title='Webcam'
              rating={4.3}
              reviewCount='400+'
              price='$99.99'
              offerText='Free shipping on orders over $100'
              shippingText='Free delivery'
              buttonVariant='add-to-cart'
            />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
         * VARIANT 2 — Flash Deal (Badge + "Add To Cart")
         * Source: node 2093-4415, flash deal product cards
         * Badge row replaces the offer text slot
         * ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby='v2'>
          <h2
            id='v2'
            className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'
          >
            Variant 2 — Flash Deal (Badge + Add To Cart)
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            {Array.from({ length: 7 }, (_, i) => (
              <ProductCard
                key={i}
                imageSrc={IMG}
                imageAlt='Gaming Setup'
                title='Gaming Setup'
                rating={4.5}
                reviewCount='624+'
                price='$299.99'
                badgeText='46% off'
                badgeLabel='Limited time offer'
                shippingText='$36 Shipping'
                buttonVariant='add-to-cart'
                onAddToCart={() => console.log('flash add')}
              />
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
         * VARIANT 3 — See Options Button
         * Source: node 2093-4415, products with multiple SKUs
         * ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby='v3'>
          <h2
            id='v3'
            className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'
          >
            Variant 3 — See Options Button
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Setup'
              title='Gaming Setup'
              rating={4.5}
              reviewCount='624+'
              price='$299.99'
              offerText='No offers Right now'
              shippingText='$36 Shipping'
              buttonVariant='see-options'
              onSeeOptions={() => console.log('see options')}
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Setup'
              title='Gaming Setup'
              rating={4.5}
              reviewCount='624+'
              price='$299.99'
              offerText='No offers Right now'
              shippingText='$36 Shipping'
              buttonVariant='see-options'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Setup'
              title='Gaming Setup'
              rating={4.5}
              reviewCount='624+'
              price='$299.99'
              badgeText='46% off'
              badgeLabel='Limited time offer'
              shippingText='$36 Shipping'
              buttonVariant='see-options'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Setup'
              title='Gaming Setup'
              rating={4.5}
              reviewCount='624+'
              price='$299.99'
              badgeText='46% off'
              badgeLabel='Limited time offer'
              shippingText='$36 Shipping'
              buttonVariant='see-options'
            />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
         * VARIANT 4 — Hot Deal Card (Badge + Dual Price, NO button, NO stars)
         * Source: node 2064-148 "Hot Deals Today" section
         * Body: auto height — no whitespace gap at bottom
         * ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby='v4'>
          <h2
            id='v4'
            className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'
          >
            Variant 4 — Hot Deal (Badge + Dual Price, No Button, No Stars)
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
            <ProductCard
              imageSrc={IMG}
              imageAlt='VR Headset'
              title='VR Headset'
              badgeText='25% off'
              badgeLabel='Offer Expires Soon'
              price='$249.99'
              originalPrice='$399.99'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Ergonomic Mouse'
              title='Ergonomic Mouse'
              badgeText='30% off'
              badgeLabel='Offer Expires Soon'
              price='$39.99'
              originalPrice='$59.99'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Smart Watch'
              title='Smart Watch'
              badgeText='15% off'
              badgeLabel='Offer Expires Soon'
              price='$79.99'
              originalPrice='$99.99'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Keyboard'
              title='Gaming Keyboard'
              badgeText='20% off'
              badgeLabel='Offer Expires Soon'
              price='$69.99'
              originalPrice='$89.99'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Curved Monitor'
              title='Curved Monitor'
              badgeText='35% off'
              badgeLabel='Offer Expires Soon'
              price='$279.99'
              originalPrice='$429.99'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Wireless Mouse'
              title='Wireless Mouse'
              badgeText='10% off'
              badgeLabel='Offer Expires Soon'
              price='$29.99'
              originalPrice='$44.99'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Laptop'
              title='Gaming Laptop'
              badgeText='40% off'
              badgeLabel='Offer Expires Soon'
              price='$899.99'
              originalPrice='$1,299.99'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming PC'
              title='Gaming PC'
              badgeText='50% off'
              badgeLabel='Offer Expires Soon'
              price='$999.99'
              originalPrice='$1,499.99'
              buttonVariant='none'
            />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
         * VARIANT 5 — Product Listing Card ("Explore More" text link)
         * Source: node 2064-148 product listing section (below filters)
         * Body: auto height, badge + stars + dual price + "Explore More →"
         * ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby='v5'>
          <h2
            id='v5'
            className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'
          >
            Variant 5 — Product Listing (Badge + Dual Price + "Explore More →")
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'>
            {Array.from({ length: 7 }, (_, i) => (
              <ProductCard
                key={i}
                imageSrc={IMG}
                imageAlt='Gaming Setup'
                title='Gaming Setup'
                badgeText='46% off'
                badgeLabel='Limited time offer'
                rating={4.5}
                reviewCount='624+'
                price='$199.99'
                originalPrice='$299.99'
                buttonVariant='explore-more'
                onExploreMore={() => console.log('explore more')}
              />
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
         * VARIANT 6 — Browsing History Card (No Button)
         * Source: node 2064-148 "Inspired by your browsing history" section
         * Body: auto height — content only, no button whitespace
         * ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby='v6'>
          <h2
            id='v6'
            className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'
          >
            Variant 6 — Browsing History (Stars + Offer, No Button)
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Setup'
              title='Gaming Setup'
              rating={4.5}
              reviewCount='624+'
              price='$299.99'
              offerText='Up to 30% off'
              shippingText='$36 Shipping'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Office Chair'
              title='Office Chair'
              rating={4.7}
              reviewCount='320+'
              price='$199.99'
              offerText='Free Shipping on orders over $50'
              shippingText='$36 Shipping'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Mechanical Keyboard'
              title='Mechanical Keyboard'
              rating={4.8}
              reviewCount='1,200+'
              price='$89.99'
              offerText='20% off for first-time buyers'
              shippingText='$36 Shipping'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Monitor Stand'
              title='Monitor Stand'
              rating={4.6}
              reviewCount='150+'
              price='$49.99'
              offerText='Buy one, get one 50% off'
              shippingText='$36 Shipping'
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Mouse'
              title='Gaming Mouse'
              rating={4.5}
              reviewCount='500+'
              price='$59.99'
              offerText='10% off with newsletter signup'
              shippingText='$36 Shipping'
              buttonVariant='none'
            />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
         * VARIANT 7 — Category Tile (Title + Arrow, Ultra-compact body)
         * Source: node 2064-148 "Shop deals by category" section
         * Body: auto height — image + minimal 42px footer
         * ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby='v7'>
          <h2
            id='v7'
            className='mb-4 text-[12px] font-bold uppercase tracking-widest text-[#42454D]'
          >
            Variant 7 — Category Tile (Title + Arrow, No Button)
          </h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8'>
            <ProductCard
              imageSrc={IMG}
              imageAlt='Suits & Blazers'
              title='Suits & Blazers'
              showArrow
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Gaming Controller'
              title='Gaming controller'
              showArrow
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='T-Shirts'
              title='T-Shirts'
              showArrow
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Jeans'
              title='Jeans'
              showArrow
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Sneakers'
              title='Sneakers'
              showArrow
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Wallets'
              title='Wallets'
              showArrow
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Belts'
              title='Belts'
              showArrow
              buttonVariant='none'
            />
            <ProductCard
              imageSrc={IMG}
              imageAlt='Hats'
              title='Hats'
              showArrow
              buttonVariant='none'
            />
          </div>
        </section>
      </div>
    </main>
  );
}
