import ModernHomePage from '@/components/homepage/ModernHomePage';

export default async function Page() {
  // Data fetching can happen here in the future
  const defaultData = {
    featuredProjects: [],
    services: [],
    testimonials: [],
    teamMembers: [],
  };

  return <ModernHomePage {...defaultData} />;
}
