import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard/admin page
    router.replace("/dashboard/admin");
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting to Admin Dashboard | Color & Craft</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Redirecting to admin dashboard...</p>
      </div>
    </>
  );
} 