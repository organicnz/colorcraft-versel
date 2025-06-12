import ModernHomePage from "@/components/homepage/ModernHomePage";

export default function HomePage() {
  // Default data for the modern homepage
  const defaultData = {
    featuredProjects: [],
    services: [],
    testimonials: [],
    teamMembers: [],
  };

  return <ModernHomePage {...defaultData} />;
}
