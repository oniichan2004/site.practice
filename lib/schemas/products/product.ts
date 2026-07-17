import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .max(10_000_000, "Price is too large"),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category must be at most 50 characters"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
