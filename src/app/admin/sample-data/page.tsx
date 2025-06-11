"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SampleDataPage() {
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sampleDataCreated, setSampleDataCreated] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/debug/projects");

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setProjectsData(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects data. Please check your Supabase connection.");
    } finally {
      setLoading(false);
    }
  }

  async function createSampleData() {
    setLoading(true);
    setError(null);

    // Define sample project data
    const sampleProjects = [
      {
        title: "Vintage Dresser Restoration",
        brief_description:
          "Bringing new life to a 1940s oak dresser with chalk paint and custom hardware.",
        description:
          "This beautiful oak dresser from the 1940s had great bones but needed a complete refinish. We stripped the original finish, repaired damaged veneer, and applied a custom-mixed chalk paint in a soft blue-gray. The original hardware was cleaned and polished to restore its brass finish, and we added new wooden drawer pulls for a contemporary touch.",
        before_images: [
          "https://images.unsplash.com/photo-1588499756884-d72584d84df5?q=80&w=2574&auto=format&fit=crop",
        ],
        after_images: [
          "https://images.unsplash.com/photo-1588499768017-3c3233d5907e?q=80&w=2574&auto=format&fit=crop",
        ],
        techniques: ["Chalk Paint", "Distressing", "Hardware Restoration"],
        materials: ["Chalk Paint", "Beeswax Finish", "Brass Hardware"],
        completion_date: "2023-05-15",
        client_name: "Emma Thompson",
        client_testimonial:
          "I can&apos;t believe this is the same dresser! Color & Craft transformed my grandmother's old furniture into a beautiful statement piece that fits perfectly with my decor.",
        is_featured: true,
      },
      {
        title: "Mid-Century Console Revival",
        brief_description:
          "Restoring a teak mid-century modern TV console with original stain and new hardware.",
        description:
          "This mid-century modern teak console had great lines but years of neglect left it looking dull and damaged. We carefully sanded the entire piece, repaired water damage on the top surface, and restored it with a teak oil finish that enhances the natural beauty of the wood. The original brass hardware was polished and reinstalled to maintain authenticity.",
        before_images: [
          "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop",
        ],
        after_images: [
          "https://images.unsplash.com/photo-1532372576444-dda954194ad0?q=80&w=1986&auto=format&fit=crop",
        ],
        techniques: ["Wood Restoration", "Oiling", "Hardware Cleaning"],
        materials: ["Teak Oil", "Fine Sandpaper", "Brass Polish"],
        completion_date: "2023-07-22",
        client_name: "Michael Winters",
        client_testimonial:
          "The console looks even better than when it was new! The attention to detail and quality of work exceeded my expectations.",
        is_featured: true,
      },
      {
        title: "Farmhouse Dining Table",
        brief_description:
          "Transforming a basic pine table into a rustic farmhouse centerpiece with milk paint and distressing.",
        description:
          "This plain pine dining table was transformed into a rustic farmhouse centerpiece. We applied milk paint in a warm white color, distressed the edges to show the natural wood beneath, and sealed it with a durable matte polyurethane. The table legs were painted in a contrasting charcoal color to add visual interest and complement the client's dining chairs.",
        before_images: [
          "https://images.unsplash.com/photo-1604578762246-42bfec5889d4?q=80&w=2000&auto=format&fit=crop",
        ],
        after_images: [
          "https://images.unsplash.com/photo-1531498352491-876f74f692fd?q=80&w=1974&auto=format&fit=crop",
        ],
        techniques: ["Milk Paint", "Distressing", "Two-Tone Finish"],
        materials: ["Milk Paint", "Polyurethane", "Sandpaper"],
        completion_date: "2023-09-10",
        is_featured: false,
      },
    ];

    try {
      // Create a FormData object and add each sample project
      for (const project of sampleProjects) {
        const formData = new FormData();

        // Add strings directly
        formData.append("title", project.title);
        formData.append("brief_description", project.brief_description);
        formData.append("description", project.description);
        formData.append("completion_date", project.completion_date);
        if (project.client_name) formData.append("client_name", project.client_name);
        if (project.client_testimonial)
          formData.append("client_testimonial", project.client_testimonial);
        formData.append("is_featured", project.is_featured.toString());

        // Add arrays with array notation in the name
        project.before_images.forEach((url) => formData.append("before_images[]", url));
        project.after_images.forEach((url) => formData.append("after_images[]", url));
        project.techniques.forEach((tech) => formData.append("techniques[]", tech));
        project.materials.forEach((material) => formData.append("materials[]", material));

        // Send to server action
        const response = await fetch("/api/projects", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error ${response.status}`);
        }
      }

      setSampleDataCreated(true);
      await fetchProjects(); // Refresh the data
    } catch (err) {
      console.error("Error creating sample data:", err);
      setError("Failed to create sample data. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Portfolio Sample Data</h1>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            {loading
              ? "Loading projects..."
              : error
                ? "Error loading projects"
                : `${projectsData.length} projects found`}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchProjects} disabled={loading}>
            Refresh Data
          </Button>
          <Button onClick={createSampleData} disabled={loading || sampleDataCreated}>
            {sampleDataCreated ? "Sample Data Added" : "Add Sample Data"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">{error}</div>
      )}

      <Tabs defaultValue="json" className="w-full">
        <TabsList>
          <TabsTrigger value="json">JSON View</TabsTrigger>
          <TabsTrigger value="preview">Card Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="json" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects Data (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                {JSON.stringify(projectsData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative h-48 bg-muted">
                  {project.after_images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.after_images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {project.is_featured && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
                      Featured
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{project.brief_description}</p>
                  {project.techniques && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.techniques.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="bg-muted text-muted-foreground px-2 py-1 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
