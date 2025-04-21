import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function CrmRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard/crm page
    router.replace("/dashboard/crm");
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting to CRM Dashboard | Color & Craft</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Redirecting to CRM dashboard...</p>
      </div>
    </>
  );
} 