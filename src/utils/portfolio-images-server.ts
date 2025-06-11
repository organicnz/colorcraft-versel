import { createClient } from "@/lib/supabase/server";

/**
 * Server-side function to get random after image (for use in server components)
 * @param portfolioId - The UUID of the portfolio item
 * @returns Promise<string | null> - The public URL of a random after image, or null if none found
 */
export async function getRandomAfterImageServer(portfolioId: string): Promise<string | null> {
  try {
    const supabase = await createClient();

    // List all files in the after_images directory
    const { data: files, error } = await supabase.storage
      .from("portfolio")
      .list(`${portfolioId}/after_images`, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error(`Error listing after_images for ${portfolioId}:`, error);
      return null;
    }

    if (!files || files.length === 0) {
      return null;
    }

    // Filter out .gitkeep and other non-image files
    const imageFiles = files.filter((file) => {
      const extension = file.name.toLowerCase().split(".").pop();
      return extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
    });

    if (imageFiles.length === 0) {
      return null;
    }

    // Randomly select one image
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const selectedFile = imageFiles[randomIndex];

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(`${portfolioId}/after_images/${selectedFile.name}`);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Unexpected error getting random after image for ${portfolioId}:`, error);
    return null;
  }
}

/**
 * Server-side function to get all after images (for use in server components)
 * @param portfolioId - The UUID of the portfolio item
 * @returns Promise<string[]> - Array of public URLs for all after images
 */
export async function getAllAfterImagesServer(portfolioId: string): Promise<string[]> {
  try {
    const supabase = await createClient();

    // List all files in the after_images directory
    const { data: files, error } = await supabase.storage
      .from("portfolio")
      .list(`${portfolioId}/after_images`, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error(`Error listing after_images for ${portfolioId}:`, error);
      return [];
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Filter out .gitkeep and other non-image files
    const imageFiles = files.filter((file) => {
      const extension = file.name.toLowerCase().split(".").pop();
      return extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
    });

    // Get public URLs for all images
    return imageFiles.map((file) => {
      const { data: urlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(`${portfolioId}/after_images/${file.name}`);
      return urlData.publicUrl;
    });
  } catch (error) {
    console.error(`Unexpected error getting all after images for ${portfolioId}:`, error);
    return [];
  }
}

/**
 * Server-side function to get all before images (for use in server components)
 * @param portfolioId - The UUID of the portfolio item
 * @returns Promise<string[]> - Array of public URLs for all before images
 */
export async function getAllBeforeImagesServer(portfolioId: string): Promise<string[]> {
  try {
    const supabase = await createClient();

    // List all files in the before_images directory
    const { data: files, error } = await supabase.storage
      .from("portfolio")
      .list(`${portfolioId}/before_images`, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error(`Error listing before_images for ${portfolioId}:`, error);
      return [];
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Filter out .gitkeep and other non-image files
    const imageFiles = files.filter((file) => {
      const extension = file.name.toLowerCase().split(".").pop();
      return extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
    });

    // Get public URLs for all images
    return imageFiles.map((file) => {
      const { data: urlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(`${portfolioId}/before_images/${file.name}`);
      return urlData.publicUrl;
    });
  } catch (error) {
    console.error(`Unexpected error getting all before images for ${portfolioId}:`, error);
    return [];
  }
}
