import { Star, CheckCircle2, Quote } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: string;
  author: string;
  city: string;
  title: string;
  quote: string;
  productName: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "Ananya Deshmukh",
    city: "Mumbai, Bandra",
    title: "The craftsmanship surpassed all expectations",
    quote:
      "We purchased the solid dining table and bouclé chairs for our new apartment. The solid oak grain, the joinery, and the comfort are on par with Italian luxury design houses at a fraction of the price.",
    productName: "Amber Sintered Dining Table",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    author: "Rohan & Sneha Sengupta",
    city: "Bengaluru, Indiranagar",
    title: "White-glove delivery was flawless",
    quote:
      "Arrived exactly on schedule. The delivery team uncrated and assembled the coffee table inside our living room, taking all packaging with them. The organic marble finish is completely breathtaking.",
    productName: "Organic Marble Coffee Table",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "3",
    author: "Kavita Malhotra",
    city: "New Delhi, Vasant Vihar",
    title: "Warm, architectural ambiance",
    quote:
      "The brushed brass pendant created the exact gentle, diffused atmosphere we were looking for in our reading nook. Customer concierge was also very helpful with sizing questions.",
    productName: "Architectural Table Lamp",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 bg-muted/40 border-y border-border/80">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Loved by 12,000+ Modern Homes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Stories from Our Community
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-light mt-2 leading-relaxed">
            Read verified reviews from architects, interior designers, and homeowners who transformed their sanctuaries with Shopora.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-6 sm:p-8 bg-card border border-border/70 shadow-2xs hover:shadow-md hover:border-brand/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-muted-foreground/30" />
                </div>

                <h3 className="font-semibold text-base text-foreground mb-2 leading-snug">
                  "{item.title}"
                </h3>

                <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6">
                  {item.quote}
                </p>
              </div>

              {/* Author Info & Verified Product Tag */}
              <div className="pt-4 border-t border-border/60">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0 border border-border">
                    <Image
                      src={item.avatar}
                      alt={item.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm text-foreground truncate">{item.author}</p>
                      <span title="Verified Buyer" className="inline-flex">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.city}</p>
                  </div>
                </div>

                <div className="mt-3 inline-block bg-secondary/80 px-2.5 py-1 rounded-md text-[10px] font-medium text-foreground/80">
                  Purchased: <span className="font-semibold text-foreground">{item.productName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
