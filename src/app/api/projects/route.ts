import { NextRequest, NextResponse } from "next/server";
import { createPortfolioProject } from "@/actions/portfolioActions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const result = await createPortfolioProject(formData);

    if (result.error) {
      return NextResponse.json(
        { 
          error: result.error, 
          fieldErrors: (result as any).fieldErrors || undefined 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      projectId: (result as any).projectId || (result as any).data?.id,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
