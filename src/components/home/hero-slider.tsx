"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  id: number;
  tag: string;
  badge: string;
  title: string;
  description: string;
  primaryBtn: { text: string; href: string };
  secondaryBtn: { text: string; href: string };
  image: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    tag: "Autumn / Winter 2026",
    badge: "Handcrafted Luxury",
    title: "Designed for modern living.",
    description:
      "Thoughtfully selected pieces that bring function, character and timeless elegance into your everyday spaces.",
    primaryBtn: { text: "Shop Collection", href: "/products" },
    secondaryBtn: { text: "Explore New Arrivals", href: "/new-arrivals" },
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 2,
    tag: "Natural Warmth & Form",
    badge: "Artisanal Materials",
    title: "Organic textures, serene warmth.",
    description:
      "Curated solid oaks, handwoven bouclé upholstery, and sculptural curves designed to transform your sanctuary.",
    primaryBtn: { text: "Discover Furniture", href: "/products" },
    secondaryBtn: { text: "View Best Sellers", href: "/products?sort=featured" },
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: 3,
    tag: "Architectural Ambiance",
    badge: "Limited Studio Edit",
    title: "Atmosphere crafted with intention.",
    description:
      "Warm sculptural illumination, tactile ceramics, and contemporary decor pieces that redefine aesthetic living.",
    primaryBtn: { text: "Shop All Decor", href: "/products" },
    secondaryBtn: { text: "Exclusive Offers", href: "/offers" },
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
  },
];

const AUTO_SLIDE_DURATION = 5500; // 5.5 seconds per slide

// Direction-aware slide variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 30 },
      opacity: { duration: 0.6 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 30 },
      opacity: { duration: 0.5 },
    },
  }),
};

export function HeroSlider() {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const currentIndex = ((page % slides.length) + slides.length) % slides.length;
  const currentSlide = slides[currentIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const goToSlide = (targetIndex: number) => {
    const diff = targetIndex - currentIndex;
    if (diff !== 0) {
      paginate(diff);
    }
  };

  // Auto-slide effect ("auto slide hobe na korle slide hobe")
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      paginate(1);
    }, AUTO_SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [page, isPaused, paginate]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        paginate(1); // Swipe left -> Next
      } else {
        paginate(-1); // Swipe right -> Prev
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative h-[85vh] min-h-[620px] max-h-[880px] w-full bg-secondary flex items-center justify-center overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Promotion Slider"
    >
      {/* Background Slides with AnimatePresence */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with subtle Ken Burns effect */}
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${currentSlide.image}")` }}
          />

          {/* Gradients for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-10 container px-4 sm:px-6 md:px-8 max-w-5xl flex flex-col items-center text-center text-white mt-10 sm:mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Tag / Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs tracking-widest uppercase font-medium mb-6 text-white/90 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{currentSlide.tag}</span>
              <span className="hidden sm:inline text-white/40">•</span>
              <span className="hidden sm:inline text-white/80">{currentSlide.badge}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight max-w-4xl mb-6 text-balance leading-[1.08]"
            >
              {currentSlide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl font-light mb-10 leading-relaxed text-balance"
            >
              {currentSlide.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-none bg-white text-black hover:bg-white/90 px-8 h-13 sm:h-14 text-xs sm:text-sm tracking-widest uppercase font-semibold transition-all hover:tracking-[0.18em] shadow-lg"
              >
                <Link href={currentSlide.primaryBtn.href}>{currentSlide.primaryBtn.text}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-none border-white/80 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black px-8 h-13 sm:h-14 text-xs sm:text-sm tracking-widest uppercase font-semibold transition-all shadow-md"
              >
                <Link href={currentSlide.secondaryBtn.href}>{currentSlide.secondaryBtn.text}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Previous & Next Navigation Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-3 sm:left-6 z-20 h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-black/25 hover:bg-black/55 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-3 sm:right-6 z-20 h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-black/25 hover:bg-black/55 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Bottom Indicators & Progress Bar */}
      <div className="absolute bottom-6 sm:bottom-8 z-20 flex items-center gap-2 bg-black/35 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-full shadow-lg">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden focus:outline-none ${
                isActive ? "w-10 sm:w-12 bg-white/30" : "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={isActive ? "true" : undefined}
            >
              {isActive && (
                <motion.div
                  key={`progress-${page}-${isPaused}`}
                  initial={{ width: "0%" }}
                  animate={{ width: isPaused ? "100%" : "100%" }}
                  transition={{
                    duration: isPaused ? 0 : AUTO_SLIDE_DURATION / 1000,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-white rounded-full shadow-xs"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
