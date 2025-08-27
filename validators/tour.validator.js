const { z } = require("zod");

const tourSchema = z
  .object({
    // Basic Information
    tourTitle: z.string().min(1, "Tour title is required").max(200, "Tour title is too long"),

    location: z.string().min(1, "Location is required").max(200, "Location is too long"),

    duration: z
      .string()
      .min(1, "Duration is required")
      .regex(/^[0-9]+\s*(days?|nights?)$/i, "Duration must be like '7 days'"),

    price: z.coerce.number().min(0, "Price must be a positive number").max(1000000, "Price is too high"),

    status: z.enum(["Active", "Draft", "Inactive"], {
      errorMap: () => ({ message: "Invalid status" }),
    }),

    difficultyLevel: z.enum(["Easy", "Moderate", "Challenging"], {
      errorMap: () => ({ message: "Invalid difficulty level" }),
    }),

    maxParticipants: z.coerce.number().int("Must be an integer").min(1, "At least 1 participant required"),

    minParticipants: z.coerce.number().int("Must be an integer").min(1, "At least 1 participant required"),

    nextDeparture: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in mm/dd/yyyy format"),

    tourGuide: z.string().min(1, "Tour guide is required").max(100, "Tour guide name too long"),

    meetingPoint: z.string().optional(),

    description: z.string().min(1, "Description is required"),

    // What's Included / Excluded
    whatsIncluded: z.array(z.string().min(1)).min(1, "At least one included item is required"),

    whatsExcluded: z.array(z.string().min(1)).optional(),

    // Itinerary
    itinerary: z
      .array(
        z.object({
          day: z.coerce.number().int().min(1, "Day number must be at least 1"),
          title: z.string().min(1, "Day title is required"),
          description: z.string().min(1, "Day description is required"),
        })
      )
      .min(1, "At least one itinerary day is required"),

    // Additional Information
    whatToBring: z.string().optional(),
    cancellationPolicy: z.string().optional(),

    // Tour Image (URL for now, can be adapted for file upload)
    tourImage: z.string().url("Tour image must be a valid URL").optional(),
  })
  .refine((data) => data.maxParticipants >= data.minParticipants, {
    message: "Max participants must be greater than or equal to min participants",
    path: ["maxParticipants"],
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
