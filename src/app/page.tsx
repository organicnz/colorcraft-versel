import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-furniture.png"
            alt="Beautifully painted furniture"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            Transform Your Furniture with ColorCraft
          </h1>
          <p className="mb-8 max-w-2xl text-lg md:text-xl">
            Expert custom furniture painting services that bring new life to your beloved pieces
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/portfolio"
              className="rounded-md bg-primary px-8 py-3 font-medium text-white transition hover:bg-primary/90"
            >
              View Our Work
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-white bg-transparent px-8 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We offer a range of professional furniture painting and restoration services
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Custom Furniture Painting",
                description:
                  "Transform your furniture with custom colors and finishes tailored to your style.",
                icon: "🎨",
              },
              {
                title: "Furniture Restoration",
                description:
                  "Bring antique and vintage pieces back to life with our careful restoration process.",
                icon: "🔨",
              },
              {
                title: "Upcycling & Repurposing",
                description:
                  "Give old furniture new purpose with creative upcycling and design solutions.",
                icon: "♻️",
              },
              {
                title: "Cabinet Refinishing",
                description:
                  "Update your kitchen or bathroom with cabinet refinishing for a fresh new look.",
                icon: "🚪",
              },
              {
                title: "Specialty Finishes",
                description:
                  "Explore unique textures and effects with our specialty finishing techniques.",
                icon: "✨",
              },
              {
                title: "Furniture Repair",
                description:
                  "Fix structural issues, damaged surfaces, and more with our expert repair services.",
                icon: "🛠️",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{service.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Our Process</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We follow a meticulous process to ensure high-quality results for every project
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 bg-primary"></div>
              {[
                {
                  title: "Consultation",
                  description:
                    "We discuss your vision, preferences, and requirements for your furniture project.",
                },
                {
                  title: "Inspection & Preparation",
                  description:
                    "We thoroughly examine the piece and prepare it for the transformation process.",
                },
                {
                  title: "Color & Finish Selection",
                  description:
                    "Choose from our wide range of colors, finishes, and techniques for your unique look.",
                },
                {
                  title: "Skilled Application",
                  description:
                    "Our craftsmen apply the selected colors and finishes with precision and care.",
                },
                {
                  title: "Quality Control",
                  description:
                    "We inspect every detail to ensure the highest quality standards are met.",
                },
                {
                  title: "Delivery & Setup",
                  description:
                    "Your beautifully transformed furniture is delivered and set up in your space.",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`relative mb-8 flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}
                  >
                    <div
                      className={`absolute top-0 ${
                        index % 2 === 0 ? "right-0 -translate-x-6" : "left-0 translate-x-5"
                      } h-6 w-6 -translate-y-1 rounded-full bg-primary`}
                    ></div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Furniture?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Contact us today to discuss your project or schedule a consultation. We're here to help bring your vision to life!
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md bg-white px-8 py-3 font-medium text-primary transition hover:bg-gray-100"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  )
}
