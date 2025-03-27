import React from 'react';
import type { Metadata } from "next";
import SignUpClient from "./signup-client";

export const metadata: Metadata = {
  title: "Create an Account | Color & Craft Furniture Painting",
  description: "Sign up for a Color & Craft account to save your favorite furniture styles and track your orders.",
};

export default function SignUpPage() {
  return <SignUpClient />;
} 