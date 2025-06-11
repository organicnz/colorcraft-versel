import { createClient } from "@/lib/supabase/server";
import { getPortfolioProjects } from "@/services/portfolio.service";

export default async function PortfolioArraysDebugPage() {
  const supabase = await createClient();

  // Get raw data directly from Supabase
  const { data: rawProjects } = await supabase
    .from("portfolio")
    .select("*")
    .eq("status", "published")
    .limit(3);

  // Get normalized data through service
  const normalizedProjects = await getPortfolioProjects({});

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">Portfolio Array Debugging</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Raw Data from Supabase</h2>
          <pre className="bg-slate-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(rawProjects, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Normalized Data from Service</h2>
          <pre className="bg-slate-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(normalizedProjects.slice(0, 3), null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Array Parsing Test</h2>
          {normalizedProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="border p-4 rounded mb-4">
              <h3 className="font-semibold">{project.title}</h3>
              <div className="mt-2">
                <strong>Raw after_images:</strong>
                <div className="text-sm text-slate-600">
                  Type: {typeof project.after_images}, Length:{" "}
                  {Array.isArray(project.after_images) ? project.after_images.length : "N/A"}
                </div>
                <pre className="text-xs bg-slate-50 p-2 rounded mt-1">
                  {JSON.stringify(project.after_images, null, 2)}
                </pre>
              </div>
              <div className="mt-2">
                <strong>First after image:</strong>
                <div className="text-sm text-slate-600">
                  {Array.isArray(project.after_images) && project.after_images.length > 0
                    ? project.after_images[0]
                    : "No images found"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
