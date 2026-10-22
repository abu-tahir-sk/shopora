"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

// Filter out the known React 19 false-positive error caused by next-themes injecting an inline script for theme hydration
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  );
}

