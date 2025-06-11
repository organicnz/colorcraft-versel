import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // Create a test portfolio item to see if the trigger works
    const testData = {
      title: "Test Portfolio Item",
      description: "This is a test to verify the image trigger function",
      status: "draft" as const,
      before_images: [], // Should be populated by trigger
      after_images: [], // Should be populated by trigger
    };

    const { data, error } = await supabase.from("portfolio").insert(testData).select("*").single();

    if (error) {
      console.error("Error creating test portfolio:", error);
      return NextResponse.json(
        { error: "Failed to create test portfolio", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Test portfolio item created successfully",
      portfolio: data,
      triggerWorked: {
        beforeImages: data.before_images || [],
        afterImages: data.after_images || [],
        beforeCount: (data.before_images || []).length,
        afterCount: (data.after_images || []).length,
      },
    });
  } catch (error: any) {
    console.error("Unexpected error in test-trigger:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();

    // Clean up test items
    const { data, error } = await supabase
      .from("portfolio")
      .delete()
      .like("title", "Test Portfolio%")
      .select("id, title");

    if (error) {
      console.error("Error cleaning up test portfolios:", error);
      return NextResponse.json(
        { error: "Failed to clean up test portfolios", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Test portfolio items cleaned up",
      deletedItems: data,
    });
  } catch (error: any) {
    console.error("Unexpected error in test-trigger cleanup:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Trigger Test API",
    endpoints: {
      "POST /": "Create test portfolio item to verify trigger",
      "DELETE /": "Clean up test portfolio items",
    },
  });
}
