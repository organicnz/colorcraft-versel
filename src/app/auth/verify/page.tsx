import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify Email | ColorCraft Furniture",
  description: "Verify your email address to complete your registration",
};

export default function VerifyPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We've sent you a verification link to complete your registration
          </p>
        </div>
        <div className="grid gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Once verified, you can{" "}
            <Link
              href="/auth/signin"
              className="underline underline-offset-4 hover:text-primary"
            >
              sign in
            </Link>{" "}
            to your account.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Didn't receive an email?{" "}
            <Link
              href="/auth/resend-verification"
              className="underline underline-offset-4 hover:text-primary"
            >
              Resend verification link
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 