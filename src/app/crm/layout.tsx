import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "CRM | Color & Craft",
  description: "Customer relationship management for Color & Craft",
};

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-100 border-r border-slate-200 hidden md:block">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold">CRM</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem href="/crm" exact>
              Dashboard
            </NavItem>
            <NavItem href="/crm/customers">Customers</NavItem>
            <NavItem href="/crm/leads">Leads</NavItem>
            <NavItem href="/crm/projects">Projects</NavItem>
            <li className="mt-6 pt-4 border-t border-slate-200">
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                ← Back to Main Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-10">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">CRM</h2>
          <MobileMenu />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pt-0 pt-16">{children}</div>
    </div>
  );
}

function NavItem({
  children,
  href,
  exact = false,
}: {
  children: ReactNode;
  href: string;
  exact?: boolean;
}) {
  // Simple active state based on the current URL
  // In a real app, you'd use usePathname from next/navigation
  const isActive = false; // Placeholder for server component

  return (
    <li>
      <Link
        href={href}
        className={`block px-2 py-1 rounded text-sm font-medium ${
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

function MobileMenu() {
  return (
    <div className="relative">
      {/* This would typically be a dropdown menu with JavaScript */}
      <button className="p-2 rounded-md hover:bg-slate-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
