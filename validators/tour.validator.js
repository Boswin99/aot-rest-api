const { z } = require("zod");

const tourSchema = z.object({
  // Basic Information
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),

  duration: z.string().min(1, "Duration is required"),

  groupSize: z.string().min(1, "Group size is required"),

  price: z.coerce.number().min(0, "Price must be a positive number").max(10000000, "Price is too high"),

  premiumPrice: z.coerce.number().min(0, "Premium price must be a positive number").max(10000000, "Premium price is too high").optional(),

  currency: z.string().min(1, "Currency is required").max(10, "Currency code too long"),

  category: z.string().min(1, "Category is required").max(100, "Category name too long"),

  description: z.string().min(1, "Description is required"),

  image: z.any().optional(),

  status: z
    .enum(["Active", "Draft", "Inactive"], {
      errorMap: () => ({ message: "Invalid status" }),
    })
    .optional(),

  difficulty: z.enum(["Easy", "Moderate", "Challenging", "Easy to Moderate"], {
    errorMap: () => ({ message: "Invalid difficulty level" }),
  }),

  highlights: z.array(z.string().min(1)).min(1, "At least one highlight is required"),

  inclusions: z.array(z.string().min(1)).min(1, "At least one included item is required"),

  exclusions: z.array(z.string().min(1)).optional(),

  // Itinerary
  itinerary: z
    .array(
      z.object({
        day: z.coerce.number().int().min(1, "Day number must be at least 1"),
        title: z.string().min(1, "Day title is required"),
        activities: z.array(z.string().min(1)).min(1, "At least one activity is required"),
        accommodation: z.string().min(1, "Accommodation is required"),
        meals: z.string().min(1, "Meals information is required"),
      })
    )
    .min(1, "At least one itinerary day is required"),

  packageOptions: z
    .array(
      z.object({
        type: z.string().min(1, "Package type is required"),
        price: z.coerce.number().min(0, "Package option price must be positive"),
        features: z.array(z.string().min(1)).min(1, "At least one feature is required"),
      })
    )
    .optional(),

  bestTimeToVisit: z.string().optional(),

  notes: z.array(z.string().min(1)).optional(),

  bookingRequirements: z.array(z.string().min(1)).optional(),
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
