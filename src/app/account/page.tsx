"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page
    router.replace("/account/profile");
  }, [router]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Redirecting to your profile...</p>
      </div>
    </div>
  );
} 