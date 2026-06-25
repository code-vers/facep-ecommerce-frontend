import { StaticImageData } from 'next/image';
import img from './../public/banner.png'
export interface CategoryItem {
  label: string;
  imageSrc: string;
}

export interface CategoryGridData {
  id: string;
  title: string;
  items: CategoryItem[];
  exploreLabel?: string;
  exploreHref: string;
}

export interface CarouselProduct {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  rating?: number;
  reviewCount?: string;
  price?: string;
  originalPrice?: string;
  badgeText?: string;
  badgeLabel?: string;
  offerText?: string;
  shippingText?: string;
}

// ── Hero Banner Slides ────────────────────────────────────────────────────────
export interface HeroSlide {
  title: string;
  subtitle: string;
  imageSrc: StaticImageData | string;
  bgColor: string;
  imageFit?: 'cover' | 'contain';
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Get the best deals in",
    subtitle: "Home, Kitchen & outdoor Appliances",
    imageSrc: img,
    bgColor: "bg-gradient-to-b from-[#ebaf0a] to-[#F4F4F5] via-[#f5d784] via-[38.46%]",
    imageFit: "contain",
  },
  {
    title: "Upgrade your lifestyle with",
    subtitle: "Premium Living Room Furniture",
    imageSrc: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    bgColor: "bg-gradient-to-b from-[#3a8bde] to-[#F4F4F5] via-[#8ec3f5] via-[38.46%]",
    imageFit: "cover",
  },
];

// ── Category Grids Data ──────────────────────────────────────────────────────
export const CATEGORY_GRIDS_1: CategoryGridData[] = [
  {
    id: "revamp-home",
    title: "Revamp your home in style",
    exploreHref: "/products?category=lighting",
    items: [
      {
        label: "Chandeliers",
        imageSrc: "https://images.unsplash.com/photo-1543242594-c77a443519c0?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "String Lights",
        imageSrc: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Lighting solutions",
        imageSrc: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Lamps",
        imageSrc: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "decorate-style",
    title: "Decorate with Style",
    exploreHref: "/products?category=decor",
    items: [
      {
        label: "String Art",
        imageSrc: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Vase",
        imageSrc: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Photo Frame",
        imageSrc: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Show Piece",
        imageSrc: "https://images.unsplash.com/photo-1534349762230-e0add2c44f7b?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "illuminate-space",
    title: "Illuminate Your Space",
    exploreHref: "/products?category=smart-lighting",
    items: [
      {
        label: "Smart Home Devices",
        imageSrc: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Outdoor Essentials",
        imageSrc: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "LED Bulbs",
        imageSrc: "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Ambient Decor",
        imageSrc: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "upgrade-home",
    title: "Upgrade Your Home Today",
    exploreHref: "/products?category=appliances",
    items: [
      {
        label: "Ceiling Fans",
        imageSrc: "https://images.unsplash.com/photo-1618955036643-f1a40237f397?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Wall Decor",
        imageSrc: "https://images.unsplash.com/photo-1534349762230-e0add2c44f7b?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Under Cabinet Storage",
        imageSrc: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Utensils",
        imageSrc: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
];

export const CATEGORY_GRIDS_2: CategoryGridData[] = [
  {
    id: "kitchen-appliances",
    title: "Top categories in Kitchen appliances",
    exploreHref: "/products?category=kitchen",
    items: [
      {
        label: "Cookware sets",
        imageSrc: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Small appliances",
        imageSrc: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Kitchen gadgets",
        imageSrc: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Dinnerware",
        imageSrc: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "fathers-day",
    title: "Shop Father's Day deals",
    exploreHref: "/products?deals=fathers-day",
    items: [
      {
        label: "Pins",
        imageSrc: "https://images.unsplash.com/photo-1590579491410-67ff7bf0225b?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Ties",
        imageSrc: "https://images.unsplash.com/photo-1589756823851-ede1bf1da6f2?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Formal Shirts",
        imageSrc: "https://images.unsplash.com/photo-1620012253295-c05518e993be?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Tshirts",
        imageSrc: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "fashion-trends",
    title: "Fashion trends you like",
    exploreHref: "/products?category=fashion",
    items: [
      {
        label: "Formal Dress",
        imageSrc: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Casual Dress",
        imageSrc: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Party Dress",
        imageSrc: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Summer Dress",
        imageSrc: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "game-on",
    title: "Get your game on",
    exploreHref: "/products?category=gaming-accessories",
    items: [
      {
        label: "Gaming Keyboards",
        imageSrc: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Posters",
        imageSrc: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Controllers",
        imageSrc: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Headsets",
        imageSrc: "https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
];

export const CATEGORY_GRIDS_3: CategoryGridData[] = [
  {
    id: "gaming-merchandise",
    title: "Gaming merchandise",
    exploreHref: "/products?category=gaming",
    items: [
      {
        label: "Gaming Chairs",
        imageSrc: "https://images.unsplash.com/photo-1598550476439-6847785fce6e?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Desks",
        imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Accessories",
        imageSrc: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Apparel",
        imageSrc: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "travel-essentials",
    title: "Most-loved travel essentials",
    exploreHref: "/products?category=travel",
    items: [
      {
        label: "Travel Adapters",
        imageSrc: "https://images.unsplash.com/photo-1563163447-10a11468be2e?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Travel Pillows",
        imageSrc: "https://images.unsplash.com/photo-1520116468816-95b69f847357?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Travel Bottles",
        imageSrc: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Travel Backpacks",
        imageSrc: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "family-fun",
    title: "Have more fun with family",
    exploreHref: "/products?category=toys",
    items: [
      {
        label: "Building Blocks",
        imageSrc: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Stuffed Animals",
        imageSrc: "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Action Figures",
        imageSrc: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Dolls",
        imageSrc: "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "watches",
    title: "Most-loved watches",
    exploreHref: "/products?category=watches",
    items: [
      {
        label: "Luxury Chronographs",
        imageSrc: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Timepieces",
        imageSrc: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Automatic Watches",
        imageSrc: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Elegant Dress Watches",
        imageSrc: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
];

export const CATEGORY_GRIDS_4: CategoryGridData[] = [
  {
    id: "gaming-4",
    title: "Gaming",
    exploreHref: "/products?category=gaming",
    items: [
      {
        label: "Gaming Chairs",
        imageSrc: "https://images.unsplash.com/photo-1598550476439-6847785fce6e?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Desks",
        imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Accessories",
        imageSrc: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gaming Apparel",
        imageSrc: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "upgrade-tech",
    title: "Upgrade on Tech",
    exploreHref: "/products?category=tech",
    items: [
      {
        label: "USB Power Adapters",
        imageSrc: "https://images.unsplash.com/photo-1563163447-10a11468be2e?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Smart Robots",
        imageSrc: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Smart Speakers",
        imageSrc: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Smart Watches",
        imageSrc: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "top-sellers",
    title: "Top Sellers",
    exploreHref: "/products?category=toys",
    items: [
      {
        label: "Building Blocks",
        imageSrc: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Stuffed Animals",
        imageSrc: "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Action Figures",
        imageSrc: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Dolls",
        imageSrc: "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "deals-top-categories",
    title: "Deals on top categories",
    exploreHref: "/products?deals=true",
    items: [
      {
        label: "Watch",
        imageSrc: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Gadgets",
        imageSrc: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Shoes",
        imageSrc: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop",
      },
      {
        label: "Perfumes",
        imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=300&auto=format&fit=crop",
      },
    ],
  },
];

// Helper to generate carousel products
const makeCarouselProducts = (prefix: string, titlePattern: string, basePrice: number, offers: string[], imgUrls: string[]): CarouselProduct[] => {
  return Array.from({ length: 9 }).map((_, i) => {
    const priceVal = basePrice + i * 15;
    const origPriceVal = Math.round(priceVal * 1.3);
    const offerText = offers[i % offers.length];
    const imgUrl = imgUrls[i % imgUrls.length];
    return {
      id: `${prefix}-${i}`,
      title: `${titlePattern} ${i + 1}`,
      imageSrc: imgUrl,
      imageAlt: `${titlePattern} ${i + 1}`,
      rating: 4.0 + (i % 10) * 0.1,
      reviewCount: `${(i + 1) * 75}+`,
      price: `$${priceVal.toFixed(2)}`,
      originalPrice: i % 2 === 0 ? `$${origPriceVal.toFixed(2)}` : undefined,
      badgeText: i % 3 === 0 ? "Best Seller" : undefined,
      badgeLabel: i % 3 === 0 ? "Deal" : undefined,
      offerText: i % 2 !== 0 ? offerText : undefined,
      shippingText: i % 2 === 0 ? "Free Shipping" : "$9.99 Shipping",
    };
  });
};

const TECH_IMAGES = [
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=300&auto=format&fit=crop", // Keyboard
  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=300&auto=format&fit=crop", // Mouse
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop", // Headphones
  "https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=300&auto=format&fit=crop", // Smartwatch
  "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=300&auto=format&fit=crop", // VR Headset
  "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=300&auto=format&fit=crop", // Speaker
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300&auto=format&fit=crop", // Laptop
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa0?q=80&w=300&auto=format&fit=crop", // Phone
];

const BEAUTY_IMAGES = [
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=300&auto=format&fit=crop", // Cosmetics
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=300&auto=format&fit=crop", // Makeup kit
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=300&auto=format&fit=crop", // Skincare
  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=300&auto=format&fit=crop", // Perfume bottle
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=300&auto=format&fit=crop", // Cream
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop", // Serum
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=300&auto=format&fit=crop", // Lipstick
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300&auto=format&fit=crop", // Lotions
];

const CLOTHING_IMAGES = [
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300&auto=format&fit=crop", // Dress model
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300&auto=format&fit=crop", // Evening gown
  "https://images.unsplash.com/photo-1620012253295-c05518e993be?q=80&w=300&auto=format&fit=crop", // Men's shirt
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300&auto=format&fit=crop", // Tshirt
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop", // Nike shoe
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop", // Jewelry necklace
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=300&auto=format&fit=crop", // Sneakers
  "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=300&auto=format&fit=crop", // Casual dress
];

const HOME_IMAGES = [
  "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=300&auto=format&fit=crop", // Lamp
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=300&auto=format&fit=crop", // Ceiling light
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop", // Organizer
  "https://images.unsplash.com/photo-1618955036643-f1a40237f397?q=80&w=300&auto=format&fit=crop", // Fan
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=300&auto=format&fit=crop", // Kitchen utensils
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=300&auto=format&fit=crop", // Chair
  "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=300&auto=format&fit=crop", // Plates
  "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=300&auto=format&fit=crop", // Bowls
];

const WIRELESS_IMAGES = [
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&auto=format&fit=crop", // Wireless headset
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop", // Headphones
  "https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=300&auto=format&fit=crop", // Wireless mouse
  "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?q=80&w=300&auto=format&fit=crop", // Controller
  "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=300&auto=format&fit=crop", // VR headset
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop", // Earbuds
  "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=300&auto=format&fit=crop", // Charging pad
];

// ── Carousel Products Data ──────────────────────────────────────────────────
export const CAROUSEL_VIEWED_ITEMS = makeCarouselProducts(
  "viewed",
  "Related Item",
  89.99,
  ["Up to 30% off", "Free Delivery", "Limited Offer"],
  TECH_IMAGES
);

export const CAROUSEL_BEAUTY_ITEMS = makeCarouselProducts(
  "beauty",
  "Beauty Product",
  24.99,
  ["Save 15%", "Trending Now", "Buy 2 Get 1 Free"],
  BEAUTY_IMAGES
);

export const CAROUSEL_BEST_CLOTHING_ITEMS = makeCarouselProducts(
  "best-clothing",
  "Top Fashion Item",
  49.99,
  ["Hot Deal", "Free Returns", "New Season"],
  CLOTHING_IMAGES
);

export const CAROUSEL_CANADA_ITEMS = makeCarouselProducts(
  "canada",
  "Canada Top Pick",
  79.99,
  ["Exclusive", "Member Price", "Canada Shipping Included"],
  TECH_IMAGES
);

export const CAROUSEL_CLOTHES_SHOES_ITEMS = makeCarouselProducts(
  "clothes-shoes",
  "Designer Item",
  120.00,
  ["Discount Applied", "Free Shipping", "Limited Time Offer"],
  CLOTHING_IMAGES
);

export const CAROUSEL_HOME_ITEMS = makeCarouselProducts(
  "home-items",
  "Home Essential",
  35.50,
  ["Top Rated", "Special Discount", "Bestseller"],
  HOME_IMAGES
);

export const CAROUSEL_WIRELESS_ITEMS = makeCarouselProducts(
  "wireless",
  "Wireless Tech Item",
  69.99,
  ["Save $20", "Fast Charging", "Highly Reviewed"],
  WIRELESS_IMAGES
);
