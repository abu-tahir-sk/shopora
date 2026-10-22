"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: Array<{
    id: string;
    url: string;
    position: number;
  }>;
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground text-sm">
        No images available
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (desktop left, mobile bottom) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0 pb-2 md:pb-0 hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden bg-secondary border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? "border-foreground ring-2 ring-foreground/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Showcase */}
      <div className="flex-1 relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary border border-border group">
        <Image
          src={currentImage.url}
          alt={`${productName} view`}
          fill
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Carousel controls if multiple images */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
              }}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-background pointer-events-auto shadow-md transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
              }}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-background pointer-events-auto shadow-md transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Indicator pills for mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5 md:hidden">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  selectedIndex === idx ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
