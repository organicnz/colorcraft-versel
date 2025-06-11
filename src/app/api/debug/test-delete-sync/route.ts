import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the first portfolio for testing
    const { data: portfolios, error: portfoliosError } = await supabase
      .from("portfolio")
      .select("id, title, before_images, after_images")
      .limit(1);

    if (portfoliosError || !portfolios?.length) {
      return NextResponse.json(
        {
          error: "No portfolios found for testing",
          portfoliosError,
        },
        { status: 404 }
      );
    }

    const portfolio = portfolios[0];

    // Simulate a DELETE webhook event to test our edge function
    const mockDeleteEvent = {
      type: "DELETE",
      table: "objects",
      old_record: {
        id: "test-id",
        name: `${portfolio.id}/after_images/test-deleted-image.jpg`,
        bucket_id: "portfolio",
      },
    };

    // Call our edge function directly
    const edgeFunctionResponse = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/portfolio-image-sync`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(mockDeleteEvent),
      }
    );

    const edgeFunctionResult = await edgeFunctionResponse.json();

    return NextResponse.json({
      success: true,
      mockEvent: mockDeleteEvent,
      portfolioTested: {
        id: portfolio.id,
        title: portfolio.title,
        beforeImagesCount: Array.isArray(portfolio.before_images)
          ? portfolio.before_images.length
          : 0,
        afterImagesCount: Array.isArray(portfolio.after_images) ? portfolio.after_images.length : 0,
      },
      edgeFunctionResponse: {
        status: edgeFunctionResponse.status,
        result: edgeFunctionResult,
      },
    });
  } catch (error) {
    console.error("Delete sync test error:", error);
    return NextResponse.json(
      {
        error: "Failed to test delete sync",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
