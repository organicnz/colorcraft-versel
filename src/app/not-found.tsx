import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center bg-white px-4 py-12 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-slate-800">
          <span className="text-primary">404</span>
        </h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Page Not Found
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Go back home
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-slate-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
