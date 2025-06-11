export default function SimpleTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Simple Test Page</h1>
      <p className="text-lg mt-4">This page has no external dependencies.</p>
      <p className="mt-2">Current time: {new Date().toISOString()}</p>
    </div>
  );
}
