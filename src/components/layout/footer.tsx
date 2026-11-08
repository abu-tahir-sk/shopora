import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#291a0c] text-[#f0ede9] border-t border-[#3d2714] overflow-hidden pt-16 pb-8 text-sm">
      {/* Subtle geometric polygon ambient glow in background matching the reference aesthetic */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/3 w-[600px] h-[400px] bg-white/[0.03] rotate-45 transform origin-center rounded-3xl"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info & Contacts */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group focus:outline-none">
              <Image
                src="/images/logo-dark.png"
                alt="Shopora Home & Living"
                width={172}
                height={41}
                className="h-10 w-auto object-contain transition-opacity group-hover:opacity-90 drop-shadow-sm"
              />
            </Link>

            <p className="text-[#f0ede9]/80 font-light max-w-sm leading-relaxed text-[14px]">
              Premium furniture crafted for the modern Indian home. Quality, comfort, and customization — built to last a lifetime.
            </p>

            {/* Direct Contact Numbers */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400/80 shrink-0" />
                <a
                  href="tel:+919990198889"
                  className="font-medium text-[#f7f4f0] hover:text-amber-300 transition-colors tracking-wide text-[14px]"
                >
                  +91 9990198889
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400/80 shrink-0" />
                <a
                  href="mailto:customercare@shopora.in"
                  className="font-medium text-[#f7f4f0] hover:text-amber-300 transition-colors tracking-wide text-[14px]"
                >
                  customercare@shopora.in
                </a>
              </div>
            </div>

            {/* Social Media Circular Outline Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/35 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/35 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-white/35 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div>
            <h4 className="font-semibold mb-5 text-[#f7f4f0] tracking-wider uppercase text-xs">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Home Interiors
                </Link>
              </li>
              <li>
                <Link
                  href="/contact?type=bulk"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Bulk Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Categories Column 2 */}
          <div>
            <h4 className="font-semibold mb-5 text-[#f7f4f0] tracking-wider uppercase text-xs">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Exclusive Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=popular"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  All Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column 3 */}
          <div>
            <h4 className="font-semibold mb-5 text-[#f7f4f0] tracking-wider uppercase text-xs">
              Customer Care
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#f0ede9]/75 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#3d2714] gap-4">
          <p className="text-[#f0ede9]/60 text-xs">
            © {new Date().getFullYear()} Shopora Home & Living. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#f0ede9]/70 text-xs">
            <span>India (INR ₹)</span>
            <span className="inline-block w-1 h-1 rounded-full bg-white/20" />
            <span>100% Genuine Solid Wood</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
