"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircularProfileButton } from "./CircularProfileButton";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { type User, type AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface NavbarAuthProps {
  user: User | null;
}

export default function NavbarAuth({ user: initialUser }: NavbarAuthProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  if (user) {
    // User is logged in - show ONLY circular profile button (no text)
    return <CircularProfileButton />;
  }

  // User is not logged in - show sign in/sign up buttons
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button
        size="sm"
        asChild
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
