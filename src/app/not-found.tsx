import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-light text-slate-800 dark:text-white mb-6">
        <span className="text-primary font-medium">404</span> | Page Not Found
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mb-8">
        We're sorry, but the page you're looking for doesn't exist or has been moved.
      </p>
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
        <Link
          href="/"
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/contact"
          className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-md transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
