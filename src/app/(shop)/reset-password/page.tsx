"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="h-12 w-12 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-medium">Invalid or Expired Link</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
          No reset token was provided or the link is invalid. Please request a new password reset link.
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="text-sm underline underline-offset-4 decoration-1 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setIsSuccess(true);
      toast.success(data.message || "Password updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-normal tracking-tight">Password Reset Complete</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
          Your account password has been successfully updated. You can now sign in with your new credentials.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-[#252930] hover:bg-[#1a1e24] dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white text-white font-medium text-sm px-8 py-2.5 h-11 rounded-md transition-colors shadow-sm"
          >
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="new-password"
          className="block text-sm font-normal text-neutral-700 dark:text-neutral-300 mb-2"
        >
          New Password (min 6 characters)
        </label>
        <div className="relative">
          <input
            id="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="New password"
            className="w-full h-12 px-4 pr-11 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-0 transition-colors text-[15px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-normal text-neutral-700 dark:text-neutral-300 mb-2"
        >
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          placeholder="Confirm password"
          className="w-full h-12 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-background text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-0 transition-colors text-[15px]"
        />
      </div>

      <div className="pt-2 flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center bg-[#252930] hover:bg-[#1a1e24] dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white text-white font-medium text-sm px-8 py-2.5 h-11 rounded-md transition-colors disabled:opacity-50 shadow-sm"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </button>

        <Link
          href="/login"
          className="text-sm font-normal text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-1 hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="py-16 sm:py-24 px-4 bg-background">
      <div className="w-full max-w-[430px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-normal text-center text-neutral-900 dark:text-neutral-100 tracking-tight mb-10">
          Set new password
        </h1>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

