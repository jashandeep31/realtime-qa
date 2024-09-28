import * as z from "zod";

export const createClassValidator = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(100, { message: "Description cannot exceed 100 characters" }),
});
