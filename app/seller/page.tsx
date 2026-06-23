import SellerFaq from "@/components/seller/SellerFaq";
import SellerGettingStarted from "@/components/seller/SellerGettingStarted";
import SellerHero from "@/components/seller/SellerHero";
import SellerStats from "@/components/seller/SellerStats";
import SellerStoreShowcase from "@/components/seller/SellerStoreShowcase";
import SellerTestimonials from "@/components/seller/SellerTestimonials";
import SellerToolsPrograms from "@/components/seller/SellerToolsPrograms";
import SellerWhySell from "@/components/seller/SellerWhySell";

export default function SellerPage() {
  return (
    <>
      <SellerHero />
      <SellerWhySell />
      <SellerGettingStarted />
      <SellerToolsPrograms />
      <SellerStoreShowcase />
      <SellerStats />
      <SellerTestimonials />
      <SellerFaq />
    </>
  );
}
