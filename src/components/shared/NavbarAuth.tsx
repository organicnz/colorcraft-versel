"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircularProfileButton } from "./CircularProfileButton";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function NavbarAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (user) {
    // User is logged in - show circular profile button
    return <CircularProfileButton />;
  }

  // User is not logged in - show sign in/sign up buttons
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
} 