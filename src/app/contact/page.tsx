import { Metadata } from "next"
import ContactForm from "@/components/forms/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us | Color&Craft Furniture Painting",
  description: "Get in touch with us for custom furniture painting services, quotes, or any questions you might have.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have questions or want to discuss your project? We'd love to hear from you!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Send us a message</h2>
            <ContactForm />
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-gray-700">Phone</h3>
                <p className="text-gray-600">+1 747 755 7695</p>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-700">Email</h3>
                <p className="text-gray-600">contact@color&craft.com</p>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-700">Address</h3>
                <p className="text-gray-600">
                  23120 Schumann Rd, Chatsworth, CA 91311
                </p>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-700">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 5:00 PM<br />
                  Saturday: 10:00 AM - 3:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 