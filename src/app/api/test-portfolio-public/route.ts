import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get published portfolio items (public access)
    const { data: projects, error } = await supabase
      .from("portfolio")
      .select("id, title, brief_description, status, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch portfolio data", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio data fetched successfully",
      data: {
        totalProjects: projects?.length || 0,
        projects: projects || [],
        statusFieldWorking: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
