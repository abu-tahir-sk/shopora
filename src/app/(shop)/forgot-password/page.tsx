"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setIsSubmitted(true);
      toast.success(data.message || "Password reset instructions dispatched");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 px-4 bg-background">
      <div className="w-full max-w-[430px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-normal text-center text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
          Reset password
        </h1>
        <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mb-10">
          We will send you an email to reset your password.
        </p>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-medium">Check your inbox</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              If an account exists for <strong className="text-foreground">{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="text-sm underline underline-offset-4 decoration-1 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                Try another email
              </button>
              <Link
                href="/login"
                className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
                disabled={isLoading}
                placeholder="Email"
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
                Submit
              </button>

              <Link
                href="/login"
                className="text-sm font-normal text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-1 hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

