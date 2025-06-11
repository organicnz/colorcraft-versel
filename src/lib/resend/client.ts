import { Resend } from "resend";
import { env } from "@/lib/config/env";

// Initialize Resend with the API key from environment (only if key exists)
let resend: Resend | null = null;

if (env.RESEND_API_KEY && env.RESEND_API_KEY.trim()) {
  try {
    resend = new Resend(env.RESEND_API_KEY);
  } catch (error) {
    console.warn("Failed to initialize Resend:", error);
  }
}

// Helper function to send emails with better error handling
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
  bcc?: string | string[];
}) {
  try {
    // Check if Resend is available
    if (!resend) {
      console.warn("Resend is not configured. Email functionality is disabled.");
      return {
        success: false,
        error: "Email service is not configured. Please set RESEND_API_KEY environment variable.",
      };
    }

    // During testing, we need to set "to" as the verified email in Resend
    const testMode = process.env.NODE_ENV !== "production";
    const toAddress = testMode ? "werbatstalker@gmail.com" : options.to;

    // Use default from address from environment if not provided
    const from = options.from || env.NEXT_PUBLIC_EMAIL_FROM;

    console.warn(`Sending email in ${testMode ? "TEST" : "PRODUCTION"} mode`);
    console.warn(`From: ${from}`);
    console.warn(`To: ${toAddress} (original: ${options.to})`);

    const { data, error } = await resend.emails.send({
      from,
      to: toAddress,
      subject: options.subject,
      text: options.text,
      html: options.html,
      bcc: options.bcc,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error in sendEmail:", error);
    return { success: false, error: error.message || "Unknown error sending email" };
  }
}

// Export the resend instance for direct use (with null check)
export { resend };
