import { Metadata } from "next"
import ContactForm from "@/components/forms/ContactForm"
import PhoneDisplay from "@/components/ui/phone-display"
import { MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | Color & Craft Furniture Painting",
  description: "Get in touch with us for custom furniture painting services, quotes, or any questions you might have.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">Contact Us</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Have questions or want to discuss your project? We'd love to hear from you!
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/50">
                <h2 className="mb-6 text-2xl font-semibold text-slate-900">Send us a message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Phone Display - Hero Style */}
              <PhoneDisplay
                phoneNumber="(747) 755-7695"
                email="contact@colorandcraft.com"
                variant="contact"
                className="relative"
              />

              {/* Address Card */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-full bg-orange-200/60 p-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Visit Our Studio</h3>
                    <p className="text-slate-700 leading-relaxed">
                      23120 Schumann Rd<br />
                      Chatsworth, CA 91311
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-full bg-blue-200/60 p-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Business Hours</h3>
                    <div className="space-y-1 text-slate-700">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 3:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-[#3ECF8E]/20 to-[#38BC81]/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#3ECF8E]/30">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Transform Your Furniture?</h3>
                <p className="text-slate-700 text-sm mb-4">
                  Call us today for a free consultation and quote. We'll help bring your vision to life!
                </p>
                <a
                  href="tel:+17477557695"
                  className="inline-flex items-center justify-center w-full bg-[#3ECF8E] hover:bg-[#38BC81] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  Call Now for Free Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 