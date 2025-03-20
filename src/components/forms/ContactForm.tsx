"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: string
    error?: string
    warning?: string
  }>({})

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setIsLoading(true)
    setFormStatus({})

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      // Check if there's a warning (like in demo mode)
      if (result.warning) {
        // Still reset the form as the submission was technically successful
        form.reset()
        
        // But show a warning instead of a success message
        setFormStatus({
          warning: result.message || "Your message was received in demo mode.",
        })
        return
      }

      // Reset the form on success
      form.reset()
      setFormStatus({
        success: "Your message has been sent. We'll get back to you soon!",
      })
    } catch (error: any) {
      setFormStatus({
        error: error.message || "Failed to send message. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {formStatus.success ? (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          {formStatus.success}
        </div>
      ) : formStatus.warning ? (
        <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-700">
          {formStatus.warning}
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              {...form.register("name")}
              disabled={isLoading}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              {...form.register("email")}
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              {...form.register("phone")}
              disabled={isLoading}
            />
            {form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              {...form.register("message")}
              disabled={isLoading}
            />
            {form.formState.errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          {formStatus.error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {formStatus.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  )
} 