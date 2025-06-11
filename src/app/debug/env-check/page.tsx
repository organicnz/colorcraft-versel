export default function EnvCheckPage() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...`
      : "Not set",
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Environment Variables Check</h1>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Server-side Environment</h2>
        <div className="space-y-2 font-mono text-sm">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="w-64 font-semibold">{key}:</span>
              <span className={value === "Not set" ? "text-red-600" : "text-green-600"}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded">
          <h3 className="font-semibold mb-2">URL Check:</h3>
          <div className="text-sm">
            {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
              <>
                <div>✅ URL is set</div>
                <div>Preview: {process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...</div>
                <div>Ends with: {process.env.NEXT_PUBLIC_SUPABASE_URL.slice(-20)}</div>
              </>
            ) : (
              <div>❌ URL is not set</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
