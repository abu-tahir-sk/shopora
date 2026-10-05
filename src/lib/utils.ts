import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT" | "INR"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "INR", notation = "standard" } = options

  const numericPrice =
    typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(numericPrice)
}
