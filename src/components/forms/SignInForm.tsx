"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const supabase = createClient();

  // Simple debug function that always works
  const debug = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    console.warn(`🔍 [Auth Debug] ${logMessage}`);
    setDebugLogs((prev) => [...prev.slice(-5), logMessage]);
  };

  useEffect(() => {
    debug("Component mounted - checking auth state");

    // Check current session
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        debug(`Current session: ${session ? `exists (${session.user.email})` : "none"}`);

        if (session && !isLoading) {
          debug("User already signed in - redirecting to dashboard");
          router.push("/dashboard");
        }
      } catch (err) {
        debug(`Error checking session: ${err}`);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      debug(`Auth event: ${event} | Session: ${session ? "exists" : "none"}`);

      if (event === "SIGNED_IN" && session) {
        debug(`Successful sign-in detected for ${session.user.email}`);
        setIsLoading(false);
        router.push("/dashboard");
      } else if (event === "SIGNED_OUT") {
        debug("Sign-out detected");
        setIsLoading(false);
      }
    });

    return () => {
      debug("Component unmounting");
      subscription.unsubscribe();
    };
  }, [supabase, router, isLoading]);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInValues) {
    debug(`Starting sign-in attempt for ${data.email}`);
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      debug(`Sign-in response: ${authError ? "ERROR" : "SUCCESS"}`);

      if (authError) {
        debug(`Sign-in error: ${authError.message}`);
        setError(
          authError.message.includes("Invalid login credentials")
            ? "Invalid email or password"
            : authError.message
        );
        setIsLoading(false);
        return;
      }

      if (!authData.user || !authData.session) {
        debug("No user or session returned");
        setError("Sign-in failed - no session created");
        setIsLoading(false);
        return;
      }

      debug(`Sign-in successful for ${authData.user.email}`);
      // Don't redirect here - let the auth state change handle it
    } catch (err: any) {
      debug(`Unexpected error: ${err.message}`);
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {/* Debug panel - always visible in dev */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
          <div className="text-sm font-medium text-yellow-800 mb-2">
            🔍 Auth Debug (Last 5 logs):
          </div>
          <div className="space-y-1">
            {debugLogs.length === 0 ? (
              <div className="text-xs text-yellow-600">No logs yet...</div>
            ) : (
              debugLogs.map((log, i) => (
                <div key={i} className="text-xs text-yellow-700 font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              placeholder="name@example.com"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("email")}
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("password")}
              disabled={isLoading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        onClick={async () => {
          debug("Google OAuth initiated");
          setIsLoading(true);
          setError(null);

          try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });

            if (error) throw error;
            debug("Google OAuth redirect started");
          } catch (err: any) {
            debug(`Google OAuth error: ${err.message}`);
            setError(err.message || "Failed to sign in with Google");
            setIsLoading(false);
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? "Redirecting..." : "Google"}
      </button>
    </div>
  );
}
