// This file should be moved to src/app/(dashboard)/services-dash/page.tsx
// Redirecting users from the dashboard/services route to the new location

import { redirect } from "next/navigation";

export default function ServicesRedirectPage() {
  redirect("/dashboard/services-dash");
} 