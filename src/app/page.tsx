import { ClassicHomePage } from '@/components/homepage/ClassicHomePage';
import { ThemeAwareHomePage } from '@/components/homepage/ThemeAwareHomePage';
import ModernHomePage from '@/components/homepage/ModernHomePage';

export default async function Page() {
  // Data fetching can happen here in the future
  const defaultData = {
    featuredProjects: [],
    services: [],
    testimonials: [],
    teamMembers: [],
  };

  return (
    <ThemeAwareHomePage
      modernPage={<ModernHomePage {...defaultData} />}
      classicPage={<ClassicHomePage />}
    />
  );
}
