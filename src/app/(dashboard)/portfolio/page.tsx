// This file should be moved to src/app/(dashboard)/portfolio-dash/page.tsx
// Redirecting users from the dashboard/portfolio route to the new location

import { redirect } from "next/navigation";

export default function PortfolioRedirectPage() {
  redirect("/dashboard/portfolio-dash");
} 