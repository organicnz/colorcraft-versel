import ModernHomePage from "@/components/homepage/ModernHomePage";
import { ClassicHomePage } from "@/components/homepage/ClassicHomePage";
import { ThemeAwareHomePage } from "@/components/homepage/ThemeAwareHomePage";

export default async function HomePage() {
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
