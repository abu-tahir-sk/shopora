"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (errorParam === "OAuthAccountNotLinked") {
      toast.error("Email already in use with another login provider. Please sign in with your original method.");
    } else if (errorParam) {
      toast.error("Authentication failed. Please verify your credentials.");
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (response?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back! Logged in successfully.");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-normal text-center text-neutral-900 dark:text-neutral-100 tracking-tight mb-10">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-normal text-neutral-700 dark:text-neutral-300 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isGoogleLoading}
            placeholder="Email"
            className="w-full h-12 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-0 transition-colors text-[15px]"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-normal text-neutral-700 dark:text-neutral-300 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              placeholder="Password"
              className="w-full h-12 px-4 pr-11 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-0 transition-colors text-[15px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Forgot your password link */}
          <div className="mt-3.5">
            <Link
              href="/forgot-password"
              className="text-sm font-normal text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-1 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Action Row: Sign In Button & Create Account Link */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="inline-flex items-center justify-center bg-[#252930] hover:bg-[#1a1e24] dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white text-white font-medium text-sm px-8 py-2.5 h-11 rounded-md transition-colors disabled:opacity-50 shadow-sm"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </button>

          <Link
            href="/register"
            className="text-sm font-normal text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-1 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Create account
          </Link>
        </div>
      </form>

      {/* Subtle Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-neutral-400 dark:text-neutral-500 font-medium tracking-wider">
            or
          </span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
        className="w-full h-11 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background hover:bg-neutral-50 dark:hover:bg-neutral-900 text-foreground font-medium text-sm inline-flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        Continue with Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-16 sm:py-24 px-4 bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

