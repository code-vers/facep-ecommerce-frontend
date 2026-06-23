import Footer from "@/components/shared/Footer";
import type { Metadata } from "next";
import { Geist_Mono, Open_Sans } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import TopNavLinks from "@/components/shared/TopNavLinks";
import "./globals.css";

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
      className={`${openSans.variable} ${geistMono.variable} h-full antialiased`}
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
