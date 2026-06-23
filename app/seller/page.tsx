import SellerGettingStarted from "@/components/seller/SellerGettingStarted";
import SellerHero from "@/components/seller/SellerHero";
import SellerStoreShowcase from "@/components/seller/SellerStoreShowcase";
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
    </>
  );
}
