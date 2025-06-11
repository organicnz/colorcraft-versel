"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// Component that uses the search params hook
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Password updated successfully");

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setError(error?.message || "Failed to reset password");
      toast.error(error?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Check hash parameters for Supabase auth confirmation
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const type = hashParams.get("type");

    // Handle auth callback
    if (accessToken && refreshToken && type === "recovery") {
      // Set the session from the URL parameters
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .catch((error: any) => {
          console.error("Error setting session:", error);
          setError("Invalid or expired reset link. Please try again.");
        });
    } else if (!searchParams?.get("code") && !hashParams.get("access_token")) {
      // If no code or access token is present, redirect to forgot password
      setError("Invalid or expired reset link. Please try again.");
    }
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-slate-900 dark:text-white">
          Reset your <span className="font-medium text-primary">password</span>
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Please enter your new password below.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-glass border border-white/30 dark:border-white/10 p-8 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy relative">
          {/* Glass gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none rounded-xl" />

          <div className="text-center relative z-10">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              Password Reset Successful
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Your password has been reset successfully.
              <br />
              You will be redirected to the login page.
            </p>
            <div className="mt-6">
              <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                Return to login
              </Link>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-glass border border-white/30 dark:border-white/10 p-8 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy relative">
          {/* Glass gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none rounded-xl" />

          <div className="text-center relative z-10">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              Reset Failed
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</p>
            <div className="mt-6">
              <Link
                href="/auth/forgot-password"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-glass border border-white/30 dark:border-white/10 p-8 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy relative"
        >
          {/* Glass gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none rounded-xl" />

          <div className="relative z-10">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="w-full p-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Enter your new password"
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...form.register("confirmPassword")}
                  className="w-full p-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Confirm your new password"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary-dark transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function ResetPasswordLoading() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-slate-900 dark:text-white">
          Reset your <span className="font-medium text-primary">password</span>
        </h1>
      </div>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Loading reset form...</p>
      </div>
    </div>
  );
}

// Main component that wraps the form with Suspense
export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12">
      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
