"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use our custom API endpoint for email verification
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification email");
      }

      // If successful, show the success message
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast.error(error.message || "Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-slate-900 dark:text-white">
            Resend <span className="font-medium text-primary">verification email</span>
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Enter your email address and we&apos;ll send you another verification link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-center">
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
                Check your email
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                We've sent a new verification link to <strong>{email}</strong>.
                <br />
                Check your inbox and follow the instructions.
              </p>
              <div className="mt-6">
                <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                  Return to login
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
          >
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full p-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary-dark transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Sending..." : "Resend Verification Email"}
            </button>
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
              >
                Return to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
