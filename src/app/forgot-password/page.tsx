"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    // Simulate or trigger reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Password reset link has been dispatched");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter the email associated with your account and we&apos;ll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Check your inbox</h3>
              <p className="text-sm text-muted-foreground">
                If an account exists for <strong className="text-foreground">{email}</strong>, you will receive a password reset link shortly.
              </p>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
              >
                Send to another email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-4">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
