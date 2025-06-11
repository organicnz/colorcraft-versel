import { createClient } from "@/lib/supabase/client";

/**
 * Get a random showcase image from the after_images directory for a portfolio item
 * @param portfolioId - The UUID of the portfolio item
 * @returns Promise<string | null> - The public URL of a random after image, or null if none found
 */
export async function getRandomAfterImage(portfolioId: string): Promise<string | null> {
  try {
    const supabase = createClient();

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
      console.warn(`No after_images found for portfolio ${portfolioId}`);
      return null;
    }

    // Filter out .gitkeep and other non-image files
    const imageFiles = files.filter((file: any) => {
      const extension = file.name.toLowerCase().split(".").pop();
      return extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
    });

    if (imageFiles.length === 0) {
      console.warn(`No image files found in after_images for portfolio ${portfolioId}`);
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
 * Get all after images for a portfolio item
 * @param portfolioId - The UUID of the portfolio item
 * @returns Promise<string[]> - Array of public URLs for all after images
 */
export async function getAllAfterImages(portfolioId: string): Promise<string[]> {
  try {
    const supabase = createClient();

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
    const imageFiles = files.filter((file: any) => {
      const extension = file.name.toLowerCase().split(".").pop();
      return extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
    });

    // Get public URLs for all images
    return imageFiles.map((file: any) => {
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
 * Get all before images for a portfolio item
 * @param portfolioId - The UUID of the portfolio item
 * @returns Promise<string[]> - Array of public URLs for all before images
 */
export async function getAllBeforeImages(portfolioId: string): Promise<string[]> {
  try {
    const supabase = createClient();

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
    const imageFiles = files.filter((file: any) => {
      const extension = file.name.toLowerCase().split(".").pop();
      return extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
    });

    // Get public URLs for all images
    return imageFiles.map((file: any) => {
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
