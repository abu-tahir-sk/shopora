import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://shopora.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Shopora - Curated Luxury & Essentials",
    template: "%s | Shopora",
  },
  description: "Shopora is a modern luxury e-commerce destination with curated collections, express delivery, and seamless checkout.",
  keywords: ["e-commerce", "luxury shopping", "curated fashion", "lifestyle", "shopora"],
  authors: [{ name: "Shopora Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: "Shopora",
    title: "Shopora - Curated Luxury & Essentials",
    description: "Explore curated collections and luxury essentials with seamless checkout at Shopora.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopora - Curated Luxury & Essentials",
    description: "Explore curated collections and luxury essentials with seamless checkout at Shopora.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
