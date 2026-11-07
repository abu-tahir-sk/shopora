"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Upload, 
  Link as LinkIcon, 
  X, 
  Star, 
  Loader2, 
  Plus, 
  Check, 
  Image as ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  defaultImages?: string[];
}

export function ImageUpload({ onUpload, defaultImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultImages && defaultImages.length > 0) {
      setImages((prev) => (prev.length === 0 ? defaultImages : prev));
    }
  }, [defaultImages]);

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    onUpload(newImages);
  };

  // Handle direct file uploads via /api/upload
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to upload ${file.name}`);
        }

        const data = await res.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const nextList = [...images, ...uploadedUrls];
        updateImages(nextList);
        toast.success(
          uploadedUrls.length === 1
            ? "Image uploaded successfully!"
            : `${uploadedUrls.length} images uploaded successfully!`
        );
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle pasting an external URL
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
    } catch {
      toast.error("Please enter a valid URL (starting with http:// or https://)");
      return;
    }

    if (images.includes(trimmed)) {
      toast.error("This image has already been added");
      return;
    }

    const nextList = [...images, trimmed];
    updateImages(nextList);
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("Image URL added successfully!");
  };

  // Handle Cloudinary upload widget result
  const handleCloudinarySuccess = (result: any) => {
    if (result.event === "success") {
      const newUrl = result.info.secure_url;
      if (newUrl && !images.includes(newUrl)) {
        const nextList = [...images, newUrl];
        updateImages(nextList);
        toast.success("Image uploaded via Cloudinary!");
      }
    }
  };

  // Remove image
  const handleRemove = (urlToRemove: string) => {
    const nextList = images.filter((u) => u !== urlToRemove);
    updateImages(nextList);
  };

  // Set an image as primary cover (move to index 0)
  const handleSetCover = (url: string) => {
    const nextList = [url, ...images.filter((u) => u !== url)];
    updateImages(nextList);
    toast.success("Set as primary cover image");
  };

  return (
    <div className="space-y-4">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={url + i}
              className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group shadow-2xs"
            >
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover"
              />

              {/* Cover Badge on first image */}
              {i === 0 ? (
                <div className="absolute top-1.5 left-1.5 bg-brand text-brand-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm z-10 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Cover</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCover(url)}
                  title="Make this the cover image"
                  className="absolute top-1.5 left-1.5 bg-background/90 hover:bg-background text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Set as Cover
                </button>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1.5 right-1.5 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <input type="hidden" name="images" value={url} />
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Direct Computer File Upload (Most reliable & fastest) */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="border-dashed border-2 hover:border-brand hover:bg-brand/5 text-foreground h-10"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-brand" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2 text-brand" />
              Upload from Device
            </>
          )}
        </Button>

        {/* 2. Paste Image URL Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs h-10"
        >
          <LinkIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          {showUrlInput ? "Cancel URL" : "Paste Image URL"}
        </Button>

        {/* 3. Cloudinary Upload Widget (optional backup) */}
        {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "shopora"}
            options={{
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              maxFiles: 10,
            }}
            onSuccess={handleCloudinarySuccess}
          >
            {({ open }) => (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => open()}
                className="text-xs h-10 text-muted-foreground hover:text-foreground"
              >
                <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                Cloudinary Widget
              </Button>
            )}
          </CldUploadWidget>
        )}

        {/* Counter */}
        {images.length > 0 && (
          <span className="text-xs text-muted-foreground ml-auto">
            {images.length} {images.length === 1 ? "image" : "images"} attached
          </span>
        )}
      </div>

      {/* URL Input Row (expandable) */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl border border-border animate-in fade-in slide-in-from-top-1 duration-200">
          <Input
            placeholder="https://images.unsplash.com/... or any image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            className="h-9 text-xs"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddUrl}
            className="h-9 shrink-0 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
