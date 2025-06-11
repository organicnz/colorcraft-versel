import { createClient } from "@/lib/supabase/server";

export default async function AuthStatePage() {
  const supabase = await createClient();

  // Get current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  let userData = null;
  let userError = null;

  if (session) {
    const { data, error } = await supabase
      .from("users")
      .select("role, email, full_name")
      .eq("id", session.user.id)
      .single();

    userData = data;
    userError = error;
  }

  // Try to fetch portfolio data
  let portfolioData = null;
  let portfolioError = null;

  if (session) {
    const { data, error } = await supabase
      .from("portfolio")
      .select("id, title, status, is_featured")
      .limit(5);

    portfolioData = data;
    portfolioError = error;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Authentication State Debug</h1>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Session Info</h2>
          {sessionError ? (
            <div className="text-red-600">
              <p>Session Error: {sessionError.message}</p>
            </div>
          ) : session ? (
            <div className="space-y-2">
              <p>
                <strong>User ID:</strong> {session.user.id}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              <p>
                <strong>Session Valid:</strong> Yes
              </p>
            </div>
          ) : (
            <p className="text-orange-600">No active session</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Data</h2>
          {userError ? (
            <div className="text-red-600">
              <p>User Error: {userError.message}</p>
            </div>
          ) : userData ? (
            <div className="space-y-2">
              <p>
                <strong>Role:</strong> {userData.role}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Full Name:</strong> {userData.full_name || "Not set"}
              </p>
            </div>
          ) : (
            <p className="text-orange-600">No user data available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Portfolio Access Test</h2>
          {portfolioError ? (
            <div className="text-red-600">
              <p>Portfolio Error: {portfolioError.message}</p>
            </div>
          ) : portfolioData ? (
            <div className="space-y-2">
              <p>
                <strong>Portfolio Count:</strong> {portfolioData.length}
              </p>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Sample Projects:</h3>
                <ul className="space-y-1">
                  {portfolioData.map((project) => (
                    <li key={project.id} className="text-sm">
                      {project.title} - Status: {project.status} - Featured:{" "}
                      {project.is_featured ? "Yes" : "No"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-orange-600">No portfolio data available</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Quick Actions</h3>
          <div className="space-x-4">
            <a href="/auth/signin" className="text-blue-600 hover:underline">
              Sign In
            </a>
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>
            <a href="/portfolio-dash" className="text-blue-600 hover:underline">
              Portfolio Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
