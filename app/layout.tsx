import Footer from "@/components/shared/Footer";
import type { Metadata } from "next";
import { Geist_Mono, Open_Sans, Geist } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import TopNavLinks from "@/components/shared/TopNavLinks";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facep",
  description: "Facep storefront interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", openSans.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-full flex-col">
          <div className="sticky top-0 z-50">
            <Navbar />
            <TopNavLinks />
          </div>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
