import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function PortfolioCardsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to portfolio page
    router.replace("/portfolio");
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting to Portfolio | Color & Craft</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Redirecting to portfolio page...</p>
      </div>
    </>
  );
} 