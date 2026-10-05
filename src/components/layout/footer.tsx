import Link from "next/link";
// Removed missing icons

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 text-sm">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-bold text-2xl tracking-tighter uppercase">Shopora</span>
            </Link>
            <p className="text-muted-foreground font-light max-w-xs leading-relaxed mb-6">
              Thoughtfully selected pieces that bring function, character and timeless style into your everyday spaces.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-xs">
                IG
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-xs">
                FB
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-xs">
                X
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium text-xs">
                YT
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 tracking-wide uppercase text-xs">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground font-light transition-colors">All Products</Link></li>
              <li><Link href="/products?sort=newest" className="text-muted-foreground hover:text-foreground font-light transition-colors">New Arrivals</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground font-light transition-colors">Best Sellers</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground font-light transition-colors">Categories</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground font-light transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 tracking-wide uppercase text-xs">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">FAQ</Link></li>
              <li><Link href="/orders" className="text-muted-foreground hover:text-foreground font-light transition-colors">Track Order</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 tracking-wide uppercase text-xs">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">Journal</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground font-light transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Shopora. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <span>India (INR ₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
