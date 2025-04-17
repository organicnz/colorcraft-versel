import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import PortfolioTable from './_components/PortfolioTable';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Manage Portfolio | Dashboard',
  description: 'Manage your portfolio projects',
};

// This page now redirects to the new dashboard/portfolio/manage path
export default async function LegacyDashboardPortfolioPage() {
  redirect('/dashboard/portfolio/manage');
} 