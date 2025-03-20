import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-primary-700">
          Furniture Painter
        </h1>
        <p className="text-xl text-center max-w-2xl mb-12 text-neutral-700">
          Transform your furniture with our professional painting and restoration services. 
          We breathe new life into old pieces while preserving their character and quality.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/portfolio" 
            className="px-8 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
          >
            View Our Work
          </Link>
          <Link 
            href="/contact" 
            className="px-8 py-3 rounded-lg border border-primary-500 text-primary-500 font-medium hover:bg-primary-50 transition-colors"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </main>
  )
}
