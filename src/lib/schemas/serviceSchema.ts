import { z } from "zod";

// Schema validation for service data
export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  image_url: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>; 