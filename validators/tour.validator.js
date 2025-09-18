const { z } = require("zod");

const tourSchema = z.object({
  // Basic Information
  title: z.string().max(200, "Title is too long"),

  duration: z.string().optional(),

  groupSize: z.string().optional(),

  price: z.coerce.number().min(0, "Price must be a positive number").max(10000000, "Price is too high").optional(),

  premiumPrice: z.coerce
    .number()
    .min(0, "Premium price must be a positive number")
    .max(10000000, "Premium price is too high")
    ,

  currency: z.string().max(10, "Currency code too long").optional(),

  category: z.string().max(100, "Category name too long").optional(),

  description: z.string(),

  image: z.any().optional(),

  status: z
    .enum(["Active", "Draft", "Inactive"], {
      errorMap: () => ({ message: "Invalid status" }),
    })
    .optional(),

  difficulty: z
    .enum(["Easy", "Moderate", "Challenging", "Easy to Moderate"], {
      errorMap: () => ({ message: "Invalid difficulty level" }),
    })
    .optional(),

  highlights: z.array(z.string()).optional(),

  inclusions: z.array(z.string()).optional(),

  exclusions: z.array(z.string()).optional(),

  // Itinerary
  itinerary: z
    .array(
      z.object({
        day: z.coerce.number().int().min(1, "Day number must be at least 1").optional(),
        title: z.string().optional(),
        activities: z.array(z.string()).optional(),
        accommodation: z.string().optional(),
        meals: z.string().optional(),
      })
    )
    .optional(),

  packageOptions: z
    .array(
      z.object({
        type: z.string().optional(),
        price: z.coerce.number().min(0, "Package option price must be positive").optional(),
        features: z.array(z.string()).optional(),
      })
    )
    .optional(),

  bestTimeToVisit: z.string().optional(),

  notes: z.array(z.string()).optional(),

  bookingRequirements: z.array(z.string()).optional(),
});

const createTourSchema = z.object({
  body: tourSchema,
});

const updateTourSchema = z.object({
  body: tourSchema.partial(),
  params: z.object({
    id: z.string().min(1, "Tour ID is required"),
  }),
});

const tourIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Tour ID is required"),
  }),
});

module.exports = {
  tourSchema,
  createTourSchema,
  updateTourSchema,
  tourIdParamSchema,
};
