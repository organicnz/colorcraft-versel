import { Metadata } from "next";
import ProjectManager from "@/components/examples/ProjectManager";

export const metadata: Metadata = {
  title: "Project Manager Demo",
  description: "A demonstration of the enhanced stack with Drizzle ORM, React Query, and Optimistic Updates",
};

export default function ProjectManagerPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Project Manager Demo</h1>
      <p className="text-muted-foreground mb-8">
        This demo showcases the enhanced stack capabilities including Drizzle ORM, 
        React Query, and optimistic updates for a fluid user experience
      </p>
      
      <ProjectManager />
    </div>
  );
}
