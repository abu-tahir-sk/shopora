"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CloudinaryUploadProps {
  onUpload: (urls: string[]) => void;
  defaultImages?: string[];
}

export function CloudinaryUpload({ onUpload, defaultImages = [] }: CloudinaryUploadProps) {
  const [images, setImages] = useState<string[]>(defaultImages);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const newUrl = result.info.secure_url;
      const updatedImages = [...images, newUrl];
      setImages(updatedImages);
      onUpload(updatedImages);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedImages = images.filter((url) => url !== urlToRemove);
    setImages(updatedImages);
    onUpload(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, i) => (
          <div key={i} className="relative h-24 w-24 rounded-md overflow-hidden border bg-muted group">
            <Image 
              src={url} 
              alt="Product image" 
              fill 
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3 text-destructive" />
            </button>
            <input type="hidden" name="images" value={url} />
          </div>
        ))}
      </div>

      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shopora"}
        onSuccess={handleUpload}
      >
        {({ open }) => {
          return (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => open()}
              className="border-dashed"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
