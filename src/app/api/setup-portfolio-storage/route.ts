import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if we have admin access
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get user role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Check if portfolio bucket already exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    const portfolioBucketExists = buckets?.some((bucket) => bucket.name === "portfolio");

    const results = {
      bucketCreation: null as any,
      policySetup: null as any,
      uploadTest: null as any,
    };

    // Step 1: Create bucket if it doesn't exist
    if (!portfolioBucketExists) {
      const { data: bucketData, error: createBucketError } = await supabase.storage.createBucket(
        "portfolio",
        {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        }
      );

      results.bucketCreation = {
        success: !createBucketError,
        message: createBucketError
          ? `Failed to create bucket: ${createBucketError.message}`
          : "Portfolio bucket created successfully",
        error: createBucketError?.message,
      };

      if (createBucketError) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create storage bucket",
            details: createBucketError.message,
            results,
          },
          { status: 500 }
        );
      }
    } else {
      results.bucketCreation = {
        success: true,
        message: "Portfolio bucket already exists",
        skipped: true,
      };
    }

    // Step 2: Manual policy setup instructions (since we can't use exec_sql)
    results.policySetup = {
      success: true,
      message:
        "Storage bucket is ready. Note: RLS policies need to be set manually in Supabase dashboard.",
      instructions: [
        "1. Go to your Supabase Dashboard",
        "2. Navigate to Storage > Settings > Policies",
        "3. Create the following policies for the portfolio bucket:",
        "   - Public read access: SELECT for all users",
        '   - Admin upload access: INSERT for users where role = "admin"',
        '   - Admin update access: UPDATE for users where role = "admin"',
        '   - Admin delete access: DELETE for users where role = "admin"',
      ],
    };

    // Step 3: Test upload permissions
    try {
      // Try to create a test file to check permissions
      const testContent = new TextEncoder().encode("Test file for checking upload permissions");

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload("test-upload.txt", testContent, {
          contentType: "text/plain",
          upsert: true,
        });

      if (!uploadError) {
        // Clean up test file
        await supabase.storage.from("portfolio").remove(["test-upload.txt"]);
        results.uploadTest = {
          success: true,
          message: "Upload permissions working correctly",
        };
      } else {
        results.uploadTest = {
          success: false,
          message: "Upload test failed - RLS policies may need manual setup",
          error: uploadError.message,
          needsManualSetup: true,
        };
      }
    } catch (error: any) {
      results.uploadTest = {
        success: false,
        message: "Upload test failed - RLS policies may need manual setup",
        error: error.message,
        needsManualSetup: true,
      };
    }

    // Verify the bucket was created successfully
    const { data: updatedBuckets } = await supabase.storage.listBuckets();
    const portfolioBucketCreated = updatedBuckets?.some((bucket) => bucket.name === "portfolio");

    return NextResponse.json({
      success: true,
      message: "Portfolio storage setup completed. Manual policy setup may be required.",
      bucket: {
        existed: portfolioBucketExists,
        created: portfolioBucketCreated,
        name: "portfolio",
      },
      ...results,
      manualSteps: {
        required: !results.uploadTest?.success,
        instructions: [
          "If upload test failed, please set up RLS policies manually:",
          "1. Go to Supabase Dashboard > Storage > Policies",
          '2. Add these policies for the "portfolio" bucket:',
          "",
          "Policy 1 (Public Read):",
          '  Name: "Portfolio images are publicly viewable"',
          "  Allowed operation: SELECT",
          "  Target roles: public",
          "  USING expression: bucket_id = 'portfolio'",
          "",
          "Policy 2 (Admin Upload):",
          '  Name: "Admins can upload portfolio images"',
          "  Allowed operation: INSERT",
          "  Target roles: authenticated",
          "  WITH CHECK expression: bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')",
          "",
          "Policy 3 (Admin Update):",
          '  Name: "Admins can update portfolio images"',
          "  Allowed operation: UPDATE",
          "  Target roles: authenticated",
          "  USING expression: bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')",
          "",
          "Policy 4 (Admin Delete):",
          '  Name: "Admins can delete portfolio images"',
          "  Allowed operation: DELETE",
          "  Target roles: authenticated",
          "  USING expression: bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')",
        ],
      },
    });
  } catch (error: any) {
    console.error("Storage setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error during storage setup",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
