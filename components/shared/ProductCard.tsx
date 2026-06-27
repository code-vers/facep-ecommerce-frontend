/**
 * @fileoverview Universal Product Card component.
 *
 * Implements all product card variants found across the Facep e-commerce
 * platform Figma designs. This is the single reusable card component to be
 * used across product listings, carousels, hot-deal grids, category tiles,
 * and browsing-history sections.
 *
 * Design tokens (extracted from Figma nodes 2093-4415 & 2064-148):
 *   - Card border:         #E5E5E6, radius 4px
 *   - Image area:          180px height, top-corner radius 4px
 *   - Content padding:     8px horizontal, 12px vertical (py-3)
 *   - Category title:      14px Open Sans Regular, #165DD0
 *   - Star icons:          12px, fill/stroke #F09000
 *   - Rating count:        12px, #4A5565
 *   - Sale price:          18px, line-height 1.2, #000000
 *   - Original price:      14px, line-through, #42454D
 *   - Offer text (green):  12px, #229A4E
 *   - Shipping text:       12px, #42454D
 *   - Badge chip:          bg #DEC33A, radius 2px, px 10px, py 2px
 *   - Badge label:         12px Open Sans Bold, #DEC33A
 *   - CTA button:          bg #DEC33A, border #DEC33A, radius 2px, h 32px
 *   - Text link:           14px, #165DD0, with ArrowRight icon 12px
 *   - Category arrow:      16px ArrowRight, #165DD0
 *
 * @module components/shared/ProductCard
 */

'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Star, Heart } from 'lucide-react';
import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Controls which call-to-action element is rendered at the bottom of the card.
 *
 * - `"add-to-cart"`  – Full-width yellow button labelled "Add To Cart".
 * - `"see-options"`  – Full-width yellow button labelled "See Options"; used
 *                      when a product has multiple variants requiring selection.
 * - `"explore-more"` – Inline text link "Explore More →" (used in product
 *                      listing / deals pages). Renders no background button.
 * - `"none"`         – No action rendered. The card body shrinks to fit
 *                      content naturally — no white-space gap at the bottom.
 */
export type ProductCardButtonVariant = 'add-to-cart' | 'see-options' | 'explore-more' | 'none';

/**
 * Props for the {@link ProductCard} component.
 *
 * All optional fields degrade gracefully — omitting them hides that section
 * without affecting the surrounding layout.
 */
export interface ProductCardProps {
  // ── Image ────────────────────────────────────────────────────────────────

  /** Absolute or relative URL of the product thumbnail image. */
  imageSrc: string;

  /**
   * Accessible alt text for the product image.
   * Should describe the product clearly for screen readers.
   */
  imageAlt: string;

  // ── Identity ─────────────────────────────────────────────────────────────

  /**
   * Product name / category label displayed as blue link-style text at the
   * top of the card body.
   *
   * @example "Gaming Setup" | "Office Chair" | "Suits & Blazers"
   */
  title: string;

  /**
   * When `true`, an arrow-right icon is rendered inline after the title.
   * Used exclusively for category cards (e.g. "Suits & Blazers →").
   *
   * @defaultValue false
   */
  showArrow?: boolean;

  // ── Rating ───────────────────────────────────────────────────────────────

  /**
   * Numeric star rating between 0–5. Supports fractional values (half-stars).
   * When omitted, the star rating row is not rendered at all.
   * @example 4.5
   */
  rating?: number;

  /**
   * Formatted review count displayed beside the star row.
   * Only rendered when `rating` is also provided.
   * @example "624+" | "1,200+"
   */
  reviewCount?: string;

  // ── Pricing ──────────────────────────────────────────────────────────────

  /**
   * Formatted sale / current price string including the currency symbol.
   * When omitted, no price row is rendered.
   * @example "$199.99"
   */
  price?: string;

  /**
   * Optional original (before-discount) price to display as a strikethrough
   * beside the sale price. Only rendered when `price` is also provided.
   *
   * Figma spec: 14px, line-through, color #42454D.
   * @example "$299.99"
   */
  originalPrice?: string;

  // ── Flash Deal Badge ──────────────────────────────────────────────────────

  /**
   * Short discount text rendered inside the yellow badge chip at the top of
   * the card body.
   *
   * When provided, the badge row replaces the `offerText` line — both
   * compete for the same vertical slot in the card body hierarchy.
   *
   * @example "46% off" | "25% off"
   */
  badgeText?: string;

  /**
   * Secondary label rendered in bold yellow text beside the badge chip.
   * @example "Limited time offer" | "Offer Expires Soon"
   */
  badgeLabel?: string;

  // ── Offer / Promotion ─────────────────────────────────────────────────────

  /**
   * Promotional text rendered below the price row.
   * If `offerTextMuted` is true, it renders in gray (#848995) and forces a 2-line height.
   * Otherwise, it renders in green (#229A4E).
   * Omit when `badgeText` is provided.
   *
   * @example "Up to 30% off" | "No offers Right now"
   */
  offerText?: string;

  /**
   * If true, renders the offerText in a muted gray color and forces it to take up 2 lines of height.
   */
  offerTextMuted?: boolean;

  // ── Shipping ──────────────────────────────────────────────────────────────

  /**
   * Shipping information rendered in muted gray (#42454D).
   * @example "$36 Shipping" | "Free delivery"
   */
  shippingText?: string;

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Determines which call-to-action element is rendered at the bottom.
   * @defaultValue "add-to-cart"
   */
  buttonVariant?: ProductCardButtonVariant;

  /**
   * Callback fired when the "Add To Cart" button is clicked.
   * Only invoked when `buttonVariant === "add-to-cart"`.
   */
  onAddToCart?: () => void;

  /**
   * Callback fired when the "See Options" button is clicked.
   * Only invoked when `buttonVariant === "see-options"`.
   */
  onSeeOptions?: () => void;

  /**
   * Callback fired when the "Explore More" text link is clicked.
   * Only invoked when `buttonVariant === "explore-more"`.
   */
  onExploreMore?: () => void;

  // ── Styling ───────────────────────────────────────────────────────────────

  /** Additional CSS class names merged into the card root element. */
  className?: string;

  /**
   * Whether to show a heart icon on the image (e.g. for wishlist).
   */
  showHeart?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @internal Props for the {@link StarRating} sub-component.
 */
interface StarRatingProps {
  /** Numeric rating value between 0 and 5 (fractional values supported). */
  rating: number;
  /** Total number of stars to render. @defaultValue 5 */
  totalStars?: number;
}

/**
 * @internal
 * Renders a row of star icons reflecting a numeric rating value.
 *
 * Each star is composed of two overlapping Lucide `<Star>` icons:
 *   1. A base empty-outline star rendered in brand orange `#F09000`.
 *   2. A filled star clipped to the fractional fill percentage (0–100%).
 *
 * This dual-layer approach allows precise half-star and fractional rendering
 * without requiring external icon libraries or SVG manipulation.
 *
 * Figma spec: 12×12 px icons, 2 px gap, color `#F09000`.
 *
 * @param props - {@link StarRatingProps}
 */
function StarRating({ rating, totalStars = 5 }: StarRatingProps) {
  return (
    <div
      className='flex items-center gap-[2px]'
      role='img'
      aria-label={`${rating} out of ${totalStars} stars`}
    >
      {Array.from({ length: totalStars }, (_, index) => {
        /**
         * Fractional fill for this star position:
         *   0   = empty star
         *   0–1 = partial (half) star
         *   1   = fully filled star
         */
        const fillAmount = Math.min(1, Math.max(0, rating - index));
        const isFilled = fillAmount >= 1;
        const isPartial = fillAmount > 0 && fillAmount < 1;

        return (
          <span
            key={index}
            className='relative block size-3 shrink-0 overflow-hidden'
            aria-hidden='true'
          >
            {/* Base layer: empty/outline star */}
            <Star
              className='absolute inset-0 size-3 text-[#F09000]'
              strokeWidth={1.5}
              fill='none'
            />

            {/* Fill layer: clipped filled star representing the fill % */}
            {(isFilled || isPartial) && (
              <span
                className='absolute inset-0 overflow-hidden'
                style={{ width: isFilled ? '100%' : `${fillAmount * 100}%` }}
              >
                <Star
                  className='absolute inset-0 size-3 text-[#F09000]'
                  strokeWidth={1.5}
                  fill='#F09000'
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Universal product card component for the Facep e-commerce platform.
 *
 * A single, fully flexible card that covers every layout variant found
 * across Figma pages 2093-4415 (Product Page) and 2064-148 (Today's Deals):
 *
 * | Variant              | Badge | Stars | Price Pair | Action          |
 * |----------------------|-------|-------|------------|-----------------|
 * | Standard             | ❌    | ✅     | ❌          | "Add To Cart"   |
 * | Flash Deal           | ✅    | ✅     | ❌          | "Add To Cart"   |
 * | See Options          | opt   | opt   | opt        | "See Options"   |
 * | Hot Deal             | ✅    | ❌     | ✅          | none            |
 * | Product Listing      | ✅    | ✅     | ✅          | "Explore More →"|
 * | Browsing History     | ❌    | ✅     | ❌          | none            |
 * | Category Tile        | ❌    | ❌     | ❌          | none (arrow)    |
 *
 * @example Standard card:
 * ```tsx
 * <ProductCard
 *   imageSrc="/products/gaming-setup.jpg"
 *   imageAlt="Gaming Setup"
 *   title="Gaming Setup"
 *   rating={4.5}
 *   reviewCount="624+"
 *   price="$299.99"
 *   offerText="Up to 30% off"
 *   shippingText="$36 Shipping"
 *   buttonVariant="add-to-cart"
 *   onAddToCart={() => addToCart(productId)}
 * />
 * ```
 *
 * @example Hot deal card (no stars, dual price, no button):
 * ```tsx
 * <ProductCard
 *   imageSrc="/products/vr-headset.jpg"
 *   imageAlt="VR Headset"
 *   title="VR Headset"
 *   badgeText="25% off"
 *   badgeLabel="Offer Expires Soon"
 *   price="$249.99"
 *   originalPrice="$399.99"
 *   buttonVariant="none"
 * />
 * ```
 *
 * @example Product listing card (deal page, "Explore More" text link):
 * ```tsx
 * <ProductCard
 *   imageSrc="/products/gaming-setup.jpg"
 *   imageAlt="Gaming Setup"
 *   title="Gaming Setup"
 *   badgeText="46% off"
 *   badgeLabel="Limited time offer"
 *   rating={4.5}
 *   reviewCount="624+"
 *   price="$199.99"
 *   originalPrice="$299.99"
 *   buttonVariant="explore-more"
 *   onExploreMore={() => router.push('/products/gaming-setup')}
 * />
 * ```
 *
 * @example Category tile (image + title + arrow, minimal body):
 * ```tsx
 * <ProductCard
 *   imageSrc="/categories/suits.jpg"
 *   imageAlt="Suits & Blazers"
 *   title="Suits & Blazers"
 *   showArrow
 *   buttonVariant="none"
 * />
 * ```
 *
 * @param props - {@link ProductCardProps}
 */
export default function ProductCard({
  imageSrc,
  imageAlt,
  title,
  showArrow = false,
  rating,
  reviewCount,
  price,
  originalPrice,
  badgeText,
  badgeLabel,
  offerText,
  offerTextMuted,
  shippingText,
  buttonVariant = 'add-to-cart',
  onAddToCart,
  onSeeOptions,
  onExploreMore,
  className,
  showHeart = false,
}: ProductCardProps) {
  /**
   * Whether this card has a full-width CTA button at the bottom.
   * When true, the body uses a fixed height (188px) with `justify-between`
   * so the button is always anchored to the bottom edge — matching the Figma
   * spec for the standard product page cards.
   *
   * When false, the body height is auto (content-sized) to prevent white
   * space beneath the last piece of text content.
   */
  const hasFullButton = buttonVariant === 'add-to-cart' || buttonVariant === 'see-options';

  /**
   * Whether the flash-deal badge row should be shown.
   * The badge row always occupies the first slot of the card body, before
   * the title and stars.
   */
  const hasFlashDeal = Boolean(badgeText);

  /**
   * Whether a price row exists — either a single price or a dual
   * sale-price + original-price pair.
   */
  const hasPrice = Boolean(price);

  /**
   * Whether a rating row should be rendered.
   * Requires both `rating` (numeric) and `reviewCount` (string) to be present.
   */
  const hasRating = typeof rating === 'number' && Boolean(reviewCount);

  return (
    <article
      className={cn(
        // ── Structure ─────────────────────────────────────────────────
        'group relative flex h-full w-full flex-col items-start overflow-hidden',
        // ── Border & Background — Figma: border #E5E5E6, radius 4px ──
        'rounded-[4px] border border-[#E5E5E6] bg-white',
        // ── Hover: subtle lift, border emphasis, shadow ──────────────
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5 hover:border-[#CACACE]',
        'hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]',
        'cursor-pointer',
        className,
      )}
    >
      {/* ── Product Image ────────────────────────────────────────────────
       *
       * Figma spec:
       *   - Height: 180px (constant across all card variants)
       *   - Width: 100% of card
       *   - Top corners rounded at 4px to match card border-radius
       *   - object-cover fills the area without distortion
       *
       * `group-hover:scale-105` adds a subtle zoom animation on hover
       * via the `overflow-hidden` clipping on the parent container.
       */}
      <div className='relative h-[180px] w-full shrink-0 overflow-hidden rounded-tl-[4px] rounded-tr-[4px]'>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          unoptimized
          className={cn(
            'object-cover',
            'transition-transform duration-300 ease-out group-hover:scale-105',
          )}
          sizes='(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw'
        />
        {showHeart && (
          <button
            type='button'
            className='absolute bottom-[8px] right-[6px] z-10 flex size-[30px] items-center justify-center rounded-[9999px] bg-[#DEC33A] hover:bg-[#cbb235] transition-colors focus-visible:outline-none'
            aria-label='Add to wishlist'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart size={16} className='text-black' />
          </button>
        )}
      </div>

      {/* ── Card Body ────────────────────────────────────────────────────
       *
       * Layout strategy:
       *   - Cards WITH a full-width button (add-to-cart / see-options):
       *     Fixed 188px height + `justify-between` anchors the button to
       *     the bottom edge — matching the Figma product-page spec.
       *
       *   - Cards WITHOUT a button (none / explore-more / category):
       *     Auto height — shrinks to fit content only. No whitespace gap.
       *
       * Padding: 8px horizontal (px-2), 12px vertical (py-3).
       */}
      <div
        className={cn(
          'flex w-full flex-1 flex-col items-start px-2 py-3',
          hasFullButton ? 'justify-between' : 'justify-start gap-1',
        )}
      >
        {/* ── Content Block ──────────────────────────────────────────────
         * All informational rows stack here. Gap is handled differently:
         * - Full-button cards: gap is implicit via fixed heights
         * - Auto-height cards: explicit `gap-1` on the parent
         */}
        <div className={cn('flex w-full flex-col', hasFullButton ? 'gap-1' : 'gap-1')}>
          {/* Flash Deal Badge Row
           *
           * Shown when `badgeText` is provided.
           *
           * Figma spec:
           *   - Badge chip: bg #DEC33A, radius 2px, px 10px, py 2px
           *   - Badge text: 12px Regular, black
           *   - Label text: 12px Bold, #DEC33A
           *   - Row gap:    10px
           */}
          {hasFlashDeal && (
            <div className='flex items-center gap-[10px]'>
              {/* Yellow badge chip */}
              <span className='flex shrink-0 items-center justify-center overflow-clip rounded-[2px] bg-[#DEC33A] px-[10px] py-[2px]'>
                <span className='whitespace-nowrap text-[12px] font-normal leading-[1.3] text-black'>
                  {badgeText}
                </span>
              </span>

              {/* Optional label beside the badge chip */}
              {badgeLabel && (
                <span className='whitespace-nowrap text-[12px] font-bold leading-[1.3] text-[#DEC33A]'>
                  {badgeLabel}
                </span>
              )}
            </div>
          )}

          {/* Product Title / Category Label
           *
           * Figma spec: 14px Open Sans Regular, color #165DD0.
           * `showArrow` appends an ArrowRight icon for category tiles.
           * `truncate` prevents overflow in narrow grid columns.
           */}
          <div className='flex w-full items-center gap-1'>
            <p className='flex-1 truncate text-[14px] font-normal leading-[1.3] text-[#165DD0]'>
              {title}
            </p>
            {showArrow && (
              <ArrowRight className='shrink-0 text-[#165DD0]' size={16} aria-hidden='true' />
            )}
          </div>

          {/* Star Rating Row
           *
           * Only rendered when both `rating` and `reviewCount` are provided.
           *
           * Figma spec:
           *   - 5 × 12px star icons, gap 2px, color #F09000
           *   - Review count: 12px Regular, #4A5565
           */}
          {hasRating && (
            <div className='flex w-full items-center gap-2'>
              <StarRating rating={rating as number} />
              <span className='whitespace-nowrap text-[12px] font-normal leading-[1.3] text-[#4A5565]'>
                {rating} ({reviewCount})
              </span>
            </div>
          )}

          {/* Price Row
           *
           * Two sub-variants:
           *
           * 1. Single price — `price` only:
           *    Figma spec: 18px Regular, line-height 1.2, #000000.
           *
           * 2. Dual price — `price` + `originalPrice`:
           *    Figma spec: sale price 18px #000000 inline with
           *    original price 14px line-through #42454D.
           *    Both items sit on the same baseline row.
           */}
          {hasPrice && (
            <div className='flex items-baseline gap-[12px]'>
              {/* Sale / current price */}
              <span className='text-[18px] font-normal leading-[1.2] text-black'>{price}</span>

              {/* Original price with strikethrough (deal cards only) */}
              {originalPrice && (
                <span className='text-[14px] font-normal leading-[1.3] text-[#42454D] line-through'>
                  {originalPrice}
                </span>
              )}
            </div>
          )}

          {/* Offer / Promotion Text
           *
           * Hidden when `badgeText` is present.
           * If `offerTextMuted` is true, renders gray and forces 2 lines.
           */}
          {!hasFlashDeal && offerText && (
            <div className={cn('text-[12px] font-normal leading-[1.3] w-full', offerTextMuted ? 'text-[#848995]' : 'text-[#229A4E] line-clamp-2')}>
              {offerTextMuted ? (
                <>
                  <p className="mb-0">{offerText}</p>
                  <p>&#8203;</p>
                </>
              ) : (
                offerText
              )}
            </div>
          )}

          {/* Shipping Information
           *
           * Figma spec: 12px Regular, color #42454D (text-weak muted gray).
           */}
          {shippingText && (
            <p className='text-[12px] font-normal leading-[1.3] text-[#42454D]'>{shippingText}</p>
          )}

          {/* "Explore More" Text Link
           *
           * Used in product listing / today's deals pages as an alternative
           * to a full-width button. Renders inline with an ArrowRight icon.
           *
           * Figma spec (node 2065:951):
           *   - Text: 14px Regular, #165DD0
           *   - Arrow icon: 12px ArrowRight, #165DD0
           *   - No background; sits flush at the bottom of the content block
           */}
          {buttonVariant === 'explore-more' && (
            <button
              type='button'
              onClick={onExploreMore}
              className={cn(
                'mt-1 flex items-center gap-1',
                'text-[14px] font-normal leading-[1.3] text-[#165DD0]',
                'transition-opacity duration-150 hover:opacity-75',
                'focus-visible:outline-none focus-visible:ring-1',
                'focus-visible:ring-[#165DD0] focus-visible:ring-offset-1',
              )}
              aria-label={`Explore more about ${title}`}
            >
              <span>Explore More</span>
              <ArrowRight size={12} aria-hidden='true' />
            </button>
          )}
        </div>

        {/* ── Full-Width CTA Button (Add To Cart / See Options)
         *
         * Only rendered for full-button variants. Anchored to the bottom
         * of the 188px body via `justify-between` on the parent.
         *
         * Figma spec:
         *   - Width:       100% of card (minus 8px padding each side)
         *   - Height:      32px
         *   - Background:  #DEC33A
         *   - Border:      1px solid #DEC33A
         *   - Radius:      2px
         *   - Typography:  12px Regular, black
         */}
        {hasFullButton && (
          <button
            type='button'
            onClick={buttonVariant === 'add-to-cart' ? onAddToCart : onSeeOptions}
            className={cn(
              'flex w-full items-center justify-center',
              // Figma: h 32px, radius 2px
              'h-8 rounded-[2px] text-[12px] font-normal leading-[1.3] text-black',
              // Variant specific styles
              buttonVariant === 'add-to-cart'
                ? 'border border-[#DEC33A] bg-[#DEC33A] transition-colors duration-150 hover:bg-[#C9B034] hover:border-[#C9B034] active:bg-[#B49A2E] active:border-[#B49A2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC33A] focus-visible:ring-offset-1'
                : 'border-[0.75px] border-[#686F7D] bg-white transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5E5E6] focus-visible:ring-offset-1',
            )}
            aria-label={
              buttonVariant === 'add-to-cart' ? `Add ${title} to cart` : `See options for ${title}`
            }
          >
            {buttonVariant === 'add-to-cart' ? 'Add To Cart' : 'See Options'}
          </button>
        )}
      </div>
    </article>
  );
}
