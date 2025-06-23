import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl md:text-6xl font-light text-slate-800 mb-6">
          <span className="text-primary font-medium">404</span> | Page Not Found
        </h1>
        <p className="text-lg text-slate-600 max-w-md mb-8">
          We are sorry, but the page you are looking for does not exist or has been moved.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
          <Link
            href="/"
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors duration-200"
          >
            Return Home
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-medium rounded-md transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
