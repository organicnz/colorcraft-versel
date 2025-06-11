import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || userProfile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const url = new URL(request.url);
    const portfolioId = url.searchParams.get("portfolioId");

    if (!portfolioId) {
      return NextResponse.json({ error: "portfolioId parameter is required" }, { status: 400 });
    }

    // Run debug function
    const { data: debugResults, error: debugError } = await supabase.rpc("debug_storage_access", {
      portfolio_uuid: portfolioId,
    });

    if (debugError) {
      console.error("Error running storage debug:", debugError);
      return NextResponse.json({ error: `Debug failed: ${debugError.message}` }, { status: 500 });
    }

    // Also get current portfolio data
    const { data: portfolioData, error: portfolioError } = await supabase
      .from("portfolio")
      .select("id, title, before_images, after_images, created_at, updated_at")
      .eq("id", portfolioId)
      .single();

    if (portfolioError) {
      console.error("Error fetching portfolio:", portfolioError);
    }

    return NextResponse.json({
      portfolioId,
      portfolio: portfolioData || null,
      storageDebug: debugResults || [],
      timestamp: new Date().toISOString(),
      instructions: {
        "Upload test": `Upload an image to portfolio/${portfolioId}/after_images/ in Supabase storage`,
        Refresh: `Call POST /api/refresh-portfolio-images with {"portfolioId": "${portfolioId}"}`,
        Verify: "Check if the after_images array is updated",
      },
    });
  } catch (error: any) {
    console.error("Unexpected error in debug-portfolio-storage:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || userProfile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { portfolioId } = body;

    if (!portfolioId) {
      return NextResponse.json(
        { error: "portfolioId is required in request body" },
        { status: 400 }
      );
    }

    // Run both debug and refresh
    const [debugResult, refreshResult] = await Promise.all([
      supabase.rpc("debug_storage_access", { portfolio_uuid: portfolioId }),
      supabase.rpc("refresh_portfolio_images", { portfolio_uuid: portfolioId }),
    ]);

    return NextResponse.json({
      portfolioId,
      debug: {
        success: !debugResult.error,
        data: debugResult.data || [],
        error: debugResult.error?.message || null,
      },
      refresh: {
        success: !refreshResult.error,
        data: refreshResult.data?.[0] || null,
        error: refreshResult.error?.message || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Unexpected error in debug-portfolio-storage POST:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
